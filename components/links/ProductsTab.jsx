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
import AddProductForm from '@/components/products/AddProductForm';
import ProductEditorItem from '@/components/products/ProductEditorItem';
import { Package, ShoppingBag, AlertCircle } from 'lucide-react';

export default function ProductsTab({
  userId,
  products = [],
  loading = false,
  error = null,
  userLoading = false,
  onAdd,
  onUpdate,
  onDelete,
  onReorder,
}) {
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

    if (oldIndex !== -1 && newIndex !== -1 && onReorder) {
      const reordered = arrayMove(products, oldIndex, newIndex);
      onReorder(reordered);
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Package size={18} className="text-indigo-600" /> Products & Store
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Showcase your digital products, merch, courses, or services directly on your LinkNest.
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Add Product Form */}
        <AddProductForm userId={userId} onAdd={onAdd} />

        {/* Products List with DnD */}
        <div className="space-y-3 min-h-[160px]">
          {userLoading || (loading && products.length === 0) ? (
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
                      onUpdate={onUpdate}
                      onDelete={onDelete}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>
    </div>
  );
}
