use anchor_lang::prelude::*;
use crate::errors::PeerEscrowError;
use crate::state::{EscrowAccount, EscrowStatus};

#[derive(Accounts)]
pub struct SubmitWork<'info> {
    #[account(mut)]
    pub contributor: Signer<'info>,

    #[account(
        mut,
        seeds = [b"escrow", escrow_account.client.as_ref(), escrow_account.task_id.as_ref()],
        bump = escrow_account.bump,
        has_one = contributor @ PeerEscrowError::Unauthorized
    )]
    pub escrow_account: Account<'info, EscrowAccount>,
}

pub fn handler(ctx: Context<SubmitWork>, deliverable_proof: String) -> Result<()> {
    require!(!deliverable_proof.is_empty(), PeerEscrowError::EmptyDeliverableProof);
    require!(deliverable_proof.len() <= 128, PeerEscrowError::DeliverableProofTooLong);

    let clock = Clock::get()?;
    let escrow = &mut ctx.accounts.escrow_account;

    require!(
        escrow.status == EscrowStatus::Initialized,
        PeerEscrowError::InvalidState
    );

    escrow.deliverable_proof = deliverable_proof;
    escrow.submitted_at_ts = clock.unix_timestamp;
    escrow.status = EscrowStatus::WorkSubmitted;

    msg!(
        "PeerEscrow: Work submitted at ts {}. Timelock review window started.",
        escrow.submitted_at_ts
    );
    Ok(())
}
