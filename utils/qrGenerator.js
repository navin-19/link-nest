/**
 * QR code generator utility.
 * This module provides helpers for generating QR code data for profile URLs.
 * The actual QR rendering is done by qrcode.react's <QRCodeSVG> / <QRCodeCanvas> components.
 */

/**
 * Returns the public profile URL for a given username.
 * @param {string} username
 * @param {string} [baseUrl] - Defaults to window.location.origin in browser
 * @returns {string}
 */
export function getProfileUrl(username, baseUrl) {
  const base = (baseUrl || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');
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
