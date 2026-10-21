use anchor_lang::prelude::*;
use crate::errors::PeerEscrowError;
use crate::state::{EscrowAccount, EscrowStatus};

#[derive(Accounts)]
pub struct ReleaseFunds<'info> {
    #[account(mut)]
    pub client: Signer<'info>,

    /// CHECK: Contributor receives the escrowed payout
    #[account(
        mut,
        address = escrow_account.contributor @ PeerEscrowError::Unauthorized
    )]
    pub contributor: UncheckedAccount<'info>,

    #[account(
        mut,
        close = client,
        seeds = [b"escrow", client.key().as_ref(), escrow_account.task_id.as_ref()],
        bump = escrow_account.bump,
        has_one = client @ PeerEscrowError::Unauthorized
    )]
    pub escrow_account: Account<'info, EscrowAccount>,
}

pub fn handler(ctx: Context<ReleaseFunds>) -> Result<()> {
    let escrow = &ctx.accounts.escrow_account;

    require!(
        escrow.status == EscrowStatus::WorkSubmitted || escrow.status == EscrowStatus::Initialized,
        PeerEscrowError::InvalidState
    );

    let payout_amount = escrow.amount;

    // Direct PDA lamport transfer to contributor
    **ctx.accounts.escrow_account.to_account_info().try_borrow_mut_lamports()? -= payout_amount;
    **ctx.accounts.contributor.try_borrow_mut_lamports()? += payout_amount;

    msg!(
        "PeerEscrow: Client approved milestone! Released {} lamports directly to contributor {}.",
        payout_amount,
        ctx.accounts.contributor.key()
    );
    Ok(())
}
