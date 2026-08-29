/**
 * QR code generator utility.
 * This module provides helpers for generating QR code data for profile URLs.
 * The actual QR rendering is done by qrcode.react's <QRCodeSVG> / <QRCodeCanvas> components.
 */

/**
 * Returns the public profile URL for a given username.
 * Uses a deterministic base URL to prevent SSR / client hydration mismatches.
 * 
 * @param {string} username
 * @param {string} [baseUrl]
 * @returns {string}
 */
export function getProfileUrl(username, baseUrl) {
  if (!username) return '';
  const envUrl = process.env.NEXT_PUBLIC_APP_URL;
  const base = (baseUrl || envUrl || 'https://linknest.app').replace(/\/$/, '');
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
