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
  CAMERA_PRESETS,
  LOCATIONS,
  brandSerifFont,
} from '../../constants/mapConfig';
import {USMapRig} from '../../components/USMapRig';

/**
 * SCENE 4: DES MOINES, IOWA (150 frames @ 30fps = 5.0s)
 * - Starts at Full US Map (zoom: 1.0)
 * - Highlights Iowa in Ice Blue (#C1E1E6)
 * - Camera eases in with PiP headroom (zoom: 1.75)
 * - Restructured metadata layout + larger 24*scale Playfair quote
 * - Pin drops, DM Card opens, price rolls up from $1,720 -> $2,600
 */
export const Scene4_IowaDesMoines: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height, fps} = useVideoConfig();

  // 4K Mobile scale multiplier (2.0 at 3840x2160)
  const scale = useMemo(() => height / 1080, [height]);

  // Source of Truth Data: Entry #4
  const location = LOCATIONS.iowa;

  // 1. STATE HIGHLIGHT TIMING (Frames 20-35)
  const highlightProgress = spring({
    frame: frame - 20,
    fps,
    config: {damping: 16, stiffness: 90},
  });

  // 2. CAMERA PUSH-IN DYNAMICS (Frames 35-77: 42 frames, cubic ease)
  const ZOOM_START = 35;
  const ZOOM_DURATION = 42;
  const zoomProgress = interpolate(
    frame,
    [ZOOM_START, ZOOM_START + ZOOM_DURATION],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.cubic),
    }
  );

  // Moderated zoom (1.75x) to preserve space for PiP talking head
  const targetZoom = 1.75;
  const currentZoom = interpolate(
    zoomProgress,
    [0, 1],
    [CAMERA_PRESETS.fullUS.zoom, targetZoom]
  );
  const currentTx = interpolate(
    zoomProgress,
    [0, 1],
    [0, CAMERA_PRESETS.iowa.txFactor * width]
  );
  const currentTy = interpolate(
    zoomProgress,
    [0, 1],
    [0, CAMERA_PRESETS.iowa.tyFactor * height]
  );

  // 3. UPPER THIRD BADGE (Springs in at frame 75 after camera settles)
  const headerSpring = spring({
    frame: frame - 75,
    fps,
    config: {damping: 15, stiffness: 100},
  });
  const headerOpacity = interpolate(headerSpring, [0, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const headerY = interpolate(headerSpring, [0, 1], [-20 * scale, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 4. PIN DROP & PULSE RINGS (Frame 82)
  const pinSpring = spring({
    frame: frame - 82,
    fps,
    config: {damping: 12, stiffness: 180, mass: 0.6},
  });
  const pinScale = interpolate(pinSpring, [0, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const localRippleFrame = Math.max(0, frame - 85);
  const rippleScale = interpolate((localRippleFrame % 30) / 30, [0, 1], [1, 2.6]);
  const rippleOpacity = interpolate((localRippleFrame % 30) / 30, [0, 1], [0.75, 0]);

  // 5. FROSTED DM CARD (Pops at frame 90)
  const cardSpring = spring({
    frame: frame - 90,
    fps,
    config: {damping: 14, stiffness: 120},
  });
  const cardOpacity = interpolate(cardSpring, [0, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cardY = interpolate(cardSpring, [0, 1], [14 * scale, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 6. LIVE PRICE COUNT-UP ($1,720 from Rockville -> $2,600 for Iowa)
  const animatedPrice = Math.round(
    interpolate(frame, [92, 116], [1720, 2600], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic),
    })
  );

  return (
    <AbsoluteFill style={{backgroundColor: BRAND_COLORS.canvasBg, overflow: 'hidden'}}>
      {/* SVG OVERFLOW SAFETY: Eliminates map viewBox edge slicing */}
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
        transformOrigin={CAMERA_PRESETS.iowa.origin}
        highlightedState={location.state}
        highlightProgress={highlightProgress}
      >
        {frame >= 82 && (
          <Marker coordinates={location.coords}>
            <g transform={`scale(${1 / currentZoom})`}>
              {/* Pulse Ring */}
              <circle
                r={20 * scale * rippleScale}
                cx={0}
                cy={0}
                fill="none"
                stroke={BRAND_COLORS.coral}
                strokeWidth={3 * scale}
                opacity={rippleOpacity}
              />

              {/* Iowa MapPin */}
              <g
                transform={`translate(${-26 * scale}, ${-54 * scale}) scale(${pinScale})`}
                style={{transformOrigin: `${26 * scale}px ${54 * scale}px`}}
              >
                <MapPin
                  size={52 * scale}
                  color={BRAND_COLORS.coral}
                  strokeWidth={2.4}
                  fill={BRAND_COLORS.white}
                />
              </g>

              {/* Redesigned Frosted DM Cost Card */}
              {cardOpacity > 0 && (
                <foreignObject
                  x={location.cardOffsetX * scale}
                  y={location.cardOffsetY * scale + cardY}
                  width={580 * scale}
                  height={350 * scale}
                  style={{opacity: cardOpacity, overflow: 'visible'}}
                >
                  <div
                    style={{
                      width: 500 * scale,
                      background: 'rgba(255, 255, 255, 0.97)',
                      border: `${2.5 * scale}px solid rgba(255, 255, 255, 0.95)`,
                      borderRadius: 26 * scale,
                      padding: `${22 * scale}px ${26 * scale}px`,
                      boxShadow: `0 ${20 * scale}px ${45 * scale}px rgba(35, 64, 111, 0.16)`,
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8 * scale,
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                      boxSizing: 'border-box',
                    }}
                  >
                    {/* Row 1: Sender Handle */}
                    <div style={{display: 'flex', alignItems: 'center', gap: 8 * scale}}>
                      <MessageSquare size={24 * scale} color={BRAND_COLORS.coral} />
                      <span
                        style={{
                          fontSize: 24 * scale,
                          fontWeight: 800,
                          color: BRAND_COLORS.deepNavy,
                          letterSpacing: '-0.01em',
                        }}
                      >
                        {location.sender}
                      </span>
                    </div>

                    {/* Row 2: Location + Demographics Badge (Unified natural flow) */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10 * scale,
                        flexWrap: 'wrap',
                      }}
                    >
                      <span
                        style={{
                          fontSize: 18 * scale,
                          fontWeight: 700,
                          color: BRAND_COLORS.deepNavy,
                          opacity: 0.75,
                        }}
                      >
                        {location.city}, {location.state}
                      </span>
                      <span
                        style={{
                          width: 4 * scale,
                          height: 4 * scale,
                          borderRadius: '50%',
                          backgroundColor: '#94a3b8',
                        }}
                      />
                      <span
                        style={{
                          backgroundColor: BRAND_COLORS.blushPink,
                          color: BRAND_COLORS.deepNavy,
                          padding: `${3 * scale}px ${12 * scale}px`,
                          borderRadius: 100 * scale,
                          fontSize: 14 * scale,
                          fontWeight: 700,
                          letterSpacing: '0.01em',
                        }}
                      >
                        {location.kidsCount} • {location.kidsAge}
                      </span>
                    </div>

                    {/* Row 3: Animated Price Ticker */}
                    <div
                      style={{
                        fontSize: 60 * scale,
                        fontWeight: 900,
                        color: BRAND_COLORS.coral,
                        lineHeight: 1,
                        letterSpacing: '-0.02em',
                        marginTop: 2 * scale,
                        display: 'flex',
                        alignItems: 'baseline',
                      }}
                    >
                      ${animatedPrice.toLocaleString()}
                      <span
                        style={{
                          fontSize: 24 * scale,
                          fontWeight: 600,
                          color: BRAND_COLORS.deepNavy,
                          opacity: 0.55,
                          marginLeft: 8 * scale,
                        }}
                      >
                        /mo
                      </span>
                    </div>

                    {/* Row 4: Parent Quote in Playfair Display (Enhanced 24*scale size) */}
                    <div
                      style={{
                        fontSize: 24 * scale,
                        lineHeight: 1.36,
                        color: BRAND_COLORS.deepNavy,
                        fontFamily: brandSerifFont,
                        fontStyle: 'italic',
                        marginTop: 2 * scale,
                      }}
                    >
                      “{location.dmSnippet}”
                    </div>
                  </div>
                </foreignObject>
              )}
            </g>
          </Marker>
        )}
      </USMapRig>

      {/* UPPER THIRD HEADER BADGE */}
      <div
        style={{
          position: 'absolute',
          top: 44 * scale,
          left: '50%',
          transform: `translateX(-50%) translateY(${headerY}px)`,
          opacity: headerOpacity,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 14 * scale,
          background: 'rgba(255, 255, 255, 0.98)',
          border: `${2 * scale}px solid rgba(35, 64, 111, 0.16)`,
          backdropFilter: 'blur(12px)',
          borderRadius: 100 * scale,
          padding: `${16 * scale}px ${40 * scale}px`,
          boxShadow: `0 ${10 * scale}px ${30 * scale}px rgba(35, 64, 111, 0.08)`,
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
          REAL DMs: MONTHLY CHILDCARE COSTS
        </span>
      </div>
    </AbsoluteFill>
  );
};

export default Scene4_IowaDesMoines;