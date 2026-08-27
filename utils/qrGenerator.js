/**
 * QR code generator utility.
 * This module provides helpers for generating QR code data for profile URLs.
 * The actual QR rendering is done by qrcode.react's <QRCodeSVG> / <QRCodeCanvas> components.
 */

/**
 * Returns the public profile URL for a given username.
 * Automatically resolves runtime browser origin when NEXT_PUBLIC_APP_URL is not set.
 * 
 * @param {string} username
 * @param {string} [baseUrl]
 * @returns {string}
 */
export function getProfileUrl(username, baseUrl) {
  if (!username) return '';
  const envUrl = process.env.NEXT_PUBLIC_APP_URL;
  const runtimeOrigin =
    typeof window !== 'undefined' && window.location?.origin
      ? window.location.origin
      : null;

  const base = (baseUrl || envUrl || runtimeOrigin || 'http://localhost:3000').replace(/\/$/, '');
  return `${base}/${username}`;
}

/**
 * Returns QR code props for use with qrcode.react.
 * @param {string} username
 * @returns {object}
 */
export function getQRProps(username) {
  return {
    value: getProfileUrl(username),
    size: 200,
    level: 'M', // error correction level
    includeMargin: true,
    bgColor: '#0f0f2e',
    fgColor: '#c026d3',
  };
}
