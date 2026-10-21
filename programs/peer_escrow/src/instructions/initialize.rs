use anchor_lang::prelude::*;
use anchor_lang::system_program::{transfer, Transfer};
use crate::errors::PeerEscrowError;
use crate::state::{EscrowAccount, EscrowStatus};

#[derive(Accounts)]
#[instruction(task_id: [u8; 32], amount: u64, metadata_uri: String)]
pub struct InitializeEscrow<'info> {
    #[account(mut)]
    pub client: Signer<'info>,

    /// CHECK: Contributor wallet specified by client, or Pubkey::default() if open bounty
    pub contributor: UncheckedAccount<'info>,

    #[account(
        init,
        payer = client,
        space = EscrowAccount::LEN,
        seeds = [b"escrow", client.key().as_ref(), task_id.as_ref()],
        bump
    )]
    pub escrow_account: Account<'info, EscrowAccount>,

    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<InitializeEscrow>,
    task_id: [u8; 32],
    amount: u64,
    deadline_ts: i64,
    dispute_window_secs: u64,
    metadata_uri: String,
) -> Result<()> {
    require!(amount > 0, PeerEscrowError::ZeroAmount);
    require!(metadata_uri.len() <= 128, PeerEscrowError::MetadataUriTooLong);

    let clock = Clock::get()?;
    require!(deadline_ts > clock.unix_timestamp, PeerEscrowError::DeadlineExceeded);

    // Transfer SOL from client wallet into the Escrow PDA
    let cpi_context = CpiContext::new(
        ctx.accounts.system_program.to_account_info(),
        Transfer {
            from: ctx.accounts.client.to_account_info(),
            to: ctx.accounts.escrow_account.to_account_info(),
        },
    );
    transfer(cpi_context, amount)?;

    let escrow = &mut ctx.accounts.escrow_account;
    escrow.client = ctx.accounts.client.key();
    escrow.contributor = ctx.accounts.contributor.key();
    escrow.amount = amount;
    escrow.deadline_ts = deadline_ts;
    escrow.dispute_window_secs = dispute_window_secs;
    escrow.submitted_at_ts = 0;
    escrow.status = EscrowStatus::Initialized;
    escrow.task_id = task_id;
    escrow.metadata_uri = metadata_uri;
    escrow.deliverable_proof = String::new();
    escrow.bump = ctx.bumps.escrow_account;

    msg!("PeerEscrow initialized: {} lamports locked for task", amount);
    Ok(())
}
