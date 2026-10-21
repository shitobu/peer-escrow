import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { X, ShieldCheck, AlertCircle } from 'lucide-react';
import { EscrowItem } from '../types';

interface CreateEscrowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (item: EscrowItem) => void;
}

export const CreateEscrowModal: React.FC<CreateEscrowModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const { publicKey } = useWallet();
  const [contributor, setContributor] = useState('');
  const [amountSol, setAmountSol] = useState('1.0');
  const [metadataUri, setMetadataUri] = useState('');
  const [deadlineDays, setDeadlineDays] = useState('7');
  const [graceWindowDays, setGraceWindowDays] = useState('3');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey) return;

    setIsSubmitting(true);
    const now = Math.floor(Date.now() / 1000);
    const dDays = parseFloat(deadlineDays) || 7;
    const gDays = parseFloat(graceWindowDays) || 3;

    const newItem: EscrowItem = {
      id: 'escrow-' + Date.now(),
      client: publicKey.toBase58(),
      contributor: contributor.trim() || 'Any Contributor (Open Bounty)',
      amountSol: parseFloat(amountSol) || 0.1,
      deadlineTs: now + Math.floor(dDays * 86400),
      disputeWindowSecs: Math.floor(gDays * 86400),
      submittedAtTs: 0,
      status: 'INITIALIZED',
      taskId: 'task-' + Math.random().toString(36).substring(2, 10),
      metadataUri: metadataUri.trim() || 'https://github.com/pulls',
      deliverableProof: '',
      createdAt: now,
    };

    setTimeout(() => {
      onCreated(newItem);
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#16161D] border border-gray-800 rounded-2xl p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white"
        >
          <X className="size-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="size-6 text-[#14F195]" />
          <h2 className="text-xl font-bold text-white">Create Milestone Escrow</h2>
        </div>

        <p className="text-xs text-gray-400 mb-5">
          Deposit funds into an on-chain Solana PDA. Funds cannot be seized, frozen, or diverted. Released only upon verified delivery or timelock expiration.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
              Contributor Wallet (or Open Bounty)
            </label>
            <input
              type="text"
              placeholder="e.g. 9WzDX... or leave blank for open bounty"
              value={contributor}
              onChange={(e) => setContributor(e.target.value)}
              className="w-full bg-[#0F0F14] border border-gray-700 focus:border-[#9945FF] rounded-xl px-3.5 py-2.5 text-sm text-gray-200 outline-none transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
                Escrow Amount (SOL)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={amountSol}
                onChange={(e) => setAmountSol(e.target.value)}
                className="w-full bg-[#0F0F14] border border-gray-700 focus:border-[#9945FF] rounded-xl px-3.5 py-2.5 text-sm text-gray-200 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
                Deadline (Days)
              </label>
              <input
                type="number"
                min="1"
                required
                value={deadlineDays}
                onChange={(e) => setDeadlineDays(e.target.value)}
                className="w-full bg-[#0F0F14] border border-gray-700 focus:border-[#9945FF] rounded-xl px-3.5 py-2.5 text-sm text-gray-200 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
              Task Specification (GitHub PR / Issue / Deliverable Link)
            </label>
            <input
              type="url"
              required
              placeholder="https://github.com/repo/pull/123"
              value={metadataUri}
              onChange={(e) => setMetadataUri(e.target.value)}
              className="w-full bg-[#0F0F14] border border-gray-700 focus:border-[#9945FF] rounded-xl px-3.5 py-2.5 text-sm text-gray-200 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">
              Review Grace Window (Days before auto-release timelock)
            </label>
            <input
              type="number"
              min="1"
              required
              value={graceWindowDays}
              onChange={(e) => setGraceWindowDays(e.target.value)}
              className="w-full bg-[#0F0F14] border border-gray-700 focus:border-[#9945FF] rounded-xl px-3.5 py-2.5 text-sm text-gray-200 outline-none transition"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              If client goes unresponsive after work submission, contributor can claim funds automatically once this window elapses.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !publicKey}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:opacity-95 text-black font-bold text-sm shadow-lg transition active:scale-98 disabled:opacity-50"
            >
              {isSubmitting
                ? 'Signing & Initializing PDA...'
                : !publicKey
                ? 'Connect Wallet to Continue'
                : `Deposit ${amountSol} SOL into Escrow`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
