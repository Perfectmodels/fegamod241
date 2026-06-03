// Types pour le module Newsletter

export interface NewsletterContact {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  subscribed: boolean;
  subscribedAt?: Date;
  source?: string;
  tags?: string[];
}

export interface NewsletterTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewsletterCampaign {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  recipients: string[]; // email addresses
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  scheduledAt?: Date;
  sentAt?: Date;
  stats?: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
  };
}

export interface RateLimitConfig {
  maxEmailsPerDay: number;
  maxEmailsPerHour: number;
  delayBetweenEmails: number; // milliseconds
  currentDayCount: number;
  currentHourCount: number;
  lastEmailSentAt?: Date;
  dayResetAt?: Date;
  hourResetAt?: Date;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  rateLimited?: boolean;
  remainingDaily?: number;
  remainingHourly?: number;
}

export interface BulkSendResult {
  totalAttempted: number;
  successful: number;
  failed: number;
  rateLimited: number;
  results: SendEmailResult[];
}
