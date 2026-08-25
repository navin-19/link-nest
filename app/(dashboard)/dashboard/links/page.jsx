'use client';

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
import AddLinkForm from '@/components/links/AddLinkForm';
import LinkEditorItem from '@/components/links/LinkEditorItem';
import LivePreview from '@/components/dashboard/LivePreview';
import { Sparkles, AlertCircle } from 'lucide-react';

export default function LinksPage() {
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

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-slate-900">
      {/* Left Column: Link Management */}
      <div className="lg:col-span-7 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Manage Links</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Add, edit, toggle visibility, and drag to reorder your links.
          </p>
        </div>

        {/* Error Alert if any */}
        {linksError && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{linksError}</span>
          </div>
        )}

        {/* Add Link Form */}
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
                <p className="text-xs text-slate-500 mt-1">Click &ldquo;Add New Link&rdquo; above to create your first link!</p>
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

      {/* Right Column: Live Phone Mockup Preview */}
      <div className="lg:col-span-5 sticky top-24 hidden lg:block">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-card">
          <LivePreview
            profile={profile}
            links={links}
            theme={profile?.themes}
          />
        </div>
      </div>
    </div>
  );
}
