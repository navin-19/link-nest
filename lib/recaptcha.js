/**
 * Helper to verify Google reCAPTCHA v3 tokens on the server.
 *
 * @param {string} token - reCAPTCHA client response token
 * @param {string} [secretKey] - Optional override of RECAPTCHA_SECRET_KEY
 * @returns {Promise<{ success: boolean, score?: number, isDevMode?: boolean, error?: string }>}
 */
export async function verifyRecaptchaToken(token, secretKey = process.env.RECAPTCHA_SECRET_KEY) {
  // If no secret key is configured (e.g. local development or demo environments), allow gracefully
  if (!secretKey) {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[reCAPTCHA] RECAPTCHA_SECRET_KEY not set — bypassing verification in development mode.');
    }
    return { success: true, score: 1.0, isDevMode: true };
  }

  if (!token) {
    return { success: false, error: 'CAPTCHA token is required.' };
  }

  try {
    const params = new URLSearchParams({
      secret: secretKey,
      response: token,
    });

    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const data = await response.json();

    if (!data.success) {
      console.warn('[reCAPTCHA] Verification failed:', data['error-codes']);
      return {
        success: false,
        error: 'CAPTCHA verification failed. Please try again.',
        errorCodes: data['error-codes'],
      };
    }

    // Check v3 score if present (threshold 0.5)
    if (typeof data.score === 'number' && data.score < 0.5) {
      console.warn(`[reCAPTCHA] Suspicious bot score: ${data.score}`);
      return {
        success: false,
        score: data.score,
        error: 'Security check flagged automated traffic. Please try again.',
      };
    }

    return {
      success: true,
      score: data.score,
      action: data.action,
    };
  } catch (err) {
    console.error('[reCAPTCHA] Network or verification exception:', err);
    return { success: false, error: 'CAPTCHA verification service error.' };
  }
}
