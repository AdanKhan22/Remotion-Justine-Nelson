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
 * CALIFORNIA MINI-SPRINT (560 frames @ 30fps = 18.6s)
 * Fluid intra-state camera movement across all 6 California stops:
 * [Stop 6: Central Valley] -> [Stop 7: San Diego] -> [Stop 8: LA] ->
 * [Stop 9: LA Margaret] -> [Stop 10: San Diego Lauren] -> [Stop 11: Bay Area Joanna]
 */
export const Scene_CaliforniaSprint: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height, fps} = useVideoConfig();

  // 4K Mobile scale multiplier (2.0 at 3840x2160)
  const scale = useMemo(() => height / 1080, [height]);

  // ---------------------------------------------------------------------------
  // 1. CHOREOGRAPHY CONFIGURATION (STRICT DISJOINT TIMELINES)
  // ---------------------------------------------------------------------------
  const stops = useMemo(
    () => [
      {
        key: 'california_nurse',
        loc: LOCATIONS.california_nurse,
        appearFrame: 28,
        cardOpenFrame: 34,
        tickStart: 36,
        tickEnd: 56,
        exitStart: 76,
        exitEnd: 88,
        priceStart: 2800,
        priceEnd: 2700,
        cardOffsetY: -125,
        tx: 0.22,
        ty: -0.01,
      },
      {
        key: 'sandiego_host',
        loc: LOCATIONS.sandiego_host,
        appearFrame: 118,
        cardOpenFrame: 124,
        tickStart: 126,
        tickEnd: 146,
        exitStart: 166,
        exitEnd: 178,
        priceStart: 2700,
        priceEnd: 3040,
        cardOffsetY: -135, // Floated above pin (safe from bottom edge)
        tx: 0.22,
        ty: -0.05,
      },
      {
        key: 'losangeles_host',
        loc: LOCATIONS.losangeles_host,
        appearFrame: 208,
        cardOpenFrame: 214,
        tickStart: 216,
        tickEnd: 236,
        exitStart: 256,
        exitEnd: 268,
        priceStart: 3040,
        priceEnd: 2000,
        cardOffsetY: -125,
        tx: 0.22,
        ty: -0.03,
      },
      {
        key: 'losangeles_margaret',
        loc: LOCATIONS.losangeles_margaret,
        appearFrame: 295,
        cardOpenFrame: 301,
        tickStart: 303,
        tickEnd: 323,
        exitStart: 343,
        exitEnd: 355,
        priceStart: 2000,
        priceEnd: 1700,
        cardOffsetY: -120,
        tx: 0.22,
        ty: -0.03,
      },
      {
        key: 'sandiego_lauren',
        loc: LOCATIONS.sandiego_lauren,
        appearFrame: 383,
        cardOpenFrame: 389,
        tickStart: 391,
        tickEnd: 411,
        exitStart: 431,
        exitEnd: 443,
        priceStart: 1700,
        priceEnd: 2560,
        cardOffsetY: -135, // Floated above pin (safe from bottom edge)
        tx: 0.22,
        ty: -0.05,
      },
      {
        key: 'bayarea',
        loc: LOCATIONS.bayarea,
        appearFrame: 478,
        cardOpenFrame: 484,
        tickStart: 486,
        tickEnd: 510,
        exitStart: 9998,
        exitEnd: 9999, // Holds to finale
        priceStart: 2560,
        priceEnd: 2600,
        cardOffsetY: -125,
        tx: 0.24,
        ty: 0.03,
      },
    ],
    []
  );

  // ---------------------------------------------------------------------------
  // 2. CONTINUOUS INTRA-STATE CAMERA TRACKING (LOCKED ORIGIN: '50% 50%')
  // ---------------------------------------------------------------------------
  const currentTx = useMemo(() => {
    // Glide into California (0 -> 25)
    if (frame <= 25) {
      const p = interpolate(frame, [0, 25], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.inOut(Easing.cubic),
      });
      return interpolate(p, [0, 1], [0, stops[0].tx]) * width;
    }
    // Hold Central Valley
    if (frame <= 88) return stops[0].tx * width;
    // Glide Central Valley -> San Diego (88 -> 118)
    if (frame <= 118) {
      const p = interpolate(frame, [88, 118], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.inOut(Easing.cubic),
      });
      return interpolate(p, [0, 1], [stops[0].tx, stops[1].tx]) * width;
    }
    // Hold San Diego
    if (frame <= 178) return stops[1].tx * width;
    // Glide San Diego -> LA (178 -> 208)
    if (frame <= 208) {
      const p = interpolate(frame, [178, 208], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.inOut(Easing.cubic),
      });
      return interpolate(p, [0, 1], [stops[1].tx, stops[2].tx]) * width;
    }
    // Hold LA Host & LA Margaret (208 -> 355)
    if (frame <= 355) return stops[2].tx * width;
    // Glide LA -> San Diego Lauren (355 -> 383)
    if (frame <= 383) {
      const p = interpolate(frame, [355, 383], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.inOut(Easing.cubic),
      });
      return interpolate(p, [0, 1], [stops[3].tx, stops[4].tx]) * width;
    }
    // Hold San Diego Lauren
    if (frame <= 443) return stops[4].tx * width;
    // Glide San Diego -> Bay Area (443 -> 475)
    if (frame <= 475) {
      const p = interpolate(frame, [443, 475], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.inOut(Easing.cubic),
      });
      return interpolate(p, [0, 1], [stops[4].tx, stops[5].tx]) * width;
    }
    // Hold Bay Area
    return stops[5].tx * width;
  }, [frame, width, stops]);

  const currentTy = useMemo(() => {
    // Glide into California (0 -> 25)
    if (frame <= 25) {
      const p = interpolate(frame, [0, 25], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.inOut(Easing.cubic),
      });
      return interpolate(p, [0, 1], [0, stops[0].ty]) * height;
    }
    // Hold Central Valley
    if (frame <= 88) return stops[0].ty * height;
    // Glide Central Valley -> San Diego (88 -> 118)
    if (frame <= 118) {
      const p = interpolate(frame, [88, 118], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.inOut(Easing.cubic),
      });
      return interpolate(p, [0, 1], [stops[0].ty, stops[1].ty]) * height;
    }
    // Hold San Diego
    if (frame <= 178) return stops[1].ty * height;
    // Glide San Diego -> LA (178 -> 208)
    if (frame <= 208) {
      const p = interpolate(frame, [178, 208], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.inOut(Easing.cubic),
      });
      return interpolate(p, [0, 1], [stops[1].ty, stops[2].ty]) * height;
    }
    // Hold LA Host & LA Margaret (208 -> 355)
    if (frame <= 355) return stops[2].ty * height;
    // Glide LA -> San Diego Lauren (355 -> 383)
    if (frame <= 383) {
      const p = interpolate(frame, [355, 383], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.inOut(Easing.cubic),
      });
      return interpolate(p, [0, 1], [stops[3].ty, stops[4].ty]) * height;
    }
    // Hold San Diego Lauren
    if (frame <= 443) return stops[4].ty * height;
    // Glide San Diego -> Bay Area (443 -> 475)
    if (frame <= 475) {
      const p = interpolate(frame, [443, 475], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.inOut(Easing.cubic),
      });
      return interpolate(p, [0, 1], [stops[4].ty, stops[5].ty]) * height;
    }
    // Hold Bay Area
    return stops[5].ty * height;
  }, [frame, height, stops]);

  const currentZoom = 1.75;
  const invariantOrigin = '50% 50%';

  // Active stop determination
  const activeStopIndex = useMemo(() => {
    if (frame < 88) return 0;
    if (frame < 178) return 1;
    if (frame < 268) return 2;
    if (frame < 355) return 3;
    if (frame < 443) return 4;
    return 5;
  }, [frame]);

  const activeStop = stops[activeStopIndex];

  // California state stays highlighted throughout this entire mini-sprint
  const highlightProgress = spring({
    frame: frame - 15,
    fps,
    config: {damping: 16, stiffness: 80},
  });

  // ---------------------------------------------------------------------------
  // 3. CARD LIFECYCLE (POP IN -> HOLD -> FADE OUT)
  // ---------------------------------------------------------------------------
  const isWithinDisplayWindow =
    frame >= activeStop.appearFrame && frame <= activeStop.exitEnd;

  const pinDropSpring = spring({
    frame: frame - activeStop.appearFrame,
    fps,
    config: {damping: 12, stiffness: 180, mass: 0.6},
  });

  const cardOpenSpring = spring({
    frame: frame - activeStop.cardOpenFrame,
    fps,
    config: {damping: 14, stiffness: 120},
  });

  // Safe monotonic exit interpolation
  const exitProgress =
    activeStop.exitEnd > activeStop.exitStart && activeStop.exitStart < 9000
      ? interpolate(frame, [activeStop.exitStart, activeStop.exitEnd], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.in(Easing.cubic),
        })
      : 0;

  const cardOpacity = Math.max(0, cardOpenSpring - exitProgress);
  const cardScale = Math.max(0, cardOpenSpring * (1 - exitProgress * 0.15));

  // Ticker animation
  const animatedPrice = Math.round(
    interpolate(
      frame,
      [activeStop.tickStart, activeStop.tickEnd],
      [activeStop.priceStart, activeStop.priceEnd],
      {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.out(Easing.cubic),
      }
    )
  );

  // Ripple pulse
  const localRippleFrame = Math.max(0, frame - activeStop.appearFrame);
  const rippleScale = interpolate((localRippleFrame % 30) / 30, [0, 1], [1, 2.6]);
  const rippleOpacity = interpolate((localRippleFrame % 30) / 30, [0, 1], [0.75, 0]);

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
        highlightedState="California"
        highlightProgress={highlightProgress}
      >
        {isWithinDisplayWindow && (
          <Marker coordinates={activeStop.loc.coords}>
            <g transform={`scale(${1 / currentZoom})`}>
              {/* Ripple Ring */}
              {exitProgress === 0 && (
                <circle
                  r={20 * scale * rippleScale}
                  cx={0}
                  cy={0}
                  fill="none"
                  stroke={BRAND_COLORS.coral}
                  strokeWidth={3 * scale}
                  opacity={rippleOpacity}
                />
              )}

              {/* Pin */}
              <g
                transform={`translate(${-26 * scale}, ${-54 * scale}) scale(${pinDropSpring * (1 - exitProgress)})`}
                style={{transformOrigin: `${26 * scale}px ${54 * scale}px`}}
              >
                <MapPin
                  size={52 * scale}
                  color={BRAND_COLORS.coral}
                  strokeWidth={2.4}
                  fill={BRAND_COLORS.white}
                />
              </g>

              {/* Unclipped Frosted DM Cost Card */}
              {cardOpacity > 0 && (
                <foreignObject
                  x={activeStop.loc.cardOffsetX * scale}
                  y={activeStop.cardOffsetY * scale}
                  width={600 * scale}
                  height={380 * scale}
                  style={{
                    opacity: cardOpacity,
                    transform: `scale(${cardScale})`,
                    transformOrigin: '0% 50%',
                    overflow: 'visible',
                  }}
                >
                  <div
                    style={{
                      width: 510 * scale,
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
                        {activeStop.loc.sender}
                      </span>
                    </div>

                    {/* Row 2: Location + Demographics Badge */}
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
                          fontSize: 19 * scale,
                          fontWeight: 700,
                          color: BRAND_COLORS.deepNavy,
                          opacity: 0.75,
                        }}
                      >
                        {activeStop.loc.city}, {activeStop.loc.state}
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
                          padding: `${5 * scale}px ${14 * scale}px`,
                          borderRadius: 100 * scale,
                          fontSize: 17.5 * scale,
                          fontWeight: 800,
                          letterSpacing: '0.01em',
                        }}
                      >
                        {activeStop.loc.kidsCount} • {activeStop.loc.kidsAge}
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

                    {/* Row 4: Parent Quote in Playfair Display */}
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
                      “{activeStop.loc.dmSnippet}”
                    </div>
                  </div>
                </foreignObject>
              )}
            </g>
          </Marker>
        )}
      </USMapRig>

      {/* UPPER THIRD HUD BADGE */}
      <div
        style={{
          position: 'absolute',
          top: 44 * scale,
          left: '50%',
          transform: `translateX(-50%)`,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 14 * scale,
          background: 'rgba(255, 255, 255, 0.98)',
          border: `2px solid rgba(35, 64, 111, 0.16)`,
          backdropFilter: 'blur(12px)',
          borderRadius: 100 * scale,
          padding: `${16 * scale}px ${40 * scale}px`,
          boxShadow: `0 ${10 * scale}px ${30 * scale}px rgba(35, 64, 111, 0.12)`,
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
          CALIFORNIA DEEP DIVE: 6 PARENT DMs
        </span>
      </div>
    </AbsoluteFill>
  );
};

export default Scene_CaliforniaSprint;