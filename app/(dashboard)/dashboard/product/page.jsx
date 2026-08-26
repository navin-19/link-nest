'use client';

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useUser } from '@/hooks/useUser';
import { useProducts } from '@/hooks/useProducts';
import { useLinks } from '@/hooks/useLinks';
import AddProductForm from '@/components/products/AddProductForm';
import ProductEditorItem from '@/components/products/ProductEditorItem';
import GoogleReviewsConfig from '@/components/products/GoogleReviewsConfig';
import LivePreview from '@/components/dashboard/LivePreview';
import { Package, Star, Sparkles, AlertCircle, ShoppingBag } from 'lucide-react';

const TABS = [
  { id: 'products', label: 'Products & Store', icon: Package },
  { id: 'reviews',  label: 'Google Reviews',   icon: Star },
];

export default function ProductDashboardPage() {
  const { user, profile, loading: userLoading } = useUser();
  const { links } = useLinks(user?.id);
  const {
    products,
    loading: productsLoading,
    error: productsError,
    addProduct,
    updateProduct,
    deleteProduct,
    reorderProducts,
  } = useProducts(user?.id);

  const [activeTab, setActiveTab] = useState('products');
  const [localProfileEdits, setLocalProfileEdits] = useState({});

  const effectiveProfile = {
    ...(profile || {}),
    ...localProfileEdits,
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = products.findIndex((item) => item.id === active.id);
    const newIndex = products.findIndex((item) => item.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const reordered = arrayMove(products, oldIndex, newIndex);
      reorderProducts(reordered);
    }
  }

  function handleLocalProfileChange(updates) {
    setLocalProfileEdits((prev) => ({ ...prev, ...updates }));
  }

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-slate-900">
      {/* Left Column: Product & Reviews Management */}
      <div className="lg:col-span-7 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Products & Reviews</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Showcase products or services and display Google customer ratings on your page.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-100/90 border border-slate-200/90 rounded-2xl shadow-2xs">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-btn'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                }`}
              >
                <Icon size={15} className={isActive ? 'text-white' : 'text-slate-500'} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── TAB 1: Products Management ──────────────────────────────────── */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Error banner if any */}
            {productsError && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{productsError}</span>
              </div>
            )}

            {/* Add Product Form */}
            <AddProductForm userId={user?.id} onAdd={addProduct} />

            {/* Products DnD List */}
            <div className="space-y-3 min-h-[160px]">
              {userLoading || (productsLoading && products.length === 0) ? (
                <div className="p-12 text-center border border-slate-200 rounded-3xl bg-white shadow-soft flex flex-col items-center justify-center gap-3">
                  <div className="w-7 h-7 rounded-full border-2 border-slate-900 border-t-transparent animate-spin" />
                  <span className="text-xs font-medium text-slate-500">Loading your products...</span>
                </div>
              ) : products.length === 0 ? (
                <div className="p-10 text-center border border-dashed border-slate-300 rounded-3xl bg-white shadow-soft space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 mx-auto flex items-center justify-center shadow-xs">
                    <ShoppingBag size={22} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">No products added yet</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Click &ldquo;Add New Product&rdquo; above to showcase your first product or service!
                    </p>
                  </div>
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={products.map((p) => p.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-3">
                      {products.map((product) => (
                        <ProductEditorItem
                          key={product.id}
                          product={product}
                          onUpdate={updateProduct}
                          onDelete={deleteProduct}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </div>
          </div>
        )}

        {/* ── TAB 2: Google Reviews Configuration ─────────────────────────── */}
        {activeTab === 'reviews' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <GoogleReviewsConfig
              profile={effectiveProfile}
              onLocalProfileChange={handleLocalProfileChange}
            />
          </div>
        )}
      </div>

      {/* Right Column: Live Phone Mockup Preview */}
      <div className="lg:col-span-5 sticky top-0 hidden lg:block self-start">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-card">
          <LivePreview
            profile={effectiveProfile}
            links={links}
            products={products}
            theme={profile?.themes}
          />
        </div>
      </div>
    </div>
  );
}
