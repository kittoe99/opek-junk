import React, { useMemo, useState } from 'react';
import { Check, Minus, Plus, Search, X } from 'lucide-react';
import {
  ITEM_CATALOG,
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
  /** Kept for API compatibility; the empty state is now built in. */
  emptyIcon?: React.ComponentType<{ className?: string }>;
  emptyMessage?: string;
  /** Kept for API compatibility (the catalog is no longer a modal). */
  catalogModalTitle?: string;
  hideHeader?: boolean;
}

const SELECTED_TAB = '__selected__';

/** Inline item catalog: pinned search + category chips over a tappable item grid. */
export const JunkItemCatalogSelector: React.FC<JunkItemCatalogSelectorProps> = ({
  selectedItems,
  onSelectedItemsChange,
  title = 'What are we picking up?',
  subtitle = 'Tap everything that needs to go. Adjust quantities as you go.',
  hideHeader = false,
}) => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState(POPULAR_ITEMS_CATEGORY_LABEL);
  const [customItemInput, setCustomItemInput] = useState('');

  const picked = selectedItems.filter((i) => i.quantity > 0);
  const totalSelectedCount = picked.reduce((sum, i) => sum + i.quantity, 0);

  const getSelectedItem = (name: string) =>
    selectedItems.find((i) => i.name.toLowerCase() === name.toLowerCase());

  const addItem = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const existing = getSelectedItem(trimmed);
    if (existing) {
      onSelectedItemsChange(
        selectedItems.map((i) => (i.id === existing.id ? { ...i, quantity: i.quantity + 1 } : i)),
      );
      return;
    }
    onSelectedItemsChange([
      ...selectedItems,
      { id: `cat-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, name: trimmed, quantity: 1 },
    ]);
  };

  const updateQuantity = (id: string, delta: number) => {
    onSelectedItemsChange(
      selectedItems
        .map((item) => (item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item))
        .filter((item) => item.quantity > 0),
    );
  };

  const addCustomFromInput = () => {
    addItem(customItemInput);
    setCustomItemInput('');
  };

  const query = search.trim().toLowerCase();
  const allItems = useMemo(() => {
    const seen = new Set<string>();
    return ITEM_CATALOG.flatMap((cat) => cat.items).filter((item) => {
      const key = item.name.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, []);

  const visibleItems: { name: string; image: string }[] = query
    ? allItems.filter((item) => item.name.toLowerCase().includes(query))
    : activeTab === SELECTED_TAB
      ? picked.map((i) => ({ name: i.name, image: getCatalogItemImage(i.name) }))
      : ITEM_CATALOG.find((cat) => cat.label === activeTab)?.items ?? [];

  const heading = query ? `Results for “${search.trim()}”` : activeTab === SELECTED_TAB ? 'Your items' : activeTab;

  const countInCategory = (items: { name: string }[]) =>
    picked
      .filter((p) => items.some((ci) => ci.name.toLowerCase() === p.name.toLowerCase()))
      .reduce((sum, p) => sum + p.quantity, 0);

  const renderCard = (item: { name: string; image: string }) => {
    const selectedItem = getSelectedItem(item.name);
    const quantity = selectedItem?.quantity ?? 0;
    const selected = quantity > 0;
    return (
      <li key={item.name} className={`cat-card ${selected ? 'is-selected' : ''}`}>
        <button
          type="button"
          className="cat-card-hit"
          onClick={() => addItem(item.name)}
          aria-label={selected ? `Add another ${item.name} (${quantity} selected)` : `Add ${item.name}`}
        >
          <span className="cat-card-icon">
            <ItemIconRenderer imagePath={item.image} size={44} className="w-11 h-11" />
          </span>
          <span className="cat-card-name">{item.name}</span>
          {selected ? (
            <span className="cat-card-badge" aria-hidden>{quantity}</span>
          ) : (
            <span className="cat-card-add" aria-hidden><Plus size={14} strokeWidth={3} /></span>
          )}
        </button>
        {selected && selectedItem && (
          <div className="cat-stepper">
            <button type="button" onClick={() => updateQuantity(selectedItem.id, -1)} aria-label={`Remove one ${item.name}`}>
              <Minus size={15} strokeWidth={2.75} />
            </button>
            <span className="tabular-nums" aria-live="polite">{quantity}</span>
            <button type="button" onClick={() => updateQuantity(selectedItem.id, 1)} aria-label={`Add one ${item.name}`}>
              <Plus size={15} strokeWidth={2.75} />
            </button>
          </div>
        )}
      </li>
    );
  };

  return (
    <div className="cat">
      {!hideHeader && <FlowStepTitle title={title} subtitle={subtitle} />}

      {/* Pinned search + categories */}
      <div className="cat-toolbar">
        <div className="cat-search">
          <Search size={18} className="cat-search-icon" aria-hidden />
          <label htmlFor="cat-search" className="sr-only">Search items</label>
          <input
            id="cat-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items, e.g. couch"
            enterKeyHint="search"
            autoComplete="off"
          />
          {search && (
            <button type="button" className="cat-search-clear" onClick={() => setSearch('')} aria-label="Clear search">
              <X size={16} strokeWidth={2.5} />
            </button>
          )}
        </div>

        <div className="cat-chips" role="tablist" aria-label="Item categories">
          {totalSelectedCount > 0 && (
            <button
              type="button"
              role="tab"
              aria-selected={!query && activeTab === SELECTED_TAB}
              onClick={() => { setActiveTab(SELECTED_TAB); setSearch(''); }}
              className="cat-chip cat-chip-selected"
            >
              <Check size={14} strokeWidth={3} aria-hidden />
              Selected
              <span className="cat-chip-count">{totalSelectedCount}</span>
            </button>
          )}
          {ITEM_CATALOG.map((cat) => {
            const count = countInCategory(cat.items);
            return (
              <button
                key={cat.label}
                type="button"
                role="tab"
                aria-selected={!query && activeTab === cat.label}
                onClick={() => { setActiveTab(cat.label); setSearch(''); }}
                className="cat-chip"
              >
                <span className="cat-chip-icon" aria-hidden>{cat.icon}</span>
                {cat.label === POPULAR_ITEMS_CATEGORY_LABEL ? 'Popular' : cat.label}
                {count > 0 && <span className="cat-chip-count">{count}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Items */}
      <div className="cat-section-head">
        <h2 className="cat-section-title">{heading}</h2>
        <span className="cat-section-count">{visibleItems.length} item{visibleItems.length === 1 ? '' : 's'}</span>
      </div>

      {visibleItems.length > 0 ? (
        <ul className="cat-grid">{visibleItems.map(renderCard)}</ul>
      ) : (
        <div className="cat-empty">
          {query ? (
            <>
              <p className="font-bold text-[var(--text)]">No match for “{search.trim()}”</p>
              <p className="mt-1 text-sm text-[var(--text-muted)]">Add it as a custom item and we’ll price it for you.</p>
              <button
                type="button"
                className="flow-btn flow-btn-primary mt-4"
                onClick={() => { addItem(search); setSearch(''); setActiveTab(SELECTED_TAB); }}
              >
                <Plus size={18} aria-hidden />
                Add “{search.trim()}”
              </button>
            </>
          ) : (
            <p className="text-sm text-[var(--text-muted)]">Nothing selected yet. Tap items in any category to add them.</p>
          )}
        </div>
      )}

      {/* Custom item */}
      <div className="cat-custom">
        <label htmlFor="cat-custom" className="flow-section-label !mb-2 block">Don’t see your item?</label>
        <div className="flex gap-2">
          <input
            id="cat-custom"
            type="text"
            value={customItemInput}
            onChange={(e) => setCustomItemInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCustomFromInput();
              }
            }}
            placeholder="Type the item name"
            className="flow-input min-w-0 flex-1 px-4"
          />
          <button
            type="button"
            onClick={addCustomFromInput}
            disabled={!customItemInput.trim()}
            className="flow-btn flow-btn-back shrink-0"
          >
            <Plus size={16} aria-hidden />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};
