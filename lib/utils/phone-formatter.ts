/**
 * Format a phone number to US format: (555) 123-4567
 * Handles 10-digit US phone numbers
 */
export function formatPhoneNumber(value: string): string {
  // Remove all non-numeric characters
  const numbers = value.replace(/\D/g, '');

  // Limit to 10 digits
  const truncated = numbers.slice(0, 10);

  // Format based on length
  if (truncated.length === 0) {
    return '';
  } else if (truncated.length <= 3) {
    return `(${truncated}`;
  } else if (truncated.length <= 6) {
    return `(${truncated.slice(0, 3)}) ${truncated.slice(3)}`;
  } else {
    return `(${truncated.slice(0, 3)}) ${truncated.slice(3, 6)}-${truncated.slice(6)}`;
  }
}

/**
 * Strip formatting from phone number to get raw digits
 */
export function unformatPhoneNumber(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Validate if a phone number is complete (10 digits)
 */
export function isValidPhoneNumber(value: string): boolean {
  const numbers = unformatPhoneNumber(value);
  return numbers.length === 10;
}
