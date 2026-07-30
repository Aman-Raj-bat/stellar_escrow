import { STROOPS_IN_XLM } from './constants';

export const formatAddress = (address: string, chars = 4): string => {
  if (!address) return '';
  if (address.length <= chars * 2) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};

export const stroopsToXlm = (stroops: bigint | number | string): string => {
  const amount = Number(stroops);
  if (isNaN(amount)) return '0.00';
  return (amount / STROOPS_IN_XLM).toFixed(2);
};

export const xlmToStroops = (xlm: number | string): bigint => {
  const amount = parseFloat(xlm.toString());
  if (isNaN(amount)) return BigInt(0);
  return BigInt(Math.floor(amount * STROOPS_IN_XLM));
};
