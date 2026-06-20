'use client';

import { useEffect, useState } from 'react';
import {
  Users,
  Search,
  Mail,
  Phone,
  Calendar
} from 'lucide-react';

import { format } from 'date-fns';

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
  bookingHistory: { status: string }[];
  preferences: { budget?: string };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/admin/users')
      .then(r => r.json())
      .then(d => {
        setUsers(d.users || []);
        setLoading(false);
      });
  }, []);

  const filtered = users.filter(
    u =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5 w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 overflow-x-hidden">

      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h2 className="font-display font-bold text-2xl text-brand-navy">
            Users
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Registered travelers on PackGo
          </p>
        </div>

        {/* SEARCH */}
        <div className="flex items-center gap-2 bg-white rounded-2xl border border-gray-200 px-4 py-3 shadow-sm w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />

          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search users..."
            className="flex-1 min-w-0 bg-transparent text-sm focus:outline-none"
          />
        </div>
      </div>

      {/* USERS */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">

        {/* MOBILE VIEW */}
        <div className="block md:hidden p-3 space-y-3">

          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-gray-100 p-4 shadow-sm"
                >
                  <div className="h-4 bg-gray-100 rounded animate-pulse mb-3" />
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-2/3 mb-2" />
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
                </div>
              ))
            : filtered.map(user => (
                <div
                  key={user._id}
                  className="rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-all"
                >

                  {/* TOP */}
                  <div className="flex items-start justify-between gap-3">

                    <div className="flex items-center gap-3 min-w-0">

                      <div className="w-10 h-10 bg-brand-blue rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {user.name?.[0]}
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-semibold text-brand-navy truncate">
                          {user.name}
                        </h3>

                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1 truncate">
                          <Mail className="w-3 h-3 shrink-0" />
                          <span className="truncate">{user.email}</span>
                        </div>
                      </div>
                    </div>

                    <span className="badge bg-gray-100 text-gray-600 text-[10px] capitalize shrink-0">
                      {user.preferences?.budget ?? 'Not set'}
                    </span>
                  </div>

                  {/* DETAILS */}
                  <div className="mt-4 grid grid-cols-2 gap-3 text-xs">

                    <div className="rounded-xl bg-gray-50 p-3">
                      <p className="text-gray-400 mb-1">Joined</p>

                      <div className="flex items-center gap-1 text-gray-600">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(user.createdAt), 'MMM d, yyyy')}
                      </div>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-3">
                      <p className="text-gray-400 mb-1">Bookings</p>

                      <p className="font-semibold text-brand-navy">
                        {user.bookingHistory?.length ?? 0}
                      </p>
                    </div>
                  </div>

                  {/* PHONE */}
                  {user.phone && (
                    <div className="mt-3 flex items-center gap-1 text-xs text-gray-500">
                      <Phone className="w-3 h-3" />
                      {user.phone}
                    </div>
                  )}
                </div>
              ))}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-10">
              <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />

              <p className="text-gray-400">
                No users found
              </p>
            </div>
          )}
        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden md:block overflow-x-auto">

          <table className="w-full text-sm">

            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {[
                  'User',
                  'Contact',
                  'Joined',
                  'Bookings',
                  'Budget Pref'
                ].map(h => (
                  <th
                    key={h}
                    className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={5} className="py-4 px-4">
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                      </td>
                    </tr>
                  ))
                : filtered.map(user => (
                    <tr
                      key={user._id}
                      className="border-b border-gray-50 hover:bg-gray-50"
                    >

                      {/* USER */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">

                          <div className="w-9 h-9 bg-brand-blue rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {user.name?.[0]}
                          </div>

                          <span className="font-medium text-brand-navy">
                            {user.name}
                          </span>
                        </div>
                      </td>

                      {/* CONTACT */}
                      <td className="py-3 px-4">

                        <div className="flex items-center gap-1 text-gray-500 text-xs">
                          <Mail className="w-3 h-3 shrink-0" />
                          {user.email}
                        </div>

                        {user.phone && (
                          <div className="flex items-center gap-1 text-gray-400 text-xs mt-1">
                            <Phone className="w-3 h-3 shrink-0" />
                            {user.phone}
                          </div>
                        )}
                      </td>

                      {/* JOINED */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-gray-500 text-xs">
                          <Calendar className="w-3 h-3 shrink-0" />
                          {format(
                            new Date(user.createdAt),
                            'MMM d, yyyy'
                          )}
                        </div>
                      </td>

                      {/* BOOKINGS */}
                      <td className="py-3 px-4 text-gray-600">
                        {user.bookingHistory?.length ?? 0}
                      </td>

                      {/* BUDGET */}
                      <td className="py-3 px-4">
                        <span className="badge bg-gray-100 text-gray-600 text-xs capitalize">
                          {user.preferences?.budget ?? 'Not set'}
                        </span>
                      </td>

                    </tr>
                  ))}
            </tbody>
          </table>

          {!loading && filtered.length === 0 && (
            <div className="text-center py-10">
              <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />

              <p className="text-gray-400">
                No users found
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
