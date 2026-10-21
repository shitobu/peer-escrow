use anchor_lang::prelude::*;
use crate::errors::PeerEscrowError;
use crate::state::{EscrowAccount, EscrowStatus};

#[derive(Accounts)]
pub struct ClaimTimelock<'info> {
    #[account(mut)]
    pub contributor: Signer<'info>,

    /// CHECK: Client who funded the escrow receives leftover rent on close
    #[account(
        mut,
        address = escrow_account.client @ PeerEscrowError::Unauthorized
    )]
    pub client: UncheckedAccount<'info>,

    #[account(
        mut,
        close = client,
        seeds = [b"escrow", escrow_account.client.as_ref(), escrow_account.task_id.as_ref()],
        bump = escrow_account.bump,
        has_one = contributor @ PeerEscrowError::Unauthorized
    )]
    pub escrow_account: Account<'info, EscrowAccount>,
}

pub fn handler(ctx: Context<ClaimTimelock>) -> Result<()> {
    let clock = Clock::get()?;
    let escrow = &ctx.accounts.escrow_account;

    require!(
        escrow.status == EscrowStatus::WorkSubmitted,
        PeerEscrowError::InvalidState
    );

    let unlock_timestamp = escrow
        .submitted_at_ts
        .checked_add(escrow.dispute_window_secs as i64)
        .unwrap();

    require!(
        clock.unix_timestamp >= unlock_timestamp,
        PeerEscrowError::ReviewPeriodActive
    );

    let payout_amount = escrow.amount;

    // Automatic disintermediated payout to contributor
    **ctx.accounts.escrow_account.to_account_info().try_borrow_mut_lamports()? -= payout_amount;
    **ctx.accounts.contributor.try_borrow_mut_lamports()? += payout_amount;

    msg!(
        "PeerEscrow: Timelock grace period elapsed without dispute. Auto-released {} lamports to contributor.",
        payout_amount
    );
    Ok(())
}
