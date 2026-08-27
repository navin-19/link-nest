'use client';

/**
 * High-fidelity, full-color official brand SVG logos.
 */

export function InstagramIcon({ size = 28, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <radialGradient
          id="ig-grad"
          cx="0.2"
          cy="1"
          r="1"
          gradientUnits="fractionalOffset"
        >
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="5%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="90%" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <rect width="48" height="48" rx="14" fill="url(#ig-grad)" />
      <rect
        x="10"
        y="10"
        width="28"
        height="28"
        rx="8"
        stroke="#ffffff"
        strokeWidth="3.2"
        fill="none"
      />
      <circle
        cx="24"
        cy="24"
        r="6.5"
        stroke="#ffffff"
        strokeWidth="3.2"
        fill="none"
      />
      <circle cx="31.5" cy="16.5" r="1.8" fill="#ffffff" />
    </svg>
  );
}

export function YouTubeIcon({ size = 28, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="48" height="48" rx="14" fill="#FF0000" />
      <path
        d="M20 16.5L32 24L20 31.5V16.5Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function TikTokIcon({ size = 28, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="48" height="48" rx="14" fill="#000000" />
      {/* Cyan offset */}
      <path
        d="M31.8 19.2C30 19.1 28.5 18 28.2 16.2V27.5C28.2 31.6 24.8 35 20.7 35C18.2 35 16 33.7 14.8 31.8C15.8 32.8 17.2 33.5 18.7 33.5C22.8 33.5 26.2 30.1 26.2 26V15.5H28.2C29.2 17.5 31.2 19 33.5 19.2V17.2C32.8 17.2 32.2 18.1 31.8 19.2Z"
        fill="#25F4EE"
      />
      {/* Magenta offset */}
      <path
        d="M30 17.5C28.2 17.5 26.7 16.2 26.2 14.5V26C26.2 30.1 22.8 33.5 18.7 33.5C16.2 33.5 14 32.2 12.8 30.3C13.8 31.3 15.2 32 16.7 32C20.8 32 24.2 28.6 24.2 24.5V14H26.2C27.2 16 29.2 17.5 31.5 17.7V15.7C30.9 15.7 30.4 16.5 30 17.5Z"
        fill="#FE2C55"
      />
      {/* Central white glyph */}
      <path
        d="M30.5 18.2C28.8 18.1 27.4 17 27 15.2V26.5C27 30.6 23.6 34 19.5 34C15.4 34 12 30.6 12 26.5C12 22.4 15.4 19 19.5 19C20.3 19 21.1 19.1 21.8 19.4V22.5C21.1 22.2 20.3 22 19.5 22C17 22 15 24 15 26.5C15 29 17 31 19.5 31C22 31 24 29 24 26.5V12H27C27.5 14.8 29.7 17 32.5 17.2V20.2C31.8 20.2 31.1 19.5 30.5 18.2Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function TwitterXIcon({ size = 28, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="48" height="48" rx="14" fill="#000000" />
      <path
        d="M29.6 13H33.8L24.6 23.5L35.4 36H26.9L20.3 27.9L12.7 36H8.5L18.2 24.9L7.8 13H16.5L22.5 20.4L29.6 13ZM28.1 33.5H30.4L15.2 15.3H12.7L28.1 33.5Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function FacebookIcon({ size = 28, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="48" height="48" rx="14" fill="#1877F2" />
      <path
        d="M31.5 25L32.4 19.5H27V16C27 14.5 27.7 13 30 13H32.5V8.3C32.5 8.3 30.2 7.9 28.1 7.9C23.6 7.9 20.6 10.6 20.6 15.5V19.5H15.5V25H20.6V39H27V25H31.5Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function LinkedInIcon({ size = 28, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="48" height="48" rx="14" fill="#0A66C2" />
      <path
        d="M16 19H20.5V34H16V19ZM18.2 12C16.8 12 15.6 13.1 15.6 14.5C15.6 15.9 16.8 17 18.2 17C19.7 17 20.8 15.9 20.8 14.5C20.8 13.1 19.7 12 18.2 12Z"
        fill="#FFFFFF"
      />
      <path
        d="M23.5 19H27.8V21.1H27.9C28.5 19.9 30.1 18.6 32.5 18.6C37.4 18.6 38.3 21.8 38.3 26V34H33.8V26.9C33.8 25.2 33.8 23 31.4 23C29 23 28.6 24.9 28.6 26.8V34H24.1V19H23.5Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function WhatsAppIcon({ size = 28, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="48" height="48" rx="14" fill="#25D366" />
      <path
        d="M34.2 13.8C31.5 11.1 27.9 9.6 24.1 9.6C16.2 9.6 9.8 16 9.8 23.9C9.8 26.4 10.5 28.9 11.7 31L9.6 38.4L17.3 36.4C19.3 37.5 21.7 38.1 24.1 38.1C32 38.1 38.4 31.7 38.4 23.8C38.4 20 36.9 16.5 34.2 13.8ZM24.1 35.7C21.9 35.7 19.8 35.1 18 34L17.6 33.7L12.9 35L14.2 30.5L13.9 30C12.7 28.1 12 25.9 12 23.7C12 17.1 17.4 11.7 24 11.7C27.2 11.7 30.2 13 32.5 15.2C34.8 17.5 36 20.5 36 23.7C36.1 30.4 30.7 35.7 24.1 35.7ZM30.7 26.8C30.3 26.6 28.5 25.7 28.1 25.6C27.8 25.4 27.5 25.4 27.3 25.7C27.1 26 26.4 26.8 26.2 27C26 27.2 25.8 27.3 25.4 27.1C25 26.9 23.9 26.5 22.5 25.3C21.4 24.3 20.7 23.1 20.5 22.7C20.3 22.3 20.5 22.1 20.7 21.9C20.9 21.7 21.1 21.5 21.3 21.3C21.5 21.1 21.6 20.9 21.7 20.7C21.8 20.5 21.8 20.3 21.7 20.1C21.6 19.9 20.9 18.2 20.6 17.5C20.3 16.8 20 16.9 19.8 16.9C19.6 16.9 19.3 16.9 19.1 16.9C18.9 16.9 18.5 17 18.2 17.3C17.9 17.6 17 18.5 17 20.2C17 21.9 18.3 23.6 18.4 23.8C18.6 24 20.9 27.5 24.4 29C25.3 29.4 25.9 29.6 26.5 29.8C27.4 30.1 28.2 30 28.8 29.9C29.5 29.8 31 29 31.3 28.1C31.6 27.2 31.6 26.4 31.5 26.3C31.4 27.1 31.1 27 30.7 26.8Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function GitHubIcon({ size = 28, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="48" height="48" rx="14" fill="#24292F" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24 10C16.3 10 10 16.3 10 24C10 30.2 14 35.3 19.6 37.2C20.3 37.3 20.6 36.9 20.6 36.5C20.6 36.2 20.6 35.1 20.6 33.7C16.7 34.6 15.9 32.1 15.9 32.1C15.3 30.5 14.4 30.1 14.4 30.1C13.1 29.2 14.5 29.2 14.5 29.2C15.9 29.3 16.7 30.7 16.7 30.7C18 32.8 20.1 32.2 20.9 31.8C21 30.8 21.4 30.2 21.9 29.8C18.8 29.4 15.5 28.2 15.5 22.9C15.5 21.4 16 20.2 16.9 19.2C16.8 18.8 16.3 17.4 17 15.6C17 15.6 18.2 15.2 20.8 17C21.9 16.7 23.1 16.5 24.3 16.5C25.5 16.5 26.7 16.7 27.8 17C30.4 15.2 31.6 15.6 31.6 15.6C32.3 17.4 31.8 18.8 31.7 19.2C32.6 20.2 33.1 21.4 33.1 22.9C33.1 28.2 29.8 29.4 26.7 29.7C27.3 30.2 27.8 31.2 27.8 32.8C27.8 35.1 27.8 36.9 27.8 36.5C27.8 36.9 28.1 37.3 28.8 37.2C34.4 35.3 38.4 30.1 38.4 24C38.4 16.3 32.1 10 24 10Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function WebsiteIcon({ size = 28, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="48" height="48" rx="14" fill="#4F46E5" />
      <circle cx="24" cy="24" r="13" stroke="#FFFFFF" strokeWidth="2.5" />
      <path d="M11 24H37" stroke="#FFFFFF" strokeWidth="2.5" />
      <path
        d="M24 11C27.5 15 29.5 19.5 29.5 24C29.5 28.5 27.5 33 24 37C20.5 33 18.5 28.5 18.5 24C18.5 19.5 20.5 15 24 11Z"
        stroke="#FFFFFF"
        strokeWidth="2.5"
      />
    </svg>
  );
}

export function EmailIcon({ size = 28, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="48" height="48" rx="14" fill="#EA4335" />
      <path
        d="M13 16.5C13 15.4 13.9 14.5 15 14.5H33C34.1 14.5 35 15.4 35 16.5V31.5C35 32.6 34.1 33.5 33 33.5H15C13.9 33.5 13 32.6 13 31.5V16.5Z"
        stroke="#FFFFFF"
        strokeWidth="2.5"
      />
      <path
        d="M13.5 16.5L24 24.5L34.5 16.5"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PhoneIcon({ size = 28, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="48" height="48" rx="14" fill="#0284C7" />
      <path
        d="M17.5 13.5C17 13.5 16 14 15.5 15C14.5 16.5 14.5 18.5 16 21.5C17.5 24.5 20.5 28.5 24.5 31.5C27.5 33.5 29.5 33.5 31 32.5C32 32 32.5 31 32.5 30.5L30.5 25.5C30 25 29 25 28 25.5L26.5 27C23.5 25.5 22.5 24.5 21 21.5L22.5 20C23 19 23 18 22.5 17.5L17.5 13.5Z"
        fill="#FFFFFF"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TelegramIcon({ size = 28, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="48" height="48" rx="14" fill="#229ED9" />
      <path
        d="M35.6 13.5L10.5 23.2C8.8 23.9 8.8 24.8 10.2 25.3L16.6 27.3L31.5 17.9C32.2 17.5 32.8 17.7 32.3 18.2L20.2 29.1H20.1L20.2 29.2L19.8 35.8C20.4 35.8 20.7 35.5 21.1 35.1L24.3 32L31 36.9C32.2 37.6 33.1 37.2 33.5 35.8L37.9 15.1C38.3 13.3 37.1 12.4 35.6 13.5Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}
