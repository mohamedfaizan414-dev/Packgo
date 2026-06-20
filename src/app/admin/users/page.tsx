'use client';
import { useEffect, useState } from 'react';
import { Users, Search, Mail, Phone, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface User { _id: string; name: string; email: string; phone?: string; createdAt: string; bookingHistory: { status: string }[]; preferences: { budget?: string } }

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/admin/users').then(r => r.json()).then(d => { setUsers(d.users || []); setLoading(false); });
  }, []);

  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div><h2 className="font-display font-bold text-2xl text-brand-navy">Users</h2><p className="text-gray-500 text-sm">Registered travelers on PackGo</p></div>
        <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-200 px-4 py-2.5 shadow-sm w-64">
          <Search className="w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="flex-1 bg-transparent text-sm focus:outline-none" />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>{['User', 'Contact', 'Joined', 'Bookings', 'Budget Pref'].map(h => (
                <th key={h} className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {loading ? Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}><td colSpan={5} className="py-4 px-4"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>
              )) : filtered.map(user => (
                <tr key={user._id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-brand-blue rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">{user.name[0]}</div>
                      <span className="font-medium text-brand-navy">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 text-gray-500 text-xs"><Mail className="w-3 h-3" />{user.email}</div>
                    {user.phone && <div className="flex items-center gap-1 text-gray-400 text-xs mt-0.5"><Phone className="w-3 h-3" />{user.phone}</div>}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 text-gray-500 text-xs"><Calendar className="w-3 h-3" />{format(new Date(user.createdAt), 'MMM d, yyyy')}</div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{user.bookingHistory?.length ?? 0}</td>
                  <td className="py-3 px-4">
                    <span className="badge bg-gray-100 text-gray-600 text-xs capitalize">{user.preferences?.budget ?? 'Not set'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && filtered.length === 0 && (
            <div className="text-center py-10">
              <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-400">No users found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
