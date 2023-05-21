export interface WaitlistUser {
    amount_referred: number;
    created_at: string;
    email: string;
    priority: number;
    referral_link: string;
    total_waiters_currently: number;
    verified: boolean;
    removed_date: string;
}
