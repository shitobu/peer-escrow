import React, { useState } from 'react';
import { useUnifiedWallet } from '../context/WalletContext';
import {
  Clock,
  CheckCircle,
  ExternalLink,
  Send,
  Unlock,
  RotateCcw,
  User,
  FastForward,
} from 'lucide-react';
import { EscrowItem } from '../types';

interface EscrowCardProps {
  escrow: EscrowItem;
  onUpdate: (updated: EscrowItem) => void;
}

export const EscrowCard: React.FC<EscrowCardProps> = ({ escrow, onUpdate }) => {
  const { publicKey, connected, connectDemo } = useUnifiedWallet();
  const [proofInput, setProofInput] = useState('');
  const [showProofForm, setShowProofForm] = useState(false);
  const [isSubmittingProof, setIsSubmittingProof] = useState(false);
  const [simulatedTimelockExpired, setSimulatedTimelockExpired] = useState(false);
  const [actionMsg, setActionMsg] = useState('');

  const myAddress = publicKey?.toBase58();
  const isClient = myAddress === escrow.client;
  const isContributor =
    myAddress === escrow.contributor ||
    escrow.contributor === 'Any Contributor (Open Bounty)';

  const now = Math.floor(Date.now() / 1000);
  const timelockUnlockTs = escrow.submittedAtTs + escrow.disputeWindowSecs;
  const isActuallyExpired = escrow.status === 'WORK_SUBMITTED' && now >= timelockUnlockTs;
  const canClaimTimelock = isActuallyExpired || simulatedTimelockExpired;

  const handleApprove = () => {
    setActionMsg('Signing transaction: Releasing funds from Solana PDA...');
    setTimeout(() => {
      onUpdate({ ...escrow, status: 'RELEASED' });
      setActionMsg('✓ Escrow released directly to contributor!');
    }, 600);
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
      setShowProofForm(false);
      setProofInput('');
      setActionMsg('✓ Deliverable attached! Autonomous review timelock started.');
    }, 600);
  };

  const handleClaimTimelock = () => {
    setActionMsg('Autonomous PDA instruction: Claiming funds after grace expiry...');
    setTimeout(() => {
      onUpdate({ ...escrow, status: 'RELEASED' });
      setActionMsg('✓ Timelock executed! 100% payout released with 0 intermediaries.');
    }, 600);
  };

  const handleRefund = () => {
    setActionMsg('Refunding unfulfilled escrow from PDA back to client...');
    setTimeout(() => {
      onUpdate({ ...escrow, status: 'REFUNDED' });
      setActionMsg('✓ Refunded 100% to client wallet.');
    }, 600);
  };

  const getStatusBadge = () => {
    switch (escrow.status) {
      case 'INITIALIZED':
        return (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center gap-1">
            <Clock className="size-3" /> Awaiting Submission
          </span>
        );
      case 'WORK_SUBMITTED':
        return (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 flex items-center gap-1">
            <Clock className="size-3 animate-spin" /> In Review (Timelock Active)
          </span>
        );
      case 'RELEASED':
        return (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle className="size-3" /> Payout Released
          </span>
        );
      case 'REFUNDED':
        return (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-500/15 text-red-400 border border-red-500/30">
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
              Submitted Deliverable Proof
            </span>
            <p className="text-xs text-gray-200 font-mono break-all">
              {escrow.deliverableProof}
            </p>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-gray-800/60 mt-2 space-y-2">
        {actionMsg && (
          <p className="text-xs font-semibold text-[#14F195] py-1 text-center bg-[#14F195]/10 rounded-lg animate-pulse">
            {actionMsg}
          </p>
        )}

        {/* 1. INITIALIZED state -> Primary "Submit Deliverable Proof" button */}
        {escrow.status === 'INITIALIZED' && (
          <div>
            {!showProofForm ? (
              <button
                onClick={() => {
                  if (!connected) {
                    connectDemo();
                  }
                  setShowProofForm(true);
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#14F195] to-[#10b981] hover:opacity-95 text-black font-bold text-xs flex items-center justify-center gap-2 transition active:scale-98 shadow-md"
              >
                <Send className="size-3.5" />
                <span>Submit Deliverable Proof</span>
              </button>
            ) : (
              <form onSubmit={handleSubmitDeliverable} className="space-y-2">
                <input
                  type="text"
                  required
                  placeholder="Paste GitHub PR or commit hash (e.g. #4f9c82b)..."
                  value={proofInput}
                  onChange={(e) => setProofInput(e.target.value)}
                  className="w-full bg-[#0F0F14] border border-[#14F195]/60 focus:border-[#14F195] rounded-xl px-3 py-2 text-xs text-gray-200 outline-none"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isSubmittingProof}
                    className="flex-1 py-1.5 rounded-xl bg-[#14F195] hover:bg-[#12d684] text-black font-bold text-xs flex items-center justify-center gap-1 transition"
                  >
                    Confirm Proof & Lock Timelock
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowProofForm(false)}
                    className="px-3 py-1.5 rounded-xl bg-gray-800 text-gray-400 hover:text-white text-xs font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* 2. WORK_SUBMITTED state -> Client Approve & Autonomous Timelock Options */}
        {escrow.status === 'WORK_SUBMITTED' && (
          <div className="space-y-2">
            <button
              onClick={handleApprove}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#14F195] to-[#9945FF] hover:opacity-95 text-black font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-98 shadow-md"
            >
              <CheckCircle className="size-3.5" />
              <span>Approve & Release {escrow.amountSol} SOL</span>
            </button>

            {/* Timelock Auto-Release Showcase */}
            {canClaimTimelock ? (
              <button
                onClick={handleClaimTimelock}
                className="w-full py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-lg animate-bounce"
              >
                <Unlock className="size-3.5" />
                <span>Claim Timelock Auto-Release (0 Intermediaries)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setSimulatedTimelockExpired(true)}
                className="w-full py-1.5 rounded-lg bg-gray-800/80 hover:bg-gray-800 text-yellow-400/90 hover:text-yellow-300 text-[11px] font-medium flex items-center justify-center gap-1 transition border border-yellow-500/20"
                title="Simulate what happens if client is unresponsive after 3-day review window"
              >
                <FastForward className="size-3" />
                <span>Simulate 3-Day Grace Window Expiration</span>
              </button>
            )}
          </div>
        )}

        {/* 3. RELEASED state */}
        {escrow.status === 'RELEASED' && (
          <div className="text-center text-xs text-emerald-400 font-medium py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            ✓ 100% Payout Settled Directly via Solana PDA (0% Cut)
          </div>
        )}

        {/* 4. REFUNDED state */}
        {escrow.status === 'REFUNDED' && (
          <div className="text-center text-xs text-red-400 font-medium py-1.5 bg-red-500/10 border border-red-500/20 rounded-xl">
            ✓ Refund Returned to Client Wallet
          </div>
        )}
      </div>
    </div>
  );
};
