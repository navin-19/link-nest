'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Inbox,
  Search,
  Download,
  Phone,
  Mail,
  MapPin,
  Calendar,
  MessageSquare,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  User,
  Sparkles,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Avatar from '@/components/profile/Avatar';

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [creatorFilter, setCreatorFilter] = useState('all');
  const [copiedId, setCopiedId] = useState(null);

  async function fetchLeads() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/leads');
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to fetch global leads');
      }
      const data = await res.json();
      setLeads(data.leads || []);
    } catch (err) {
      console.error('[AdminLeads] Error:', err);
      setError(err.message || 'Error loading platform leads');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLeads();
  }, []);

  // Unique creators list for dropdown filter
  const creators = useMemo(() => {
    const map = new Map();
    for (const l of leads) {
      if (l.profiles?.id && l.profiles?.username) {
        map.set(l.profiles.id, l.profiles.username);
      }
    }
    return Array.from(map.entries()).map(([id, username]) => ({ id, username }));
  }, [leads]);

  // Filtered leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const creatorUsername = lead.profiles?.username || '';
      const creatorName = lead.profiles?.display_name || '';

      const matchesSearch =
        !search.trim() ||
        lead.name?.toLowerCase().includes(search.toLowerCase().trim()) ||
        lead.email?.toLowerCase().includes(search.toLowerCase().trim()) ||
        lead.mobile_number?.toLowerCase().includes(search.toLowerCase().trim()) ||
        lead.place?.toLowerCase().includes(search.toLowerCase().trim()) ||
        lead.address?.toLowerCase().includes(search.toLowerCase().trim()) ||
        creatorUsername.toLowerCase().includes(search.toLowerCase().trim()) ||
        creatorName.toLowerCase().includes(search.toLowerCase().trim());

      const matchesCreator =
        creatorFilter === 'all' || lead.profiles?.id === creatorFilter;

      return matchesSearch && matchesCreator;
    });
  }, [leads, search, creatorFilter]);

  function handleCopyEmail(id, email) {
    navigator.clipboard.writeText(email);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function handleExportGlobalCSV() {
    if (filteredLeads.length === 0) return;

    const headers = [
      'Lead Name',
      'Email',
      'Country Code',
      'Mobile Number',
      'Full Phone',
      'Place / City',
      'Address',
      'Creator Username',
      'Creator Display Name',
      'Date Subscribed',
    ];

    const rows = filteredLeads.map((l) => {
      const fullPhone = [l.country_code, l.mobile_number].filter(Boolean).join(' ');
      return [
        `"${(l.name || '').replace(/"/g, '""')}"`,
        `"${(l.email || '').replace(/"/g, '""')}"`,
        `"${(l.country_code || '').replace(/"/g, '""')}"`,
        `"${(l.mobile_number || '').replace(/"/g, '""')}"`,
        `"${fullPhone.replace(/"/g, '""')}"`,
        `"${(l.place || '').replace(/"/g, '""')}"`,
        `"${(l.address || '').replace(/"/g, '""')}"`,
        `"${(l.profiles?.username || '').replace(/"/g, '""')}"`,
        `"${(l.profiles?.display_name || '').replace(/"/g, '""')}"`,
        `"${new Date(l.created_at).toISOString()}"`,
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
      `linknest-global-leads-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-slate-900 pb-12 animate-in fade-in duration-150 font-sans">
      {/* Header & Export Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Inbox size={24} className="text-purple-600" />
            <span>Platform-Wide Subscriber Leads</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Inspect all subscriber leads captured across every LinkNest profile and export global CSV reports.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Button
            variant="secondary"
            size="sm"
            onClick={fetchLeads}
            loading={loading}
            className="shadow-2xs text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw size={13} />
            <span>Refresh</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleExportGlobalCSV}
            disabled={filteredLeads.length === 0}
            className="shadow-btn hover:shadow-btn-hover text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Download size={14} />
            <span>Export CSV ({filteredLeads.length})</span>
          </Button>
        </div>
      </div>

      {/* Search & Creator Filters Card */}
      <div className="p-4 rounded-3xl border border-slate-200/90 bg-white shadow-soft space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search by lead name, email, phone, city, address, creator..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-2xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all font-mono"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={creatorFilter}
              onChange={(e) => setCreatorFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-2xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10 cursor-pointer shadow-2xs font-semibold"
            >
              <option value="all">All Creator Pages</option>
              {creators.map((c) => (
                <option key={c.id} value={c.id}>
                  @{c.username}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
          <span>
            Showing <strong>{filteredLeads.length}</strong> of {leads.length} global leads
          </span>
          {(search || creatorFilter !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setCreatorFilter('all');
              }}
              className="text-indigo-600 font-bold hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Global Leads Table Card */}
      <div className="rounded-3xl border border-slate-200/90 bg-white shadow-card overflow-hidden">
        {loading ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-7 h-7 rounded-full border-2 border-purple-950 border-t-transparent animate-spin mx-auto" />
            <p className="text-xs font-medium text-slate-500">Loading platform leads...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-xs text-red-600 bg-red-50/50">
            {error}
          </div>
        ) : leads.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No subscriber leads have been captured platform-wide yet.
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No leads match your filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-5">Lead / Contact</th>
                  <th className="py-3.5 px-5">Mobile Number</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-5">Target Creator</th>
                  <th className="py-3.5 px-4">Date Captured</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
                {filteredLeads.map((lead) => {
                  const hasMobile = Boolean(lead.mobile_number && lead.mobile_number.trim().length > 0);
                  const fullPhone = [lead.country_code, lead.mobile_number].filter(Boolean).join(' ');
                  const dialNumber = (lead.country_code || '') + (lead.mobile_number || '');
                  const cleanDial = dialNumber.replace(/[^\d+]/g, '');
                  const cleanWa = dialNumber.replace(/\D/g, '');
                  const creator = lead.profiles;

                  return (
                    <tr key={lead.id} className="hover:bg-slate-50/90 transition-colors">
                      {/* Name & Email */}
                      <td className="py-3.5 px-5">
                        <div className="space-y-1">
                          {lead.name ? (
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              <User size={13} className="text-slate-400 shrink-0" />
                              <span>{lead.name}</span>
                            </div>
                          ) : null}
                          <div className="flex items-center gap-1.5 text-slate-600 font-mono text-[11px]">
                            <Mail size={12} className="text-slate-400 shrink-0" />
                            <span>{lead.email}</span>
                            <button
                              type="button"
                              onClick={() => handleCopyEmail(lead.id, lead.email)}
                              className="text-slate-400 hover:text-slate-700 p-0.5 transition-colors cursor-pointer"
                              title="Copy email"
                            >
                              {copiedId === lead.id ? (
                                <Check size={12} className="text-emerald-600" />
                              ) : (
                                <Copy size={12} />
                              )}
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Mobile */}
                      <td className="py-3.5 px-5">
                        {hasMobile ? (
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                              <Phone size={13} />
                            </div>
                            <span className="font-semibold text-slate-900 font-mono text-xs">
                              {fullPhone}
                            </span>
                            <div className="flex items-center gap-1">
                              <a
                                href={`tel:${cleanDial}`}
                                className="p-1 text-slate-400 hover:text-sky-600 transition-colors"
                                title="Call number"
                              >
                                <Phone size={12} />
                              </a>
                              <a
                                href={`https://wa.me/${cleanWa}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 text-emerald-600 hover:text-emerald-800 transition-colors"
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

                      {/* Location & Address */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5 max-w-[170px]">
                          {lead.place && (
                            <div className="flex items-center gap-1 text-slate-800 font-medium truncate">
                              <MapPin size={12} className="text-slate-400 shrink-0" />
                              <span className="truncate">{lead.place}</span>
                            </div>
                          )}
                          {lead.address && (
                            <div className="text-[10px] text-slate-500 truncate" title={lead.address}>
                              {lead.address}
                            </div>
                          )}
                          {!lead.place && !lead.address && (
                            <span className="text-slate-400 font-mono">—</span>
                          )}
                        </div>
                      </td>

                      {/* Creator */}
                      <td className="py-3.5 px-5">
                        {creator ? (
                          <div className="flex items-center gap-2">
                            <Avatar
                              src={creator.avatar_url}
                              alt={creator.display_name || creator.username}
                              size={26}
                              className="shrink-0"
                            />
                            <div className="min-w-0">
                              <span className="font-bold text-slate-900 block truncate text-xs">
                                {creator.display_name || creator.username}
                              </span>
                              <a
                                href={`/${creator.username}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] font-mono text-indigo-600 hover:underline inline-flex items-center gap-0.5"
                              >
                                <span>@{creator.username}</span>
                                <ExternalLink size={10} />
                              </a>
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-mono text-xs">—</span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                        {new Date(lead.created_at).toLocaleString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
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
