use anchor_lang::prelude::*;

#[error_code]
pub enum PeerEscrowError {
    #[msg("Unauthorized: Signer does not have permission for this action")]
    Unauthorized,

    #[msg("Escrow is not in the required state for this operation")]
    InvalidState,

    #[msg("Milestone deadline has already passed")]
    DeadlineExceeded,

    #[msg("Milestone deadline has not yet passed; cannot refund early")]
    DeadlineNotReached,

    #[msg("Review grace period is still active; timelock auto-release not unlocked yet")]
    ReviewPeriodActive,

    #[msg("No deliverable proof provided for submission")]
    EmptyDeliverableProof,

    #[msg("Work has already been submitted for this milestone")]
    WorkAlreadySubmitted,

    #[msg("Escrow amount must be greater than zero")]
    ZeroAmount,

    #[msg("Metadata URI exceeds maximum allowed length of 128 characters")]
    MetadataUriTooLong,

    #[msg("Deliverable proof string exceeds maximum allowed length of 128 characters")]
    DeliverableProofTooLong,
}
