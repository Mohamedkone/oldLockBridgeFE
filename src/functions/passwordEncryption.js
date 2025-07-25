export async function deriveKeyPairFromPassword(password) {
  try {
    const encoder = new TextEncoder();
    const passwordBytes = encoder.encode(password);
    
    // Import password as key material
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      passwordBytes,
      'PBKDF2',
      false,
      ['deriveKey']
    );
    
    // Use a fixed salt for deterministic results
    const salt = encoder.encode('lockbridge-diamond-salt-2024');
    
    // Derive a 256-bit key using PBKDF2
    const derivedKey = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      {
        name: 'AES-GCM',
        length: 256
      },
      true,
      ['encrypt', 'decrypt']
    );
    
    return derivedKey;
  } catch (error) {
    console.error("Error deriving deterministic key:", error);
    throw new Error("Failed to derive deterministic key from password");
  }
}
