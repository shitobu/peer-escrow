# 🎬 PeerEscrow 2-Minute Demo Video Script
### *HackYeah 2026 — Superteam Poland Track Submission*

---

### **Overview**
- **Target Video Duration:** 2 minutes to 2 minutes 30 seconds (Requirement is <= 3 mins).
- **Tool to record:** OBS Studio or simple browser/screen recorder with microphone.

---

### **Video Scene-by-Scene Walkthrough**

#### **Scene 1: Introduction (0:00 - 0:30)**
* **Visual:** Browser showing the PeerEscrow Dashboard with Solana Devnet connected.
* **Speaker Script:**
  > *"Hi everyone! This is Naota, presenting **PeerEscrow** for the HackYeah 2026 Superteam Poland track: 'Finance Without Intermediaries'.*  
  > *In the traditional gig economy, centralized middlemen like Upwork and Fiverr siphon 10 to 20% in transaction fees, force intrusive KYC, and lock creators in bureaucratic dispute processes when clients go silent.*  
  > *PeerEscrow solves this on Solana with 0% platform fees, deterministic PDA vaults, and autonomous timelocks that eliminate human intermediaries entirely."*

---

#### **Scene 2: Creating a Trustless Milestone (0:30 - 1:00)**
* **Visual:** Click **"+ Create Escrow"** button. Fill out:
  - Task Title: `HackYeah PeerEscrow Solana Program`
  - Contributor Wallet: (Paste contributor public key or test key)
  - Amount: `1.5 SOL`
  - Deliverable link: `https://github.com/shitobu/peer-escrow`
  - Click **"Lock Deposit in Escrow"**.
* **Speaker Script:**
  > *"Here, the client creates a milestone and locks 1.5 SOL directly into a Program Derived Address vault. The client specifies the contributor's wallet and a grace review period.  
  > No company holds the funds—only the Solana smart contract can govern them."*

---

#### **Scene 3: Contributor Submits Work & Starts Timelock (1:00 - 1:30)**
* **Visual:** Find the active milestone card. Click **"Submit Deliverable Proof"**. Paste a Git commit hash or PR URL (`https://github.com/shitobu/peer-escrow/pull/1`). Click **"Submit Proof"**. Notice the status badge switches to orange `Work Submitted (Under Review)` with a countdown timer.
* **Speaker Script:**
  > *"Once the contributor completes the task, they attach their cryptographic work proof—such as a Git commit or IPFS CID.  
  > This immediately activates the autonomous review window on-chain. If the client reviews and approves it, funds release instantly.  
  > But what if the client ghosts?"*

---

#### **Scene 4: Autonomous Timelock Release & Client Refund (1:30 - 2:05)**
* **Visual:** Highlight the **"Claim Timelock (Grace Expired)"** and **"Approve & Release"** buttons. Click **"Approve & Release"** (or demonstrate the timelock path). Show transaction confirmation and status badge updating to green `Released / Completed`. Show the total stats counters updating.
* **Speaker Script:**
  > *"This is where PeerEscrow achieves true disintermediation: if a client ghosts the contributor past the grace window, the contributor can execute `claim_timelock` on-chain to withdraw 100% of their earnings automatically! No customer support, no human arbitration.  
  > And conversely, if a contributor abandons a task past the deadline, the client can execute an autonomous refund."*

---

#### **Scene 5: Conclusion & Summary (2:05 - 2:20)**
* **Visual:** Zoom out to the full dashboard showing stats (Total Volume, Active Milestones, Completed Payouts, 0% Middleman Extraction).
* **Speaker Script:**
  > *"PeerEscrow is live on Solana Devnet, with full Anchor smart contracts, deterministic PDA state management, and an intuitive Web3 interface.  
  > Thank you Superteam Poland and HackYeah for driving finance without intermediaries!"*
