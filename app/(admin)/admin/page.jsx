'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  ShieldCheck,
  Layers,
  Inbox,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  UserCheck,
  CreditCard,
  RefreshCw,
} from 'lucide-react';
import Button from '@/components/ui/Button';

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    suspendedUsers: 0,
    paidUsers: 0,
    totalLeads: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadOverview() {
    setLoading(true);
    setError(null);
    try {
      const [usersRes, leadsRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/leads'),
      ]);

      if (!usersRes.ok || !leadsRes.ok) {
        throw new Error('Failed to fetch administrative metrics');
      }

      const usersData = await usersRes.json();
      const leadsData = await leadsRes.json();

      const usersList = usersData.users || [];
      const leadsList = leadsData.leads || [];

      const active = usersList.filter((u) => !u.is_suspended).length;
      const suspended = usersList.filter((u) => u.is_suspended).length;
      const paid = usersList.filter((u) => u.plan === 'pro' || u.plan === 'business').length;

      setStats({
        totalUsers: usersList.length,
        activeUsers: active,
        suspendedUsers: suspended,
        paidUsers: paid,
        totalLeads: leadsList.length,
      });
    } catch (err) {
      console.error('[AdminOverview] Error loading stats:', err);
      setError(err.message || 'Error loading metrics');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOverview();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8 text-slate-900 pb-12 animate-in fade-in duration-150 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200/80 mb-2">
            <ShieldCheck size={13} />
            <span>Super Administrator Mode</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Admin Management Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Global account governance, account suspension, tier allocation, and platform-wide leads.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={loadOverview}
          loading={loading}
          className="shadow-2xs self-start sm:self-auto flex items-center gap-1.5 cursor-pointer text-xs"
        >
          <RefreshCw size={13} />
          <span>Refresh Data</span>
        </Button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700">
          {error}
        </div>
      )}

      {/* 4 Stat Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Users */}
        <div className="p-5 sm:p-6 rounded-3xl border border-slate-200/90 bg-white shadow-soft space-y-2 hover:shadow-card transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Accounts
            </span>
            <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {loading ? '...' : stats.totalUsers}
            </span>
            <span className="text-xs font-semibold text-slate-400">creators</span>
          </div>
        </div>

        {/* Active Accounts */}
        <div className="p-5 sm:p-6 rounded-3xl border border-slate-200/90 bg-white shadow-soft space-y-2 hover:shadow-card transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Status
            </span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {loading ? '...' : stats.activeUsers}
            </span>
            {stats.suspendedUsers > 0 && (
              <span className="text-xs font-bold text-amber-600">
                ({stats.suspendedUsers} suspended)
              </span>
            )}
          </div>
        </div>

        {/* Paid Tiers */}
        <div className="p-5 sm:p-6 rounded-3xl border border-slate-200/90 bg-white shadow-soft space-y-2 hover:shadow-card transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pro & Business Tiers
            </span>
            <div className="w-9 h-9 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Sparkles size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {loading ? '...' : stats.paidUsers}
            </span>
            <span className="text-xs font-semibold text-slate-400">upgraded</span>
          </div>
        </div>

        {/* Global Leads */}
        <div className="p-5 sm:p-6 rounded-3xl border border-slate-200/90 bg-white shadow-soft space-y-2 hover:shadow-card transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Captured Leads
            </span>
            <div className="w-9 h-9 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Inbox size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {loading ? '...' : stats.totalLeads}
            </span>
            <span className="text-xs font-semibold text-slate-400">platform leads</span>
          </div>
        </div>
      </div>

      {/* 3 Main Action Portals */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">Administrative Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Users */}
          <Link
            href="/admin/users"
            className="p-6 rounded-3xl border border-slate-200/90 bg-white shadow-card hover:shadow-xl hover:border-slate-300 transition-all duration-200 group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Users size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  User Accounts
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  View full user directory, search by username or email, suspend accounts, and permanently delete users.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform">
              <span>Manage Users</span>
              <ArrowRight size={14} />
            </div>
          </Link>

          {/* Card 2: Plans */}
          <Link
            href="/admin/plans"
            className="p-6 rounded-3xl border border-slate-200/90 bg-white shadow-card hover:shadow-xl hover:border-slate-300 transition-all duration-200 group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Layers size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                  Plans & Tiers
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Allocate and adjust subscription tiers (Free, Pro, Business) across accounts with instant tier updates.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-purple-600 group-hover:translate-x-1 transition-transform">
              <span>Manage Plans</span>
              <ArrowRight size={14} />
            </div>
          </Link>

          {/* Card 3: Leads */}
          <Link
            href="/admin/leads"
            className="p-6 rounded-3xl border border-slate-200/90 bg-white shadow-card hover:shadow-xl hover:border-slate-300 transition-all duration-200 group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Inbox size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                  Global Leads
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Browse and audit subscriber contact data captured across every LinkNest profile and export global CSVs.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-sky-600 group-hover:translate-x-1 transition-transform">
              <span>View & Export Leads</span>
              <ArrowRight size={14} />
            </div>
          </Link>
        </div>
      </div>

      {/* Security & Access Notice */}
      <div className="p-5 rounded-3xl border border-purple-200/80 bg-linear-to-r from-purple-50/80 to-indigo-50/80 flex items-start gap-3.5">
        <div className="p-2 rounded-xl bg-purple-600 text-white shrink-0 shadow-2xs mt-0.5">
          <ShieldAlert size={16} />
        </div>
        <div className="text-xs text-purple-950 space-y-1">
          <p className="font-bold">Super Admin Access Model Note</p>
          <p className="text-purple-900/80 leading-relaxed">
            Super administrator privileges are restricted to designated database entries (<code className="bg-purple-200/60 px-1 py-0.5 rounded text-[11px] font-mono">is_super_admin = true</code>). Promotion cannot be performed via client UI to safeguard system integrity.
          </p>
        </div>
      </div>
    </div>
  );
}
