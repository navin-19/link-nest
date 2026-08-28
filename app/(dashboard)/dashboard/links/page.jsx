'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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
import { useLinks } from '@/hooks/useLinks';
import { useProducts } from '@/hooks/useProducts';
import AddLinkForm from '@/components/links/AddLinkForm';
import LinkEditorItem from '@/components/links/LinkEditorItem';
import SocialLinksEditor from '@/components/links/SocialLinksEditor';
import ProductsTab from '@/components/links/ProductsTab';
import LivePreview from '@/components/dashboard/LivePreview';
import { Link2, Share2, Package, Sparkles, AlertCircle } from 'lucide-react';

// ── 3 Main Tabs: Links Management, Social Links, Products ────────────────────
const TABS = [
  { id: 'links',    label: 'Links Management', icon: Link2   },
  { id: 'social',   label: 'Social Links',     icon: Share2  },
  { id: 'products', label: 'Products',         icon: Package },
];

function LinksContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabQuery = searchParams.get('tab');

  const { user, profile, loading: userLoading } = useUser();
  const {
    links,
    loading: linksLoading,
    error: linksError,
    addLink,
    updateLink,
    deleteLink,
    reorderLinks,
  } = useLinks(user?.id);

  const {
    products,
    loading: productsLoading,
    error: productsError,
    addProduct,
    updateProduct,
    deleteProduct,
    reorderProducts,
  } = useProducts(user?.id);

  // Tab State initialized from query param if valid, or default to 'links'
  const initialTab = TABS.some((t) => t.id === tabQuery) ? tabQuery : 'links';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [localProfileEdits, setLocalProfileEdits] = useState({});

  useEffect(() => {
    if (tabQuery && TABS.some((t) => t.id === tabQuery)) {
      setActiveTab(tabQuery);
    }
  }, [tabQuery]);

  function handleTabChange(tabId) {
    setActiveTab(tabId);
    router.replace(`/dashboard/links?tab=${tabId}`, { scroll: false });
  }

  // Combined profile for real-time live preview responsiveness
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

    const oldIndex = links.findIndex((item) => item.id === active.id);
    const newIndex = links.findIndex((item) => item.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const reordered = arrayMove(links, oldIndex, newIndex);
      reorderLinks(reordered);
    }
  }

  function handleLocalProfileChange(updates) {
    setLocalProfileEdits((prev) => ({ ...prev, ...updates }));
  }

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-slate-900">
      {/* Left Column: Link / Social / Products Editor */}
      <div className="lg:col-span-7 space-y-6">
        {/* Page Title & Description */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Link & Content Editor</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage your custom links, social platforms, and digital products in one place.
          </p>
        </div>

        {/* 3-Tab Navigation Bar */}
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-100/90 border border-slate-200/90 rounded-2xl shadow-2xs">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
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

        {/* ── TAB 1: Links Management ────────────────────────────────────────── */}
        {activeTab === 'links' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Link2 size={18} className="text-indigo-600" /> Links Management
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Add, edit, toggle visibility, and drag to reorder your profile links.
                  </p>
                </div>
              </div>

              {/* Error Alert if any */}
              {linksError && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{linksError}</span>
                </div>
              )}

              {/* Add Link Form with Quick-Add Social Bar */}
              <AddLinkForm onAdd={addLink} />

              {/* Links List with DnD */}
              <div className="space-y-3 min-h-[160px]">
                {userLoading || (linksLoading && links.length === 0) ? (
                  <div className="p-12 text-center border border-slate-200 rounded-3xl bg-white shadow-soft flex flex-col items-center justify-center gap-3">
                    <div className="w-7 h-7 rounded-full border-2 border-slate-900 border-t-transparent animate-spin" />
                    <span className="text-xs font-medium text-slate-500">Loading your links...</span>
                  </div>
                ) : links.length === 0 ? (
                  <div className="p-10 text-center border border-dashed border-slate-300 rounded-3xl bg-white shadow-soft space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 mx-auto flex items-center justify-center shadow-xs">
                      <Sparkles size={22} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">You don&apos;t have any links yet</p>
                      <p className="text-xs text-slate-500 mt-1">Click &ldquo;Add Custom Link&rdquo; or pick a quick-add social button above to create your first link!</p>
                    </div>
                  </div>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={links.map((l) => l.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-3">
                        {links.map((link) => (
                          <LinkEditorItem
                            key={link.id}
                            link={link}
                            onUpdate={updateLink}
                            onDelete={deleteLink}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: Social Links ────────────────────────────────────────────── */}
        {activeTab === 'social' && (
          <SocialLinksEditor
            profile={effectiveProfile}
            onLocalProfileChange={handleLocalProfileChange}
          />
        )}

        {/* ── TAB 3: Products ────────────────────────────────────────────────── */}
        {activeTab === 'products' && (
          <ProductsTab
            userId={user?.id}
            profile={effectiveProfile}
            onLocalProfileChange={handleLocalProfileChange}
            products={products}
            loading={productsLoading}
            error={productsError}
            userLoading={userLoading}
            onAdd={addProduct}
            onUpdate={updateProduct}
            onDelete={deleteProduct}
            onReorder={reorderProducts}
          />
        )}
      </div>

      {/* Right Column: Live Phone Mockup Preview (Fixed / Sticky in viewport) */}
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

export default function LinksPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 rounded-full border-2 border-slate-900 border-t-transparent animate-spin" />
        </div>
      }
    >
      <LinksContent />
    </Suspense>
  );
}
