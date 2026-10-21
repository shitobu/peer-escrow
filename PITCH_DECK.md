# ⚡️ PeerEscrow Pitch Deck
### *Finance Without Intermediaries — Built for HackYeah 2026 (Superteam Poland Track)*

---

### Slide 1: Cover
- **Title:** PeerEscrow
- **Subtitle:** Trustless Milestone Finance & Autonomous Bounties on Solana
- **Tagline:** Eliminate Middlemen. Eliminate Rent Extraction. Eliminate Ghosting.
- **Presenter:** Naota / `shitobu`
- **Hackathon:** HackYeah 2026 — Superteam Poland Track: *Finance Without Intermediaries*

---

### Slide 2: The Problem: The Broken Middleman Economy
- **The Web2 Chokepoint:** Freelance & bounty platforms (Upwork, Fiverr, traditional escrows) charge **10% to 20% in fees** on every transaction.
- **Arbitrary Censorship & Delays:** Cross-border workers endure opaque KYC gates, weeks of account freezes, and restricted global access.
- **The "Client Ghosting" Dilemma:** A contributor delivers high-quality code or creative work, but the client vanishes. The contributor is left stranded in months-long customer support arbitration.

---

### Slide 3: The Vision: Finance Without Intermediaries
- What if contract terms were strictly enforced by math, cryptography, and time?
- **Zero Take Rates (0% Fees):** 100% of client payments go directly into the hands of the builder.
- **Autonomous Resolution:** No arbitration panels, no support tickets, no central bank accounts.
- **Permissionless & Global:** Anyone with a Solana wallet can create or fulfill milestones instantly.

---

### Slide 4: How PeerEscrow Works
- **1. Milestone Creation:** Client deposits SOL into a program-derived vault account (`PDA`).
- **2. Work Submission:** Contributor completes the task and registers an immutable proof hash (Git commit, PR URL, IPFS CID).
- **3. Dual Resolution Paths:**
  - **Happy Path:** Client verifies work and signs release with 1-click.
  - **Autonomous Timelock Path:** If the client goes inactive during review, contributor claims the full funds once the grace timer expires!

---

### Slide 5: The Autonomous Timelock Mechanism
- **The Innovation:** True disintermediation requires removing the *need* for human arbitrators.
- **Clock-Enforced Security:**
  - Client sets a review grace period (e.g., 3 to 7 days).
  - When contributor submits deliverable, the Solana runtime timestamp clock starts ticking.
  - If client does not reject or raise a valid on-chain dispute within that window, the smart contract unlocks 100% of funds for the contributor.
- **Client Protection:** If deadline arrives with no submission, client triggers instant 1-click refund.

---

### Slide 6: Architecture & On-Chain Design
- **Anchor Framework (v0.30.1) on Solana:**
  - Program Derived Addresses (`[b"escrow", client, task_id]`) eliminate smart contract custody risk.
  - Zero admin backdoors, no upgradeable keys with drain privileges.
- **Web Application:**
  - Built with React 18, Vite, TypeScript, and Tailwind CSS.
  - Native Solana Wallet Adapter support (Phantom, Solflare, Backpack).
  - Real-time Devnet interaction with automatic balance tracking and live countdown timers.

---

### Slide 7: Market Opportunity & Impact
- **Global Gig Economy:** Over $450B in freelance transaction volume globally.
- **Extracted Rent:** Traditional platforms siphon **$45B+ annually** simply for acting as escrow middlemen.
- **Crypto & Open-Source Bounties:** Web3 projects need frictionless, global micro-grants and bounties without wading through KYC bureaucracy or fiat banking wires.

---

### Slide 8: Competitive Comparison

| Feature | Upwork / Fiverr | Traditional Crypto Escrows | **PeerEscrow** |
| :--- | :--- | :--- | :--- |
| **Platform Fee** | 10% - 20% | 1% - 3% | **0.00%** |
| **KYC Barrier** | Strict Passport ID | Often required for fiat/USDC | **None (Wallet-to-Wallet)** |
| **Dispute Resolution** | Centralized Admin (Slow) | Centralized Multi-sig | **Autonomous Smart Contract Timelock** |
| **Settlement Time** | 5 - 14 Days | Hours | **Instant (Solana ~400ms)** |
| **Custody Risk** | Corporate Bank Account | Centralized Treasury | **Non-Custodial PDA Vault** |

---

### Slide 9: Roadmap & Future Expansion
- **Q4 2026:**
  - Multi-token support (SPL Token deposits: USDC, EURC, SOL).
  - Decentralized IPFS metadata integration via Bundlr / Irys.
- **Q1 2027:**
  - Multi-milestone chaining (staged deliverables in a single contract).
  - Decentralized community juror pools (Kleros / Aragon-style stake-slashing) for disputed edge cases.

---

### Slide 10: Conclusion & Call to Action
- **PeerEscrow** is the purest embodiment of *"Finance Without Intermediaries"*.
- It returns financial sovereignty to builders, creators, and clients worldwide.
- **Try the Live App:** [github.com/shitobu/peer-escrow](https://github.com/shitobu/peer-escrow)
- **Built for HackYeah 2026 Superteam Poland Track**.
