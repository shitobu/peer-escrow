use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum EscrowStatus {
    Initialized,
    WorkSubmitted,
    Released,
    Refunded,
    Disputed,
}

#[account]
pub struct EscrowAccount {
    /// The party creating and funding the escrow (the Client / Sponsor).
    pub client: Pubkey,
    /// The party performing the work (the Contributor / Freelancer).
    pub contributor: Pubkey,
    /// Escrowed amount in lamports (or token base units).
    pub amount: u64,
    /// Unix timestamp when milestone work is due.
    pub deadline_ts: i64,
    /// Grace period (in seconds) for client review before auto-release triggers.
    pub dispute_window_secs: u64,
    /// Timestamp when work was submitted (0 if not submitted yet).
    pub submitted_at_ts: i64,
    /// Current lifecycle state of the escrow.
    pub status: EscrowStatus,
    /// Identifier seed used for deterministic PDA derivation.
    pub task_id: [u8; 32],
    /// URI or hash pointing to deliverable requirements (e.g. GitHub PR URL / IPFS hash).
    pub metadata_uri: String,
    /// Deliverable proof submitted by worker (e.g. commit hash or IPFS CID).
    pub deliverable_proof: String,
    /// PDA bump seed.
    pub bump: u8,
}

impl EscrowAccount {
    // 8 (discriminator) + 32 (client) + 32 (contributor) + 8 (amount) + 8 (deadline)
    // + 8 (dispute_window) + 8 (submitted_at) + 1 (status) + 32 (task_id)
    // + (4 + 128 metadata_uri) + (4 + 128 deliverable_proof) + 1 (bump)
    pub const LEN: usize = 8 + 32 + 32 + 8 + 8 + 8 + 8 + 1 + 32 + (4 + 128) + (4 + 128) + 1;
}
