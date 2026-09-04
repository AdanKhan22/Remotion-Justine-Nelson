import React, {useMemo} from 'react';
import {ComposableMap, Geographies, Geography} from 'react-simple-maps';
import {BRAND_COLORS, US_TOPO_JSON} from '../constants/mapConfig';

interface USMapRigProps {
  width: number;
  height: number;
  scale: number;
  currentZoom: number;
  currentTx: number;
  currentTy: number;
  transformOrigin: string;
  highlightedState?: string | null;
  highlightProgress?: number;
  children?: React.ReactNode;
}

export const USMapRig: React.FC<USMapRigProps> = ({
  width,
  height,
  scale,
  currentZoom,
  currentTx,
  currentTy,
  transformOrigin,
  highlightedState,
  highlightProgress = 0,
  children,
}) => {
  const mapScale = useMemo(() => {
    return Math.min(width * 1.15, height * 1.95);
  }, [width, height]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        transform: `translate(${currentTx}px, ${currentTy}px) scale(${currentZoom})`,
        transformOrigin,
        filter: `drop-shadow(0px ${10 * scale}px ${32 * scale}px rgba(35, 64, 111, 0.12))`,
      }}
    >
      <ComposableMap
        projection="geoAlbersUsa"
        projectionConfig={{scale: mapScale}}
        width={width}
        height={height}
        style={{width: '100%', height: '100%'}}
      >
        <Geographies geography={US_TOPO_JSON}>
          {({geographies}) =>
            geographies.map((geo) => {
              const stateName = geo.properties.name;
              const isTargetState = stateName === highlightedState;

              const stateFill = isTargetState
                ? highlightProgress > 0.01
                  ? BRAND_COLORS.iceBlue
                  : BRAND_COLORS.stateDefault
                : BRAND_COLORS.stateDefault;

              const stateStroke = isTargetState
                ? BRAND_COLORS.deepNavy
                : BRAND_COLORS.stateBorder;

              const strokeWidth = isTargetState
                ? (1.4 + 1.4 * highlightProgress) * scale
                : 1.4 * scale;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={stateFill}
                  stroke={stateStroke}
                  strokeWidth={strokeWidth}
                  style={{
                    default: {
                      outline: 'none',
                      filter:
                        isTargetState && highlightProgress > 0.5
                          ? `drop-shadow(0px ${4 * scale}px ${16 * scale}px rgba(35, 64, 111, 0.35))`
                          : 'none',
                    },
                    hover: {outline: 'none'},
                    pressed: {outline: 'none'},
                  }}
                />
              );
            })
          }
        </Geographies>
        {children}
      </ComposableMap>
    </div>
  );
};