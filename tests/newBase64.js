const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Your public key (raw Base64 DER, wrapped into SPKI PEM below)
const publicKeyBase64 = 'MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAjkKwEoV3Pcy4RT/t1Wko69j7pz+9g3HaT5Mic+CyN2woLTVK/sK7f/1m0/OyDkIpU7eS9plWAAKRuaBDYLRPxee0iPedgayGsPWLf/oKjAtpCYXPAMPIpJOOqb8pKQ8PwD0bWbRJ4nCDtsnbvUxmMPI6CYjIDy7NDb/Yi4Xz6Cz4f0zpas0lfEB48nlhheZLdRu/I9rN1eoUqbrK6HNCPk39V0cNAikKTHZcY3orLE1eHtJAM7z7Mu2WvqBBnf/TVhMxjT+AYo3aRgBmjHzfGPIVdJbZHWnKjsJCzxaAP+wIX+yutdulWEuWui/sE3SIUFPoJGeEMyT2cngQkyspoMmLKaPc0IzNY/HCQuJ8iQrEDFj8z4XQ5QB5AUa9XvO+tRy7FjmeEWzEq2qyXPrbNnyp+c9v9xXp0kRVyINYzf5DUDvlubjg8Srem4Fzq8fVeFYQHR6cFxkCPyDgLgEg316XK+BSGnHdfbk5ZvQn9ubcH7cwL1WjIzyyMVk05GpUYwQn5XqrfYLgfyA7wyg6f+LKzeufvi0nb6RV4BkROvjT1Nb0nH/51h5a8Hr5tOvd+PR/go5CAGyYeoclU5/YOVZxvxMIZAGcGn+285XFBwWNp4aDnB1R3kkhw9bT7pTP6vD4mOcDlgKfMU4W7Z0Qe4nksiYPMqNkfggguIaSoc0CAwEAAQ==';

// Your card data
const cardData = JSON.stringify({
  card: {
    number: "6006491295999915674 ",
    pin: "3409",
    // ... other fields
  }
});

// Wrap raw Base64 DER (SPKI) into PEM format required by crypto.publicEncrypt
function wrapSpkiPem(base64Der) {
  const lines = base64Der.match(/.{1,64}/g).join('\n');
  return `-----BEGIN PUBLIC KEY-----\n${lines}\n-----END PUBLIC KEY-----\n`;
}

const publicKeyPem = wrapSpkiPem(publicKeyBase64);

// Encrypt using RSA with OAEP padding (common for modern APIs)
const encryptedBuffer = crypto.publicEncrypt(
  {
    key: publicKeyPem,
    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    oaepHash: "sha256",
  },
  Buffer.from(cardData, 'utf8')
);

// Convert to Base64 and write ciphertext only to output file (no secrets to stdout)
const base64Encrypted = encryptedBuffer.toString('base64');
const outputPath = path.join(__dirname, 'newBase64.output.txt');
fs.writeFileSync(outputPath, base64Encrypted, 'utf8');
console.log(`Ciphertext written to: ${outputPath}`);