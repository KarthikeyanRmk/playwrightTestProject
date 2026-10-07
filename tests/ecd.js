// ============================================================
// P97 Prepaid Closed Loop - RSA-OAEP SHA-256 ECD Generator
// ============================================================

// 1. Base64 public key (from GET /v5/wallet/register/publickey)
const publicKeyBase64 = "MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAjkKwEoV3Pcy4RT/t1Wko69j7pz+9g3HaT5Mic+CyN2woLTVK/sK7f/1m0/OyDkIpU7eS9plWAAKRuaBDYLRPxee0iPedgayGsPWLf/oKjAtpCYXPAMPIpJOOqb8pKQ8PwD0bWbRJ4nCDtsnbvUxmMPI6CYjIDy7NDb/Yi4Xz6Cz4f0zpas0lfEB48nlhheZLdRu/I9rN1eoUqbrK6HNCPk39V0cNAikKTHZcY3orLE1eHtJAM7z7Mu2WvqBBnf/TVhMxjT+AYo3aRgBmjHzfGPIVdJbZHWnKjsJCzxaAP+wIX+yutdulWEuWui/sE3SIUFPoJGeEMyT2cngQkyspoMmLKaPc0IzNY/HCQuJ8iQrEDFj8z4XQ5QB5AUa9XvO+tRy7FjmeEWzEq2qyXPrbNnyp+c9v9xXp0kRVyINYzf5DUDvlubjg8Srem4Fzq8fVeFYQHR6cFxkCPyDgLgEg316XK+BSGnHdfbk5ZvQn9ubcH7cwL1WjIzyyMVk05GpUYwQn5XqrfYLgfyA7wyg6f+LKzeufvi0nb6RV4BkROvjT1Nb0nH/51h5a8Hr5tOvd+PR/go5CAGyYeoclU5/YOVZxvxMIZAGcGn+285XFBwWNp4aDnB1R3kkhw9bT7pTP6vD4mOcDlgKfMU4W7Z0Qe4nksiYPMqNkfggguIaSoc0CAwEAAQ==";

// ============================================================
// 2. Card data — MATCHES DOCUMENT'S PLAIN TEXT CARD DATA SCHEMA
// ============================================================
const cardData = {
    pan: "6006491295999915674",   // Mandatory
    expDate: "122026",            // Optional (MMyyyy) — set to "" or remove if not needed
    cvv: "3409"                    // Conditional (required for SVS host)
};

// Optional: set to true if the card issuer does NOT require expDate/cvv
// (e.g., non-SVS host, or you want to test PAN-only encryption)
const omitOptionalFields = false;

// ------------------------------------------------------------
// Build the plaintext exactly as the PCI Zone expects
// ------------------------------------------------------------
const plaintextObject = { pan: cardData.pan };

if (!omitOptionalFields) {
    if (cardData.expDate) plaintextObject.expDate = cardData.expDate;
    if (cardData.cvv)     plaintextObject.cvv     = cardData.cvv;
}

// IMPORTANT: The PCI Zone expects a JSON string, not just the PAN.
// Use compact JSON (no extra whitespace) to avoid mismatches.
const plaintextJson = JSON.stringify(plaintextObject);

console.log("Plaintext to encrypt:", plaintextJson);
// Expected: {"pan":"6006491295999915674","expDate":"122026","cvv":"123"}

// ============================================================
// 3. Helper functions
// ============================================================
function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

function base64ToUint8Array(base64) {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

// ============================================================
// 4. Main encryption logic
// ============================================================
async function encryptCardData() {
    try {
        const publicKeyBytes = base64ToUint8Array(publicKeyBase64);

        const publicKey = await crypto.subtle.importKey(
            "spki",
            publicKeyBytes,
            { name: "RSA-OAEP", hash: "SHA-256" },
            false,
            ["encrypt"]
        );

        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(plaintextJson);   // <-- JSON string

        const encryptedBuffer = await crypto.subtle.encrypt(
            { name: "RSA-OAEP" },
            publicKey,
            dataBuffer
        );

        const encryptedBase64 = arrayBufferToBase64(encryptedBuffer);
        console.log("ECD (encCardData):", encryptedBase64);

        // Hoppscotch: store for use as {{encCardData}} in request body
        pw.env.set("encCardData", encryptedBase64);

    } catch (error) {
        console.error("Encryption failed:", error);
    }
}

encryptCardData();