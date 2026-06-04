import { RateLimitConfig, SendEmailResult, BulkSendResult, NewsletterContact } from '../types/newsletter';

// Configuration par défaut basée sur les limites Brevo (Free tier: 300/jour)
const DEFAULT_RATE_LIMIT: RateLimitConfig = {
  maxEmailsPerDay: 300,    // Limite gratuite Brevo
  maxEmailsPerHour: 50,    // Pour éviter les pics
  delayBetweenEmails: 1000, // 1 seconde entre chaque email
  currentDayCount: 0,
  currentHourCount: 0,
};

// Stockage local du rate limit (en production, utiliser une base de données)
let rateLimitState: RateLimitConfig = { ...DEFAULT_RATE_LIMIT };

const STORAGE_KEY = 'brevo_rate_limit';

/**
 * Charge l'état du rate limit depuis le localStorage
 */
export const loadRateLimitState = (): RateLimitConfig => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      rateLimitState = {
        ...DEFAULT_RATE_LIMIT,
        ...parsed,
        dayResetAt: parsed.dayResetAt ? new Date(parsed.dayResetAt) : undefined,
        hourResetAt: parsed.hourResetAt ? new Date(parsed.hourResetAt) : undefined,
        lastEmailSentAt: parsed.lastEmailSentAt ? new Date(parsed.lastEmailSentAt) : undefined,
      };
    }
    return rateLimitState;
  } catch {
    return rateLimitState;
  }
};

/**
 * Sauvegarde l'état du rate limit
 */
export const saveRateLimitState = (): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rateLimitState));
  } catch (e) {
    console.error('Erreur sauvegarde rate limit:', e);
  }
};

/**
 * Réinitialise les compteurs si nécessaire
 */
const resetCountersIfNeeded = (): void => {
  const now = new Date();
  
  // Reset journalier
  if (!rateLimitState.dayResetAt || now > rateLimitState.dayResetAt) {
    rateLimitState.currentDayCount = 0;
    const tomorrow = new Date(now);
    tomorrow.setHours(24, 0, 0, 0);
    rateLimitState.dayResetAt = tomorrow;
  }
  
  // Reset horaire
  if (!rateLimitState.hourResetAt || now > rateLimitState.hourResetAt) {
    rateLimitState.currentHourCount = 0;
    const nextHour = new Date(now);
    nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0);
    rateLimitState.hourResetAt = nextHour;
  }
  
  saveRateLimitState();
};

/**
 * Vérifie si on peut envoyer un email
 */
export const canSendEmail = (): { allowed: boolean; reason?: string; waitTime?: number } => {
  resetCountersIfNeeded();
  
  if (rateLimitState.currentDayCount >= rateLimitState.maxEmailsPerDay) {
    const waitTime = rateLimitState.dayResetAt 
      ? rateLimitState.dayResetAt.getTime() - Date.now()
      : 0;
    return {
      allowed: false,
      reason: `Limite journalière atteinte (${rateLimitState.maxEmailsPerDay} emails)`,
      waitTime,
    };
  }
  
  if (rateLimitState.currentHourCount >= rateLimitState.maxEmailsPerHour) {
    const waitTime = rateLimitState.hourResetAt 
      ? rateLimitState.hourResetAt.getTime() - Date.now()
      : 0;
    return {
      allowed: false,
      reason: `Limite horaire atteinte (${rateLimitState.maxEmailsPerHour} emails)`,
      waitTime,
    };
  }
  
  // Vérifier le délai entre emails
  if (rateLimitState.lastEmailSentAt) {
    const timeSinceLastEmail = Date.now() - rateLimitState.lastEmailSentAt.getTime();
    if (timeSinceLastEmail < rateLimitState.delayBetweenEmails) {
      return {
        allowed: false,
        reason: 'Délai entre emails non respecté',
        waitTime: rateLimitState.delayBetweenEmails - timeSinceLastEmail,
      };
    }
  }
  
  return { allowed: true };
};

/**
 * Enregistre l'envoi d'un email
 */
export const recordEmailSent = (): void => {
  rateLimitState.currentDayCount++;
  rateLimitState.currentHourCount++;
  rateLimitState.lastEmailSentAt = new Date();
  saveRateLimitState();
};

/**
 * Obtient les statistiques actuelles de rate limit
 */
export const getRateLimitStats = (): {
  dailyUsed: number;
  dailyLimit: number;
  dailyRemaining: number;
  hourlyUsed: number;
  hourlyLimit: number;
  hourlyRemaining: number;
  nextDayReset: Date | undefined;
  nextHourReset: Date | undefined;
} => {
  resetCountersIfNeeded();
  
  return {
    dailyUsed: rateLimitState.currentDayCount,
    dailyLimit: rateLimitState.maxEmailsPerDay,
    dailyRemaining: Math.max(0, rateLimitState.maxEmailsPerDay - rateLimitState.currentDayCount),
    hourlyUsed: rateLimitState.currentHourCount,
    hourlyLimit: rateLimitState.maxEmailsPerHour,
    hourlyRemaining: Math.max(0, rateLimitState.maxEmailsPerHour - rateLimitState.currentHourCount),
    nextDayReset: rateLimitState.dayResetAt,
    nextHourReset: rateLimitState.hourResetAt,
  };
};

/**
 * Met à jour la configuration des limites
 */
export const updateRateLimitConfig = (config: Partial<RateLimitConfig>): void => {
  rateLimitState = {
    ...rateLimitState,
    ...config,
  };
  saveRateLimitState();
};

/**
 * Réinitialise les compteurs (à utiliser avec précaution)
 */
export const resetRateLimitCounters = (): void => {
  rateLimitState.currentDayCount = 0;
  rateLimitState.currentHourCount = 0;
  rateLimitState.lastEmailSentAt = undefined;
  saveRateLimitState();
};

/**
 * Envoie un email via Brevo avec rate limiting
 */
export const sendEmailWithRateLimit = async (
  to: NewsletterContact,
  subject: string,
  htmlContent: string,
  senderEmail: string = 'contact@fegamod.ga',
  senderName: string = 'FEGAMOD'
): Promise<SendEmailResult> => {
  const canSend = canSendEmail();
  
  if (!canSend.allowed) {
    return {
      success: false,
      error: canSend.reason,
      rateLimited: true,
      remainingDaily: getRateLimitStats().dailyRemaining,
      remainingHourly: getRateLimitStats().hourlyRemaining,
    };
  }
  
  const apiKey = import.meta.env.VITE_BREVO_API_KEY;
  
  if (!apiKey) {
    return {
      success: false,
      error: 'Clé API Brevo non configurée (VITE_BREVO_API_KEY)',
    };
  }
  
  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: senderName,
          email: senderEmail,
        },
        to: [
          {
            email: to.email,
            name: to.name || to.email,
          },
        ],
        subject: subject,
        htmlContent: htmlContent,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Enregistrer l'envoi réussi
    recordEmailSent();
    
    const stats = getRateLimitStats();
    
    return {
      success: true,
      messageId: data.messageId,
      remainingDaily: stats.dailyRemaining,
      remainingHourly: stats.hourlyRemaining,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
};

/**
 * Envoie des emails en masse avec rate limiting
 */
export const sendBulkEmailsWithRateLimit = async (
  contacts: NewsletterContact[],
  subject: string,
  htmlContent: string,
  senderEmail?: string,
  senderName?: string,
  onProgress?: (current: number, total: number, result: SendEmailResult) => void
): Promise<BulkSendResult> => {
  const results: SendEmailResult[] = [];
  let successful = 0;
  let failed = 0;
  let rateLimited = 0;
  
  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    
    // Vérifier le rate limit avant chaque envoi
    const canSend = canSendEmail();
    
    if (!canSend.allowed) {
      // Attendre si nécessaire
      if (canSend.waitTime && canSend.waitTime < 60000) {
        await new Promise((resolve) => setTimeout(resolve, canSend.waitTime));
      } else {
        // Stop si le temps d'attente est trop long
        const remainingContacts = contacts.slice(i);
        remainingContacts.forEach(() => {
          results.push({
            success: false,
            error: canSend.reason,
            rateLimited: true,
          });
          rateLimited++;
        });
        break;
      }
    }
    
    const result = await sendEmailWithRateLimit(
      contact,
      subject,
      htmlContent,
      senderEmail,
      senderName
    );
    
    results.push(result);
    
    if (result.success) {
      successful++;
    } else if (result.rateLimited) {
      rateLimited++;
    } else {
      failed++;
    }
    
    if (onProgress) {
      onProgress(i + 1, contacts.length, result);
    }
    
    // Délai entre les emails
    if (i < contacts.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, rateLimitState.delayBetweenEmails));
    }
  }
  
  return {
    totalAttempted: contacts.length,
    successful,
    failed,
    rateLimited,
    results,
  };
};

// Initialiser au chargement
loadRateLimitState();
