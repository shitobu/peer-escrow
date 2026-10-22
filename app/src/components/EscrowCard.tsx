import React, { useState } from 'react';
import { useUnifiedWallet } from '../context/WalletContext';
import {
  Clock,
  CheckCircle,
  ExternalLink,
  Send,
  Unlock,
  RotateCcw,
  AlertTriangle,
  User,
} from 'lucide-react';
import { EscrowItem } from '../types';

interface EscrowCardProps {
  escrow: EscrowItem;
  onUpdate: (updated: EscrowItem) => void;
}

export const EscrowCard: React.FC<EscrowCardProps> = ({ escrow, onUpdate }) => {
  const { publicKey } = useUnifiedWallet();
  const [proofInput, setProofInput] = useState('');
  const [isSubmittingProof, setIsSubmittingProof] = useState(false);
  const [actionMsg, setActionMsg] = useState('');

  const myAddress = publicKey?.toBase58();
  const isClient = myAddress === escrow.client;
  const isContributor =
    myAddress === escrow.contributor ||
    escrow.contributor === 'Any Contributor (Open Bounty)';

  const now = Math.floor(Date.now() / 1000);
  const timelockUnlockTs = escrow.submittedAtTs + escrow.disputeWindowSecs;
  const canClaimTimelock =
    escrow.status === 'WORK_SUBMITTED' && now >= timelockUnlockTs;
  const canRefund =
    escrow.status === 'INITIALIZED' && now >= escrow.deadlineTs && isClient;

  const handleApprove = () => {
    setActionMsg('Releasing funds from PDA...');
    setTimeout(() => {
      onUpdate({ ...escrow, status: 'RELEASED' });
      setActionMsg('Released successfully!');
    }, 500);
  };

  const handleSubmitDeliverable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofInput.trim()) return;
    setIsSubmittingProof(true);
    setTimeout(() => {
      onUpdate({
        ...escrow,
        contributor: myAddress || escrow.contributor,
        status: 'WORK_SUBMITTED',
        submittedAtTs: Math.floor(Date.now() / 1000),
        deliverableProof: proofInput.trim(),
      });
      setIsSubmittingProof(false);
      setProofInput('');
      setActionMsg('Deliverable submitted! Review timelock started.');
    }, 500);
  };

  const handleClaimTimelock = () => {
    setActionMsg('Claiming unreviewed payout via timelock...');
    setTimeout(() => {
      onUpdate({ ...escrow, status: 'RELEASED' });
      setActionMsg('Auto-claimed payout!');
    }, 500);
  };

  const handleRefund = () => {
    setActionMsg('Refunding unfulfilled escrow...');
    setTimeout(() => {
      onUpdate({ ...escrow, status: 'REFUNDED' });
      setActionMsg('Refunded to client!');
    }, 500);
  };

  const getStatusBadge = () => {
    switch (escrow.status) {
      case 'INITIALIZED':
        return (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            Awaiting Submission
          </span>
        );
      case 'WORK_SUBMITTED':
        return (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
            In Review (Timelock Active)
          </span>
        );
      case 'RELEASED':
        return (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
            <CheckCircle className="size-3" /> Payout Released
          </span>
        );
      case 'REFUNDED':
        return (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
            Refunded
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#15151C] border border-gray-800 hover:border-gray-700/80 rounded-2xl p-5 shadow-lg transition flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#14F195] to-[#9945FF]">
              {escrow.amountSol} SOL
            </div>
          </div>
          {getStatusBadge()}
        </div>

        {/* Task Link */}
        <div className="mb-4">
          <a
            href={escrow.metadataUri}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-gray-200 hover:text-[#14F195] flex items-center gap-1.5 transition line-clamp-1"
          >
            <span>{escrow.metadataUri}</span>
            <ExternalLink className="size-3.5 shrink-0 text-gray-400" />
          </a>
        </div>

        {/* Parties */}
        <div className="space-y-1.5 text-xs text-gray-400 mb-4 bg-[#0F0F14] p-3 rounded-xl border border-gray-800/80">
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1 text-gray-400">
              <User className="size-3" /> Client:
            </span>
            <span className="font-mono text-gray-300">
              {escrow.client.slice(0, 4)}...{escrow.client.slice(-4)}
              {isClient && ' (You)'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1 text-gray-400">
              <User className="size-3" /> Contributor:
            </span>
            <span className="font-mono text-gray-300">
              {escrow.contributor.length > 20
                ? `${escrow.contributor.slice(0, 4)}...${escrow.contributor.slice(-4)}`
                : escrow.contributor}
              {isContributor && ' (You)'}
            </span>
          </div>
        </div>

        {/* Deliverable Proof if submitted */}
        {escrow.deliverableProof && (
          <div className="mb-4 bg-emerald-500/5 border border-emerald-500/20 p-3 rounded-xl">
            <span className="text-[11px] font-semibold text-emerald-400 uppercase block mb-0.5">
              Submitted Proof
            </span>
            <p className="text-xs text-gray-200 font-mono break-all">
              {escrow.deliverableProof}
            </p>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-2 border-t border-gray-800/60 mt-2">
        {actionMsg && (
          <p className="text-xs font-medium text-[#14F195] mb-2 text-center">
            {actionMsg}
          </p>
        )}

        {/* Contributor: Submit Deliverable Form */}
        {escrow.status === 'INITIALIZED' && isContributor && (
          <form onSubmit={handleSubmitDeliverable} className="flex gap-2">
            <input
              type="text"
              required
              placeholder="Paste PR URL or deliverable commit hash..."
              value={proofInput}
              onChange={(e) => setProofInput(e.target.value)}
              className="flex-1 bg-[#0F0F14] border border-gray-700 focus:border-[#14F195] rounded-xl px-3 py-1.5 text-xs text-gray-200 outline-none"
            />
            <button
              type="submit"
              disabled={isSubmittingProof}
              className="px-3.5 py-1.5 rounded-xl bg-[#14F195] hover:bg-[#12d684] text-black font-bold text-xs flex items-center gap-1 transition"
            >
              <Send className="size-3" />
              Submit
            </button>
          </form>
        )}

        {/* Client: Release Payout */}
        {escrow.status === 'WORK_SUBMITTED' && isClient && (
          <button
            onClick={handleApprove}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#14F195] to-[#9945FF] hover:opacity-95 text-black font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-98 shadow-md"
          >
            <CheckCircle className="size-3.5" />
            Approve & Release {escrow.amountSol} SOL
          </button>
        )}

        {/* Contributor: Claim Timelock Auto-Release */}
        {canClaimTimelock && isContributor && (
          <button
            onClick={handleClaimTimelock}
            className="w-full py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-xs flex items-center justify-center gap-1.5 transition"
          >
            <Unlock className="size-3.5" />
            Claim Timelock Auto-Release
          </button>
        )}

        {/* Client: Claim Refund */}
        {canRefund && (
          <button
            onClick={handleRefund}
            className="w-full py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-red-400 border border-red-500/30 font-bold text-xs flex items-center justify-center gap-1.5 transition"
          >
            <RotateCcw className="size-3.5" />
            Claim Expired Refund
          </button>
        )}

        {escrow.status === 'RELEASED' && (
          <div className="text-center text-xs text-emerald-400 font-medium py-1">
            ✓ Milestone settled with 0% platform fee
          </div>
        )}
      </div>
    </div>
  );
};
