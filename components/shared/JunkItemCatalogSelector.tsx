import React, { useState } from 'react';
import { Check, Plus, Minus, X, Package, Search, LayoutGrid } from 'lucide-react';
import {
  ITEM_CATALOG,
  POPULAR_ITEMS,
  POPULAR_ITEMS_CATEGORY_LABEL,
} from '../../lib/itemCatalog';
import { FlowStepTitle } from './flow/FlowStepTitle';
import { ItemIconRenderer } from '../icons/JunkItemIcons';

export interface CatalogSelectedItem {
  id: string;
  name: string;
  quantity: number;
}

export function getCatalogItemImage(itemName: string): string {
  for (const cat of ITEM_CATALOG) {
    const found = cat.items.find((i) => i.name.toLowerCase() === itemName.toLowerCase());
    if (found) return found.image;
  }
  return '/items/misc-item.svg';
}

interface JunkItemCatalogSelectorProps {
  selectedItems: CatalogSelectedItem[];
  onSelectedItemsChange: (items: CatalogSelectedItem[]) => void;
  title?: string;
  subtitle?: string;
  emptyIcon?: React.ComponentType<{ className?: string }>;
  emptyMessage?: string;
  catalogModalTitle?: string;
  hideHeader?: boolean;
}

export const JunkItemCatalogSelector: React.FC<JunkItemCatalogSelectorProps> = ({
  selectedItems,
  onSelectedItemsChange,
  title = 'What are we picking up?',
  subtitle = 'Select your items, then reveal your custom estimate.',
  emptyIcon: EmptyIcon = Package,
  emptyMessage = 'Tap items above or browse the full catalog.',
  catalogModalTitle = 'Item catalog',
  hideHeader = false,
}) => {
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState('');
  const [expandedCategory, setExpandedCategory] = useState(POPULAR_ITEMS_CATEGORY_LABEL);
  const [customItemInput, setCustomItemInput] = useState('');

  const hasSelectedItems = selectedItems.some((i) => i.quantity > 0);
  const totalSelectedCount = selectedItems.reduce((sum, i) => sum + i.quantity, 0);

  const getSelectedItem = (name: string) =>
    selectedItems.find((i) => i.name.toLowerCase() === name.toLowerCase());

  const toggleItem = (name: string) => {
    const existing = getSelectedItem(name);
    if (existing) {
      onSelectedItemsChange(selectedItems.filter((i) => i.name.toLowerCase() !== name.toLowerCase()));
      return;
    }
    onSelectedItemsChange([
      ...selectedItems,
      { id: `cat-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, name, quantity: 1 },
    ]);
  };

  const updateQuantity = (id: string, delta: number) => {
    onSelectedItemsChange(
      selectedItems
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const addCustomItem = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const existing = getSelectedItem(trimmed);
    if (existing) {
      updateQuantity(existing.id, 1);
      return;
    }
    onSelectedItemsChange([
      ...selectedItems,
      { id: `custom-${Date.now()}`, name: trimmed, quantity: 1 },
    ]);
  };

  const catalogQuery = catalogSearch.trim().toLowerCase();
  const visibleCatalogItems = catalogQuery
    ? ITEM_CATALOG.flatMap((cat) => cat.items).filter((item) =>
        item.name.toLowerCase().includes(catalogQuery)
      )
    : ITEM_CATALOG.find((cat) => cat.label === expandedCategory)?.items ?? [];

  const renderItemCard = (item: { name: string; image: string }, compact = false) => {
    const selectedItem = getSelectedItem(item.name);
    const quantity = selectedItem?.quantity ?? 0;
    const selected = quantity > 0;

    return (
      <div
        key={item.name}
        className={`group relative flex flex-col rounded-2xl border bg-[var(--surface)] transition-all duration-200 ${
          compact ? 'min-h-[128px]' : 'min-h-[148px]'
        } ${
          selected
            ? 'border-brand shadow-[0_0_0_1px_rgba(255,0,110,0.12)]'
            : 'border-[var(--border)] hover:border-white/15 hover:shadow-none'
        }`}
      >
        <button
          type="button"
          onClick={() => toggleItem(item.name)}
          className="flex flex-col items-center flex-1 w-full p-3 sm:p-3.5 text-center cursor-pointer"
          aria-pressed={selected}
        >
          <div
            className={`absolute top-2.5 right-2.5 w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
              selected
                ? 'border-brand bg-brand'
                : 'border-white/15 bg-[var(--surface)] group-hover:border-white/25'
            }`}
            aria-hidden
          >
            {selected && <Check size={12} className="text-white" strokeWidth={3} />}
          </div>

          <div
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-2.5 transition-colors ${
              selected ? 'bg-brand/[0.06]' : 'bg-white/[0.04] group-hover:bg-white/[0.06]'
            }`}
          >
            <ItemIconRenderer
              imagePath={item.image}
              size={compact ? 40 : 48}
              className={`${compact ? 'w-10 h-10' : 'w-11 h-11 sm:w-12 sm:h-12'} shrink-0`}
            />
          </div>

          <span
            className={`text-[11px] sm:text-xs font-semibold leading-snug line-clamp-2 px-0.5 ${
              selected ? 'text-[var(--text)]' : 'text-[var(--text-muted)]'
            }`}
          >
            {item.name}
          </span>
        </button>

        {selected && selectedItem ? (
          <div
            className="px-3 pb-3 flex justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white/[0.04] px-1.5 py-1">
              <button
                type="button"
                onClick={() => updateQuantity(selectedItem.id, -1)}
                className="w-6 h-6 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-brand hover:border-brand/30 transition-colors"
                aria-label={`Decrease ${item.name}`}
              >
                <Minus size={12} strokeWidth={2.5} />
              </button>
              <span className="min-w-[1.25rem] text-center text-xs font-bold text-[var(--text)] tabular-nums">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => updateQuantity(selectedItem.id, 1)}
                className="w-6 h-6 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-brand hover:border-brand/30 transition-colors"
                aria-label={`Increase ${item.name}`}
              >
                <Plus size={12} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <>
      <div className="space-y-5">
        {!hideHeader && <FlowStepTitle title={title} subtitle={subtitle} />}

        <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
          {POPULAR_ITEMS.slice(0, 6).map((item) => renderItemCard(item, true))}
        </div>

        <button
          type="button"
          onClick={() => setShowCatalogModal(true)}
          className="w-full flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3.5 text-left hover:border-white/15 hover:shadow-none transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-white/[0.04] text-[var(--text-muted)] flex items-center justify-center shrink-0">
            <LayoutGrid size={18} strokeWidth={2} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[var(--text)]">Browse full catalog</p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Search by category or item name</p>
          </div>
          <span className="text-xs font-semibold text-brand shrink-0">Open</span>
        </button>

        {hasSelectedItems ? (
          <div className="rounded-2xl border border-[var(--border)] overflow-hidden bg-[var(--surface)]">
            <div className="px-4 py-2.5 border-b border-[var(--border)] flex items-center justify-between">
              <p className="text-xs font-semibold text-[var(--text-muted)]">
                Selected · {totalSelectedCount}
              </p>
            </div>
            <ul className="divide-y divide-secondary-50">
              {selectedItems
                .filter((i) => i.quantity > 0)
                .map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-3 px-4 py-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-white/[0.04] flex items-center justify-center shrink-0">
                        <ItemIconRenderer
                          imagePath={getCatalogItemImage(item.name)}
                          className="w-5 h-5"
                        />
                      </div>
                      <p className="text-sm font-medium text-[var(--text)] truncate">{item.name}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-7 h-7 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:border-brand/30 hover:text-brand transition-colors"
                        aria-label={`Decrease ${item.name}`}
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-6 text-center text-sm font-bold text-[var(--text)] tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-7 h-7 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:border-brand/30 hover:text-brand transition-colors"
                        aria-label={`Increase ${item.name}`}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-7 text-center rounded-2xl border border-dashed border-[var(--border)] bg-white/[0.04]/40">
            <div className="w-9 h-9 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center mb-2">
              <EmptyIcon className="w-4 h-4 text-neutral-500" />
            </div>
            <p className="text-xs font-semibold text-[var(--text-muted)]">No items selected</p>
            <p className="text-[11px] text-neutral-500 mt-0.5 max-w-[220px]">{emptyMessage}</p>
          </div>
        )}
      </div>

      {showCatalogModal && (
        <div className="fixed inset-0 z-50 flex items-stretch justify-center p-0 sm:p-4 md:p-6 bg-black/70 backdrop-blur-sm">
          <div className="bg-[var(--surface)] w-full h-full sm:max-w-5xl sm:max-h-[90vh] sm:rounded-3xl sm:shadow-2xl border-0 sm:border sm:border-[var(--border)] flex flex-col overflow-hidden">
            <div className="px-4 sm:px-5 py-3.5 border-b border-[var(--border)] flex items-center justify-between shrink-0">
              <div className="min-w-0">
                <h3 className="text-base font-semibold text-[var(--text)] tracking-tight">
                  {catalogModalTitle}
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Select items to include in your estimate
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCatalogModal(false)}
                className="w-9 h-9 rounded-full border border-[var(--border)] text-[var(--text-muted)] hover:bg-white/[0.04] flex items-center justify-center transition-colors"
                aria-label="Close catalog"
              >
                <X size={18} strokeWidth={2} />
              </button>
            </div>

            <div className="px-4 sm:px-5 py-3 border-b border-[var(--border)] shrink-0">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none"
                />
                <input
                  type="text"
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  placeholder="Search items…"
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-white/[0.04] border border-[var(--border)] rounded-xl text-[var(--text)] placeholder:text-neutral-500 focus:outline-none focus:bg-[var(--surface)] focus:border-brand/40 focus:ring-2 focus:ring-brand/10 transition-all"
                />
                {catalogSearch && (
                  <button
                    type="button"
                    onClick={() => setCatalogSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center"
                    aria-label="Clear search"
                  >
                    <X size={10} strokeWidth={2.5} />
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 min-h-0 flex flex-col sm:flex-row overflow-hidden">
              <div className="w-full sm:w-52 shrink-0 flex flex-row sm:flex-col gap-1 border-b sm:border-b-0 sm:border-r border-[var(--border)] p-2.5 sm:p-3 overflow-x-auto sm:overflow-y-auto bg-white/[0.04]/30">
                {ITEM_CATALOG.map((category) => {
                  const isActive = expandedCategory === category.label && !catalogSearch.trim();
                  const selectedCount = selectedItems.filter((i) => {
                    const inCat = category.items.some(
                      (ci) => ci.name.toLowerCase() === i.name.toLowerCase()
                    );
                    return inCat && i.quantity > 0;
                  }).length;

                  return (
                    <button
                      key={category.label}
                      type="button"
                      onClick={() => {
                        setExpandedCategory(category.label);
                        setCatalogSearch('');
                      }}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-all shrink-0 sm:w-full ${
                        isActive
                          ? 'bg-[var(--surface)] text-[var(--text)] shadow-none border border-[var(--border)]'
                          : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/70 border border-transparent'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 flex items-center justify-center shrink-0 ${
                          isActive ? 'text-brand' : 'text-[var(--text-muted)]'
                        }`}
                      >
                        <span className="scale-75 origin-center">{category.icon}</span>
                      </span>
                      <span
                        className={`text-xs truncate flex-1 ${
                          isActive ? 'font-semibold' : 'font-medium'
                        }`}
                      >
                        {category.label}
                      </span>
                      {selectedCount > 0 && (
                        <span className="text-[10px] font-bold min-w-[1.25rem] h-5 px-1.5 bg-brand text-white rounded-full flex items-center justify-center shrink-0">
                          {selectedCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-[var(--text)]">
                      {catalogSearch.trim() ? 'Search results' : expandedCategory}
                    </h4>
                    <span className="text-[11px] font-medium text-[var(--text-muted)]">
                      {visibleCatalogItems.length}
                    </span>
                  </div>

                  {visibleCatalogItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center rounded-2xl border border-dashed border-[var(--border)] bg-white/[0.04]/40">
                      <Package size={20} className="text-neutral-500 mb-2" />
                      <p className="text-sm font-medium text-[var(--text-muted)]">No items found</p>
                      <p className="text-xs text-neutral-500 mt-1">
                        Try another search or add a custom item below.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3">
                      {visibleCatalogItems.map((item) => renderItemCard(item))}
                    </div>
                  )}

                  <div className="rounded-2xl border border-dashed border-[var(--border)] p-4 bg-white/[0.04]/30">
                    <p className="text-xs font-semibold text-[var(--text-muted)] mb-2.5">
                      Don&apos;t see your item?
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customItemInput}
                        onChange={(e) => setCustomItemInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addCustomItem(customItemInput);
                            setCustomItemInput('');
                          }
                        }}
                        placeholder="Type item name"
                        className="flex-1 px-3.5 py-2.5 text-sm bg-[var(--surface)] border border-[var(--border)] rounded-xl text-[var(--text)] placeholder:text-neutral-500 focus:outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/10 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          addCustomItem(customItemInput);
                          setCustomItemInput('');
                        }}
                        disabled={!customItemInput.trim()}
                        className="px-4 py-2.5 bg-brand text-white text-sm font-semibold rounded-xl hover:bg-brand-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1.5 shrink-0"
                      >
                        <Plus size={14} strokeWidth={2.5} />
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-4 sm:px-5 py-3.5 border-t border-[var(--border)] bg-[var(--surface)] flex items-center justify-between shrink-0">
              <span className="text-sm text-[var(--text-muted)]">
                <span className="font-semibold text-[var(--text)]">{totalSelectedCount}</span>
                {' '}selected
              </span>
              <button
                type="button"
                onClick={() => setShowCatalogModal(false)}
                className="px-5 py-2.5 bg-brand hover:bg-brand-600 text-white text-sm font-semibold rounded-full transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
