import { createCipheriv, createDecipheriv } from 'crypto';

/**
 * AES-256-CBC encryption utility
 * Compatible with Spring Boot AES256Util.java implementation
 *
 * Uses:
 * - Algorithm: AES-256-CBC
 * - IV: First 16 bytes of the AES_SECRET_KEY
 * - Key: Full AES_SECRET_KEY (32 bytes)
 */
export class AES256Util {
  private static readonly ALGORITHM = 'aes-256-cbc';
  private static key: Buffer;
  private static iv: Buffer;

  static initialize(secretKey: string): void {
    // Convert the secret key string to a Buffer (UTF-8 bytes)
    this.key = Buffer.from(secretKey, 'utf-8');

    // Ensure key is exactly 32 bytes for AES-256
    if (this.key.length !== 32) {
      throw new Error(
        `AES-256 requires a 32-byte key. Received ${this.key.length} bytes. ` +
        'Ensure AES_SECRET_KEY environment variable is exactly 32 characters.',
      );
    }

    // IV is the first 16 bytes of the key (same as Spring Boot implementation)
    this.iv = this.key.slice(0, 16);
  }

  /**
   * Encrypts plaintext using AES-256-CBC
   * @param plainText The plaintext to encrypt
   * @returns Base64 encoded encrypted text
   */
  static encrypt(plainText: string): string {
    if (!this.key || !this.iv) {
      throw new Error(
        'AES256Util not initialized. Call AES256Util.initialize(secretKey) first.',
      );
    }

    const cipher = createCipheriv(this.ALGORITHM, this.key, this.iv);
    let encrypted = cipher.update(plainText, 'utf-8', 'binary');
    encrypted += cipher.final('binary');

    // Return as Base64 string
    return Buffer.from(encrypted, 'binary').toString('base64');
  }

  /**
   * Decrypts Base64 encoded ciphertext using AES-256-CBC
   * @param encryptedText The Base64 encoded ciphertext to decrypt
   * @returns Decrypted plaintext
   */
  static decrypt(encryptedText: string): string {
    if (!this.key || !this.iv) {
      throw new Error(
        'AES256Util not initialized. Call AES256Util.initialize(secretKey) first.',
      );
    }

    // Decode Base64 to binary
    const encrypted = Buffer.from(encryptedText, 'base64');

    const decipher = createDecipheriv(this.ALGORITHM, this.key, this.iv);
    let decrypted = decipher.update(encrypted).toString('utf-8');
    decrypted += decipher.final('utf-8');

    return decrypted;
  }
}
