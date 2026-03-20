export class PasswordValidatorService {
  /**
   * Validates password according to security rules.
   * Password must contain:
   * - Minimum 8 characters
   * - At least one uppercase letter
   * - At least one lowercase letter
   * - At least one number
   * - At least one special character
   *
   * @param password - The password to validate
   * @throws Error - Descriptive error message in Spanish if validation fails
   */
  static validate(password: string): void {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
      password,
    );

    if (password.length < minLength) {
      throw new Error(
        'La contraseña debe tener al menos 8 caracteres de largo.',
      );
    }

    if (!hasUpperCase) {
      throw new Error(
        'La contraseña debe contener al menos una letra mayúscula.',
      );
    }

    if (!hasLowerCase) {
      throw new Error(
        'La contraseña debe contener al menos una letra minúscula.',
      );
    }

    if (!hasNumber) {
      throw new Error('La contraseña debe contener al menos un número.');
    }

    if (!hasSpecialChar) {
      throw new Error(
        'La contraseña debe contener al menos un carácter especial (!@#$%^&*()_+-=[]{};\'"\\|,.<>/?)',
      );
    }
  }
}
