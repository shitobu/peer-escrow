import {
  Connection,
  PublicKey,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
} from '@solana/web3.js';
import { EscrowItem } from '../types';

export const DEVNET_ENDPOINT = clusterApiUrl('devnet');
export const connection = new Connection(DEVNET_ENDPOINT, 'confirmed');

export const PROGRAM_ID = new PublicKey('PeerEscrow111111111111111111111111111111111');

export async function requestDevnetAirdrop(publicKey: PublicKey): Promise<string> {
  const signature = await connection.requestAirdrop(publicKey, 1 * LAMPORTS_PER_SOL);
  const latestBlockHash = await connection.getLatestBlockhash();
  await connection.confirmTransaction({
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    signature,
  });
  return signature;
}

export function deriveEscrowPda(client: PublicKey, taskId: Uint8Array): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('escrow'), client.toBuffer(), taskId],
    PROGRAM_ID
  );
}

// Local mock storage for demo / interactive simulation while on Devnet
const STORAGE_KEY = 'peerescrow_milestones_v1';

export function getLocalEscrows(): EscrowItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getInitialDemoData();
    return JSON.parse(raw);
  } catch {
    return getInitialDemoData();
  }
}

export function saveLocalEscrows(items: EscrowItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function getInitialDemoData(): EscrowItem[] {
  const now = Math.floor(Date.now() / 1000);
  return [
    {
      id: 'demo-1',
      client: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
      contributor: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
      amountSol: 2.5,
      deadlineTs: now + 86400 * 5,
      disputeWindowSecs: 86400 * 2,
      submittedAtTs: now - 3600,
      status: 'WORK_SUBMITTED',
      taskId: 'milestone-subgraph-indexer',
      metadataUri: 'https://github.com/solana-labs/solana/pull/2941',
      deliverableProof: 'commit: 4f9c82b - Completed indexer with 100% tests passing',
      createdAt: now - 86400 * 2,
    },
    {
      id: 'demo-2',
      client: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
      contributor: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
      amountSol: 5.0,
      deadlineTs: now + 86400 * 10,
      disputeWindowSecs: 86400 * 3,
      submittedAtTs: 0,
      status: 'INITIALIZED',
      taskId: 'bounty-audit-solana-anchor',
      metadataUri: 'https://github.com/coral-xyz/anchor/issues/3102',
      deliverableProof: '',
      createdAt: now - 3600 * 12,
    },
  ];
}
