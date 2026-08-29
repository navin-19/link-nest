'use client';

import { useState, useMemo } from 'react';
import { useUser } from '@/hooks/useUser';
import { useSubscribers } from '@/hooks/useSubscribers';
import Button from '@/components/ui/Button';
import {
  Users,
  Phone,
  Mail,
  Download,
  Search,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  Calendar,
  Sparkles,
  MessageSquare,
  MapPin,
  User,
} from 'lucide-react';
import Link from 'next/link';

export default function LeadsPage() {
  const { user, profile } = useUser();
  const { subscribers, loading, error, deleteSubscriber } = useSubscribers(user?.id);

  const [search, setSearch]       = useState('');
  const [copiedId, setCopiedId]   = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const filteredSubscribers = useMemo(() => {
    if (!search.trim()) return subscribers;
    const q = search.toLowerCase().trim();
    return subscribers.filter(
      (s) =>
        s.name?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q) ||
        s.mobile_number?.toLowerCase().includes(q) ||
        s.country_code?.toLowerCase().includes(q) ||
        s.place?.toLowerCase().includes(q) ||
        s.address?.toLowerCase().includes(q) ||
        (s.custom_data && JSON.stringify(s.custom_data).toLowerCase().includes(q))
    );
  }, [subscribers, search]);

  const phoneCount = useMemo(() => {
    return subscribers.filter((s) => s.mobile_number && s.mobile_number.trim().length > 0).length;
  }, [subscribers]);

  const placeCount = useMemo(() => {
    const places = new Set(
      subscribers
        .filter((s) => s.place && s.place.trim().length > 0)
        .map((s) => s.place.trim().toLowerCase())
    );
    return places.size;
  }, [subscribers]);

  function handleCopyEmail(id, email) {
    navigator.clipboard.writeText(email);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function handleExportCSV() {
    if (subscribers.length === 0) return;

    const headers = [
      'Name',
      'Email',
      'Country Code',
      'Mobile Number',
      'Full Phone',
      'Place / City',
      'Address',
      'Custom Details',
      'Subscribed Date',
    ];

    const rows = subscribers.map((s) => {
      const fullPhone = [s.country_code, s.mobile_number].filter(Boolean).join(' ');
      const customStr = s.custom_data && Object.keys(s.custom_data).length > 0
        ? Object.entries(s.custom_data).map(([k, v]) => `${k}: ${v}`).join('; ')
        : '';

      return [
        `"${(s.name || '').replace(/"/g, '""')}"`,
        `"${s.email.replace(/"/g, '""')}"`,
        `"${(s.country_code || '').replace(/"/g, '""')}"`,
        `"${(s.mobile_number || '').replace(/"/g, '""')}"`,
        `"${fullPhone.replace(/"/g, '""')}"`,
        `"${(s.place || '').replace(/"/g, '""')}"`,
        `"${(s.address || '').replace(/"/g, '""')}"`,
        `"${customStr.replace(/"/g, '""')}"`,
        `"${new Date(s.created_at).toISOString()}"`,
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `linknest-leads-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to remove this lead?')) return;
    setDeletingId(id);
    try {
      await deleteSubscriber(id);
    } catch (err) {
      console.error('Delete lead failed:', err);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 text-slate-900 dark:text-slate-100 pb-12 animate-in fade-in duration-150">
      {/* Header & Export Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight flex items-center gap-2.5">
            <Users size={28} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Leads & Subscribers</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
            Collect, view, and export visitor contact details captured from your public profile subscribe page.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleExportCSV}
          disabled={subscribers.length === 0}
          className="shadow-btn hover:shadow-btn-hover text-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Download size={14} />
          <span>Export CSV</span>
        </Button>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0c0f1d] shadow-soft space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Leads
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Users size={16} />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {loading ? '...' : subscribers.length}
          </p>
        </div>

        <div className="p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0c0f1d] shadow-soft space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              With Mobile
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Phone size={16} />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {loading ? '...' : phoneCount}
          </p>
        </div>

        <div className="p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0c0f1d] shadow-soft space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Cities / Places
            </span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <MapPin size={16} />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {loading ? '...' : placeCount}
          </p>
        </div>

        <div className="p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0c0f1d] shadow-soft space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Latest Contact
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Calendar size={16} />
            </div>
          </div>
          <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
            {loading
              ? '...'
              : subscribers.length > 0
              ? new Date(subscribers[0].created_at).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'None yet'}
          </p>
        </div>
      </div>

      {/* Main Leads Table & Search Container */}
      <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0c0f1d] shadow-card overflow-hidden">
        {/* Table Top Controls */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/40 dark:bg-slate-900/40">
          <div className="relative flex-1 max-w-md">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            />
            <input
              type="text"
              placeholder="Search by name, email, phone, city, address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d1020] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
            />
          </div>

          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Showing {filteredSubscribers.length} of {subscribers.length} leads
          </span>
        </div>

        {/* Loading / Error States */}
        {loading ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-7 h-7 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mx-auto" />
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Loading your leads...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-xs text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-950/20">
            {error}
          </div>
        ) : subscribers.length === 0 ? (
          /* Empty State */
          <div className="p-12 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-xs">
              <Users size={24} />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <p className="text-base font-bold text-slate-900 dark:text-white">No subscribers yet</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Your subscribers will appear here when visitors sign up on your public profile.
              </p>
            </div>
            {profile?.username && (
              <Link
                href={`/${profile.username}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-900 dark:bg-emerald-500 hover:bg-slate-800 dark:hover:bg-emerald-600 text-white text-xs font-semibold shadow-btn hover:shadow-btn-hover transition-all"
              >
                <span>View your public profile</span>
                <ExternalLink size={12} />
              </Link>
            )}
          </div>
        ) : filteredSubscribers.length === 0 ? (
          /* Search Empty State */
          <div className="p-12 text-center text-xs text-slate-500 dark:text-slate-400">
            No leads match your search &ldquo;{search}&rdquo;.
          </div>
        ) : (
          /* Responsive Leads Table */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4 sm:px-6">Contact / Name</th>
                  <th className="py-3 px-4 sm:px-6">Mobile Number</th>
                  <th className="py-3 px-4 sm:px-6">Place / City</th>
                  <th className="py-3 px-4 sm:px-6">Address</th>
                  <th className="py-3 px-4 sm:px-6">Date Subscribed</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-800 dark:text-slate-200">
                {filteredSubscribers.map((sub) => {
                  const hasMobile = Boolean(sub.mobile_number && sub.mobile_number.trim().length > 0);
                  const fullPhone = [sub.country_code, sub.mobile_number].filter(Boolean).join(' ');
                  const dialNumber = (sub.country_code || '') + (sub.mobile_number || '');
                  const cleanDial = dialNumber.replace(/[^\d+]/g, '');
                  const cleanWa = dialNumber.replace(/\D/g, '');

                  return (
                    <tr
                      key={sub.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* Name & Email */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="space-y-1">
                          {sub.name ? (
                            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              <User size={13} className="text-slate-400 dark:text-slate-500 shrink-0" />
                              <span>{sub.name}</span>
                            </div>
                          ) : null}
                          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                            <Mail size={12} className="text-slate-400 dark:text-slate-500 shrink-0" />
                            <span>{sub.email}</span>
                            <button
                              type="button"
                              onClick={() => handleCopyEmail(sub.id, sub.email)}
                              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-0.5 transition-colors cursor-pointer"
                              title="Copy email"
                            >
                              {copiedId === sub.id ? (
                                <Check size={12} className="text-emerald-600 dark:text-emerald-400" />
                              ) : (
                                <Copy size={12} />
                              )}
                            </button>
                          </div>

                          {sub.custom_data && Object.keys(sub.custom_data).length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-1">
                              {Object.entries(sub.custom_data).map(([k, v]) => (
                                <span
                                  key={k}
                                  className="inline-flex items-center text-[9px] font-medium px-1.5 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/40"
                                >
                                  <span className="font-semibold capitalize">{k.replace(/^custom_|_/g, ' ')}:</span>&nbsp;{String(v)}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Mobile Number */}
                      <td className="py-3.5 px-4 sm:px-6">
                        {hasMobile ? (
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                              <Phone size={13} />
                            </div>
                            <span className="font-semibold text-slate-900 dark:text-white font-mono text-xs">
                              {fullPhone}
                            </span>
                            <div className="flex items-center gap-1">
                              <a
                                href={`tel:${cleanDial}`}
                                className="p-1 text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                                title="Call number"
                              >
                                <Phone size={12} />
                              </a>
                              <a
                                href={`https://wa.me/${cleanWa}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
                                title="Chat on WhatsApp"
                              >
                                <MessageSquare size={12} />
                              </a>
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500 font-mono">—</span>
                        )}
                      </td>

                      {/* Place / City */}
                      <td className="py-3.5 px-4 sm:px-6">
                        {sub.place ? (
                          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium max-w-[140px] truncate">
                            <MapPin size={12} className="text-slate-400 dark:text-slate-500 shrink-0" />
                            <span className="truncate">{sub.place}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500 font-mono">—</span>
                        )}
                      </td>

                      {/* Address */}
                      <td className="py-3.5 px-4 sm:px-6 max-w-[160px]">
                        {sub.address ? (
                          <span className="text-slate-600 dark:text-slate-400 truncate block text-[11px]" title={sub.address}>
                            {sub.address}
                          </span>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500 font-mono">—</span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 sm:px-6 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                        {new Date(sub.created_at).toLocaleString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(sub.id)}
                          loading={deletingId === sub.id}
                          className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                          title="Delete contact"
                          aria-label="Delete contact"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
