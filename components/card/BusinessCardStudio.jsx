'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import {
  Download,
  Printer,
  Smartphone,
  Copy,
  Check,
  Mail,
  Phone,
  MapPin,
  Layout,
  UserCheck,
  QrCode,
  Link2,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { downloadVCard } from '@/utils/vCardGenerator';

const CARD_THEMES = [
  {
    id: 'obsidian',
    name: 'Midnight Obsidian',
    bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #020617 100%)',
    textColor: '#ffffff',
    subTextColor: '#94a3b8',
    accentColor: '#38bdf8',
    qrBg: '#ffffff',
    qrFg: '#0f172a',
    border: 'border-slate-700/60',
  },
  {
    id: 'aurora',
    name: 'Aurora Hologram',
    bg: 'linear-gradient(135deg, #311042 0%, #1e1b4b 50%, #064e3b 100%)',
    textColor: '#ffffff',
    subTextColor: '#cbd5e1',
    accentColor: '#c084fc',
    qrBg: '#ffffff',
    qrFg: '#1e1b4b',
    border: 'border-purple-500/30',
  },
  {
    id: 'pearl',
    name: 'Minimal Pearl',
    bg: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    textColor: '#0f172a',
    subTextColor: '#64748b',
    accentColor: '#2563eb',
    qrBg: '#0f172a',
    qrFg: '#ffffff',
    border: 'border-slate-200 shadow-xl',
  },
  {
    id: 'emerald',
    name: 'Emerald Prestige',
    bg: 'linear-gradient(135deg, #022c22 0%, #064e3b 50%, #042f2e 100%)',
    textColor: '#ffffff',
    subTextColor: '#a7f3d0',
    accentColor: '#34d399',
    qrBg: '#ffffff',
    qrFg: '#064e3b',
    border: 'border-emerald-700/50',
  },
  {
    id: 'sunset',
    name: 'Sunset Velvet',
    bg: 'linear-gradient(135deg, #4a044e 0%, #831843 50%, #701a75 100%)',
    textColor: '#ffffff',
    subTextColor: '#fbcfe8',
    accentColor: '#f472b6',
    qrBg: '#ffffff',
    qrFg: '#831843',
    border: 'border-pink-500/40',
  },
];

export default function BusinessCardStudio({ user, profile, profileUrl }) {
  const [orientation, setOrientation] = useState('horizontal'); // 'horizontal' | 'vertical'
  const [selectedTheme, setSelectedTheme] = useState(CARD_THEMES[0]);

  // Card Content Fields
  const [name, setName] = useState(profile?.display_name || profile?.username || 'Your Name');
  const [title, setTitle] = useState(profile?.bio ? profile.bio.slice(0, 40) : 'Creator & Founder');
  const [company, setCompany] = useState('LinkNest Pro');
  const [email, setEmail] = useState(user?.email || 'alex@example.com');
  const [phone, setPhone] = useState('+1 (555) 019-2834');
  const [location, setLocation] = useState('San Francisco, CA');
  const [tagline, setTagline] = useState('Scan to connect and explore my links');
  const [customQrUrl, setCustomQrUrl] = useState('');
  const [showAvatar, setShowAvatar] = useState(true);
  const [showQR, setShowQR] = useState(true);

  // Custom QR Code Colors inside the card
  const [customQrFg, setCustomQrFg] = useState(CARD_THEMES[0].qrFg);
  const [customQrBg, setCustomQrBg] = useState(CARD_THEMES[0].qrBg);

  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (profile) {
      if (profile.display_name || profile.username) {
        setName(profile.display_name || profile.username);
      }
      if (profile.bio) {
        setTitle(profile.bio.slice(0, 40));
      }
    }
    if (user?.email) {
      setEmail(user.email);
    }
  }, [profile, user]);

  const targetUrl = customQrUrl.trim() || profileUrl || (typeof window !== 'undefined' ? `${window.location.origin}/${profile?.username || ''}` : 'https://linknest.app');

  function handleSelectTheme(theme) {
    setSelectedTheme(theme);
    setCustomQrFg(theme.qrFg);
    setCustomQrBg(theme.qrBg);
  }

  function handleDownloadCardImage() {
    setExporting(true);
    try {
      const isHorizontal = orientation === 'horizontal';
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const scale = 3;
      const width = isHorizontal ? 1050 : 680;
      const height = isHorizontal ? 600 : 1040;

      canvas.width = width * scale;
      canvas.height = height * scale;
      ctx.scale(scale, scale);

      const gradient = ctx.createLinearGradient(0, 0, width, height);
      if (selectedTheme.id === 'obsidian') {
        gradient.addColorStop(0, '#0f172a');
        gradient.addColorStop(0.5, '#1e293b');
        gradient.addColorStop(1, '#020617');
      } else if (selectedTheme.id === 'aurora') {
        gradient.addColorStop(0, '#311042');
        gradient.addColorStop(0.5, '#1e1b4b');
        gradient.addColorStop(1, '#064e3b');
      } else if (selectedTheme.id === 'pearl') {
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(1, '#f8fafc');
      } else if (selectedTheme.id === 'emerald') {
        gradient.addColorStop(0, '#022c22');
        gradient.addColorStop(0.5, '#064e3b');
        gradient.addColorStop(1, '#042f2e');
      } else {
        gradient.addColorStop(0, '#4a044e');
        gradient.addColorStop(0.5, '#831843');
        gradient.addColorStop(1, '#701a75');
      }

      const radius = 32;
      ctx.beginPath();
      ctx.moveTo(radius, 0);
      ctx.lineTo(width - radius, 0);
      ctx.quadraticCurveTo(width, 0, width, radius);
      ctx.lineTo(width, height - radius);
      ctx.quadraticCurveTo(width, height, width - radius, height);
      ctx.lineTo(radius, height);
      ctx.quadraticCurveTo(0, height, 0, height - radius);
      ctx.lineTo(0, radius);
      ctx.quadraticCurveTo(0, 0, radius, 0);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.lineWidth = 3;
      ctx.strokeStyle = selectedTheme.id === 'pearl' ? '#e2e8f0' : 'rgba(255, 255, 255, 0.15)';
      ctx.stroke();

      const textColor = selectedTheme.textColor;
      const subTextColor = selectedTheme.subTextColor;
      const accentColor = selectedTheme.accentColor;

      if (isHorizontal) {
        ctx.fillStyle = textColor;
        ctx.font = 'bold 36px Inter, sans-serif';
        ctx.fillText(name || 'Your Name', 60, 95);

        ctx.fillStyle = accentColor;
        ctx.font = '600 20px Inter, sans-serif';
        ctx.fillText(title || '', 60, 135);

        if (company) {
          ctx.fillStyle = subTextColor;
          ctx.font = '500 16px Inter, sans-serif';
          ctx.fillText(`at ${company}`, 60, 165);
        }

        let contactY = 240;
        ctx.fillStyle = textColor;
        ctx.font = '500 16px Inter, sans-serif';

        if (email) {
          ctx.fillText(`✉  ${email}`, 60, contactY);
          contactY += 36;
        }
        if (phone) {
          ctx.fillText(`☎  ${phone}`, 60, contactY);
          contactY += 36;
        }
        if (location) {
          ctx.fillText(`📍 ${location}`, 60, contactY);
          contactY += 36;
        }

        ctx.fillStyle = subTextColor;
        ctx.font = 'italic 15px Inter, sans-serif';
        ctx.fillText(tagline || '', 60, height - 60);

        const qrCanvas = document.getElementById('card-qr-export-canvas');
        if (qrCanvas && showQR) {
          const qrSize = 220;
          const qrX = width - qrSize - 60;
          const qrY = 70;

          ctx.fillStyle = customQrBg;
          ctx.beginPath();
          ctx.roundRect(qrX - 16, qrY - 16, qrSize + 32, qrSize + 32, 20);
          ctx.fill();

          ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

          ctx.fillStyle = subTextColor;
          ctx.font = 'bold 13px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(`/${profile?.username || ''}`, qrX + qrSize / 2, qrY + qrSize + 40);
          ctx.textAlign = 'left';
        }
      } else {
        ctx.textAlign = 'center';

        ctx.fillStyle = textColor;
        ctx.font = 'bold 36px Inter, sans-serif';
        ctx.fillText(name || 'Your Name', width / 2, 110);

        ctx.fillStyle = accentColor;
        ctx.font = '600 20px Inter, sans-serif';
        ctx.fillText(title || '', width / 2, 150);

        if (company) {
          ctx.fillStyle = subTextColor;
          ctx.font = '500 16px Inter, sans-serif';
          ctx.fillText(company, width / 2, 180);
        }

        const qrCanvas = document.getElementById('card-qr-export-canvas');
        if (qrCanvas && showQR) {
          const qrSize = 240;
          const qrX = (width - qrSize) / 2;
          const qrY = 240;

          ctx.fillStyle = customQrBg;
          ctx.beginPath();
          ctx.roundRect(qrX - 20, qrY - 20, qrSize + 40, qrSize + 40, 24);
          ctx.fill();

          ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

          ctx.fillStyle = subTextColor;
          ctx.font = 'bold 15px monospace';
          ctx.fillText(`/${profile?.username || ''}`, width / 2, qrY + qrSize + 48);
        }

        let vContactY = height - 200;
        ctx.fillStyle = textColor;
        ctx.font = '500 16px Inter, sans-serif';

        if (email) {
          ctx.fillText(`✉  ${email}`, width / 2, vContactY);
          vContactY += 34;
        }
        if (phone) {
          ctx.fillText(`☎  ${phone}`, width / 2, vContactY);
          vContactY += 34;
        }

        ctx.fillStyle = subTextColor;
        ctx.font = 'italic 14px Inter, sans-serif';
        ctx.fillText(tagline || '', width / 2, height - 60);

        ctx.textAlign = 'left';
      }

      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `${(name || 'business-card').toLowerCase().replace(/[^a-z0-9]/g, '_')}-card.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (err) {
      console.error('Card export error:', err);
    } finally {
      setExporting(false);
    }
  }

  function handleDownloadVCard() {
    downloadVCard({
      name,
      title,
      company,
      email,
      phone,
      url: targetUrl,
      note: tagline,
    });
  }

  function handlePrintCard() {
    window.print();
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(targetUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy link error:', err);
    }
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start text-slate-900 dark:text-slate-100">
      {/* Left: Customization Controls */}
      <div className="xl:col-span-6 space-y-6">
        {/* Layout & Theme Presets */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0c0f1d] border border-slate-200/90 dark:border-slate-800 shadow-card space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layout size={18} className="text-slate-700 dark:text-slate-300" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Card Layout & Ratio</h3>
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200/70 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setOrientation('horizontal')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  orientation === 'horizontal'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Horizontal (3.5&quot; × 2&quot;)
              </button>
              <button
                type="button"
                onClick={() => setOrientation('vertical')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  orientation === 'vertical'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Vertical (Badge / NFC)
              </button>
            </div>
          </div>

          {/* Theme Presets */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2.5">
              Card Theme Preset
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {CARD_THEMES.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => handleSelectTheme(theme)}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    selectedTheme.id === theme.id
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs bg-slate-50 dark:bg-slate-800/80'
                      : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div
                    className="w-6 h-6 rounded-lg shadow-inner shrink-0 border border-black/10"
                    style={{ background: theme.bg }}
                  />
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {theme.name}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* QR Code Styling Inside Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0c0f1d] border border-slate-200/90 dark:border-slate-800 shadow-card space-y-4">
          <div className="flex items-center gap-2">
            <QrCode size={18} className="text-slate-700 dark:text-slate-300" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Card QR Code Customization</h3>
          </div>

          {/* Custom QR Link Destination */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              QR Code Destination URL
            </label>
            <div className="relative">
              <input
                type="url"
                value={customQrUrl}
                onChange={(e) => setCustomQrUrl(e.target.value)}
                placeholder={profileUrl || 'https://linknest.app/username'}
                className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d1020] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs font-mono font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
              <Link2 size={14} className="absolute left-3 top-2.5 text-slate-400 dark:text-slate-500" />
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              Leave blank to use your default LinkNest profile URL.
            </p>
          </div>

          {/* QR Code Colors on Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                QR Pattern Color
              </label>
              <div className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0d1020]">
                <input
                  type="color"
                  value={customQrFg}
                  onChange={(e) => setCustomQrFg(e.target.value)}
                  className="w-7 h-7 rounded-lg cursor-pointer border-0 bg-transparent p-0"
                />
                <span className="text-xs font-mono text-slate-700 dark:text-slate-300">{customQrFg}</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                QR Background Color
              </label>
              <div className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0d1020]">
                <input
                  type="color"
                  value={customQrBg}
                  onChange={(e) => setCustomQrBg(e.target.value)}
                  className="w-7 h-7 rounded-lg cursor-pointer border-0 bg-transparent p-0"
                />
                <span className="text-xs font-mono text-slate-700 dark:text-slate-300">{customQrBg}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card Content Information */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0c0f1d] border border-slate-200/90 dark:border-slate-800 shadow-card space-y-4">
          <div className="flex items-center gap-2">
            <UserCheck size={18} className="text-slate-700 dark:text-slate-300" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Cardholder Information</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Rivers"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d1020] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Job Title / Role</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Creative Director"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d1020] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Company / Brand</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Acme Studios"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d1020] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d1020] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d1020] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="San Francisco, CA"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d1020] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Card Footer Tagline</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Tagline or motto..."
              maxLength={80}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d1020] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Feature Toggles */}
          <div className="pt-2 flex items-center gap-6 border-t border-slate-100 dark:border-slate-800 text-xs">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={showAvatar}
                onChange={(e) => setShowAvatar(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-0"
              />
              Include Avatar
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={showQR}
                onChange={(e) => setShowQR(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-0"
              />
              Include QR Code
            </label>
          </div>
        </div>
      </div>

      {/* Right: Live Interactive Business Card Preview & Export Actions */}
      <div className="xl:col-span-6 sticky top-24 space-y-6">
        <div className="p-8 rounded-3xl bg-slate-900 dark:bg-[#0c0f1d] border border-slate-800 text-white shadow-2xl flex flex-col items-center justify-center space-y-6 overflow-hidden">
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-bold tracking-wider uppercase text-slate-400">
              Live Card Preview
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              {orientation === 'horizontal' ? '3.5" × 2" Standard' : 'Vertical Pass'}
            </span>
          </div>

          {/* Interactive Card Render Container */}
          <div
            style={{
              background: selectedTheme.bg,
              color: selectedTheme.textColor,
            }}
            className={`w-full transition-all duration-300 rounded-[28px] p-6 sm:p-8 border ${
              selectedTheme.border
            } shadow-2xl relative flex flex-col justify-between overflow-hidden ${
              orientation === 'horizontal'
                ? 'min-h-[290px] max-w-[500px]'
                : 'min-h-[460px] max-w-[340px]'
            }`}
          >
            {/* Horizontal Layout */}
            {orientation === 'horizontal' ? (
              <div className="flex flex-col justify-between h-full space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 max-w-[260px]">
                    <div className="flex items-center gap-2.5">
                      {showAvatar && profile?.avatar_url && (
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 shrink-0">
                          <Image
                            src={profile.avatar_url}
                            alt={name || 'Avatar'}
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <h4 className="text-xl font-bold tracking-tight truncate">{name || 'Your Name'}</h4>
                    </div>

                    <p
                      className="text-xs font-semibold truncate"
                      style={{ color: selectedTheme.accentColor }}
                    >
                      {title}
                    </p>

                    {company && (
                      <p className="text-[11px]" style={{ color: selectedTheme.subTextColor }}>
                        {company}
                      </p>
                    )}
                  </div>

                  {/* Scannable QR Code */}
                  {showQR && (
                    <div
                      className="p-2 rounded-2xl shrink-0 shadow-md border border-white/10 flex flex-col items-center space-y-1"
                      style={{ backgroundColor: customQrBg }}
                    >
                      <QRCodeSVG
                        value={targetUrl}
                        size={84}
                        bgColor={customQrBg}
                        fgColor={customQrFg}
                        level="M"
                      />
                      <span
                        className="text-[8px] font-bold font-mono tracking-tight"
                        style={{ color: customQrFg }}
                      >
                        /{profile?.username || ''}
                      </span>
                    </div>
                  )}
                </div>

                {/* Contact Badges */}
                <div className="space-y-1.5 text-[11px]" style={{ color: selectedTheme.textColor }}>
                  {email && (
                    <div className="flex items-center gap-2 truncate opacity-90">
                      <Mail size={12} style={{ color: selectedTheme.accentColor }} />
                      <span className="truncate">{email}</span>
                    </div>
                  )}
                  {phone && (
                    <div className="flex items-center gap-2 truncate opacity-90">
                      <Phone size={12} style={{ color: selectedTheme.accentColor }} />
                      <span>{phone}</span>
                    </div>
                  )}
                  {location && (
                    <div className="flex items-center gap-2 truncate opacity-90">
                      <MapPin size={12} style={{ color: selectedTheme.accentColor }} />
                      <span>{location}</span>
                    </div>
                  )}
                </div>

                {/* Tagline */}
                {tagline && (
                  <div
                    className="text-[10px] italic border-t pt-2.5 truncate"
                    style={{
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      color: selectedTheme.subTextColor,
                    }}
                  >
                    {tagline}
                  </div>
                )}
              </div>
            ) : (
              /* Vertical Layout */
              <div className="flex flex-col items-center text-center justify-between h-full space-y-6">
                <div className="flex flex-col items-center space-y-2">
                  {showAvatar && profile?.avatar_url && (
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/20 shadow-lg">
                      <Image
                        src={profile.avatar_url}
                        alt={name || 'Avatar'}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <h4 className="text-xl font-bold tracking-tight">{name || 'Your Name'}</h4>
                    <p
                      className="text-xs font-semibold"
                      style={{ color: selectedTheme.accentColor }}
                    >
                      {title}
                    </p>
                    {company && (
                      <p className="text-[11px]" style={{ color: selectedTheme.subTextColor }}>
                        {company}
                      </p>
                    )}
                  </div>
                </div>

                {/* QR in center */}
                {showQR && (
                  <div
                    className="p-3 rounded-2xl shadow-xl border border-white/10 flex flex-col items-center space-y-1.5"
                    style={{ backgroundColor: customQrBg }}
                  >
                    <QRCodeSVG
                      value={targetUrl}
                      size={110}
                      bgColor={customQrBg}
                      fgColor={customQrFg}
                      level="M"
                    />
                    <span
                      className="text-[9px] font-bold font-mono tracking-tight"
                      style={{ color: customQrFg }}
                    >
                      linknest.app/{profile?.username || ''}
                    </span>
                  </div>
                )}

                {/* Contact list at bottom */}
                <div className="space-y-1 text-[11px] w-full" style={{ color: selectedTheme.textColor }}>
                  {email && (
                    <div className="flex items-center justify-center gap-1.5 truncate opacity-90">
                      <Mail size={12} style={{ color: selectedTheme.accentColor }} />
                      <span className="truncate">{email}</span>
                    </div>
                  )}
                  {phone && (
                    <div className="flex items-center justify-center gap-1.5 truncate opacity-90">
                      <Phone size={12} style={{ color: selectedTheme.accentColor }} />
                      <span>{phone}</span>
                    </div>
                  )}
                </div>

                {tagline && (
                  <p
                    className="text-[10px] italic pt-1 border-t w-full"
                    style={{
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      color: selectedTheme.subTextColor,
                    }}
                  >
                    {tagline}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Action Tools Hub */}
          <div className="w-full space-y-3 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={handleDownloadCardImage}
                loading={exporting}
                className="w-full bg-white dark:bg-emerald-500 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-emerald-600 shadow-md font-semibold"
              >
                <Download size={15} /> Download Card (PNG)
              </Button>

              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={handleDownloadVCard}
                className="w-full bg-slate-800 text-white hover:bg-slate-700 border-slate-700 shadow-md"
              >
                <Smartphone size={15} /> Save vCard (.vcf)
              </Button>
            </div>

            <div className="flex items-center justify-between gap-3 pt-1">
              <button
                type="button"
                onClick={handlePrintCard}
                className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer py-1.5 px-3 rounded-xl hover:bg-slate-800"
              >
                <Printer size={14} /> Print Business Card
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 text-xs font-mono text-slate-300 hover:text-white transition-colors cursor-pointer py-1.5 px-3 rounded-xl hover:bg-slate-800"
              >
                {copied ? (
                  <>
                    <Check size={14} className="text-emerald-400" /> Copied Link
                  </>
                ) : (
                  <>
                    <Copy size={14} /> /{profile?.username || ''}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Hidden Canvas used for high-res QR export in card rendering */}
        <div className="hidden">
          <QRCodeCanvas
            id="card-qr-export-canvas"
            value={targetUrl}
            size={512}
            bgColor={customQrBg}
            fgColor={customQrFg}
            level="M"
            includeMargin={false}
          />
        </div>
      </div>
    </div>
  );
}
