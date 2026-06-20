'use client';
import { useEffect, useState } from 'react';
import { Plus, Map } from 'lucide-react';
import toast from 'react-hot-toast';

interface Plan { _id: string; title: string; slug: string; }

export default function AdminItinerariesPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ planId: '', dayNumber: '', title: '', description: '', transport: '', image: '', highlights: '', tips: '', breakfast: false, lunch: false, dinner: false });

  useEffect(() => {
    fetch('/api/plans?limit=100').then(r => r.json()).then(d => setPlans(d.plans || []));
  }, []);

  const inputCls = 'w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue';

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const body = {
      planId: form.planId,
      dayNumber: Number(form.dayNumber),
      title: form.title,
      description: form.description,
      transport: form.transport,
      image: form.image,
      highlights: form.highlights.split('\n').filter(Boolean),
      tips: form.tips.split('\n').filter(Boolean),
      meals: { breakfast: form.breakfast, lunch: form.lunch, dinner: form.dinner },
      activities: [],
    };
    const res = await fetch('/api/itineraries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    setSaving(false);
    if (res.ok) { toast.success('Itinerary day created!'); setShowForm(false); }
    else { const d = await res.json(); toast.error(d.error || 'Failed'); }
  };

  const setF = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div><h2 className="font-display font-bold text-2xl text-brand-navy">Itineraries</h2><p className="text-gray-500 text-sm">Add day-by-day plans to packages</p></div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm">
          <Plus className="w-4 h-4" /> {showForm ? 'Cancel' : 'Add Day'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-card p-6">
          <h3 className="font-display font-semibold text-brand-navy mb-5">Add Itinerary Day</h3>
          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Select Package *</label>
              <select required value={form.planId} onChange={setF('planId')} className={inputCls}>
                <option value="">-- Select a plan --</option>
                {plans.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Day Number *</label>
              <input type="number" min="1" required value={form.dayNumber} onChange={setF('dayNumber')} className={inputCls} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Day Title *</label>
              <input required value={form.title} onChange={setF('title')} placeholder="e.g. Arrival in Delhi & Old City Walk" className={inputCls} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Description *</label>
              <textarea required rows={3} value={form.description} onChange={setF('description')} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Transport</label>
              <input value={form.transport} onChange={setF('transport')} placeholder="e.g. AC vehicle, Train" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Day Image URL</label>
              <input type="url" value={form.image} onChange={setF('image')} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Highlights (one per line)</label>
              <textarea rows={3} value={form.highlights} onChange={setF('highlights')} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Tips (one per line)</label>
              <textarea rows={3} value={form.tips} onChange={setF('tips')} className={inputCls} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-2">Meals Included</label>
              <div className="flex gap-4">
                {(['breakfast', 'lunch', 'dinner'] as const).map(m => (
                  <label key={m} className="flex items-center gap-2 text-sm capitalize cursor-pointer">
                    <input type="checkbox" checked={form[m]} onChange={e => setForm(p => ({ ...p, [m]: e.target.checked }))} className="w-4 h-4 accent-brand-blue" /> {m}
                  </label>
                ))}
              </div>
            </div>
            <div className="sm:col-span-2 flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">{saving ? 'Saving...' : 'Add Day'}</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {!showForm && (
        <div className="bg-white rounded-2xl shadow-card p-12 text-center">
          <Map className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <h3 className="font-display font-semibold text-brand-navy mb-1">Manage Itineraries</h3>
          <p className="text-gray-500 text-sm mb-4">Add detailed day-by-day plans to your packages to give travelers a complete experience overview.</p>
          <button onClick={() => setShowForm(true)} className="btn-primary text-sm mx-auto"><Plus className="w-4 h-4" /> Add Itinerary Day</button>
        </div>
      )}
    </div>
  );
}
