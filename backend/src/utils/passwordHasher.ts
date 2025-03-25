
// Function to hash a password using Web Crypto API
export async function hashPassword(password: string): Promise<string> {
  // Convert password string to buffer
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  
  // Generate a random salt (16 bytes)
  const salt = crypto.getRandomValues(new Uint8Array(16));
  
  // Hash the password with the salt using SHA-256
  const hashBuffer = await crypto.subtle.digest(
    'SHA-256',
    new Uint8Array([...salt, ...passwordBuffer])
  );
  
  // Convert both salt and hash to base64 for storage
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const saltArray = Array.from(salt);
  
  // Store salt+hash as base64 string (salt is first 16 bytes)
  const hashBase64 = btoa(String.fromCharCode(...saltArray, ...hashArray));
  
  return hashBase64;
}

// Function to verify a password against a stored hash
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  try {
    // Decode the stored hash to get salt+hash
    const decoder = new TextEncoder();
    const hashBytes = atob(storedHash).split('').map(c => c.charCodeAt(0));
    
    // Extract salt (first 16 bytes)
    const salt = new Uint8Array(hashBytes.slice(0, 16));
    
    // Hash the provided password with the extracted salt
    const passwordBuffer = decoder.encode(password);
    const hashBuffer = await crypto.subtle.digest(
      'SHA-256',
      new Uint8Array([...salt, ...passwordBuffer])
    );
    
    // Convert to base64 for comparison
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const newHashBase64 = btoa(String.fromCharCode(...salt, ...hashArray));
    
    // Compare the hashes
    return newHashBase64 === storedHash;
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
}
