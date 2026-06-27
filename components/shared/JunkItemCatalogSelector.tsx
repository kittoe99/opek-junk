import React, { useState } from 'react';
import { Check, Plus, Minus, X, Package, ArrowRight } from 'lucide-react';
import { ITEM_CATALOG } from '../../lib/itemCatalog';
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

const PRIMARY_ITEMS = ITEM_CATALOG.find((c) => c.label === 'Popular Items')?.items.slice(0, 6) ?? [];

interface JunkItemCatalogSelectorProps {
  selectedItems: CatalogSelectedItem[];
  onSelectedItemsChange: (items: CatalogSelectedItem[]) => void;
  title?: string;
  subtitle?: string;
  emptyIcon?: React.ComponentType<{ className?: string }>;
  emptyMessage?: string;
  catalogModalTitle?: string;
}

export const JunkItemCatalogSelector: React.FC<JunkItemCatalogSelectorProps> = ({
  selectedItems,
  onSelectedItemsChange,
  title = 'What are we picking up?',
  subtitle = 'Select your items, then reveal your custom estimate.',
  emptyIcon: EmptyIcon = Package,
  emptyMessage = 'Please select items above or browse the full catalog.',
  catalogModalTitle = 'Junk Removal Catalog',
}) => {
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState('');
  const [expandedCategory, setExpandedCategory] = useState('Popular Items');
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
      <button
        key={item.name}
        type="button"
        className={`group relative flex flex-col items-center justify-between p-3 sm:p-4 md:p-5 rounded-2xl border transition-all duration-300 text-center cursor-pointer ${
          compact ? 'min-h-[132px] sm:min-h-[150px]' : 'min-h-[132px] sm:min-h-[172px]'
        } ${
          selected
            ? 'bg-brand/[0.03] border-brand ring-2 ring-brand/10 shadow-lg shadow-brand/5 scale-[1.02]'
            : 'bg-white border-secondary-100 hover:border-secondary-100 hover:shadow-lg hover:shadow-secondary-100/50 hover:-translate-y-1 active:translate-y-0 active:shadow-sm'
        }`}
        onClick={() => toggleItem(item.name)}
      >
        {selected && (
          <div className="absolute top-2 right-2 w-4.5 h-4.5 bg-brand text-white rounded-full flex items-center justify-center shadow-md z-10">
            <Check size={10} strokeWidth={4} />
          </div>
        )}

        <div className="flex flex-col items-center flex-1 w-full justify-center">
          <div
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-2 sm:mb-3 transition-all duration-300 ${
              selected ? 'bg-brand/10 text-brand' : 'bg-secondary-50 text-secondary-400 group-hover:bg-secondary-100 group-hover:text-secondary-500'
            }`}
          >
            <ItemIconRenderer
              imagePath={item.image}
              className="w-8 h-8 sm:w-10 sm:h-10 transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <span
            className={`text-[10px] sm:text-xs md:text-sm font-black leading-tight transition-colors px-0.5 line-clamp-2 ${
              selected ? 'text-brand' : 'text-secondary-800 group-hover:text-secondary'
            }`}
          >
            {item.name}
          </span>
        </div>

        <div className="mt-2 flex flex-col items-center shrink-0 w-full" onClick={(e) => e.stopPropagation()}>
          {selected && selectedItem ? (
            <div className="flex items-center gap-1 sm:gap-1.5 bg-white border border-secondary-100 rounded-full px-1.5 py-0.5 sm:px-2 sm:py-0.5 shadow-sm">
              <button
                type="button"
                onClick={() => updateQuantity(selectedItem.id, -1)}
                className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full bg-white flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer"
              >
                <Minus size={8} className="text-secondary-500" />
              </button>
              <span className="w-4 sm:w-5 text-center text-[10px] sm:text-xs font-black text-secondary leading-none">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => updateQuantity(selectedItem.id, 1)}
                className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full bg-white flex items-center justify-center hover:bg-brand/10 hover:text-brand transition-colors cursor-pointer"
              >
                <Plus size={8} className="text-secondary-500" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => toggleItem(item.name)}
              className="px-2 py-0.5 sm:px-3 sm:py-1 text-[8px] sm:text-[9px] font-black uppercase tracking-wider rounded-lg border border-secondary-100 text-secondary-400 group-hover:border-brand group-hover:text-brand group-hover:bg-brand/5 transition-all cursor-pointer"
            >
              + Select
            </div>
          )}
        </div>
      </button>
    );
  };

  return (
    <>
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <div className="text-center space-y-2 mb-6">
          <h2 className="text-lg font-black text-secondary uppercase tracking-wider">{title}</h2>
          <p className="text-secondary-400 text-xs">{subtitle}</p>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {PRIMARY_ITEMS.map((item) => renderItemCard(item, true))}
        </div>

        <div className="mt-2">
          <button
            type="button"
            onClick={() => setShowCatalogModal(true)}
            className="w-full flex items-center justify-between p-4 bg-white border border-dashed border-secondary-200 hover:border-brand hover:bg-brand/[0.01] rounded-2xl transition-all group shadow-sm cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary-50 text-secondary-500 group-hover:bg-brand/10 group-hover:text-brand flex items-center justify-center transition-colors">
                <Plus size={20} />
              </div>
              <div className="text-left">
                <p className="text-xs font-black uppercase tracking-wider text-secondary">Show more items</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full border border-secondary-100 group-hover:border-brand group-hover:bg-brand flex items-center justify-center transition-all shrink-0">
              <ArrowRight size={14} className="text-secondary-300 group-hover:text-white transition-all group-hover:translate-x-0.5" />
            </div>
          </button>
        </div>

        {hasSelectedItems && (
          <div className="border border-secondary-100 rounded-2xl divide-y divide-secondary-100 overflow-hidden bg-white animate-fade-in">
            <div className="bg-secondary-50/50 px-4 py-2.5 border-b border-secondary-100">
              <p className="text-[10px] font-black uppercase tracking-wider text-secondary-400">
                Selected Items ({totalSelectedCount})
              </p>
            </div>
            {selectedItems
              .filter((i) => i.quantity > 0)
              .map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 px-4 bg-white hover:bg-secondary-50/30 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-secondary-50 flex items-center justify-center shrink-0">
                      <ItemIconRenderer
                        imagePath={getCatalogItemImage(item.name)}
                        className="w-4.5 h-4.5 text-secondary-500"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-secondary truncate">{item.name}</p>
                      <p className="text-[10px] text-secondary-400">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-7 h-7 rounded-full border border-secondary-100 bg-white flex items-center justify-center hover:border-brand hover:text-brand text-secondary-500 transition-colors cursor-pointer"
                    >
                      <Minus size={11} />
                    </button>
                    <span className="w-6 text-center text-xs font-black text-secondary">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-7 h-7 rounded-full border border-secondary-100 bg-white flex items-center justify-center hover:border-brand hover:text-brand text-secondary-500 transition-colors cursor-pointer"
                    >
                      <Plus size={11} />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}

        {!hasSelectedItems && (
          <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed border-secondary-100 rounded-2xl bg-secondary-50/10">
            <div className="w-10 h-10 rounded-full bg-secondary-50 flex items-center justify-center mb-2">
              <EmptyIcon className="w-5 h-5 text-secondary-300" />
            </div>
            <p className="text-xs font-semibold text-secondary-400">No items selected</p>
            <p className="text-[10px] text-secondary-300 mt-0.5">{emptyMessage}</p>
          </div>
        )}
      </div>

      {showCatalogModal && (
        <div className="fixed inset-0 z-50 flex items-stretch justify-center p-2 sm:p-4 md:p-6 bg-secondary/70 backdrop-blur-md">
          <div className="bg-white w-full h-full max-h-full sm:max-w-5xl sm:rounded-3xl shadow-2xl border border-secondary-100 flex flex-col overflow-hidden">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-secondary-100 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
                  <Plus size={20} strokeWidth={2.5} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-black text-secondary text-sm sm:text-base uppercase tracking-wider">
                    {catalogModalTitle}
                  </h3>
                  <p className="hidden sm:block text-[10px] text-secondary-400 mt-0.5 font-bold uppercase tracking-wider">
                    Select any items to haul away
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCatalogModal(false)}
                className="w-10 h-10 rounded-full bg-secondary-50 hover:bg-brand/10 hover:text-brand text-secondary-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>

            <div className="px-4 sm:px-6 py-2.5 sm:py-3 border-b border-secondary-100 bg-secondary-50/40 shrink-0">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  placeholder="Search catalog items (e.g. Refrigerator, Sofa)..."
                  className="w-full px-4 py-2.5 sm:py-3 text-sm bg-white border border-secondary-100 rounded-2xl text-secondary placeholder:text-secondary-300 focus:outline-none focus:border-brand/40 focus:ring-3 focus:ring-brand/8 shadow-sm transition-all duration-200"
                />
                {catalogSearch && (
                  <button
                    type="button"
                    onClick={() => setCatalogSearch('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-secondary-200 hover:bg-secondary-300 flex items-center justify-center transition-colors"
                  >
                    <X size={10} className="text-secondary-600" strokeWidth={2.5} />
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 min-h-0 flex flex-col sm:flex-row overflow-hidden bg-secondary-50/20">
              <div className="w-full sm:w-[210px] md:w-[230px] shrink-0 flex flex-row sm:flex-col gap-1 border-b sm:border-b-0 sm:border-r border-secondary-100 p-3 sm:p-4 overflow-x-auto sm:overflow-y-auto bg-white">
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
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group shrink-0 w-auto sm:w-full ${
                        isActive
                          ? 'bg-brand/10 text-brand'
                          : 'hover:bg-secondary-50 text-secondary-500 hover:text-secondary'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                          isActive
                            ? 'bg-brand/20 text-brand'
                            : 'bg-secondary-100 text-secondary-400 group-hover:bg-brand/10 group-hover:text-brand'
                        }`}
                      >
                        <span className="scale-75">{category.icon}</span>
                      </div>
                      <p
                        className={`text-[10px] sm:text-[11px] leading-tight truncate ${
                          isActive ? 'font-black' : 'font-semibold'
                        }`}
                      >
                        {category.label}
                      </p>
                      {selectedCount > 0 && (
                        <span className="text-[9px] font-black px-1.5 py-0.5 bg-brand text-white rounded-full ml-auto shrink-0">
                          {selectedCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 md:p-6">
                <div className="space-y-5">
                  <div className="flex items-center gap-2">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-secondary-400">
                      {catalogSearch.trim() ? 'Search Results' : expandedCategory}
                    </h4>
                    <span className="px-2 py-0.5 rounded-full bg-white border border-secondary-100 text-secondary-400 text-[10px] font-bold">
                      {visibleCatalogItems.length}
                    </span>
                  </div>

                  {visibleCatalogItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-14 text-center border border-dashed border-secondary-100 rounded-3xl bg-white">
                      <Package size={20} className="text-secondary-300 mb-3" />
                      <p className="text-sm font-semibold text-secondary-400">No items found</p>
                      <p className="text-xs text-secondary-300 mt-1">Try another search or add a custom item below.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                      {visibleCatalogItems.map((item) => renderItemCard(item))}
                    </div>
                  )}

                  <div className="border border-dashed border-secondary-100 rounded-2xl p-4 bg-white">
                    <p className="text-[10px] font-black text-secondary-400 uppercase tracking-widest mb-3">
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
                        placeholder="Type item name and press Enter"
                        className="flex-1 px-4 py-2.5 text-sm bg-white border border-secondary-100 rounded-xl text-secondary placeholder:text-secondary-300 focus:outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/8 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          addCustomItem(customItemInput);
                          setCustomItemInput('');
                        }}
                        disabled={!customItemInput.trim()}
                        className="px-4 bg-secondary text-white text-sm font-bold rounded-xl hover:bg-brand transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0 cursor-pointer"
                      >
                        <Plus size={14} />
                        <span className="hidden sm:inline text-xs">Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-4 sm:px-6 py-4 border-t border-secondary-100 bg-white flex items-center justify-between shrink-0 shadow-[0_-8px_24px_rgba(15,23,42,0.04)]">
              <span className="text-xs font-bold text-secondary-500">
                {totalSelectedCount} item{totalSelectedCount === 1 ? '' : 's'} selected
              </span>
              <button
                type="button"
                onClick={() => setShowCatalogModal(false)}
                className="px-6 py-3 bg-secondary hover:bg-brand text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-secondary/10 hover:shadow-brand/20 cursor-pointer"
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
