import { rpc, scValToNative, networks } from '../contracts/escrow';
import { rpcUrl } from './stellar';

export type ActivityEventType = 'CREATED' | 'FUNDED' | 'ACCEPTED' | 'RELEASED' | 'REFUNDED' | 'UNKNOWN';

export interface ActivityEvent {
  id: string;
  type: ActivityEventType;
  escrowId: string;
  txHash: string;
  timestamp: Date;
  ledger: number;
  actor?: string; // The wallet that likely triggered this or is relevant (client/freelancer)
}

const server = new rpc.Server(rpcUrl);

export async function fetchContractEvents(escrowId?: string): Promise<ActivityEvent[]> {
  try {
    // Some networks have startLedger limitations, if we get an error we might have to adjust.
    // We'll just fetch a generous amount from the current ledger minus 17280 (approx 1 day on Stellar if 5s ledgers).
    // Let's actually use getLatestLedger
    const latestLedgerResponse = await server.getLatestLedger();
    const latestLedger = latestLedgerResponse.sequence;
    const startLedger = Math.max(1, latestLedger - 17280); 
    
    const request: any = {
      startLedger,
      filters: [
        {
          type: "contract",
          contractIds: [networks.testnet.contractId],
          topics: [
            // match events where topic 0 is 'ESCROW' symbol. We can leave it open to catch everything for the contract
          ]
        }
      ],
      limit: 100, // max allowed usually
    };

    const response = await server.getEvents(request);

    const activities: ActivityEvent[] = [];

    if (response && response.events) {
      for (const event of response.events) {
        if (event.type !== 'contract') continue;

        const topicValues = event.topic; // In newer stellar-sdk, these are already xdr.ScVal
        if (topicValues.length < 3) continue;

        const mainTopic = scValToNative(topicValues[0]);
        if (mainTopic !== 'ESCROW') continue;

        const typeTopic = scValToNative(topicValues[1]) as string;
        const eventEscrowId = scValToNative(topicValues[2]).toString();

        // If filtering by escrow ID
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
  } catch (err) {
    console.error('Failed to fetch events', err);
    return []; // Return empty array on failure instead of breaking the app
  }
}
