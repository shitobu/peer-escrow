import React, { useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Shield, Coins, Zap, Lock, LogOut } from 'lucide-react';
import { requestDevnetAirdrop } from '../services/solana';
import { useUnifiedWallet } from '../context/WalletContext';

interface NavbarProps {
  onOpenCreate: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCreate }) => {
  const {
    publicKey,
    connected,
    isDemo,
    demoBalance,
    connectDemo,
    disconnectDemo,
    requestDemoAirdrop,
  } = useUnifiedWallet();

  const [isAirdropping, setIsAirdropping] = useState(false);
  const [airdropMsg, setAirdropMsg] = useState('');

  const handleAirdrop = async () => {
    if (!publicKey) return;
    setIsAirdropping(true);

    if (isDemo) {
      setAirdropMsg('Requesting 1 Devnet SOL faucet...');
      setTimeout(() => {
        requestDemoAirdrop();
        setAirdropMsg('Airdropped 1 Devnet SOL! (Simulated PDA balance updated)');
        setIsAirdropping(false);
        setTimeout(() => setAirdropMsg(''), 4000);
      }, 600);
      return;
    }

    setAirdropMsg('Requesting 1 Devnet SOL from Solana cluster...');
    try {
      await requestDevnetAirdrop(publicKey);
      setAirdropMsg('Airdropped 1 Devnet SOL on-chain!');
      setTimeout(() => setAirdropMsg(''), 4000);
    } catch (err: any) {
      setAirdropMsg('Devnet faucet rate-limited. Test funds remain active.');
      setTimeout(() => setAirdropMsg(''), 4000);
    } finally {
      setIsAirdropping(false);
    }
  };

  const truncatedAddress = publicKey
    ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
    : '';

  return (
    <nav className="border-b border-gray-800 bg-[#121217]/95 backdrop-blur sticky top-0 z-50 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
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
              <span className="text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-[#14F195]/15 text-[#14F195] border border-[#14F195]/30">
                Devnet
              </span>
            </div>
            <p className="text-xs text-gray-400 hidden sm:block">
              Zero-KYC Milestone Bounties & Freelance Escrow
            </p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap justify-end">
          {connected && (
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
            onClick={() => {
              if (!connected) {
                connectDemo();
              } else {
                onOpenCreate();
              }
            }}
            className={
              connected
                ? 'flex items-center gap-1.5 text-xs sm:text-sm font-semibold px-3.5 py-2 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-[#9945FF] to-[#7d33d9] hover:from-[#8b38f0] hover:to-[#7029cb] text-white shadow-lg transition transform active:scale-95'
                : 'flex items-center gap-1.5 text-xs sm:text-sm font-semibold px-3.5 py-2 sm:px-4 sm:py-2 rounded-xl bg-gray-800/80 text-gray-400 border border-gray-700 hover:border-gray-600 transition'
            }
          >
            {connected ? (
              <Zap className="size-4" />
            ) : (
              <Lock className="size-3.5 text-gray-400" />
            )}
            <span>{connected ? 'Create Escrow' : 'Connect Wallet to Escrow'}</span>
          </button>

          {/* Quick Devnet Demo Connect vs Disconnect */}
          {isDemo ? (
            <div className="flex items-center gap-2 bg-[#1B1B24] border border-[#14F195]/40 rounded-xl px-3 py-1.5">
              <div className="size-2 rounded-full bg-[#14F195] animate-pulse" />
              <div className="text-left text-xs">
                <div className="font-mono text-gray-200 font-bold leading-tight">
                  {truncatedAddress}
                </div>
                <div className="text-[10px] text-[#14F195] leading-none">
                  {demoBalance.toFixed(1)} SOL Devnet
                </div>
              </div>
              <button
                onClick={disconnectDemo}
                className="ml-1 text-gray-400 hover:text-red-400 p-1"
                title="Disconnect Demo Wallet"
              >
                <LogOut className="size-3.5" />
              </button>
            </div>
          ) : !connected ? (
            <button
              onClick={connectDemo}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-[#14F195]/15 hover:bg-[#14F195]/25 text-[#14F195] border border-[#14F195]/40 shadow transition active:scale-95"
              title="Click to instantly test on Devnet without browser extensions"
            >
              <Zap className="size-3.5" />
              <span>⚡ Devnet Demo Wallet</span>
            </button>
          ) : null}

          {/* Standard Solana Wallet Adapter Button (Phantom / Solflare) */}
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
