use anchor_lang::prelude::*;
use crate::errors::PeerEscrowError;
use crate::state::{EscrowAccount, EscrowStatus};

#[derive(Accounts)]
pub struct RefundEscrow<'info> {
    #[account(mut)]
    pub client: Signer<'info>,

    #[account(
        mut,
        close = client,
        seeds = [b"escrow", client.key().as_ref(), escrow_account.task_id.as_ref()],
        bump = escrow_account.bump,
        has_one = client @ PeerEscrowError::Unauthorized
    )]
    pub escrow_account: Account<'info, EscrowAccount>,
}

pub fn handler(ctx: Context<RefundEscrow>) -> Result<()> {
    let clock = Clock::get()?;
    let escrow = &ctx.accounts.escrow_account;

    require!(
        escrow.status == EscrowStatus::Initialized,
        PeerEscrowError::InvalidState
    );

    require!(
        clock.unix_timestamp > escrow.deadline_ts,
        PeerEscrowError::DeadlineNotReached
    );

    let refund_amount = escrow.amount;

    // Full refund back to client (remaining rent is refunded automatically via close = client)
    **ctx.accounts.escrow_account.to_account_info().try_borrow_mut_lamports()? -= refund_amount;
    **ctx.accounts.client.try_borrow_mut_lamports()? += refund_amount;

    msg!(
        "PeerEscrow: Milestone deadline elapsed without submission. Refunded {} lamports to client.",
        refund_amount
    );
    Ok(())
}
