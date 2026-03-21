'use client';

import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';

const geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

const markers = [
  { name: 'Seattle', count: '15+', coordinates: [-122.33, 47.61] as [number, number], size: 8, labelPos: 'right' as const },
  { name: 'Bay Area', count: '40+', coordinates: [-122.42, 37.77] as [number, number], size: 12, labelPos: 'right' as const },
  { name: 'Los Angeles', count: '60+', coordinates: [-118.24, 34.05] as [number, number], size: 15, labelPos: 'right' as const },
  { name: 'San Diego', count: '30+', coordinates: [-117.16, 32.72] as [number, number], size: 10, labelPos: 'left' as const },
];

const STATES: Record<string, boolean> = {
  '06': true,  // California
  '53': false, // Washington
  '41': false, // Oregon
  '32': false, // Nevada
  '04': false, // Arizona
  '16': false, // Idaho
  '49': false, // Utah
  '30': false, // Montana (fills top)
};

export function CommunityMap() {
  return (
    <div className="w-full">
      <style>{`
        @keyframes pulse-ring {
          0% { r: var(--base-r); opacity: 0.35; }
          50% { r: var(--pulse-r); opacity: 0.12; }
          100% { r: var(--base-r); opacity: 0.35; }
        }
        .marker-pulse {
          animation: pulse-ring 3s ease-in-out infinite;
        }
      `}</style>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          center: [-119.5, 41],
          scale: 1200,
        }}
        width={380}
        height={520}
        style={{ width: '100%', height: 'auto' }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies
              .filter((geo) => geo.id in STATES)
              .map((geo) => {
                const highlight = STATES[geo.id];
                return (
                  <Geography
                    key={geo.rpiKey || geo.id}
                    geography={geo}
                    fill={highlight ? 'rgba(96, 96, 144, 0.18)' : 'rgba(96, 96, 144, 0.08)'}
                    stroke="rgba(96, 96, 144, 0.25)"
                    strokeWidth={1}
                    style={{
                      default: { outline: 'none' },
                      hover: { outline: 'none' },
                      pressed: { outline: 'none' },
                    }}
                  />
                );
              })
          }
        </Geographies>

        {markers.map((marker, i) => {
          const isLeft = marker.labelPos === 'left';
          return (
            <Marker key={marker.name} coordinates={marker.coordinates}>
              {/* Animated pulse ring */}
              <circle
                className="marker-pulse"
                r={marker.size}
                fill="rgba(96, 96, 144, 0.35)"
                style={{
                  '--base-r': marker.size,
                  '--pulse-r': marker.size * 1.6,
                  animationDelay: `${i * 0.7}s`,
                } as React.CSSProperties}
              />
              {/* Solid dot */}
              <circle r={marker.size * 0.5} fill="#606090" />
              {/* Label */}
              <text
                textAnchor={isLeft ? 'end' : 'start'}
                x={isLeft ? -(marker.size + 5) : marker.size + 5}
                y={-2}
                style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '11px',
                  fontWeight: 600,
                  fill: '#6969C1',
                }}
              >
                {marker.name}
              </text>
              <text
                textAnchor={isLeft ? 'end' : 'start'}
                x={isLeft ? -(marker.size + 5) : marker.size + 5}
                y={10}
                style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '9px',
                  fontWeight: 400,
                  fill: 'rgba(96, 96, 144, 0.5)',
                }}
              >
                {marker.count} doulas
              </text>
            </Marker>
          );
        })}
      </ComposableMap>
    </div>
  );
}
