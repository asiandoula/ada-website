'use client';

import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';

const geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

const markers = [
  { name: 'Los Angeles', count: '60+', coordinates: [-118.2437, 34.0522] as [number, number], size: 18, labelSide: 'right' as const },
  { name: 'Bay Area', count: '40+', coordinates: [-122.4194, 37.7749] as [number, number], size: 14, labelSide: 'right' as const },
  { name: 'San Diego', count: '30+', coordinates: [-117.1611, 32.7157] as [number, number], size: 12, labelSide: 'right' as const },
  { name: 'Seattle', count: '15+', coordinates: [-122.3321, 47.6062] as [number, number], size: 10, labelSide: 'right' as const },
  { name: 'New York', count: '10+', coordinates: [-74.006, 40.7128] as [number, number], size: 8, labelSide: 'left' as const },
];

// California FIPS code for highlighting
const CALIFORNIA_FIPS = '06';

export function CommunityMap() {
  return (
    <div className="w-full max-w-lg mx-auto">
      <ComposableMap
        projection="geoAlbersUsa"
        width={500}
        height={320}
        style={{ width: '100%', height: 'auto' }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const isCalifornia = geo.id === CALIFORNIA_FIPS;
              return (
                <Geography
                  key={geo.rpiKey || geo.id}
                  geography={geo}
                  fill={isCalifornia ? 'rgba(96, 96, 144, 0.12)' : 'rgba(96, 96, 144, 0.04)'}
                  stroke="rgba(96, 96, 144, 0.1)"
                  strokeWidth={0.5}
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

        {markers.map((marker) => {
          const isLeft = marker.labelSide === 'left';
          const xOffset = isLeft ? -(marker.size + 6) : marker.size + 6;
          const anchor = isLeft ? 'end' : 'start';

          return (
            <Marker key={marker.name} coordinates={marker.coordinates}>
              {/* Outer glow */}
              <circle r={marker.size} fill="rgba(96, 96, 144, 0.15)" />
              {/* Inner dot */}
              <circle r={marker.size * 0.4} fill="#606090" />
              {/* City name label */}
              <text
                textAnchor={anchor}
                x={xOffset}
                y={-4}
                style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '11px',
                  fontWeight: 600,
                  fill: '#606090',
                }}
              >
                {marker.name}
              </text>
              {/* Doula count sub-label */}
              <text
                textAnchor={anchor}
                x={xOffset}
                y={9}
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
