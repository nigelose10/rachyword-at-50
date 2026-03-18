import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Download, Search, Users, CheckCircle2, XCircle, ChevronDown, ArrowLeft } from 'lucide-react';
import { db } from '../firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

// ── Admin password — change this to whatever you want ──
const ADMIN_PASSWORD = 'DRA50Admin!';

interface RSVPEntry {
  id: string;
  title: string;
  surname: string;
  firstname: string;
  telephone: string;
  email: string;
  attendingThanksgiving: boolean;
  attendingBirthday: boolean;
  guestCategory: string;
  comments: string;
  status: string;
  createdAt: any;
}

interface AdminDashboardProps {
  onBack: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rsvps, setRsvps] = useState<RSVPEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setError('');
      fetchRSVPs();
    } else {
      setError('Invalid password');
    }
  };

  const fetchRSVPs = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'rsvps'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const entries: RSVPEntry[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as RSVPEntry));
      setRsvps(entries);
    } catch (err) {
      console.error('Error fetching RSVPs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authenticated) fetchRSVPs();
  }, [authenticated]);

  // ── Derived stats ──
  const stats = useMemo(() => ({
    total: rsvps.length,
    thanksgiving: rsvps.filter(r => r.attendingThanksgiving).length,
    birthday: rsvps.filter(r => r.attendingBirthday).length,
    categories: [...new Set(rsvps.map(r => r.guestCategory).filter(Boolean))],
  }), [rsvps]);

  // ── Filtered list ──
  const filtered = useMemo(() => {
    let list = rsvps;
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      list = list.filter(r =>
        r.firstname?.toLowerCase().includes(s) ||
        r.surname?.toLowerCase().includes(s) ||
        r.email?.toLowerCase().includes(s) ||
        r.telephone?.includes(s)
      );
    }
    if (filterCategory !== 'All') {
      list = list.filter(r => r.guestCategory === filterCategory);
    }
    return list;
  }, [rsvps, searchTerm, filterCategory]);

  // ── CSV export ──
  const exportCSV = () => {
    const headers = ['Title', 'Surname', 'First Name', 'Telephone', 'Email', 'Thanksgiving (May 6)', 'Birthday (May 7)', 'Guest Category', 'Comments', 'Date Submitted'];
    const rows = filtered.map(r => [
      r.title,
      r.surname,
      r.firstname,
      r.telephone,
      r.email,
      r.attendingThanksgiving ? 'YES' : 'NO',
      r.attendingBirthday ? 'YES' : 'NO',
      r.guestCategory,
      `"${(r.comments || '').replace(/"/g, '""')}"`,
      r.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A',
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DRA50_RSVP_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Password gate ──
  if (!authenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center" style={{
        background: 'radial-gradient(ellipse at center, rgba(26,21,16,0.95), rgba(10,8,6,0.99))',
      }}>
        <button onClick={onBack} className="absolute top-6 left-6 flex items-center gap-2 text-gold/30 hover:text-gold/60 transition-colors cursor-pointer font-body text-sm">
          <ArrowLeft size={16} /> Back
        </button>

        <motion.form
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          onSubmit={handleLogin}
          className="flex flex-col items-center text-center px-8 max-w-sm w-full"
        >
          <Lock size={32} className="text-gold/40 mb-6" />
          <h2 className="font-display text-2xl font-bold text-gold-gradient mb-2">Admin Access</h2>
          <p className="font-body text-sm text-parchment/30 mb-8">Enter the organizer password</p>

          <input
            type="password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError(''); }}
            placeholder="Password"
            className="w-full bg-transparent border-b-2 border-gold/20 py-4 text-parchment font-body text-xl text-center focus:outline-none focus:border-gold/60 transition-colors duration-500 placeholder:text-gold/15 mb-6"
            autoFocus
          />

          {error && <p className="text-red-400/80 font-body text-sm mb-4">{error}</p>}

          <button type="submit"
            className="btn-gold w-full py-3.5 rounded-full border border-gold/30 bg-gold/10 font-body text-sm uppercase tracking-[0.2em] text-gold-light cursor-pointer transition-all duration-500"
          >
            Enter
          </button>
        </motion.form>
      </div>
    );
  }

  // ── Dashboard ──
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" style={{
      background: '#0A0806',
      scrollbarWidth: 'thin',
      scrollbarColor: 'rgba(201,169,110,0.15) transparent',
    }}>
      {/* Header */}
      <div className="sticky top-0 z-10 px-6 md:px-10 py-5 flex items-center justify-between" style={{
        background: 'linear-gradient(to bottom, rgba(10,8,6,0.98), rgba(10,8,6,0.9))',
        backdropFilter: 'blur(12px)',
      }}>
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-gold/30 hover:text-gold/60 transition-colors cursor-pointer">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-display text-lg font-bold text-gold-gradient">DRA @ 50 Guestlist</h1>
            <p className="font-body text-[10px] text-gold/20 tracking-wider">{stats.total} total responses</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={fetchRSVPs} className="px-4 py-2 rounded-full border border-gold/15 text-gold/40 hover:text-gold/70 hover:border-gold/30 font-body text-[10px] uppercase tracking-wider cursor-pointer transition-all">
            Refresh
          </button>
          <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 rounded-full border border-gold/25 bg-gold/10 text-gold-light/80 font-body text-[10px] uppercase tracking-wider cursor-pointer transition-all hover:bg-gold/20">
            <Download size={12} /> CSV
          </button>
        </div>
      </div>

      <div className="px-6 md:px-10 py-6">
        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total RSVPs', value: stats.total, icon: Users },
            { label: 'Categories', value: stats.categories.length, icon: Users },
            { label: 'Thanksgiving (May 6)', value: stats.thanksgiving, icon: CheckCircle2 },
            { label: 'Birthday (May 7)', value: stats.birthday, icon: CheckCircle2 },
          ].map(stat => (
            <div key={stat.label} className="glass-card rounded-xl p-5">
              <stat.icon size={16} className="text-gold/30 mb-3" />
              <p className="font-display text-2xl font-bold text-gold-light/80 mb-1">{stat.value}</p>
              <p className="font-body text-[9px] uppercase tracking-[0.3em] text-gold/25">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/25" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, or phone..."
              className="w-full bg-transparent border border-gold/12 rounded-full py-3 pl-10 pr-4 text-parchment font-body text-sm focus:outline-none focus:border-gold/30 transition-colors placeholder:text-gold/15"
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-5 py-3 rounded-full border border-gold/15 text-gold/50 font-body text-sm cursor-pointer hover:border-gold/30 transition-all"
            >
              {filterCategory === 'All' ? 'All Categories' : filterCategory}
              <ChevronDown size={14} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute right-0 top-full mt-2 w-64 max-h-72 overflow-y-auto rounded-xl border border-gold/15 bg-noir-warm/95 backdrop-blur-md z-20 py-2"
                  style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(201,169,110,0.15) transparent' }}
                >
                  <button onClick={() => { setFilterCategory('All'); setShowFilters(false); }}
                    className={`w-full text-left px-4 py-2.5 font-body text-sm cursor-pointer transition-colors ${filterCategory === 'All' ? 'text-gold-light bg-gold/10' : 'text-gold/40 hover:text-gold/70 hover:bg-gold/5'}`}
                  >All Categories</button>
                  {stats.categories.map(cat => (
                    <button key={cat} onClick={() => { setFilterCategory(cat); setShowFilters(false); }}
                      className={`w-full text-left px-4 py-2.5 font-body text-sm cursor-pointer transition-colors ${filterCategory === cat ? 'text-gold-light bg-gold/10' : 'text-gold/40 hover:text-gold/70 hover:bg-gold/5'}`}
                    >{cat}</button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Results count */}
        <p className="font-body text-[10px] text-gold/20 tracking-wider mb-4 uppercase">
          Showing {filtered.length} of {rsvps.length} guests
        </p>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="diamond animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-body text-gold/25 text-sm">No RSVPs found</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gold/10">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gold/10">
                  {['#', 'Name', 'Contact', 'May 6', 'May 7', 'Category', 'Comments'].map(h => (
                    <th key={h} className="px-4 py-3 font-body text-[9px] uppercase tracking-[0.3em] text-gold/30 font-normal whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr key={r.id} className="border-b border-gold/5 hover:bg-gold/3 transition-colors">
                    <td className="px-4 py-4 font-body text-xs text-gold/20">{i + 1}</td>
                    <td className="px-4 py-4">
                      <p className="font-body text-sm text-parchment/70">{r.title} {r.firstname} {r.surname}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-body text-xs text-parchment/50">{r.email}</p>
                      <p className="font-body text-xs text-gold/25">{r.telephone}</p>
                    </td>
                    <td className="px-4 py-4">
                      {r.attendingThanksgiving ? (
                        <CheckCircle2 size={16} className="text-green-500/60" />
                      ) : (
                        <XCircle size={16} className="text-red-400/40" />
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {r.attendingBirthday ? (
                        <CheckCircle2 size={16} className="text-green-500/60" />
                      ) : (
                        <XCircle size={16} className="text-red-400/40" />
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-3 py-1 rounded-full border border-gold/10 text-gold/40 font-body text-[10px] whitespace-nowrap">{r.guestCategory || '—'}</span>
                    </td>
                    <td className="px-4 py-4 max-w-[200px]">
                      <p className="font-body text-xs text-parchment/30 truncate">{r.comments || '—'}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
