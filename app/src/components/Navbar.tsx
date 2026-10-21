import React, { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Shield, Coins, ExternalLink, Zap } from 'lucide-react';
import { requestDevnetAirdrop } from '../services/solana';

interface NavbarProps {
  onOpenCreate: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCreate }) => {
  const { publicKey } = useWallet();
  const [isAirdropping, setIsAirdropping] = useState(false);
  const [airdropMsg, setAirdropMsg] = useState('');

  const handleAirdrop = async () => {
    if (!publicKey) return;
    setIsAirdropping(true);
    setAirdropMsg('Requesting 1 Devnet SOL...');
    try {
      await requestDevnetAirdrop(publicKey);
      setAirdropMsg('Airdropped 1 SOL!');
      setTimeout(() => setAirdropMsg(''), 4000);
    } catch (err: any) {
      setAirdropMsg('Faucet rate limit. Use faucet.solana.com');
      setTimeout(() => setAirdropMsg(''), 4000);
    } finally {
      setIsAirdropping(false);
    }
  };

  return (
    <nav className="border-b border-gray-800 bg-[#121217]/90 backdrop-blur sticky top-0 z-50 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-gradient-to-tr from-[#9945FF] to-[#14F195] p-0.5 flex items-center justify-center glow-purple">
            <div className="size-full bg-[#121217] rounded-[10px] flex items-center justify-center">
              <Shield className="size-5 text-[#14F195]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white">PeerEscrow</span>
              <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-[#14F195]/15 text-[#14F195] border border-[#14F195]/30">
                Devnet
              </span>
            </div>
            <p className="text-xs text-gray-400 hidden sm:block">
              Zero-KYC Milestone Bounties & Freelance Escrow
            </p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {publicKey && (
            <button
              onClick={handleAirdrop}
              disabled={isAirdropping}
              className="hidden md:flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-gray-800/80 hover:bg-gray-800 text-gray-300 border border-gray-700 transition"
              title="Request 1 Devnet SOL for testing"
            >
              <Coins className="size-3.5 text-[#14F195]" />
              {isAirdropping ? 'Airdropping...' : 'Get 1 Devnet SOL'}
            </button>
          )}

          <button
            onClick={onOpenCreate}
            className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl bg-gradient-to-r from-[#9945FF] to-[#7d33d9] hover:from-[#8b38f0] hover:to-[#7029cb] text-white shadow-lg transition transform active:scale-95"
          >
            <Zap className="size-4" />
            <span>Create Escrow</span>
          </button>

          <WalletMultiButton />
        </div>
      </div>

      {airdropMsg && (
        <div className="text-center text-xs font-medium py-1 text-[#14F195] bg-[#14F195]/10 mt-2 rounded">
          {airdropMsg}
        </div>
      )}
    </nav>
  );
};
