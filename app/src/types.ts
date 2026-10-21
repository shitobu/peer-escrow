export type EscrowStatus = 'INITIALIZED' | 'WORK_SUBMITTED' | 'RELEASED' | 'REFUNDED' | 'DISPUTED';

export interface EscrowItem {
  id: string;
  client: string;
  contributor: string;
  amountSol: number;
  deadlineTs: number;
  disputeWindowSecs: number;
  submittedAtTs: number;
  status: EscrowStatus;
  taskId: string;
  metadataUri: string;
  deliverableProof: string;
  createdAt: number;
}
