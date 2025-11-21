import crypto from 'crypto';
import type { EncryptedDocumentMetadata } from '@shared/schema';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 12 bytes (96 bits) recommended for GCM
const AUTH_TAG_LENGTH = 16; // 16 bytes for GCM auth tag
const KEY_LENGTH = 32; // 256 bits

/**
 * GDPR-Compliant Encryption Utilities
 * 
 * AES-256-GCM encryption for document metadata with workspace-level keys.
 * 
 * Security Features:
 * - AES-256-GCM (authenticated encryption)
 * - Random IV for each encryption
 * - Authentication tag for integrity verification
 * - Workspace-level key isolation
 * 
 * Key Management:
 * - MVP: Single encryption key from environment (VAULT_ENCRYPTION_KEY)
 * - Future: Per-workspace keys with KMS integration and rotation
 */

/**
 * Get the encryption key for a workspace.
 * MVP: Returns single key from environment variable.
 * Future: Implement per-workspace key retrieval from KMS.
 */
function getWorkspaceEncryptionKey(workspaceId: number): Buffer {
  const keyHex = process.env.VAULT_ENCRYPTION_KEY;
  
  if (!keyHex) {
    throw new Error('VAULT_ENCRYPTION_KEY not configured. Set this environment variable with a 64-character hex string.');
  }
  
  if (keyHex.length !== 64) {
    throw new Error('VAULT_ENCRYPTION_KEY must be 64 hex characters (32 bytes/256 bits)');
  }
  
  return Buffer.from(keyHex, 'hex');
}

/**
 * Generate a new encryption key (for setup/key rotation).
 * Run: `node -e "console.log(crypto.randomBytes(32).toString('hex'))"`
 */
export function generateEncryptionKey(): string {
  return crypto.randomBytes(KEY_LENGTH).toString('hex');
}

/**
 * Encrypt document metadata using AES-256-GCM.
 * 
 * @param metadata - Plain document metadata
 * @param workspaceId - Workspace ID for key isolation
 * @returns Encrypted metadata with ciphertext, IV, and auth tag
 */
export function encryptMetadata(
  metadata: EncryptedDocumentMetadata,
  workspaceId: number
): {
  ciphertext: string;
  iv: string;
  authTag: string;
} {
  try {
    const key = getWorkspaceEncryptionKey(workspaceId);
    const iv = crypto.randomBytes(IV_LENGTH);
    
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    const plaintext = JSON.stringify(metadata);
    let encrypted = cipher.update(plaintext, 'utf8');
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    
    const authTag = cipher.getAuthTag();
    
    return {
      ciphertext: encrypted.toString('base64'),
      iv: iv.toString('base64'),
      authTag: authTag.toString('base64'),
    };
  } catch (error) {
    throw new Error(`Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Decrypt document metadata using AES-256-GCM.
 * 
 * @param encrypted - Encrypted metadata object
 * @param workspaceId - Workspace ID for key isolation
 * @returns Decrypted metadata
 * @throws Error if decryption fails or auth tag verification fails
 */
export function decryptMetadata(
  encrypted: {
    ciphertext: string;
    iv: string;
    authTag: string;
  },
  workspaceId: number
): EncryptedDocumentMetadata {
  try {
    const key = getWorkspaceEncryptionKey(workspaceId);
    const iv = Buffer.from(encrypted.iv, 'base64');
    const ciphertext = Buffer.from(encrypted.ciphertext, 'base64');
    const authTag = Buffer.from(encrypted.authTag, 'base64');
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(ciphertext);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    
    const plaintext = decrypted.toString('utf8');
    return JSON.parse(plaintext) as EncryptedDocumentMetadata;
  } catch (error) {
    // Authentication failure or corruption
    throw new Error(`Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Compute SHA-256 hash of file for integrity verification.
 * 
 * @param buffer - File buffer
 * @returns SHA-256 hash as hex string
 */
export function computeFileHash(buffer: Buffer): string {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

/**
 * Verify file integrity by comparing hashes.
 * 
 * @param buffer - File buffer
 * @param expectedHash - Expected SHA-256 hash
 * @returns True if hash matches
 */
export function verifyFileIntegrity(buffer: Buffer, expectedHash: string): boolean {
  const actualHash = computeFileHash(buffer);
  return crypto.timingSafeEqual(
    Buffer.from(actualHash, 'hex'),
    Buffer.from(expectedHash, 'hex')
  );
}
