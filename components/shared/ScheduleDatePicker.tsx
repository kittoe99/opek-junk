import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export type TimeSlot = 'morning' | 'midday' | 'evening';

export const TIME_SLOT_OPTIONS: {
  id: TimeSlot;
  label: string;
  range: string;
}[] = [
  { id: 'morning', label: 'Morning', range: '8am – 12pm' },
  { id: 'midday', label: 'Mid-day', range: '12pm – 4pm' },
  { id: 'evening', label: 'Evening', range: '4pm – 7pm' },
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

  const selectedStr = selectedDate
    ? selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    : '';

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-secondary">{selectedStr || 'Select a date'}</p>
          {timeSlot && <p className="text-xs text-secondary-400 mt-0.5">{formatTimeSlotLabel(timeSlot)}</p>}
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setViewMonth((m) => addMonths(m, -1))}
            disabled={!canGoPrev}
            className="w-7 h-7 rounded-lg text-secondary hover:bg-secondary-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            aria-label="Previous month"
          >
            <ChevronLeft size={15} />
          </button>
          <button
            type="button"
            onClick={() => setViewMonth((m) => addMonths(m, 1))}
            className="w-7 h-7 rounded-lg text-secondary hover:bg-secondary-100 transition-colors flex items-center justify-center"
            aria-label="Next month"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-secondary-100 p-3">
        <p className="text-xs font-semibold text-secondary-500 text-center mb-3">{monthLabel}</p>
        <div className="grid grid-cols-7 gap-px mb-1">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
            <div key={day} className="text-[10px] font-semibold text-secondary-300 text-center py-1">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-px">
          {calendarDays.map(({ date: cellDate, key }) => {
            if (!cellDate) return <div key={key} className="aspect-square" aria-hidden="true" />;
            const disabled = startOfDay(cellDate) < minSelectable;
            const isSelected = selectedDate ? isSameDay(cellDate, selectedDate) : false;
            const isToday = isSameDay(cellDate, today);
            return (
              <button
                key={key}
                type="button"
                disabled={disabled}
                onClick={() => onDateChange(toISODate(cellDate))}
                className={`aspect-square rounded-lg text-xs font-semibold transition-colors flex items-center justify-center ${
                  disabled ? 'text-secondary-200 cursor-not-allowed' : isSelected ? 'bg-brand text-white' : 'text-secondary hover:bg-brand/10'
                } ${!disabled && !isSelected && isToday ? 'ring-1 ring-brand/40 ring-inset' : ''}`}
              >
                {cellDate.getDate()}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-secondary-100 bg-white p-3 shadow-sm">
        <p className="text-xs font-semibold text-secondary-500 mb-2">Time slot</p>
        <div className="flex gap-2">
          {TIME_SLOT_OPTIONS.map(({ id, label, range }) => {
            const selected = timeSlot === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onTimeSlotChange(id)}
                className={`flex-1 rounded-lg border py-2.5 text-center text-xs font-semibold transition-all ${
                  selected ? 'border-secondary bg-secondary text-white shadow-sm' : 'border-secondary-100 bg-[#faf9f7] text-secondary hover:border-secondary-300 hover:bg-secondary-50'
                }`}
              >
                {label}
                <span className={`block text-[10px] font-normal mt-0.5 ${selected ? 'text-white/70' : 'text-secondary-400'}`}>{range}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
