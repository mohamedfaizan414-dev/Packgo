'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Star,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
  UploadCloud,
  Image as ImageIcon
} from 'lucide-react';

import {
  formatPrice,
  getDurationLabel
} from '@/lib/utils';

import toast from 'react-hot-toast';

interface Plan {
  _id: string;
  title: string;
  slug: string;
  destination: string;
  price: number | { amount: number };
  discountedPrice?: number;

  duration: {
    days: number;
    nights: number;
  };

  category: string;
  rating: number;
  isTrending: boolean;
  isFeatured: boolean;
  isActive: boolean;
  bookingCount: number;

  country?: string;
  region?: string;
  shortDescription?: string;
  description?: string;
  maxGroupSize?: number;
  departureFrom?: string;
  coverImage?: string;

  highlights?: string[] | string;
  inclusions?: string[] | string;
  exclusions?: string[] | string;
  tags?: string[] | string;
}

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  // ✅ Track current active slug during editing states to target backend routes accurately
  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  const initialFormState = {
    title: '',
    destination: '',
    country: '',
    region: '',
    shortDescription: '',
    description: '',
    price: '',
    discountedPrice: '',
    durationDays: '',
    durationNights: '',
    category: 'beach',
    tripType: 'group',
    difficulty: 'easy',
    maxGroupSize: '20',
    departureFrom: '',
    coverImage: '',
    highlights: '',
    inclusions: '',
    exclusions: '',
    tags: '',
    isTrending: false,
    isFeatured: false
  };

  const [form, setForm] = useState(initialFormState);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; planSlug: string; planTitle: string }>({
    isOpen: false,
    planSlug: '',
    planTitle: ''
  });

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/plans?limit=50&${search ? `search=${encodeURIComponent(search)}` : ''}`
      );

      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);

      const data = await res.json();
      setPlans(data.plans || data.data || []);
    } catch (error) {
      console.error('Plans fetch failed:', error);
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [search]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File is too large. Max limit is 10MB.");
      return;
    }

    setSelectedImage(file);
    setForm((prev) => ({
      ...prev,
      coverImage: URL.createObjectURL(file)
    }));
  };

  const toggleAddForm = () => {
    if (showForm && editingId) {
      setForm(initialFormState);
      setEditingId(null);
      setEditingSlug(null);
    } else {
      setShowForm(!showForm);
      setForm(initialFormState);
      setEditingId(null);
      setEditingSlug(null);
    }
  };

  const startEdit = (plan: Plan) => {
    setEditingId(plan._id);
    setEditingSlug(plan.slug); // ✅ Capture current active slug identity reference link

    const currentPrice =
      typeof plan.price === 'object' && plan.price !== null
        ? plan.price.amount
        : plan.price;

    setForm({
      title: plan.title || '',
      destination: plan.destination || '',
      country: plan.country || '',
      region: plan.region || '',
      shortDescription: plan.shortDescription || '',
      description: plan.description || '',
      price: String(currentPrice || ''),
      discountedPrice: plan.discountedPrice ? String(plan.discountedPrice) : '',
      durationDays: String(plan.duration?.days || ''),
      durationNights: String(plan.duration?.nights || ''),
      category: plan.category || 'beach',
      tripType: 'group',
      difficulty: 'easy',
      maxGroupSize: String(plan.maxGroupSize || '20'),
      departureFrom: plan.departureFrom || '',
      coverImage: plan.coverImage || '',
      highlights: Array.isArray(plan.highlights) ? plan.highlights.join('\n') : '',
      inclusions: Array.isArray(plan.inclusions) ? plan.inclusions.join('\n') : '',
      exclusions: Array.isArray(plan.exclusions) ? plan.exclusions.join('\n') : '',
      tags: Array.isArray(plan.tags) ? plan.tags.join(', ') : '',
      isTrending: !!plan.isTrending,
      isFeatured: !!plan.isFeatured
    });

    setSelectedImage(null);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    let uploadedImageUrl = form.coverImage;

    if (selectedImage) {
      try {
        setUploadingImage(true);
        const toastId = toast.loading("Uploading cover image to Cloudinary...");
        const imageData = new FormData();
        imageData.append('file', selectedImage);
        imageData.append(
          'upload_preset',
          process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ''
        );

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: 'POST',
            body: imageData
          }
        );

        const uploadedImage = await uploadRes.json();

        if (!uploadedImage.secure_url) {
          toast.error('Image upload failed', { id: toastId });
          setSaving(false);
          setUploadingImage(false);
          return;
        }

        uploadedImageUrl = uploadedImage.secure_url;
        toast.success("Image saved successfully!", { id: toastId });
        setUploadingImage(false);
      } catch (error) {
        toast.error('Image upload failed');
        setSaving(false);
        setUploadingImage(false);
        return;
      }
    }

    const body = {
      title: form.title,
      slug:
        editingId ? undefined : form.title
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, ''),
      destination: form.destination,
      country: form.country,
      region: form.region,
      shortDescription: form.shortDescription,
      description: form.description,
      price: Number(form.price),
      discountedPrice: form.discountedPrice ? Number(form.discountedPrice) : undefined,
      currency: 'INR',
      duration: {
        days: Number(form.durationDays),
        nights: Number(form.durationNights)
      },
      maxGroupSize: Number(form.maxGroupSize),
      departureFrom: form.departureFrom,
      coverImage: uploadedImageUrl,
      images: [uploadedImageUrl],
      category: form.category,
      difficulty: form.difficulty,
      highlights: form.highlights.split('\n').filter(Boolean),
      inclusions: form.inclusions.split('\n').filter(Boolean),
      exclusions: form.exclusions.split('\n').filter(Boolean),
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      isTrending: form.isTrending,
      isFeatured: form.isFeatured,
      isActive: true
    };

    // ✅ FIXED: Targets the text slug instead of the hex _id to match your dynamic api folder structure perfectly
    const url = editingId ? `/api/plans/${editingSlug}` : '/api/plans';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      setSaving(false);

      if (res.ok) {
        toast.success(editingId ? 'Plan updated!' : 'Plan created!');
        setShowForm(false);
        setEditingId(null);
        setEditingSlug(null);
        setSelectedImage(null);
        setForm(initialFormState);
        fetchPlans();
      } else {
        toast.error(data.error || 'Failed');
      }
    } catch (error) {
      setSaving(false);
      toast.error('Something went wrong');
    }
  };

  const confirmDeletePlan = async () => {
    const slug = deleteModal.planSlug;
    setDeleteModal(prev => ({ ...prev, isOpen: false }));
    const loadingToast = toast.loading("Deactivating package...");
    
    try {
      const res = await fetch(`/api/plans/${slug}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        toast.success('Plan deactivated successfully', { id: loadingToast });
        fetchPlans(); 
      } else {
        toast.error('Failed to deactivate package', { id: loadingToast });
      }
    } catch (error) {
      toast.error('Something went wrong during deletion', { id: loadingToast });
    }
  };

  const inputCls =
    'w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue bg-white';

  const setF =
    (k: string) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) =>
      setForm((p) => ({
        ...p,
        [k]: e.target.value
      }));

  return (
    <div className="space-y-6 max-w-7xl relative px-4 md:px-0">
      
      {/* ── MODERN MINIMALIST DARK ALERT MODAL ── */}
      <AnimatePresence>
        {deleteModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteModal(prev => ({ ...prev, isOpen: false }))}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl relative z-10 text-slate-100"
            >
              <div className="flex gap-4 items-start">
                <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-display tracking-tight text-white mb-1">Deactivate Package</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Are you sure you want to deactivate <span className="text-slate-200 font-semibold">"{deleteModal.planTitle}"</span>? This package will be hidden from public discovery feeds.
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-2 border-t border-slate-800/60">
                <button
                  type="button"
                  onClick={() => setDeleteModal(prev => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-xl transition-colors"
                >
                  Keep Active
                </button>
                <button
                  type="button"
                  onClick={confirmDeletePlan}
                  className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-500 rounded-xl shadow-lg shadow-red-600/10 transition-all"
                >
                  Confirm Deactivate
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-xl md:text-2xl text-brand-navy">
            Travel Plans
          </h2>
          <p className="text-gray-500 text-xs md:text-sm">
            Manage all tour packages
          </p>
        </div>

        <button onClick={toggleAddForm} className="btn-primary text-xs md:text-sm">
          {showForm ? 'Cancel' : '+ Add Plan'}
        </button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-card p-4 md:p-6"
        >
          <h3 className="font-display font-semibold text-brand-navy mb-5">
            {editingId ? 'Edit Plan Details' : 'Create New Plan'}
          </h3>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              ['title', 'Title *', 'text'],
              ['destination', 'Destination *', 'text'],
              ['country', 'Country *', 'text'],
              ['region', 'Region *', 'text'],
              ['price', 'Price (₹) *', 'number'],
              ['discountedPrice', 'Discounted Price', 'number'],
              ['durationDays', 'Days *', 'number'],
              ['durationNights', 'Nights *', 'number'],
              ['maxGroupSize', 'Max Group Size', 'number'],
              ['departureFrom', 'Departure From *', 'text']
            ].map(([k, label, type]) => (
              <div key={k} className="w-full">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {label}
                </label>
                <input
                  type={type}
                  required={label.includes('*')}
                  value={form[k as keyof typeof form] as string}
                  onChange={setF(k)}
                  className={inputCls}
                />
              </div>
            ))}

            {/* Choose File Dropzone */}
            <div className="md:col-span-2 w-full">
              <label className="block text-xs font-medium text-gray-600 mb-2.5">
                Package Cover Image *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center p-4 bg-gray-50 border border-gray-200 rounded-2xl">
                
                <div className="sm:col-span-2 relative group flex flex-col items-center justify-center h-36 border-2 border-dashed border-gray-300 hover:border-brand-blue/60 bg-white rounded-xl transition-all overflow-hidden">
                  <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer px-4 text-center">
                    <div className="p-2 bg-gray-100 text-gray-500 group-hover:text-brand-blue group-hover:bg-brand-blue/10 rounded-xl transition-all mb-1.5">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <span className="text-xs md:text-sm font-medium text-gray-700 group-hover:text-brand-blue transition-colors">
                      {uploadingImage ? "Processing media..." : "Click or drag to upload"}
                    </span>
                    <span className="text-[11px] text-gray-400 mt-0.5">PNG, JPG, or WebP up to 10MB</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      className="hidden" 
                      required={!form.coverImage}
                    />
                  </label>
                </div>

                <div className="h-36 w-full flex items-center justify-center bg-white border border-gray-200 rounded-xl overflow-hidden relative shadow-sm">
                  {form.coverImage ? (
                    <img 
                      src={form.coverImage} 
                      alt="Media preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-gray-400 gap-1">
                      <ImageIcon className="w-5 h-5 stroke-[1.5]" />
                      <span className="text-xs font-medium">Preview Area</span>
                    </div>
                  )}
                </div>

              </div>
            </div>

            <div className="md:col-span-2 w-full">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Short Description *
              </label>
              <input
                required
                value={form.shortDescription}
                onChange={setF('shortDescription')}
                className={inputCls}
                maxLength={200}
              />
            </div>

            <div className="md:col-span-2 w-full">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Full Description *
              </label>
              <textarea
                required
                rows={4}
                value={form.description}
                onChange={setF('description')}
                className={inputCls}
              />
            </div>

            <div className="w-full">
              <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
              <select value={form.category} onChange={setF('category')} className={inputCls}>
                {['adventure','beach','cultural','honeymoon','family','wildlife','pilgrimage','cruise'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="w-full">
              <label className="block text-xs font-medium text-gray-600 mb-1">Difficulty</label>
              <select value={form.difficulty} onChange={setF('difficulty')} className={inputCls}>
                {['easy','moderate','challenging'].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Tags Section */}
            <div className="w-full">
              <label className="block text-xs font-medium text-gray-600 mb-1">Tags (comma separated)</label>
              <input 
                value={form.tags} 
                onChange={setF('tags')} 
                placeholder="kashmir, beach, luxury" 
                className={inputCls} 
              />
            </div>

            {/* Trending & Featured Toggles */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6 py-2 select-none">
              <label className="flex items-center gap-2 text-xs md:text-sm font-medium text-gray-700 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={form.isTrending} 
                  onChange={e => setForm(p => ({ ...p, isTrending: e.target.checked }))} 
                  className="w-4 h-4 rounded border-gray-300 text-brand-blue focus:ring-brand-blue/20 accent-brand-blue" 
                /> 
                Trending Package
              </label>
              <label className="flex items-center gap-2 text-xs md:text-sm font-medium text-gray-700 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={form.isFeatured} 
                  onChange={e => setForm(p => ({ ...p, isFeatured: e.target.checked }))} 
                  className="w-4 h-4 rounded border-gray-300 text-brand-blue focus:ring-brand-blue/20 accent-brand-blue" 
                /> 
                Featured Package
              </label>
            </div>

            <div className="md:col-span-2 flex gap-3 pt-2 w-full">
              <button
                type="submit"
                disabled={saving || uploadingImage}
                className="btn-primary disabled:opacity-60 text-xs md:text-sm"
              >
                {saving
                  ? 'Saving...'
                  : editingId
                  ? 'Update Plan'
                  : 'Create Plan'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setEditingSlug(null);
                  setSelectedImage(null);
                  setForm(initialFormState);
                }}
                className="btn-secondary text-xs md:text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* SEARCH */}
      <div className="bg-white rounded-xl border border-gray-200 flex items-center gap-2 px-4 py-2.5 shadow-sm">
        <Search className="w-4 h-4 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search plans..."
          className="flex-1 bg-transparent text-sm focus:outline-none"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {[
                  'Package',
                  'Destination',
                  'Duration',
                  'Price',
                  'Status',
                  'Rating',
                  'Actions'
                ].map((h) => (
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
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td colSpan={7} className="py-4 px-4">
                      <div className="h-4 bg-gray-100 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : (
                plans.map((plan) => {
                  const currentPrice =
                    typeof plan.price === 'object' && plan.price !== null
                      ? plan.price.amount
                      : plan.price;

                  return (
                    <tr
                      key={plan._id}
                      className="border-b border-gray-50 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        <div className="font-medium text-brand-navy line-clamp-1 max-w-48">
                          {plan.title}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-gray-600 text-xs">
                        {plan.destination}
                      </td>

                      <td className="py-3 px-4 text-gray-600 text-xs whitespace-nowrap">
                        {getDurationLabel(
                          plan.duration?.days || 0,
                          plan.duration?.nights || 0
                        )}
                      </td>

                      <td className="py-3 px-4 text-xs whitespace-nowrap">
                        <p className="font-semibold text-brand-navy">
                          {formatPrice(plan.discountedPrice ?? currentPrice)}
                        </p>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`badge text-xs ${
                            plan.isActive
                              ? 'bg-green-50 text-green-600'
                              : 'bg-red-50 text-red-500'
                          }`}
                        >
                          {plan.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="flex items-center gap-1 text-xs">
                          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                          {Number(plan.rating || 0).toFixed(1)}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/plan/${plan.slug}`}
                            target="_blank"
                            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-brand-blue transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => startEdit(plan)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-brand-blue transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteModal({ isOpen: true, planSlug: plan.slug, planTitle: plan.title })}
                            className="p-1.5 hover:bg-red-50 rounded-lg text-gray-500 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {!loading && plans.length === 0 && (
            <p className="text-center py-10 text-gray-400">No plans found</p>
          )}
        </div>
      </div>
    </div>
  );
}