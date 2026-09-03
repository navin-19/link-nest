'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useUser } from '@/hooks/useUser';
import { useSubscribers } from '@/hooks/useSubscribers';
import Button from '@/components/ui/Button';
import Heading from '@/components/ui/Heading';
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
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export default function LeadsPage() {
  const { user, profile } = useUser();
  const { subscribers, loading, error, deleteSubscriber } = useSubscribers(user?.id);

  // Search & Pagination State
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [copiedId, setCopiedId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // View Subscriber Details Modal State
  const [viewingSubscriber, setViewingSubscriber] = useState(null);

  // Filtered Subscribers
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

  // Reset pagination on search change
  const totalPages = Math.ceil(filteredSubscribers.length / pageSize) || 1;
  const paginatedSubscribers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSubscribers.slice(start, start + pageSize);
  }, [filteredSubscribers, currentPage, pageSize]);

  // Stats
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

  // Copy Email Handler
  function handleCopyEmail(id, email) {
    navigator.clipboard.writeText(email);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  // Export CSV Handler
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
      const customStr =
        s.custom_data && Object.keys(s.custom_data).length > 0
          ? Object.entries(s.custom_data)
              .map(([k, v]) => `${k}: ${v}`)
              .join('; ')
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

  // Delete Subscriber Handler
  async function handleDelete(id) {
    if (!confirm('Are you sure you want to remove this lead?')) return;
    setDeletingId(id);
    try {
      await deleteSubscriber(id);
      if (viewingSubscriber?.id === id) {
        setViewingSubscriber(null);
      }
    } catch (err) {
      console.error('Delete lead failed:', err);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 text-slate-900 dark:text-slate-100 pb-16 animate-in fade-in duration-150">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. Page Header & Action Bar */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Heading
            as="h1"
            className="text-2xl sm:text-3xl lg:text-[32px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight flex items-center gap-2.5"
          >
            <Users size={28} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Subscriber Leads</span>
          </Heading>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Collect, view, and export visitor contact details captured from your public profile subscribe form.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {profile?.username && (
            <Link
              href={`/${profile.username}`}
              target="_blank"
              className="px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f1d] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 shadow-2xs transition-all"
            >
              <span>Public Profile</span>
              <ExternalLink size={12} />
            </Link>
          )}

          <Button
            variant="primary"
            size="sm"
            onClick={handleExportCSV}
            disabled={subscribers.length === 0}
            className="shadow-btn hover:shadow-btn-hover text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. KPI Summary Cards */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Leads */}
        <div className="p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0c0f1d] shadow-card space-y-1">
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

        {/* With Mobile */}
        <div className="p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0c0f1d] shadow-card space-y-1">
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

        {/* Cities / Places */}
        <div className="p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0c0f1d] shadow-card space-y-1">
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

        {/* Latest Contact */}
        <div className="p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0c0f1d] shadow-card space-y-1">
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

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. Subscribers Data Table Section */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0c0f1d] shadow-card overflow-hidden space-y-0">
        {/* Table Header & Search Controls */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/40 dark:bg-slate-900/40">
          <div className="flex items-center gap-2">
            <Heading as="h2" className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Subscribers
            </Heading>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {filteredSubscribers.length}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1 max-w-md">
            <div className="relative w-full">
              <Search
                size={14}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
              />
              <input
                type="text"
                placeholder="Search by name, email, phone, city, address..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d1020] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    setCurrentPage(1);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>
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
          <div className="p-14 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-xs">
              <Users size={24} />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <p className="text-base font-bold text-slate-900 dark:text-white">No subscribers yet</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Your subscriber leads will appear here when visitors submit the subscribe form on your public profile.
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
          /* Responsive Subscribers Table */
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-3 sm:px-4 w-12 text-center">#</th>
                    <th className="py-3 px-3 sm:px-5">Name</th>
                    <th className="py-3 px-3 sm:px-5">Email</th>
                    <th className="py-3 px-3 sm:px-5">Mobile Number</th>
                    <th className="py-3 px-3 sm:px-5">Place / City</th>
                    <th className="py-3 px-3 sm:px-5">Address</th>
                    <th className="py-3 px-3 sm:px-5">Date Subscribed</th>
                    <th className="py-3 px-3 sm:px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs text-slate-800 dark:text-slate-200">
                  {paginatedSubscribers.map((sub, idx) => {
                    const rowNumber = (currentPage - 1) * pageSize + idx + 1;
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
                        {/* 1. Row Index */}
                        <td className="py-3.5 px-3 sm:px-4 text-center font-mono text-[11px] text-slate-400">
                          {rowNumber}
                        </td>

                        {/* 2. Name */}
                        <td className="py-3.5 px-3 sm:px-5">
                          {sub.name ? (
                            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              <User size={13} className="text-slate-400 shrink-0" />
                              <span className="truncate max-w-[140px]">{sub.name}</span>
                            </div>
                          ) : (
                            <span className="text-slate-400 font-mono text-[11px]">—</span>
                          )}
                        </td>

                        {/* 3. Email */}
                        <td className="py-3.5 px-3 sm:px-5">
                          <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                            <Mail size={12} className="text-slate-400 shrink-0" />
                            <span className="truncate max-w-[170px]">{sub.email}</span>
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
                        </td>

                        {/* 4. Mobile Number */}
                        <td className="py-3.5 px-3 sm:px-5">
                          {hasMobile ? (
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-900 dark:text-white font-mono text-xs whitespace-nowrap">
                                {fullPhone}
                              </span>
                              <div className="flex items-center gap-1 shrink-0">
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
                            <span className="text-slate-400 font-mono">—</span>
                          )}
                        </td>

                        {/* 5. Place / City */}
                        <td className="py-3.5 px-3 sm:px-5">
                          {sub.place ? (
                            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium max-w-[130px] truncate">
                              <MapPin size={12} className="text-slate-400 shrink-0" />
                              <span className="truncate">{sub.place}</span>
                            </div>
                          ) : (
                            <span className="text-slate-400 font-mono">—</span>
                          )}
                        </td>

                        {/* 6. Address */}
                        <td className="py-3.5 px-3 sm:px-5 max-w-[150px]">
                          {sub.address ? (
                            <span
                              className="text-slate-600 dark:text-slate-400 truncate block text-[11px]"
                              title={sub.address}
                            >
                              {sub.address}
                            </span>
                          ) : (
                            <span className="text-slate-400 font-mono">—</span>
                          )}
                        </td>

                        {/* 7. Date Subscribed */}
                        <td className="py-3.5 px-3 sm:px-5 text-slate-500 dark:text-slate-400 font-mono text-[11px] whitespace-nowrap">
                          {new Date(sub.created_at).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>

                        {/* 8. Actions (View / Delete) */}
                        <td className="py-3.5 px-3 sm:px-5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            {/* View Subscriber Detail Modal */}
                            <button
                              type="button"
                              onClick={() => setViewingSubscriber(sub)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
                              title="View subscriber details"
                              aria-label="View subscriber details"
                            >
                              <Eye size={14} />
                            </button>

                            {/* Delete Subscriber */}
                            <button
                              type="button"
                              onClick={() => handleDelete(sub.id)}
                              disabled={deletingId === sub.id}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer disabled:opacity-40"
                              title="Delete contact"
                              aria-label="Delete contact"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 bg-slate-50/20 dark:bg-slate-900/20">
                <span>
                  Showing {(currentPage - 1) * pageSize + 1} to{' '}
                  {Math.min(currentPage * pageSize, filteredSubscribers.length)} of{' '}
                  {filteredSubscribers.length} subscribers
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f1d] text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1 transition-colors font-medium cursor-pointer"
                  >
                    <ChevronLeft size={13} />
                    <span>Previous</span>
                  </button>

                  <span className="px-2 font-semibold text-slate-700 dark:text-slate-200">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0f1d] text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1 transition-colors font-medium cursor-pointer"
                  >
                    <span>Next</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 4. View Subscriber Details Modal */}
      {/* ───────────────────────────────────────────────────────────── */}
      {viewingSubscriber && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0c0f1d] shadow-2xl p-6 text-slate-900 dark:text-white space-y-5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold text-sm flex items-center justify-center border border-emerald-200/60 dark:border-emerald-800/60">
                  {viewingSubscriber.name
                    ? viewingSubscriber.name.slice(0, 2).toUpperCase()
                    : 'LE'}
                </div>
                <div>
                  <Heading as="h3" className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                    {viewingSubscriber.name || 'Subscriber Lead'}
                  </Heading>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    Subscribed on{' '}
                    {new Date(viewingSubscriber.created_at).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingSubscriber(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Subscriber Details Dynamic Grid */}
            <div className="space-y-4 text-xs">
              {/* Contact Group */}
              <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Full Name */}
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Full Name
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white text-xs block mt-0.5">
                      {viewingSubscriber.name || '—'}
                    </span>
                  </div>

                  {/* Email */}
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Email Address
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5 font-mono text-xs font-semibold text-slate-900 dark:text-white">
                      <span>{viewingSubscriber.email}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyEmail(viewingSubscriber.id, viewingSubscriber.email)}
                        className="text-slate-400 hover:text-slate-600 p-0.5"
                        title="Copy email"
                      >
                        {copiedId === viewingSubscriber.id ? (
                          <Check size={12} className="text-emerald-500" />
                        ) : (
                          <Copy size={12} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Mobile / WhatsApp Number
                    </span>
                    {viewingSubscriber.mobile_number ? (
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-bold font-mono text-slate-900 dark:text-white">
                          {[viewingSubscriber.country_code, viewingSubscriber.mobile_number]
                            .filter(Boolean)
                            .join(' ')}
                        </span>
                        <a
                          href={`https://wa.me/${(
                            (viewingSubscriber.country_code || '') +
                            (viewingSubscriber.mobile_number || '')
                          ).replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-emerald-600 hover:text-emerald-700"
                          title="WhatsApp"
                        >
                          <MessageSquare size={12} />
                        </a>
                      </div>
                    ) : (
                      <span className="text-slate-400 font-mono mt-0.5 block">—</span>
                    )}
                  </div>

                  {/* Place / City */}
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Place / City
                    </span>
                    <span className="font-medium text-slate-900 dark:text-white block mt-0.5">
                      {viewingSubscriber.place || '—'}
                    </span>
                  </div>
                </div>

                {/* Street Address */}
                {viewingSubscriber.address && (
                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Address
                    </span>
                    <p className="text-xs text-slate-800 dark:text-slate-200 mt-0.5 leading-relaxed">
                      {viewingSubscriber.address}
                    </p>
                  </div>
                )}
              </div>

              {/* Custom Fields (if captured) */}
              {viewingSubscriber.custom_data &&
                Object.keys(viewingSubscriber.custom_data).length > 0 && (
                  <div className="p-4 rounded-2xl border border-purple-200/60 dark:border-purple-900/40 bg-purple-50/30 dark:bg-purple-950/20 space-y-2.5">
                    <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles size={12} />
                      <span>Custom Form Field Responses</span>
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {Object.entries(viewingSubscriber.custom_data).map(([key, val]) => (
                        <div key={key} className="space-y-0.5">
                          <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 capitalize block">
                            {key.replace(/^custom_|_/g, ' ')}
                          </span>
                          <span className="font-semibold text-slate-900 dark:text-white block break-words">
                            {String(val)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Internal Metadata */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-[11px] text-slate-400 space-y-1 font-mono">
                <div className="flex items-center justify-between">
                  <span>Lead ID:</span>
                  <span className="text-slate-600 dark:text-slate-300">{viewingSubscriber.id}</span>
                </div>
                {viewingSubscriber.source && (
                  <div className="flex items-center justify-between">
                    <span>Source:</span>
                    <span className="px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 capitalize">
                      {viewingSubscriber.source}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => handleDelete(viewingSubscriber.id)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 size={13} />
                <span>Delete Lead</span>
              </button>

              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setViewingSubscriber(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
