import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Sun, CloudSun, Moon, CalendarDays } from 'lucide-react';

export type TimeSlot = 'morning' | 'midday' | 'evening';

export const TIME_SLOT_OPTIONS: {
  id: TimeSlot;
  label: string;
  range: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}[] = [
  { id: 'morning', label: 'Morning', range: '8am – 12pm', icon: Sun },
  { id: 'midday', label: 'Mid-day', range: '12pm – 4pm', icon: CloudSun },
  { id: 'evening', label: 'Evening', range: '4pm – 7pm', icon: Moon },
];

export function formatTimeSlotLabel(slot: TimeSlot | ''): string {
  if (!slot) return '';
  const option = TIME_SLOT_OPTIONS.find((o) => o.id === slot);
  return option ? `${option.label} (${option.range})` : '';
}

export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseISODate(value: string): Date | null {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function addMonths(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

interface ScheduleDatePickerProps {
  date: string;
  timeSlot: TimeSlot | '';
  onDateChange: (date: string) => void;
  onTimeSlotChange: (slot: TimeSlot) => void;
  minDate?: string;
}

export const ScheduleDatePicker: React.FC<ScheduleDatePickerProps> = ({
  date,
  timeSlot,
  onDateChange,
  onTimeSlotChange,
  minDate,
}) => {
  const today = useMemo(() => startOfDay(new Date()), []);
  const minSelectable = useMemo(() => {
    const parsed = minDate ? parseISODate(minDate) : null;
    return parsed ? startOfDay(parsed) : today;
  }, [minDate, today]);

  const selectedDate = useMemo(() => parseISODate(date), [date]);
  const [viewMonth, setViewMonth] = useState(() => selectedDate ?? today);

  const monthLabel = viewMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const calendarDays = useMemo(() => {
    const year = viewMonth.getFullYear();
    const month = viewMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const startOffset = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: Array<{ date: Date | null; key: string }> = [];

    for (let i = 0; i < startOffset; i += 1) {
      cells.push({ date: null, key: `empty-start-${i}` });
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const cellDate = new Date(year, month, day);
      cells.push({ date: cellDate, key: toISODate(cellDate) });
    }

    while (cells.length % 7 !== 0) {
      cells.push({ date: null, key: `empty-end-${cells.length}` });
    }

    return cells;
  }, [viewMonth]);

  const canGoPrev = useMemo(() => {
    const prevMonthEnd = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 0);
    return startOfDay(prevMonthEnd) >= minSelectable;
  }, [viewMonth, minSelectable]);

  const selectedSummary = useMemo(() => {
    if (!selectedDate) return 'Select a date below';
    const formatted = selectedDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
    const slotLabel = timeSlot ? formatTimeSlotLabel(timeSlot) : '';
    return slotLabel ? `${formatted} · ${slotLabel}` : formatted;
  }, [selectedDate, timeSlot]);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-secondary-100 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="px-4 py-3.5 bg-gradient-to-r from-secondary-50/80 to-white border-b border-secondary-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-brand/10 border border-brand/15 flex items-center justify-center shrink-0">
              <CalendarDays size={16} className="text-brand" strokeWidth={2.5} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em]">
                Preferred Date
              </p>
              <p className="text-sm font-bold text-secondary truncate">{selectedSummary}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setViewMonth((m) => addMonths(m, -1))}
              disabled={!canGoPrev}
              className="w-8 h-8 rounded-lg border border-secondary-100 text-secondary hover:border-brand/40 hover:text-brand disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              aria-label="Previous month"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => setViewMonth((m) => addMonths(m, 1))}
              className="w-8 h-8 rounded-lg border border-secondary-100 text-secondary hover:border-brand/40 hover:text-brand transition-colors flex items-center justify-center"
              aria-label="Next month"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-center mb-4">
            <p className="text-sm font-black text-secondary tracking-wide">{monthLabel}</p>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
              <div
                key={day}
                className="text-[10px] font-black uppercase tracking-wider text-secondary-300 text-center py-1"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map(({ date: cellDate, key }) => {
              if (!cellDate) {
                return <div key={key} className="aspect-square" aria-hidden="true" />;
              }

              const disabled = startOfDay(cellDate) < minSelectable;
              const isSelected = selectedDate ? isSameDay(cellDate, selectedDate) : false;
              const isToday = isSameDay(cellDate, today);

              return (
                <button
                  key={key}
                  type="button"
                  disabled={disabled}
                  onClick={() => onDateChange(toISODate(cellDate))}
                  className={[
                    'aspect-square rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center relative',
                    disabled
                      ? 'text-secondary-200 cursor-not-allowed'
                      : isSelected
                        ? 'bg-brand text-white shadow-lg shadow-brand/25 scale-[1.02]'
                        : 'text-secondary hover:bg-brand/8 hover:text-brand',
                    !disabled && !isSelected && isToday
                      ? 'ring-2 ring-brand/30 ring-inset'
                      : '',
                  ].join(' ')}
                >
                  {cellDate.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-black text-secondary-400 uppercase tracking-[0.2em] mb-2">
          Preferred Time Slot *
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {TIME_SLOT_OPTIONS.map(({ id, label, range, icon: Icon }) => {
            const selected = timeSlot === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onTimeSlotChange(id)}
                className={[
                  'group relative rounded-xl border p-3.5 text-left transition-all duration-300',
                  selected
                    ? 'border-brand bg-brand/5 shadow-[0_4px_20px_rgba(255,0,110,0.12)]'
                    : 'border-secondary-100 bg-white hover:border-brand/40 hover:shadow-[0_4px_20px_rgba(255,0,110,0.08)]',
                ].join(' ')}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={[
                      'w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors',
                      selected
                        ? 'bg-brand text-white'
                        : 'bg-secondary-50 text-secondary-400 group-hover:bg-brand/10 group-hover:text-brand',
                    ].join(' ')}
                  >
                    <Icon size={16} strokeWidth={2.5} />
                  </div>
                  <div className="min-w-0">
                    <p
                      className={[
                        'text-sm font-black',
                        selected ? 'text-brand' : 'text-secondary',
                      ].join(' ')}
                    >
                      {label}
                    </p>
                    <p className="text-[11px] font-semibold text-secondary-400 mt-0.5">{range}</p>
                  </div>
                </div>
                {selected && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-brand" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
