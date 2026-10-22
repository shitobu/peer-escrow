import React, { useState, useMemo } from 'react';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { UnifiedWalletProvider, useUnifiedWallet } from './context/WalletContext';
import { Navbar } from './components/Navbar';
import { EscrowCard } from './components/EscrowCard';
import { CreateEscrowModal } from './components/CreateEscrowModal';
import { getLocalEscrows, saveLocalEscrows } from './services/solana';
import { EscrowItem } from './types';
import { Shield, ArrowRight, Zap, CheckCircle2, Lock, Percent } from 'lucide-react';

const DashboardContent: React.FC = () => {
  const { publicKey, connected, connectDemo } = useUnifiedWallet();
  const [escrows, setEscrows] = useState<EscrowItem[]>(() => getLocalEscrows());
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'ALL' | 'CLIENT' | 'CONTRIBUTOR'>('ALL');

  const handleCreated = (item: EscrowItem) => {
    const updated = [item, ...escrows];
    setEscrows(updated);
    saveLocalEscrows(updated);
  };

  const handleUpdate = (updatedItem: EscrowItem) => {
    const updated = escrows.map((e) => (e.id === updatedItem.id ? updatedItem : e));
    setEscrows(updated);
    saveLocalEscrows(updated);
  };

  const myAddress = publicKey?.toBase58();

  const filteredEscrows = useMemo(() => {
    if (activeTab === 'CLIENT') {
      return escrows.filter((e) => e.client === myAddress);
    }
    if (activeTab === 'CONTRIBUTOR') {
      return escrows.filter(
        (e) =>
          e.contributor === myAddress ||
          e.contributor === 'Any Contributor (Open Bounty)'
      );
    }
    return escrows;
  }, [escrows, activeTab, myAddress]);

  const totalVolume = escrows.reduce((acc, curr) => acc + curr.amountSol, 0);
  const activeCount = escrows.filter(
    (e) => e.status === 'INITIALIZED' || e.status === 'WORK_SUBMITTED'
  ).length;
  const completedCount = escrows.filter((e) => e.status === 'RELEASED').length;

  return (
    <div className="min-h-screen bg-[#0B0B0E] text-gray-100 flex flex-col">
      <Navbar onOpenCreate={() => setIsCreateOpen(true)} />

      {/* Hero / Value Prop Banner */}
      <div className="border-b border-gray-800/80 bg-gradient-to-b from-[#14141B] to-[#0B0B0E] px-4 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#9945FF]/10 text-[#9945FF] border border-[#9945FF]/30 text-xs font-semibold mb-3">
                <Lock className="size-3.5" /> Code-Enforced Financial Disintermediation
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                Trustless Milestone Escrow for{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#14F195] to-[#9945FF]">
                  Solana Builders
                </span>
              </h1>
              <p className="text-gray-400 text-sm sm:text-base max-w-2xl mt-2.5">
                Fund bounties and hire freelancers without intermediary payment processors.
                Zero KYC freezes, 0% platform cuts, and automatic timelock releases on Devnet.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  if (!connected) {
                    connectDemo();
                  } else {
                    setIsCreateOpen(true);
                  }
                }}
                className={
                  connected
                    ? 'px-5 py-3 rounded-xl bg-gradient-to-r from-[#14F195] to-[#9945FF] hover:opacity-95 text-black font-bold text-sm shadow-xl flex items-center gap-2 transition active:scale-95'
                    : 'px-5 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 font-bold text-sm shadow-xl flex items-center gap-2 transition active:scale-95'
                }
              >
                {connected ? <Zap className="size-4" /> : <Lock className="size-4 text-emerald-400" />}
                <span>{connected ? 'Create New Milestone' : 'Connect Devnet Wallet'}</span>
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-gray-800/60">
            <div className="bg-[#121217] p-4 rounded-xl border border-gray-800">
              <span className="text-xs text-gray-400 font-medium">Total Volume Escrowed</span>
              <div className="text-2xl font-black text-[#14F195] mt-0.5">
                {totalVolume.toFixed(2)} SOL
              </div>
            </div>
            <div className="bg-[#121217] p-4 rounded-xl border border-gray-800">
              <span className="text-xs text-gray-400 font-medium">Active Milestones</span>
              <div className="text-2xl font-black text-white mt-0.5">{activeCount}</div>
            </div>
            <div className="bg-[#121217] p-4 rounded-xl border border-gray-800">
              <span className="text-xs text-gray-400 font-medium">Completed Payouts</span>
              <div className="text-2xl font-black text-[#9945FF] mt-0.5">{completedCount}</div>
            </div>
            <div className="bg-[#121217] p-4 rounded-xl border border-gray-800">
              <span className="text-xs text-gray-400 font-medium">Middleman Extraction</span>
              <div className="text-2xl font-black text-emerald-400 mt-0.5">0.0%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full px-4 lg:px-8 py-8 flex-1">
        {/* Filter Tabs */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition ${
                activeTab === 'ALL'
                  ? 'bg-gray-800 text-white border border-gray-700'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              All Milestones ({escrows.length})
            </button>
            <button
              onClick={() => setActiveTab('CLIENT')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition ${
                activeTab === 'CLIENT'
                  ? 'bg-gray-800 text-white border border-gray-700'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              As Client / Funder
            </button>
            <button
              onClick={() => setActiveTab('CONTRIBUTOR')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition ${
                activeTab === 'CONTRIBUTOR'
                  ? 'bg-gray-800 text-white border border-gray-700'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              As Contributor
            </button>
          </div>

          <div className="text-xs text-gray-400 hidden sm:block">
            Connected to Solana Devnet Program
          </div>
        </div>

        {/* Escrow Cards Grid */}
        {filteredEscrows.length === 0 ? (
          <div className="text-center py-16 bg-[#121217] border border-gray-800/80 rounded-2xl p-8">
            <Shield className="size-12 text-gray-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-300">No milestones found in this view</h3>
            <p className="text-xs text-gray-400 mt-1 mb-4">
              Create a new escrow or switch to "All Milestones" to see live contracts.
            </p>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#9945FF] hover:bg-[#8338e6] text-white text-xs font-bold transition"
            >
              Create Milestone
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredEscrows.map((item) => (
              <EscrowCard key={item.id} escrow={item} onUpdate={handleUpdate} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/60 bg-[#0F0F14] py-6 px-4 text-center text-xs text-gray-400">
        <p>
          PeerEscrow — Built for the <strong>HackYeah 2026 Solana Challenge</strong> (Finance Without Intermediaries).
        </p>
        <p className="mt-1 text-gray-400">
          Anchor On-Chain Program | Solana Devnet | Zero Intermediaries | MIT License
        </p>
      </footer>

      {/* Create Modal */}
      <CreateEscrowModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={handleCreated}
      />
    </div>
  );
};

export const App: React.FC = () => {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <UnifiedWalletProvider>
            <DashboardContent />
          </UnifiedWalletProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
