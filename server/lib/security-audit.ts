import type { IStorage } from '../storage';

/**
 * Security & Authentication Audit Logger
 * 
 * Logs all security-relevant events for compliance and incident response.
 * Follows GDPR data minimization - logs only essential data (no passwords, no PII beyond user ID).
 */

export type SecurityAuditAction =
  | 'login_success'
  | 'login_failed'
  | 'logout'
  | 'password_change'
  | 'password_reset_request'
  | 'password_reset_complete'
  | 'registration'
  | 'session_invalidated'
  | 'rate_limit_exceeded'
  | 'invoice_created'
  | 'invoice_updated'
  | 'invoice_deleted'
  | 'client_created'
  | 'client_updated'
  | 'client_deleted';

export interface SecurityAuditLog {
  id: number;
  userId: number | null;
  action: SecurityAuditAction;
  ipAddress: string | null;
  userAgent: string | null;
  metadata: Record<string, any> | null;
  timestamp: Date;
}

export class SecurityAuditLogger {
  constructor(private storage: IStorage) {}

  /**
   * Log a security audit event.
   * 
   * @param action - Security action type
   * @param userId - User ID (null for failed logins)
   * @param req - Express request object (for IP and user agent)
   * @param metadata - Additional context (no sensitive data)
   */
  async log(
    action: SecurityAuditAction,
    userId: number | null,
    req: any,
    metadata?: Record<string, any>
  ): Promise<void> {
    try {
      const ipAddress = this.getClientIp(req);
      const userAgent = req.get('user-agent') || null;

      await this.storage.createSecurityAuditLog({
        userId,
        action,
        ipAddress,
        userAgent,
        metadata: metadata || null,
      });
    } catch (error) {
      // Log audit failures to console but don't block operations
      console.error('Security audit logging failed:', error);
    }
  }

  /**
   * Get client IP address (handles proxies).
   */
  private getClientIp(req: any): string | null {
    // Handle X-Forwarded-For header (proxies/load balancers)
    const forwarded = req.get('x-forwarded-for');
    if (forwarded) {
      // X-Forwarded-For can be a comma-separated list; take the first IP
      return forwarded.split(',')[0].trim();
    }
    
    // Fallback to req.ip
    return req.ip || req.connection?.remoteAddress || null;
  }

  // Convenience methods for common events
  async logLoginSuccess(userId: number, req: any): Promise<void> {
    await this.log('login_success', userId, req);
  }

  async logLoginFailed(username: string, req: any): Promise<void> {
    await this.log('login_failed', null, req, { username });
  }

  async logLogout(userId: number, req: any): Promise<void> {
    await this.log('logout', userId, req);
  }

  async logPasswordChange(userId: number, req: any): Promise<void> {
    await this.log('password_change', userId, req);
  }

  async logPasswordResetRequest(userId: number, req: any): Promise<void> {
    await this.log('password_reset_request', userId, req);
  }

  async logPasswordResetComplete(userId: number, req: any): Promise<void> {
    await this.log('password_reset_complete', userId, req);
  }

  async logRegistration(userId: number, req: any): Promise<void> {
    await this.log('registration', userId, req);
  }

  async logSessionInvalidated(userId: number, req: any, metadata?: Record<string, any>): Promise<void> {
    await this.log('session_invalidated', userId, req, metadata);
  }

  async logRateLimitExceeded(req: any): Promise<void> {
    await this.log('rate_limit_exceeded', null, req);
  }

  async logInvoiceCreated(userId: number, req: any, invoiceId: number): Promise<void> {
    await this.log('invoice_created', userId, req, { invoiceId });
  }

  async logInvoiceUpdated(userId: number, req: any, invoiceId: number): Promise<void> {
    await this.log('invoice_updated', userId, req, { invoiceId });
  }

  async logInvoiceDeleted(userId: number, req: any, invoiceId: number): Promise<void> {
    await this.log('invoice_deleted', userId, req, { invoiceId });
  }

  async logClientCreated(userId: number, req: any, clientId: number): Promise<void> {
    await this.log('client_created', userId, req, { clientId });
  }

  async logClientUpdated(userId: number, req: any, clientId: number): Promise<void> {
    await this.log('client_updated', userId, req, { clientId });
  }

  async logClientDeleted(userId: number, req: any, clientId: number): Promise<void> {
    await this.log('client_deleted', userId, req, { clientId });
  }
}
