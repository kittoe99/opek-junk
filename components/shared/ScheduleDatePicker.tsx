import React, { useMemo, useState } from 'react';
import { CalendarCheck, Check, ChevronLeft, ChevronRight, Sun, Sunrise, Sunset } from 'lucide-react';

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

const SLOT_ICONS: Record<TimeSlot, typeof Sun> = { morning: Sunrise, midday: Sun, evening: Sunset };

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

  // Skip weeks that are entirely in the past so the month opens on bookable days.
  const weeks = useMemo(() => {
    const rows: typeof calendarDays[] = [];
    for (let i = 0; i < calendarDays.length; i += 7) rows.push(calendarDays.slice(i, i + 7));
    return rows.filter((row) => row.some(({ date: d }) => d && startOfDay(d) >= minSelectable));
  }, [calendarDays, minSelectable]);

  const pickedLabel = selectedDate
    ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    : '';
  const pickedSlot = TIME_SLOT_OPTIONS.find((o) => o.id === timeSlot);

  return (
    <div className="qcal">
      <div className="qcal-card">
        <div className="qcal-head">
          <button
            type="button"
            onClick={() => setViewMonth((m) => addMonths(m, -1))}
            disabled={!canGoPrev}
            className="qcal-nav"
            aria-label="Previous month"
          >
            <ChevronLeft size={20} aria-hidden />
          </button>
          <p className="qcal-month" aria-live="polite">{monthLabel}</p>
          <button
            type="button"
            onClick={() => setViewMonth((m) => addMonths(m, 1))}
            className="qcal-nav"
            aria-label="Next month"
          >
            <ChevronRight size={20} aria-hidden />
          </button>
        </div>

        <div className="qcal-grid" role="group" aria-label={`Dates in ${monthLabel}`}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
            <span key={i} className="qcal-dow" aria-hidden="true">{day}</span>
          ))}
          {weeks.flat().map(({ date: cellDate, key }) => {
            if (!cellDate) return <span key={key} aria-hidden="true" />;
            const disabled = startOfDay(cellDate) < minSelectable;
            const isSelected = selectedDate ? isSameDay(cellDate, selectedDate) : false;
            const isToday = isSameDay(cellDate, today);
            return (
              <button
                key={key}
                type="button"
                disabled={disabled}
                aria-pressed={isSelected}
                aria-label={cellDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                onClick={() => onDateChange(toISODate(cellDate))}
                className={`qcal-day${isSelected ? ' is-selected' : ''}${isToday ? ' is-today' : ''}`}
              >
                {cellDate.getDate()}
              </button>
            );
          })}
        </div>
      </div>

      <div className="qslots" role="radiogroup" aria-label="Arrival window">
        <p className="qslots-title">Arrival window</p>
        {TIME_SLOT_OPTIONS.map(({ id, label, range }) => {
          const selected = timeSlot === id;
          const Icon = SLOT_ICONS[id];
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onTimeSlotChange(id)}
              className={`qslot${selected ? ' is-selected' : ''}`}
            >
              <span className="qslot-icon"><Icon size={20} aria-hidden /></span>
              <span className="qslot-text">
                <span className="qslot-label">{label}</span>
                <span className="qslot-range">{range}</span>
              </span>
              <span className="qslot-check" aria-hidden="true">{selected && <Check size={14} strokeWidth={3} />}</span>
            </button>
          );
        })}
      </div>

      <p className={`qcal-picked${selectedDate ? '' : ' is-empty'}`} aria-live="polite">
        <CalendarCheck size={18} aria-hidden />
        {selectedDate
          ? <span><strong>{pickedLabel}</strong>{pickedSlot ? ` · ${pickedSlot.label}, ${pickedSlot.range}` : ' · choose an arrival window'}</span>
          : <span>Pick a day, then an arrival window</span>}
      </p>
    </div>
  );
};
