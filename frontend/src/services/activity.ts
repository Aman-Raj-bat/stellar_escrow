import { rpc } from '../contracts/escrow';
import { scValToNative, xdr } from '@stellar/stellar-sdk';
import { rpcUrl } from './stellar';

export type ActivityEventType = 'CREATED' | 'FUNDED' | 'ACCEPTED' | 'RELEASED' | 'REFUNDED' | 'UNKNOWN';

export interface ActivityEvent {
  id: string;
  type: ActivityEventType;
  escrowId: string; // Now represents the Contract Address
  txHash: string;
  timestamp: Date;
  ledger: number;
  actor?: string;
}

const server = new rpc.Server(rpcUrl);

export async function fetchContractEvents(escrowId?: string): Promise<ActivityEvent[]> {
  try {
    const latestLedgerResponse = await server.getLatestLedger();
    const latestLedger = latestLedgerResponse.sequence;
    const startLedger = Math.max(1, latestLedger - 17280); 
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const request: any = {
      startLedger,
      filters: [
        {
          type: "contract",
          contractIds: escrowId ? [escrowId] : [], // Empty array fetches from all contracts on testnet
          topics: [
            // match events where topic 0 is 'ESCROW' symbol.
          ]
        }
      ],
      limit: 100,
    };

    if (!escrowId) {
      // If we are querying all escrows, we MUST add a topic filter so we don't query everything on the network
      request.filters[0].topics = [[xdr.ScVal.scvSymbol('ESCROW').toXDR('base64')]];
    }

    const response = await server.getEvents(request);

    const activities: ActivityEvent[] = [];

    if (response && response.events) {
      for (const event of response.events) {
        if (event.type !== 'contract') continue;

        const topicValues = event.topic;
        if (topicValues.length < 3) continue;

        const mainTopic = scValToNative(topicValues[0]);
        if (mainTopic !== 'ESCROW') continue;

        const typeTopic = scValToNative(topicValues[1]) as string;
        
        // The contract address that emitted the event
        const eventEscrowId = typeof event.contractId === 'string' ? event.contractId : (event.contractId as any)?.contractId() || (event.contractId as any)?.toString() || "";

        // If filtering by escrow ID, we don't need to manually check since we provided contractIds, but just to be safe:
        if (escrowId && eventEscrowId !== escrowId) {
          continue;
        }

        const dataNative = scValToNative(event.value);
        
        let actor = undefined;
        if (typeTopic === 'CREATED' && Array.isArray(dataNative)) {
          actor = dataNative[0]; // client
        } else if (typeTopic === 'ACCEPTED') {
          actor = dataNative; // freelancer
        } else if (typeTopic === 'RELEASED') {
          actor = dataNative; // client
        } else if (typeTopic === 'REFUNDED') {
          actor = dataNative; // freelancer
        }

        // We generate a rough timestamp based on ledger close time if possible, or just fallback.
        // Soroban getEvents returns ledger closing time in response.events[i].ledgerClosedAt string (ISO)
        const timestamp = new Date(event.ledgerClosedAt);

        activities.push({
          id: event.id,
          type: typeTopic as ActivityEventType,
          escrowId: eventEscrowId,
          txHash: event.txHash,
          timestamp,
          ledger: event.ledger,
          actor,
        });
      }
    }

    // Sort descending by ledger/timestamp
    return activities.sort((a, b) => b.ledger - a.ledger);
  } catch (err: unknown) {
    console.error('Failed to fetch events', err);
    return []; // Return empty array on failure instead of breaking the app
  }
}
