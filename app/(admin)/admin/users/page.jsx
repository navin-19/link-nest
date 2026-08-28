'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Search,
  Shield,
  ShieldAlert,
  Trash2,
  ExternalLink,
  Ban,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Calendar,
  Mail,
  User,
  Filter,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Avatar from '@/components/profile/Avatar';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');

  // Action states
  const [togglingId, setTogglingId] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

  async function fetchUsers() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/users');
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to fetch user list');
      }
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error('[AdminUsers] Error:', err);
      setError(err.message || 'Error loading users');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        !search.trim() ||
        u.username?.toLowerCase().includes(search.toLowerCase().trim()) ||
        u.display_name?.toLowerCase().includes(search.toLowerCase().trim()) ||
        u.email?.toLowerCase().includes(search.toLowerCase().trim());

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && !u.is_suspended) ||
        (statusFilter === 'suspended' && u.is_suspended);

      const matchesPlan =
        planFilter === 'all' || u.plan?.toLowerCase() === planFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesPlan;
    });
  }, [users, search, statusFilter, planFilter]);

  async function handleToggleSuspend(user) {
    const nextState = !user.is_suspended;
    setTogglingId(user.id);
    setActionMessage(null);

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_suspended: nextState }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update user status');
      }

      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, is_suspended: nextState } : u))
      );

      setActionMessage({
        type: 'success',
        text: `User @${user.username} is now ${nextState ? 'suspended' : 'active'}.`,
      });
    } catch (err) {
      console.error('[handleToggleSuspend] Error:', err);
      setActionMessage({
        type: 'error',
        text: err.message || 'Failed to update user',
      });
    } finally {
      setTogglingId(null);
    }
  }

  async function handleConfirmDelete() {
    if (!userToDelete) return;
    if (deleteConfirmationInput.trim() !== userToDelete.username) return;

    setDeleting(true);
    setActionMessage(null);

    try {
      const res = await fetch(`/api/admin/users/${userToDelete.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete user');
      }

      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      setActionMessage({
        type: 'success',
        text: `Account @${userToDelete.username} was permanently deleted.`,
      });
      setUserToDelete(null);
      setDeleteConfirmationInput('');
    } catch (err) {
      console.error('[handleConfirmDelete] Error:', err);
      setActionMessage({
        type: 'error',
        text: err.message || 'Failed to delete user',
      });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-slate-900 pb-12 animate-in fade-in duration-150 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users size={24} className="text-purple-600" />
            <span>User Directory & Governance</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Search, audit account states, toggle account suspensions, or permanently delete users.
          </p>
        </div>

        <div className="text-xs text-slate-500 font-semibold bg-white border border-slate-200/90 px-3.5 py-2 rounded-2xl shadow-2xs self-start sm:self-auto">
          Total Users: <strong className="text-slate-900">{users.length}</strong>
        </div>
      </div>

      {/* Action Notification Banner */}
      {actionMessage && (
        <div
          className={`p-4 rounded-2xl text-xs flex items-center justify-between border animate-in fade-in ${
            actionMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          <span>{actionMessage.text}</span>
          <button
            type="button"
            onClick={() => setActionMessage(null)}
            className="text-[11px] font-bold underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Search & Filters Card */}
      <div className="p-4 rounded-3xl border border-slate-200/90 bg-white shadow-soft space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="sm:col-span-6 relative">
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

          {/* Status Filter */}
          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-2xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10 cursor-pointer shadow-2xs font-semibold"
            >
              <option value="all">All Account Statuses</option>
              <option value="active">Active Only</option>
              <option value="suspended">Suspended Only</option>
            </select>
          </div>

          {/* Plan Filter */}
          <div className="sm:col-span-3">
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-2xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10 cursor-pointer shadow-2xs font-semibold"
            >
              <option value="all">All Plans & Tiers</option>
              <option value="free">Free Tier</option>
              <option value="pro">Pro Tier</option>
              <option value="business">Business Tier</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
          <span>
            Showing <strong>{filteredUsers.length}</strong> of {users.length} registered accounts
          </span>
          {(search || statusFilter !== 'all' || planFilter !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setStatusFilter('all');
                setPlanFilter('all');
              }}
              className="text-indigo-600 font-bold hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Users Table Card */}
      <div className="rounded-3xl border border-slate-200/90 bg-white shadow-card overflow-hidden">
        {loading ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-7 h-7 rounded-full border-2 border-purple-950 border-t-transparent animate-spin mx-auto" />
            <p className="text-xs font-medium text-slate-500">Loading user directory...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-xs text-red-600 bg-red-50/50">
            {error}
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No registered users found.
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No users match the search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-5">User / Creator</th>
                  <th className="py-3.5 px-5">Email Address</th>
                  <th className="py-3.5 px-4">Plan Tier</th>
                  <th className="py-3.5 px-4">Account Status</th>
                  <th className="py-3.5 px-4">Joined Date</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
                {filteredUsers.map((user) => {
                  const isSuspended = user.is_suspended;
                  const isSuperAdmin = user.is_super_admin;
                  const plan = user.plan || 'free';

                  return (
                    <tr
                      key={user.id}
                      className={`hover:bg-slate-50/90 transition-colors ${
                        isSuspended ? 'bg-amber-50/30' : ''
                      }`}
                    >
                      {/* User Info */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={user.avatar_url}
                            alt={user.display_name || user.username}
                            size={36}
                            className="shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-slate-900">
                                {user.display_name || user.username}
                              </span>
                              {isSuperAdmin && (
                                <span className="inline-flex items-center gap-1 text-[9px] font-extrabold bg-purple-100 text-purple-800 border border-purple-200/80 px-1.5 py-0.2 rounded-md">
                                  <Shield size={10} /> Admin
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 mt-0.5">
                              <span>@{user.username}</span>
                              <a
                                href={`/${user.username}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-400 hover:text-slate-700"
                                title="View public profile"
                              >
                                <ExternalLink size={11} />
                              </a>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-5">
                        <span className="text-slate-600 font-mono text-[11px]">
                          {user.email || '—'}
                        </span>
                      </td>

                      {/* Plan */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            plan === 'business'
                              ? 'bg-purple-100 text-purple-800 border border-purple-200'
                              : plan === 'pro'
                              ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {plan}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {isSuspended ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                            <Ban size={11} /> Suspended
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 size={11} /> Active
                          </span>
                        )}
                      </td>

                      {/* Joined Date */}
                      <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                        {user.created_at
                          ? new Date(user.created_at).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : '—'}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Suspend / Unsuspend Button */}
                          <Button
                            size="sm"
                            variant={isSuspended ? 'secondary' : 'ghost'}
                            onClick={() => handleToggleSuspend(user)}
                            loading={togglingId === user.id}
                            className={`text-xs ${
                              isSuspended
                                ? 'text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border-emerald-200'
                                : 'text-amber-700 hover:text-amber-800 hover:bg-amber-50'
                            }`}
                            title={isSuspended ? 'Reactivate account' : 'Suspend account'}
                          >
                            {isSuspended ? 'Unsuspend' : 'Suspend'}
                          </Button>

                          {/* Delete Button */}
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              setUserToDelete(user);
                              setDeleteConfirmationInput('');
                            }}
                            className="text-slate-400 hover:text-red-600 hover:bg-red-50"
                            title="Delete user account"
                            aria-label={`Delete ${user.username}`}
                          >
                            <Trash2 size={15} />
                          </Button>
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

      {/* Irreversible Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(userToDelete)}
        onClose={() => {
          if (!deleting) {
            setUserToDelete(null);
            setDeleteConfirmationInput('');
          }
        }}
        title="Permanently Delete Account"
        description="This action is immediate, destructive, and irreversible."
        size="md"
        footer={
          <>
            <Button
              variant="ghost"
              size="sm"
              disabled={deleting}
              onClick={() => {
                setUserToDelete(null);
                setDeleteConfirmationInput('');
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              loading={deleting}
              disabled={deleteConfirmationInput.trim() !== userToDelete?.username}
              onClick={handleConfirmDelete}
              className="shadow-btn"
            >
              I understand, delete this user
            </Button>
          </>
        }
      >
        {userToDelete && (
          <div className="space-y-4 text-xs text-slate-700">
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 flex items-start gap-3">
              <AlertTriangle size={18} className="shrink-0 text-red-600 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-red-900">Warning: Permanent deletion</p>
                <p className="leading-relaxed">
                  Deleting <strong className="font-mono font-bold">@{userToDelete.username}</strong> ({userToDelete.email || 'No email'}) will permanently erase their authentication profile, links, products, leads, custom themes, and analytics data.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="delete-confirm-input" className="font-semibold text-slate-800 block">
                To confirm deletion, please type the exact username <span className="font-mono font-bold text-red-600">@{userToDelete.username}</span>:
              </label>
              <Input
                id="delete-confirm-input"
                placeholder={userToDelete.username}
                value={deleteConfirmationInput}
                onChange={(e) => setDeleteConfirmationInput(e.target.value)}
                className="font-mono text-xs"
                autoFocus
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
