'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Layers,
  Search,
  Sparkles,
  Zap,
  Check,
  Building,
  RefreshCw,
  ExternalLink,
  Shield,
  CreditCard,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Avatar from '@/components/profile/Avatar';

const PLANS_CONFIG = [
  { id: 'free',     label: 'Free',     badgeStyle: 'bg-slate-100 text-slate-700 border-slate-200' },
  { id: 'pro',      label: 'Pro',      badgeStyle: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  { id: 'business', label: 'Business', badgeStyle: 'bg-purple-100 text-purple-800 border-purple-200' },
];

export default function AdminPlansPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState('all');

  // Saving state for specific user rows
  const [savingId, setSavingId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  async function fetchUsers() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/users');
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to fetch users');
      }
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error('[AdminPlans] Error:', err);
      setError(err.message || 'Error loading plan allocations');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  // Compute plan tier statistics
  const planStats = useMemo(() => {
    const stats = { free: 0, pro: 0, business: 0 };
    for (const u of users) {
      const p = u.plan?.toLowerCase() || 'free';
      if (stats[p] !== undefined) stats[p]++;
      else stats.free++;
    }
    return stats;
  }, [users]);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        !search.trim() ||
        u.username?.toLowerCase().includes(search.toLowerCase().trim()) ||
        u.display_name?.toLowerCase().includes(search.toLowerCase().trim()) ||
        u.email?.toLowerCase().includes(search.toLowerCase().trim());

      const matchesPlan =
        planFilter === 'all' || u.plan?.toLowerCase() === planFilter.toLowerCase();

      return matchesSearch && matchesPlan;
    });
  }, [users, search, planFilter]);

  async function handlePlanChange(userId, newPlan, username) {
    setSavingId(userId);
    setFeedback(null);

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: newPlan }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update plan');
      }

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, plan: newPlan } : u))
      );

      setFeedback({
        type: 'success',
        text: `Plan for @${username} was updated to ${newPlan.toUpperCase()}.`,
      });
    } catch (err) {
      console.error('[handlePlanChange] Error:', err);
      setFeedback({
        type: 'error',
        text: err.message || 'Failed to update plan tier',
      });
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-slate-900 pb-12 animate-in fade-in duration-150 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Layers size={24} className="text-purple-600" />
            <span>Subscription & Plan Management</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manually allocate account tiers (Free, Pro, Business) to adjust user feature access and branding limits.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={fetchUsers}
          loading={loading}
          className="shadow-2xs self-start sm:self-auto flex items-center gap-1.5 cursor-pointer text-xs"
        >
          <RefreshCw size={13} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Action Notification Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs flex items-center justify-between border animate-in fade-in ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          <span>{feedback.text}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-[11px] font-bold underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Plan Distribution Metric Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Free Card */}
        <div className="p-5 rounded-3xl border border-slate-200/90 bg-white shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Free Tier
            </span>
            <span className="text-2xl font-extrabold text-slate-800 mt-1 block">
              {loading ? '...' : planStats.free}
            </span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">
            Free
          </div>
        </div>

        {/* Pro Card */}
        <div className="p-5 rounded-3xl border border-indigo-100 bg-white shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider block">
              Pro Tier ($6/mo)
            </span>
            <span className="text-2xl font-extrabold text-indigo-950 mt-1 block">
              {loading ? '...' : planStats.pro}
            </span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs shadow-2xs">
            <Sparkles size={18} />
          </div>
        </div>

        {/* Business Card */}
        <div className="p-5 rounded-3xl border border-purple-100 bg-white shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider block">
              Business Tier ($18/mo)
            </span>
            <span className="text-2xl font-extrabold text-purple-950 mt-1 block">
              {loading ? '...' : planStats.business}
            </span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs shadow-2xs">
            <Building size={18} />
          </div>
        </div>
      </div>

      {/* Search & Tier Filters */}
      <div className="p-4 rounded-3xl border border-slate-200/90 bg-white shadow-soft space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search by username, display name, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-2xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all font-mono"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-2xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10 cursor-pointer shadow-2xs font-semibold"
            >
              <option value="all">Filter by All Plans</option>
              <option value="free">Free Tier Only</option>
              <option value="pro">Pro Tier Only</option>
              <option value="business">Business Tier Only</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
          <span>
            Showing <strong>{filteredUsers.length}</strong> of {users.length} accounts
          </span>
          {(search || planFilter !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setPlanFilter('all');
              }}
              className="text-indigo-600 font-bold hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Plan Management Table */}
      <div className="rounded-3xl border border-slate-200/90 bg-white shadow-card overflow-hidden">
        {loading ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-7 h-7 rounded-full border-2 border-purple-950 border-t-transparent animate-spin mx-auto" />
            <p className="text-xs font-medium text-slate-500">Loading plan allocations...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-xs text-red-600 bg-red-50/50">
            {error}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No accounts match your search filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-5">Creator</th>
                  <th className="py-3.5 px-5">Email Address</th>
                  <th className="py-3.5 px-4">Current Plan</th>
                  <th className="py-3.5 px-5 text-right">Change Tier / Allocation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
                {filteredUsers.map((user) => {
                  const currentPlan = user.plan || 'free';
                  const isSaving = savingId === user.id;

                  return (
                    <tr key={user.id} className="hover:bg-slate-50/90 transition-colors">
                      {/* Creator */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={user.avatar_url}
                            alt={user.display_name || user.username}
                            size={34}
                            className="shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 truncate">
                              {user.display_name || user.username}
                            </div>
                            <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                              @{user.username}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-5 font-mono text-[11px] text-slate-600">
                        {user.email || '—'}
                      </td>

                      {/* Current Plan Badge */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            currentPlan === 'business'
                              ? 'bg-purple-100 text-purple-800 border-purple-200'
                              : currentPlan === 'pro'
                              ? 'bg-indigo-100 text-indigo-800 border-indigo-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {currentPlan}
                        </span>
                      </td>

                      {/* Plan Change Selector */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="inline-flex items-center gap-2">
                          <select
                            value={currentPlan}
                            disabled={isSaving}
                            onChange={(e) =>
                              handlePlanChange(user.id, e.target.value, user.username)
                            }
                            className="py-1.5 px-3 text-xs rounded-xl border border-slate-200 bg-white font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 cursor-pointer shadow-2xs"
                          >
                            <option value="free">Free Tier</option>
                            <option value="pro">Pro Tier ($6/mo)</option>
                            <option value="business">Business Tier ($18/mo)</option>
                          </select>
                          {isSaving && (
                            <div className="w-4 h-4 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin shrink-0" />
                          )}
                        </div>
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
