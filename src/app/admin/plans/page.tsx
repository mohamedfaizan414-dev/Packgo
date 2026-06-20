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
  <div className="space-y-5 w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 overflow-x-hidden">

    {/* MODAL */}
    <AnimatePresence>
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() =>
              setDeleteModal(prev => ({ ...prev, isOpen: false }))
            }
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            className="relative z-10 w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6 shadow-2xl"
          >
            <div className="flex items-start gap-4">
              <div className="shrink-0 rounded-xl bg-amber-500/10 p-3 text-amber-500">
                <AlertTriangle className="h-6 w-6" />
              </div>

              <div>
                <h3 className="mb-1 text-lg font-bold text-white">
                  Deactivate Package
                </h3>

                <p className="text-sm leading-relaxed text-slate-400">
                  Are you sure you want to deactivate{" "}
                  <span className="font-semibold text-slate-200">
                    "{deleteModal.planTitle}"
                  </span>
                  ?
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 border-t border-slate-800 pt-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() =>
                  setDeleteModal(prev => ({ ...prev, isOpen: false }))
                }
                className="rounded-xl px-4 py-2 text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDeletePlan}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>

    {/* HEADER */}
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

      <div>
        <h2 className="font-display text-2xl font-bold text-brand-navy">
          Travel Plans
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Manage all tour packages
        </p>
      </div>

      <button
        onClick={toggleAddForm}
        className="btn-primary h-11 px-5 text-sm font-medium rounded-xl w-fit min-w-[140px] self-start"
      >
        {showForm ? 'Cancel' : '+ Add Plan'}
      </button>
    </div>

    {/* FORM */}
    {showForm && (
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white p-4 sm:p-6 shadow-card"
      >
        <h3 className="mb-5 font-display text-lg font-semibold text-brand-navy">
          {editingId ? 'Edit Plan Details' : 'Create New Plan'}
        </h3>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >

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
            <div key={k} className="min-w-0">
              <label className="mb-1.5 block text-xs font-medium text-gray-600">
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

          {/* IMAGE */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-xs font-medium text-gray-600">
              Package Cover Image *
            </label>

            <div className="grid grid-cols-1 gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-3 sm:p-4 lg:grid-cols-3">

              <div className="lg:col-span-2">
                <label className="group flex h-40 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-white px-4 text-center transition hover:border-brand-blue/60">

                  <div className="mb-2 rounded-xl bg-gray-100 p-2 text-gray-500 transition group-hover:bg-brand-blue/10 group-hover:text-brand-blue">
                    <UploadCloud className="h-5 w-5" />
                  </div>

                  <span className="text-sm font-medium text-gray-700 transition group-hover:text-brand-blue">
                    {uploadingImage
                      ? "Processing media..."
                      : "Click to upload image"}
                  </span>

                  <span className="mt-1 text-[11px] text-gray-400">
                    PNG, JPG or WEBP
                  </span>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    required={!form.coverImage}
                  />
                </label>
              </div>

              <div className="flex h-40 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                {form.coverImage ? (
                  <img
                    src={form.coverImage}
                    alt="preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-gray-400">
                    <ImageIcon className="h-5 w-5" />
                    <span className="text-xs">Preview</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="md:col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-gray-600">
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

          <div className="md:col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-gray-600">
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

          {/* BUTTONS */}
          <div className="md:col-span-2 flex flex-col gap-3 pt-2 sm:flex-row">

            <button
              type="submit"
              disabled={saving || uploadingImage}
              className="btn-primary rounded-xl px-5 py-2.5 text-sm disabled:opacity-60 w-full sm:w-auto"
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
              className="btn-secondary rounded-xl px-5 py-2.5 text-sm w-full sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    )}

    {/* SEARCH */}
    <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
      <Search className="h-4 w-4 shrink-0 text-gray-400" />

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search plans..."
        className="min-w-0 flex-1 bg-transparent text-sm outline-none"
      />
    </div>

    {/* TABLE */}
    <div className="overflow-hidden rounded-2xl bg-white shadow-card">

      {/* MOBILE CARDS */}
      <div className="block md:hidden space-y-3 p-3">
        {plans.map((plan) => {
          const currentPrice =
            typeof plan.price === 'object' && plan.price !== null
              ? plan.price.amount
              : plan.price;

          return (
            <div
              key={plan._id}
              className="rounded-2xl border border-gray-100 p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-brand-navy">
                    {plan.title}
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    {plan.destination}
                  </p>
                </div>

                <span
                  className={`badge text-xs ${
                    plan.isActive
                      ? 'bg-green-50 text-green-600'
                      : 'bg-red-50 text-red-500'
                  }`}
                >
                  {plan.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Price</p>

                  <p className="font-semibold text-brand-navy">
                    {formatPrice(plan.discountedPrice ?? currentPrice)}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {Number(plan.rating || 0).toFixed(1)}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">

                <Link
                  href={`/plan/${plan.slug}`}
                  target="_blank"
                  className="flex-1 rounded-xl border border-gray-200 py-2 text-center text-sm text-gray-600 transition hover:bg-gray-50"
                >
                  View
                </Link>

                <button
                  type="button"
                  onClick={() => startEdit(plan)}
                  className="rounded-xl border border-gray-200 p-2.5 text-gray-600 transition hover:bg-gray-50"
                >
                  <Edit className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setDeleteModal({
                      isOpen: true,
                      planSlug: plan.slug,
                      planTitle: plan.title
                    })
                  }
                  className="rounded-xl border border-red-100 p-2.5 text-red-500 transition hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">

          <thead className="border-b border-gray-200 bg-gray-50">
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
                  className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium uppercase text-gray-500"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {plans.map((plan) => {
              const currentPrice =
                typeof plan.price === 'object' && plan.price !== null
                  ? plan.price.amount
                  : plan.price;

              return (
                <tr
                  key={plan._id}
                  className="border-b border-gray-50 hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    <div className="max-w-52 truncate font-medium text-brand-navy">
                      {plan.title}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-xs text-gray-600">
                    {plan.destination}
                  </td>

                  <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-600">
                    {getDurationLabel(
                      plan.duration?.days || 0,
                      plan.duration?.nights || 0
                    )}
                  </td>

                  <td className="whitespace-nowrap px-4 py-3">
                    <p className="font-semibold text-brand-navy">
                      {formatPrice(plan.discountedPrice ?? currentPrice)}
                    </p>
                  </td>

                  <td className="px-4 py-3">
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

                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-xs">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      {Number(plan.rating || 0).toFixed(1)}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">

                      <Link
                        href={`/plan/${plan.slug}`}
                        target="_blank"
                        className="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-brand-blue"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => startEdit(plan)}
                        className="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-brand-blue"
                      >
                        <Edit className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setDeleteModal({
                            isOpen: true,
                            planSlug: plan.slug,
                            planTitle: plan.title
                          })
                        }
                        className="rounded-lg p-1.5 text-gray-500 transition hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {!loading && plans.length === 0 && (
        <p className="py-10 text-center text-gray-400">
          No plans found
        </p>
      )}
    </div>
  </div>
);

}
