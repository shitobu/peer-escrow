use anchor_lang::prelude::*;

pub mod errors;
pub mod instructions;
pub mod state;

use instructions::*;

declare_id!("PeerEscrow111111111111111111111111111111111");

#[program]
pub mod peer_escrow {
    use super::*;

    /// Initialize a new milestone escrow. Client deposits funds into the PDA vault.
    pub fn initialize_escrow(
        ctx: Context<InitializeEscrow>,
        task_id: [u8; 32],
        amount: u64,
        deadline_ts: i64,
        dispute_window_secs: u64,
        metadata_uri: String,
    ) -> Result<()> {
        instructions::initialize::handler(
            ctx,
            task_id,
            amount,
            deadline_ts,
            dispute_window_secs,
            metadata_uri,
        )
    }

    /// Contributor submits proof of work (e.g. GitHub PR URL or IPFS deliverable CID).
    pub fn submit_work(ctx: Context<SubmitWork>, deliverable_proof: String) -> Result<()> {
        instructions::submit_work::handler(ctx, deliverable_proof)
    }

    /// Client approves deliverable and releases escrowed funds directly to contributor.
    pub fn release_funds(ctx: Context<ReleaseFunds>) -> Result<()> {
        instructions::release::handler(ctx)
    }

    /// Contributor auto-claims funds if client remains inactive past the review window.
    pub fn claim_timelock(ctx: Context<ClaimTimelock>) -> Result<()> {
        instructions::claim_timelock::handler(ctx)
    }

    /// Client reclaims escrowed funds if contributor never submits work before deadline.
    pub fn refund_escrow(ctx: Context<RefundEscrow>) -> Result<()> {
        instructions::refund::handler(ctx)
    }
}
