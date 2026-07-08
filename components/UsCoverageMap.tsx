import React, { useEffect, useId, useMemo, useState } from 'react';
import { CoverageCity, coverageCities } from '../lib/coverageCities';

const MAP_VIEWBOX = '0 0 959 593';

interface StatePath {
  id: string;
  name: string;
  d: string;
}

interface UsCoverageMapProps {
  selectedCitySlug?: string | null;
  hoveredCitySlug?: string | null;
  onCityHover?: (city: CoverageCity | null) => void;
  onCitySelect?: (city: CoverageCity) => void;
}

let cachedStatePaths: StatePath[] | null = null;

async function loadStatePaths(): Promise<StatePath[]> {
  if (cachedStatePaths) return cachedStatePaths;

  const response = await fetch('/us-coverage-map.svg');
  const svgText = await response.text();
  const doc = new DOMParser().parseFromString(svgText, 'image/svg+xml');
  const paths = Array.from(doc.querySelectorAll('g.state path'));

  cachedStatePaths = paths
    .map((path, index) => {
      const d = path.getAttribute('d');
      if (!d) return null;

      const title = path.querySelector('title')?.textContent?.trim();
      const className = path.getAttribute('class') ?? `state-${index}`;

      return {
        id: className,
        name: title || className.toUpperCase(),
        d,
      };
    })
    .filter((path): path is StatePath => path !== null);

  return cachedStatePaths;
}

export const UsCoverageMap: React.FC<UsCoverageMapProps> = ({
  selectedCitySlug,
  hoveredCitySlug,
  onCityHover,
  onCitySelect,
}) => {
  const tooltipId = useId();
  const [statePaths, setStatePaths] = useState<StatePath[]>([]);
  const [hoveredStateId, setHoveredStateId] = useState<string | null>(null);
  const [focusedCitySlug, setFocusedCitySlug] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadStatePaths().then((paths) => {
      if (!cancelled) setStatePaths(paths);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const activeCitySlug = hoveredCitySlug ?? focusedCitySlug ?? selectedCitySlug ?? null;
  const activeCity = useMemo(
    () => coverageCities.find((city) => city.slug === activeCitySlug) ?? null,
    [activeCitySlug],
  );

  const getStateFill = (stateId: string) => {
    if (hoveredStateId === stateId) return '#9ab392';
    if (activeCity && stateId.toLowerCase() === activeCity.state.toLowerCase()) {
      return '#a3b59b';
    }
    return '#b8c9b0';
  };

  return (
    <div className="relative w-full">
      <svg
        viewBox={MAP_VIEWBOX}
        className="w-full h-auto touch-manipulation"
        role="img"
        aria-label="Interactive map of United States service coverage. Hover or select a city pin to learn more."
      >
        <title>United States service coverage map</title>

        {statePaths.map((state) => (
          <path
            key={state.id}
            d={state.d}
            fill={getStateFill(state.id)}
            stroke="#ffffff"
            strokeWidth={1}
            className="transition-colors duration-200 cursor-default"
            onMouseEnter={() => setHoveredStateId(state.id)}
            onMouseLeave={() => setHoveredStateId(null)}
          >
            <title>{state.name}</title>
          </path>
        ))}

        {coverageCities.map((city) => {
          const isActive = activeCitySlug === city.slug;
          const isSelected = selectedCitySlug === city.slug;

          return (
            <g
              key={city.slug}
              transform={`translate(${city.x - 12}, ${city.y - 22})`}
              className="cursor-pointer"
              role="button"
              tabIndex={0}
              aria-label={`${city.name}. ${isSelected ? 'Selected.' : 'Click to select.'}`}
              aria-describedby={isActive ? tooltipId : undefined}
              onMouseEnter={() => onCityHover?.(city)}
              onMouseLeave={() => onCityHover?.(null)}
              onFocus={() => setFocusedCitySlug(city.slug)}
              onBlur={() => setFocusedCitySlug(null)}
              onClick={() => onCitySelect?.(city)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onCitySelect?.(city);
                }
              }}
            >
              <circle cx={12} cy={12} r={isActive ? 18 : 14} fill="transparent" />
              {isSelected && (
                <circle cx={12} cy={12} r={16} fill="rgba(255, 0, 110, 0.12)" />
              )}
              <g
                className={`transition-transform duration-200 ${
                  isActive ? 'text-brand scale-110' : 'text-secondary'
                }`}
                style={{ transformOrigin: '12px 12px' }}
              >
                <svg viewBox="0 0 24 24" width={24} height={24} aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"
                  />
                </svg>
              </g>
            </g>
          );
        })}
      </svg>

      {activeCity && (
        <div
          id={tooltipId}
          className="pointer-events-none absolute z-10 px-3 py-2 rounded-xl bg-secondary text-white text-xs font-semibold shadow-lg"
          style={{
            left: `${(activeCity.x / 959) * 100}%`,
            top: `${(activeCity.y / 593) * 100}%`,
            transform: 'translate(-50%, -130%)',
          }}
        >
          {activeCity.name}
        </div>
      )}

      <p className="mt-3 text-center text-xs text-secondary-400 md:hidden">
        Tap a pin to explore service in that metro
      </p>
      <p className="mt-3 text-center text-xs text-secondary-400 hidden md:block">
        Hover or click a pin to explore service in that metro
      </p>
    </div>
  );
};
