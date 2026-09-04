import React, {useMemo} from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
} from 'remotion';
import {Marker} from 'react-simple-maps';
import {MapPin, MessageSquare} from 'lucide-react';
import {
  BRAND_COLORS,
  LOCATIONS,
  brandSerifFont,
} from '../../constants/mapConfig';
import {USMapRig} from '../../components/USMapRig';

/**
 * SCENE 14: THE NATIONAL OVERVIEW (180 frames @ 30fps = 6.0s)
 * - Zero-jump camera pull-back from Chicago (1.75x) -> Full US (1.0x)
 * - All 16 pins drop in a cascading wave across the country
 * - Clean, mobile-friendly pin tags without heavy DM card boxes
 */
export const Scene14_NationalOverview: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height, fps} = useVideoConfig();

  // 4K Mobile scale multiplier (2.0 at 3840x2160)
  const scale = useMemo(() => height / 1080, [height]);

  // ---------------------------------------------------------------------------
  // 1. SEAMLESS CAMERA PULL-BACK FROM CHICAGO TO FULL US
  // ---------------------------------------------------------------------------
  // Chicago exit values from Scene 13: tx: -0.12, ty: 0.02, zoom: 1.75
  const pullBackProgress = interpolate(frame, [0, 48], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

  const currentZoom = interpolate(pullBackProgress, [0, 1], [1.75, 1.0]);
  const currentTx = interpolate(pullBackProgress, [0, 1], [-0.12 * width, 0]);
  const currentTy = interpolate(pullBackProgress, [0, 1], [0.02 * height, 0]);
  const invariantOrigin = '50% 50%';

  // ---------------------------------------------------------------------------
  // 2. ALL 16 LOCATIONS WITH SMART MICRO-OFFSETS FOR MULTI-SUBMISSION CITIES
  // ---------------------------------------------------------------------------
  const allLocations = useMemo(() => {
    return [
      {...LOCATIONS.norfolk, displayCost: '$1.3k', delay: 20, microOffsetX: 0, microOffsetY: 0},
      {...LOCATIONS.littleton, displayCost: '$1.5k', delay: 24, microOffsetX: 0, microOffsetY: 0},
      {...LOCATIONS.rockville, displayCost: '$1.7k', delay: 28, microOffsetX: 0, microOffsetY: 0},
      {...LOCATIONS.iowa, displayCost: '$2.6k', delay: 32, microOffsetX: 0, microOffsetY: 0},
      {...LOCATIONS.grandrapids, displayCost: '$2.8k', delay: 36, microOffsetX: 0, microOffsetY: 0},
      {...LOCATIONS.california_nurse, displayCost: '$2.7k', delay: 40, microOffsetX: 0, microOffsetY: 0},
      {...LOCATIONS.sandiego_host, displayCost: '$3.0k', delay: 44, microOffsetX: -0.3, microOffsetY: -0.15},
      {...LOCATIONS.losangeles_host, displayCost: '$2.0k', delay: 48, microOffsetX: -0.35, microOffsetY: 0.15},
      {...LOCATIONS.losangeles_margaret, displayCost: '$1.7k', delay: 52, microOffsetX: 0.35, microOffsetY: -0.15},
      {...LOCATIONS.sandiego_lauren, displayCost: '$2.5k', delay: 56, microOffsetX: 0.3, microOffsetY: 0.15},
      {...LOCATIONS.bayarea, displayCost: '$2.6k', delay: 60, microOffsetX: 0, microOffsetY: 0},
      {...LOCATIONS.charlottesville, displayCost: '$3.0k', delay: 64, microOffsetX: 0, microOffsetY: 0},
      {...LOCATIONS.overlandpark, displayCost: '$3.7k', delay: 68, microOffsetX: 0, microOffsetY: 0},
      {...LOCATIONS.portland, displayCost: '$4.0k', delay: 72, microOffsetX: 0, microOffsetY: 0},
      {...LOCATIONS.omaha, displayCost: '$4.7k', delay: 76, microOffsetX: 0, microOffsetY: 0},
      {...LOCATIONS.chicago, displayCost: '$6.0k', delay: 0, microOffsetX: 0, microOffsetY: 0}, // Already visible from Scene 13
    ];
  }, []);

  // UI Header Badge
  const headerSpring = spring({
    frame: frame - 40,
    fps,
    config: {damping: 15, stiffness: 100},
  });

  return (
    <AbsoluteFill style={{backgroundColor: BRAND_COLORS.canvasBg, overflow: 'hidden'}}>
      {/* SVG OVERFLOW SAFETY */}
      <style>{`
        svg, .rsm-svg {
          overflow: visible !important;
        }
      `}</style>

      {/* 2D MAP CAMERA RIG */}
      <USMapRig
        width={width}
        height={height}
        scale={scale}
        currentZoom={currentZoom}
        currentTx={currentTx}
        currentTy={currentTy}
        transformOrigin={invariantOrigin}
        highlightedState="none" // Clean full map base
        highlightProgress={0}
      >
        {allLocations.map((item) => {
          const isChicago = item.id === 'chicago';
          // Chicago was already on-screen; others drop in staggered
          const pinFrame = isChicago ? frame : frame - item.delay;

          if (pinFrame < 0) return null;

          const pinDrop = spring({
            frame: pinFrame,
            fps,
            config: {damping: 12, stiffness: 180, mass: 0.6},
          });

          // Subtle ripple pulse
          const rippleProgress = ((pinFrame + 5) % 35) / 35;
          const rippleScale = interpolate(rippleProgress, [0, 1], [0.8, 2.4]);
          const rippleOpacity = interpolate(rippleProgress, [0, 0.3, 1], [0.8, 0.4, 0]);

          const coords: [number, number] = [
            item.coords[0] + item.microOffsetX,
            item.coords[1] + item.microOffsetY,
          ];

          return (
            <Marker key={item.id} coordinates={coords}>
              <g transform={`scale(${1 / currentZoom})`}>
                {/* Pulse Ring */}
                <circle
                  r={18 * scale * rippleScale}
                  cx={0}
                  cy={0}
                  fill="none"
                  stroke={isChicago ? '#DC2626' : BRAND_COLORS.coral}
                  strokeWidth={2.5 * scale}
                  opacity={rippleOpacity}
                />

                {/* Animated Dropping Pin */}
                <g
                  transform={`translate(${-22 * scale}, ${-46 * scale}) scale(${pinDrop})`}
                  style={{transformOrigin: `${22 * scale}px ${46 * scale}px`}}
                >
                  <MapPin
                    size={44 * scale}
                    color={isChicago ? '#DC2626' : BRAND_COLORS.coral}
                    strokeWidth={2.4}
                    fill={BRAND_COLORS.white}
                  />
                </g>

                {/* Compact Price Chip (No heavy boxes) */}
                <g
                  transform={`translate(${16 * scale}, ${-36 * scale}) scale(${pinDrop})`}
                  style={{transformOrigin: '0% 50%'}}
                >
                  <rect
                    x={0}
                    y={-12 * scale}
                    width={56 * scale}
                    height={24 * scale}
                    rx={12 * scale}
                    fill={isChicago ? BRAND_COLORS.deepNavy : 'rgba(255, 255, 255, 0.94)'}
                    stroke={isChicago ? BRAND_COLORS.coral : 'rgba(35, 64, 111, 0.18)'}
                    strokeWidth={1.5 * scale}
                  />
                  <text
                    x={28 * scale}
                    y={4 * scale}
                    textAnchor="middle"
                    fill={isChicago ? BRAND_COLORS.white : BRAND_COLORS.deepNavy}
                    fontSize={12 * scale}
                    fontWeight={900}
                    fontFamily="system-ui, -apple-system, sans-serif"
                  >
                    {item.displayCost}
                  </text>
                </g>
              </g>
            </Marker>
          );
        })}
      </USMapRig>

      {/* TOP SUMMARY HUD BADGE */}
      <div
        style={{
          position: 'absolute',
          top: 48 * scale,
          left: '50%',
          transform: `translateX(-50%) translateY(${(1 - headerSpring) * -30}px)`,
          opacity: headerSpring,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 14 * scale,
          background: 'rgba(255, 255, 255, 0.98)',
          border: `${2.5 * scale}px solid rgba(35, 64, 111, 0.16)`,
          backdropFilter: 'blur(16px)',
          borderRadius: 100 * scale,
          padding: `${18 * scale}px ${44 * scale}px`,
          boxShadow: `0 ${12 * scale}px ${36 * scale}px rgba(35, 64, 111, 0.12)`,
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <MessageSquare size={28 * scale} color={BRAND_COLORS.coral} />
        <span
          style={{
            fontSize: 24 * scale,
            fontWeight: 800,
            letterSpacing: '0.06em',
            color: BRAND_COLORS.deepNavy,
          }}
        >
          16 PARENT DMs ACROSS THE NATION
        </span>
      </div>

      {/* BOTTOM CLIMAX RANGE PILL */}
      <div
        style={{
          position: 'absolute',
          bottom: 54 * scale,
          left: '50%',
          transform: `translateX(-50%) translateY(${(1 - headerSpring) * 30}px)`,
          opacity: headerSpring,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 20 * scale,
          background: 'rgba(255, 255, 255, 0.96)',
          border: `${2 * scale}px solid rgba(35, 64, 111, 0.12)`,
          backdropFilter: 'blur(16px)',
          borderRadius: 100 * scale,
          padding: `${16 * scale}px ${42 * scale}px`,
          boxShadow: `0 ${16 * scale}px ${40 * scale}px rgba(35, 64, 111, 0.12)`,
        }}
      >
        <span
          style={{
            fontFamily: brandSerifFont,
            fontSize: 22 * scale,
            color: BRAND_COLORS.deepNavy,
            fontStyle: 'italic',
          }}
        >
          Cost Range:
        </span>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 6 * scale}}>
          <span style={{fontSize: 24 * scale, fontWeight: 900, color: BRAND_COLORS.coral, fontFamily: 'system-ui, sans-serif'}}>
            $1,285
          </span>
          <span style={{fontSize: 16 * scale, color: '#64748b', fontWeight: 600}}>VA</span>
        </div>
        <span style={{fontSize: 20 * scale, color: '#94a3b8', fontWeight: 700}}>➔</span>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 6 * scale}}>
          <span style={{fontSize: 28 * scale, fontWeight: 900, color: '#DC2626', fontFamily: 'system-ui, sans-serif'}}>
            $6,000
          </span>
          <span style={{fontSize: 16 * scale, color: '#64748b', fontWeight: 600}}>/mo (IL)</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default Scene14_NationalOverview;