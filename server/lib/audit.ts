import type { IStorage } from '../storage';
import type { AuditActionType } from '@shared/schema';

/**
 * GDPR-Compliant Audit Logging
 * 
 * Minimal logging that records only:
 * - Timestamp (auto-generated)
 * - User ID
 * - Document ID (nullable for erasure requests)
 * - Action type
 * 
 * NEVER logs:
 * - Document content
 * - Metadata
 * - File names
 * - Any personally identifiable information beyond user ID
 * 
 * This complies with GDPR Article 5(1)(c) - data minimization principle.
 */

export class AuditLogger {
  constructor(private storage: IStorage) {}

  /**
   * Log a vault audit event.
   * 
   * @param userId - User performing the action
   * @param action - Action type (upload, download, delete, etc.)
   * @param documentId - Document ID (optional for erasure requests)
   */
  async log(
    userId: number,
    action: AuditActionType,
    documentId?: number
  ): Promise<void> {
    try {
      await this.storage.createVaultAuditLog({
        userId,
        action,
        documentId: documentId || null,
      });
    } catch (error) {
      // Log audit failures to console but don't block operations
      console.error('Audit logging failed:', error);
    }
  }

  /**
   * Log document upload.
   */
  async logUpload(userId: number, documentId: number): Promise<void> {
    await this.log(userId, 'upload', documentId);
  }

  /**
   * Log download link generation.
   */
  async logDownloadLink(userId: number, documentId: number): Promise<void> {
    await this.log(userId, 'download_link', documentId);
  }

  /**
   * Log actual file download.
   */
  async logDownload(userId: number, documentId: number): Promise<void> {
    await this.log(userId, 'download', documentId);
  }

  /**
   * Log user-initiated delete.
   */
  async logUserDelete(userId: number, documentId: number): Promise<void> {
    await this.log(userId, 'user_delete', documentId);
  }

  /**
   * Log automated retention deletion.
   */
  async logAutoDelete(userId: number, documentId: number): Promise<void> {
    await this.log(userId, 'auto_delete', documentId);
  }

  /**
   * Log expiry notice sent.
   */
  async logExpiryNotice(userId: number, documentId: number): Promise<void> {
    await this.log(userId, 'expiry_notice', documentId);
  }

  /**
   * Log GDPR erasure request.
   */
  async logErasureRequest(userId: number, documentId?: number): Promise<void> {
    await this.log(userId, 'erasure_request', documentId);
  }
}
