'use client';

import { useState, useRef } from 'react';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import {
  Download,
  Copy,
  Check,
  Sparkles,
  QrCode,
  Layers,
  Palette,
  Sliders,
  Link2,
} from 'lucide-react';
import Button from '@/components/ui/Button';

const COLOR_PRESETS = [
  { name: 'Obsidian', fg: '#0f172a', bg: '#ffffff' },
  { name: 'Electric Violet', fg: '#7c3aed', bg: '#ffffff' },
  { name: 'Indigo Night', fg: '#ffffff', bg: '#1e1b4b' },
  { name: 'Emerald Luxe', fg: '#065f46', bg: '#ecfdf5' },
  { name: 'Rose Gold', fg: '#9f1239', bg: '#fff1f2' },
  { name: 'Cyber Neon', fg: '#06b6d4', bg: '#090d16' },
];

const FRAME_STYLES = [
  { id: 'none', label: 'Clean (No Frame)', desc: 'Pure minimalist QR code' },
  { id: 'scan_me', label: 'Scan Me Badge', desc: 'Modern pill header badge' },
  { id: 'card_frame', label: 'Elevated Frame', desc: 'Card with footer label' },
];

export default function QRCodeCustomizer({ profile, profileUrl }) {
  const [customUrl, setCustomUrl] = useState('');
  const [fgColor, setFgColor] = useState('#0f172a');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [includeAvatar, setIncludeAvatar] = useState(false);
  const [size] = useState(240);
  const [level, setLevel] = useState('M');
  const [frameStyle, setFrameStyle] = useState('scan_me');
  const [customLabel, setCustomLabel] = useState('SCAN TO CONNECT');

  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const svgRef = useRef(null);

  const targetUrl = customUrl.trim() || profileUrl || (typeof window !== 'undefined' ? `${window.location.origin}/${profile?.username || ''}` : 'https://linknest.app');

  const avatarImageSettings = includeAvatar && profile?.avatar_url
    ? {
        src: profile.avatar_url,
        height: Math.round(size * 0.22),
        width: Math.round(size * 0.22),
        excavate: true,
      }
    : undefined;

  function handleDownloadPNG() {
    setDownloading(true);
    try {
      const canvas = document.getElementById('qr-high-res-canvas');
      if (!canvas) return;

      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `${profile?.username || 'linknest'}-qr-code.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (err) {
      console.error('PNG download error:', err);
    } finally {
      setDownloading(false);
    }
  }

  function handleDownloadSVG() {
    try {
      const svgElement = svgRef.current?.querySelector('svg');
      if (!svgElement) return;

      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);

      const downloadLink = document.createElement('a');
      downloadLink.href = svgUrl;
      downloadLink.download = `${profile?.username || 'linknest'}-qr-code.svg`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(svgUrl);
    } catch (err) {
      console.error('SVG download error:', err);
    }
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-slate-900 dark:text-slate-100">
      {/* Left: Customization Controls */}
      <div className="lg:col-span-7 space-y-6">
        {/* Custom URL Input */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0c0f1d] border border-slate-200/90 dark:border-slate-800 shadow-card space-y-3">
          <div className="flex items-center gap-2">
            <Link2 size={18} className="text-slate-700 dark:text-slate-300" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">QR Code Link Destination</h3>
          </div>

          <div>
            <input
              type="url"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder={profileUrl || 'https://linknest.app/yourname'}
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d1020] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs font-mono font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5">
              Customize where the QR code leads (default: your LinkNest profile).
            </p>
          </div>
        </div>

        {/* Preset Color Themes */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0c0f1d] border border-slate-200/90 dark:border-slate-800 shadow-card space-y-4">
          <div className="flex items-center gap-2">
            <Palette size={18} className="text-slate-700 dark:text-slate-300" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Color Palette Presets</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {COLOR_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => {
                  setFgColor(preset.fg);
                  setBgColor(preset.bg);
                }}
                className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  fgColor === preset.fg && bgColor === preset.bg
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div
                  className="w-7 h-7 rounded-xl border border-slate-200/80 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-xs"
                  style={{ backgroundColor: preset.bg }}
                >
                  <div
                    className="w-3.5 h-3.5 rounded-md"
                    style={{ backgroundColor: preset.fg }}
                  />
                </div>
                <div className="truncate">
                  <div className="text-xs font-semibold text-slate-900 dark:text-white">{preset.name}</div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono truncate">{preset.fg}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Custom Color Pickers */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Foreground (Pattern) Color
              </label>
              <div className="flex items-center gap-2.5 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0d1020]">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-8 h-8 rounded-xl cursor-pointer border-0 bg-transparent p-0"
                />
                <input
                  type="text"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-full bg-transparent text-xs font-mono font-semibold text-slate-800 dark:text-slate-200 uppercase focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Background Color
              </label>
              <div className="flex items-center gap-2.5 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0d1020]">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-8 h-8 rounded-xl cursor-pointer border-0 bg-transparent p-0"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-full bg-transparent text-xs font-mono font-semibold text-slate-800 dark:text-slate-200 uppercase focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Frame & Badge Style */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0c0f1d] border border-slate-200/90 dark:border-slate-800 shadow-card space-y-4">
          <div className="flex items-center gap-2">
            <Layers size={18} className="text-slate-700 dark:text-slate-300" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Frame & Banner Style</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {FRAME_STYLES.map((frame) => (
              <button
                key={frame.id}
                type="button"
                onClick={() => setFrameStyle(frame.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  frameStyle === frame.id
                    ? 'border-emerald-500 bg-slate-900 dark:bg-emerald-500 text-white shadow-btn'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 text-slate-800 dark:text-slate-200'
                }`}
              >
                <div className="text-xs font-bold">{frame.label}</div>
                <div
                  className={`text-[11px] mt-0.5 ${
                    frameStyle === frame.id ? 'text-slate-300 dark:text-emerald-100' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {frame.desc}
                </div>
              </button>
            ))}
          </div>

          {frameStyle !== 'none' && (
            <div className="pt-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Badge Header Text
              </label>
              <input
                type="text"
                value={customLabel}
                onChange={(e) => setCustomLabel(e.target.value)}
                maxLength={30}
                placeholder="e.g. SCAN TO CONNECT"
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d1020] text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          )}
        </div>

        {/* QR Customization Options */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0c0f1d] border border-slate-200/90 dark:border-slate-800 shadow-card space-y-5">
          <div className="flex items-center gap-2">
            <Sliders size={18} className="text-slate-700 dark:text-slate-300" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Advanced Adjustments</h3>
          </div>

          <div className="space-y-4">
            {/* Center Avatar Toggle */}
            {profile?.avatar_url && (
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0d1020] border border-slate-200/70 dark:border-slate-800">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Embed Profile Avatar in Center</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Places your profile photo inside the center of the QR code
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeAvatar}
                    onChange={(e) => setIncludeAvatar(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
            )}

            {/* Error Correction Level */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Error Correction Density
                </label>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">Level {level}</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'L', name: 'Low (7%)' },
                  { id: 'M', name: 'Medium (15%)' },
                  { id: 'Q', name: 'High (25%)' },
                  { id: 'H', name: 'Max (30%)' },
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setLevel(lvl.id)}
                    className={`py-2 px-1 text-center rounded-xl border text-[11px] font-medium transition-all cursor-pointer ${
                      level === lvl.id
                        ? 'border-emerald-500 bg-slate-900 dark:bg-emerald-500 text-white font-bold'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {lvl.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Live Preview & Action Hub */}
      <div className="lg:col-span-5 sticky top-24 space-y-6">
        <div className="p-8 rounded-3xl bg-white dark:bg-[#0c0f1d] border border-slate-200/90 dark:border-slate-800 shadow-card flex flex-col items-center justify-center text-center space-y-6">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Live QR Preview
          </div>

          {/* Styled QR Frame Wrapper */}
          <div
            ref={svgRef}
            className={`transition-all duration-300 ${
              frameStyle === 'scan_me'
                ? 'p-6 rounded-3xl bg-slate-900 text-white shadow-xl flex flex-col items-center space-y-4 border border-slate-800'
                : frameStyle === 'card_frame'
                ? 'p-6 rounded-3xl bg-white dark:bg-[#0d1020] border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col items-center space-y-3'
                : 'p-4 rounded-3xl bg-white dark:bg-[#0d1020] shadow-card border border-slate-100 dark:border-slate-800 inline-block'
            }`}
          >
            {frameStyle === 'scan_me' && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-[11px] font-bold tracking-wider uppercase border border-white/15">
                <Sparkles size={12} className="text-yellow-400" />
                {customLabel}
              </div>
            )}

            <div
              className="p-4 rounded-2xl shadow-inner inline-flex items-center justify-center"
              style={{ backgroundColor: bgColor }}
            >
              <QRCodeSVG
                value={targetUrl}
                size={size}
                bgColor={bgColor}
                fgColor={fgColor}
                level={level}
                includeMargin={false}
                imageSettings={avatarImageSettings}
              />
            </div>

            {frameStyle === 'card_frame' && (
              <div className="text-center pt-1">
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {profile?.display_name || profile?.username || 'LinkNest Profile'}
                </div>
                <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                  {targetUrl}
                </div>
              </div>
            )}
          </div>

          {/* Profile URL pill */}
          <div className="w-full p-2.5 rounded-2xl bg-slate-50 dark:bg-[#0d1020] border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
            <span className="text-xs font-mono text-slate-700 dark:text-slate-300 truncate pl-2">
              {targetUrl}
            </span>
            <button
              type="button"
              onClick={handleCopyLink}
              className="p-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 shadow-xs transition-colors shrink-0 cursor-pointer"
              title="Copy Profile URL"
            >
              {copied ? <Check size={14} className="text-emerald-600 dark:text-emerald-400" /> : <Copy size={14} />}
            </button>
          </div>

          {/* Export Action Buttons */}
          <div className="w-full grid grid-cols-2 gap-3 pt-2">
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleDownloadPNG}
              loading={downloading}
              className="w-full shadow-btn hover:shadow-btn-hover"
            >
              <Download size={15} /> Download PNG
            </Button>

            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={handleDownloadSVG}
              className="w-full shadow-soft"
            >
              <QrCode size={15} /> Download SVG
            </Button>
          </div>
        </div>

        {/* Hidden high-res canvas used for crisp PNG download */}
        <div className="hidden">
          <QRCodeCanvas
            id="qr-high-res-canvas"
            value={targetUrl}
            size={1024}
            bgColor={bgColor}
            fgColor={fgColor}
            level={level}
            includeMargin={true}
            imageSettings={
              includeAvatar && profile?.avatar_url
                ? {
                    src: profile.avatar_url,
                    height: 220,
                    width: 220,
                    excavate: true,
                  }
                : undefined
            }
          />
        </div>
      </div>
    </div>
  );
}
