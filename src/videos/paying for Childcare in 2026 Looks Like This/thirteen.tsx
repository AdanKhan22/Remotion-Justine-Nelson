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
import {MapPin, MessageSquare, AlertCircle} from 'lucide-react';
import {
  BRAND_COLORS,
  LOCATIONS,
  brandSerifFont,
} from '../../constants/mapConfig';
import {USMapRig} from '../../components/USMapRig';

/**
 * SCENE 13: THE SPRINT FINALE (450 frames @ 30fps = 15.0s)
 * - Single Invariant Transform Origin ('50% 50%') -> 0 Jerks, 0 Jump Cuts
 * - Continuous cubic camera glides between states:
 *   [Kansas: 0-100] -> [Glide: 100-140] -> [Oregon: 140-210] -> [Glide: 210-250] -> [Nebraska: 250-320] -> [Glide: 320-360] -> [Chicago Finale: 360-450]
 */
export const Scene13_SprintFinale: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height, fps} = useVideoConfig();

  // 4K Mobile scale multiplier (2.0 at 3840x2160)
  const scale = useMemo(() => height / 1080, [height]);

  // ---------------------------------------------------------------------------
  // 1. BUTTERY-SMOOTH CONTINUOUS CAMERA TRACKING (LOCKED ORIGIN: '50% 50%')
  // ---------------------------------------------------------------------------
  const currentTx = useMemo(() => {
    // Glide 0: From Virginia (-0.28) to Kansas (0.02)
    if (frame <= 30) {
      const p = interpolate(frame, [0, 30], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.inOut(Easing.cubic),
      });
      return interpolate(p, [0, 1], [-0.28, 0.02]) * width;
    }
    // Kansas Hold
    if (frame <= 100) {
      return 0.02 * width;
    }
    // Glide 1: Kansas (0.02) to Oregon (0.30)
    if (frame <= 140) {
      const p = interpolate(frame, [100, 140], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.inOut(Easing.cubic),
      });
      return interpolate(p, [0, 1], [0.02, 0.30]) * width;
    }
    // Oregon Hold
    if (frame <= 210) {
      return 0.30 * width;
    }
    // Glide 2: Oregon (0.30) to Nebraska (0.02)
    if (frame <= 250) {
      const p = interpolate(frame, [210, 250], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.inOut(Easing.cubic),
      });
      return interpolate(p, [0, 1], [0.30, 0.02]) * width;
    }
    // Nebraska Hold
    if (frame <= 320) {
      return 0.02 * width;
    }
    // Glide 3: Nebraska (0.02) to Chicago (-0.12)
    if (frame <= 360) {
      const p = interpolate(frame, [320, 360], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.inOut(Easing.cubic),
      });
      return interpolate(p, [0, 1], [0.02, -0.12]) * width;
    }
    // Chicago Hold
    return -0.12 * width;
  }, [frame, width]);

  const currentTy = useMemo(() => {
    // Glide 0: From Virginia (0.02) to Kansas (-0.02)
    if (frame <= 30) {
      const p = interpolate(frame, [0, 30], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.inOut(Easing.cubic),
      });
      return interpolate(p, [0, 1], [0.02, -0.02]) * height;
    }
    // Kansas Hold
    if (frame <= 100) {
      return -0.02 * height;
    }
    // Glide 1: Kansas (-0.02) to Oregon (0.14 - pulls Pacific NW down away from top bezel)
    if (frame <= 140) {
      const p = interpolate(frame, [100, 140], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.inOut(Easing.cubic),
      });
      return interpolate(p, [0, 1], [-0.02, 0.14]) * height;
    }
    // Oregon Hold
    if (frame <= 210) {
      return 0.14 * height;
    }
    // Glide 2: Oregon (0.14) to Nebraska (0.02)
    if (frame <= 250) {
      const p = interpolate(frame, [210, 250], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.inOut(Easing.cubic),
      });
      return interpolate(p, [0, 1], [0.14, 0.02]) * height;
    }
    // Nebraska Hold
    if (frame <= 320) {
      return 0.02 * height;
    }
    // Glide 3: Nebraska (0.02) to Chicago (0.02)
    if (frame <= 360) {
      const p = interpolate(frame, [320, 360], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.inOut(Easing.cubic),
      });
      return interpolate(p, [0, 1], [0.02, 0.02]) * height;
    }
    // Chicago Hold
    return 0.02 * height;
  }, [frame, height]);

  const currentZoom = 1.75;
  const invariantOrigin = '50% 50%'; // NEVER changes across frames!

  // ---------------------------------------------------------------------------
  // 2. STATE HIGHLIGHT TIMING
  // ---------------------------------------------------------------------------
  const activeStateName = useMemo(() => {
    if (frame < 120) return 'Kansas';
    if (frame < 230) return 'Oregon';
    if (frame < 340) return 'Nebraska';
    return 'Illinois';
  }, [frame]);

  const highlightProgress = useMemo(() => {
    if (frame < 120) return interpolate(frame, [15, 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    if (frame < 230) return interpolate(frame, [125, 140], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    if (frame < 340) return interpolate(frame, [235, 250], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    return interpolate(frame, [345, 360], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  }, [frame]);

  // ---------------------------------------------------------------------------
  // 3. STOP DATA & CARD LIFECYCLES
  // ---------------------------------------------------------------------------
  // STOP 1: KANSAS ($3,700) [Visible: 32 -> 98]
  const showKansas = frame >= 32 && frame <= 98;
  const ksEnter = spring({frame: frame - 32, fps, config: {damping: 14, stiffness: 120}});
  const ksExit = interpolate(frame, [86, 98], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic)});
  const ksPrice = Math.round(interpolate(frame, [36, 58], [3000, 3700], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)}));

  // STOP 2: OREGON ($4,000) [Visible: 142 -> 208]
  const showOregon = frame >= 142 && frame <= 208;
  const orEnter = spring({frame: frame - 142, fps, config: {damping: 14, stiffness: 120}});
  const orExit = interpolate(frame, [196, 208], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic)});
  const orPrice = Math.round(interpolate(frame, [146, 168], [3700, 4000], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)}));

  // STOP 3: NEBRASKA ($4,730) [Visible: 252 -> 318]
  const showNebraska = frame >= 252 && frame <= 318;
  const neEnter = spring({frame: frame - 252, fps, config: {damping: 14, stiffness: 120}});
  const neExit = interpolate(frame, [306, 318], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic)});
  const nePrice = Math.round(interpolate(frame, [256, 278], [4000, 4730], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)}));

  // STOP 4: CHICAGO ($6,000) [Visible: 362 -> 450]
  const showChicago = frame >= 362;
  const chiEnter = spring({frame: frame - 362, fps, config: {damping: 14, stiffness: 120}});
  const chiPrice = Math.round(interpolate(frame, [366, 392], [4730, 6000], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)}));

  const isChicagoActive = frame >= 340;

  return (
    <AbsoluteFill style={{backgroundColor: BRAND_COLORS.canvasBg, overflow: 'hidden'}}>
      {/* SVG OVERFLOW SAFETY */}
      <style>{`
        svg, .rsm-svg {
          overflow: visible !important;
        }
      `}</style>

      {/* 2D MAP CAMERA RIG WITH FIXED 50% 50% ORIGIN */}
      <USMapRig
        width={width}
        height={height}
        scale={scale}
        currentZoom={currentZoom}
        currentTx={currentTx}
        currentTy={currentTy}
        transformOrigin={invariantOrigin}
        highlightedState={activeStateName}
        highlightProgress={highlightProgress}
      >
        {/* ---------------- STOP 1: KANSAS ---------------- */}
        {showKansas && (
          <Marker coordinates={LOCATIONS.overlandpark.coords}>
            <g transform={`scale(${1 / currentZoom})`}>
              <g
                transform={`translate(${-26 * scale}, ${-54 * scale}) scale(${ksEnter * (1 - ksExit)})`}
                style={{transformOrigin: `${26 * scale}px ${54 * scale}px`}}
              >
                <MapPin size={52 * scale} color={BRAND_COLORS.coral} strokeWidth={2.4} fill={BRAND_COLORS.white} />
              </g>

              <foreignObject
                x={LOCATIONS.overlandpark.cardOffsetX * scale}
                y={-125 * scale}
                width={590 * scale}
                height={370 * scale}
                style={{
                  opacity: Math.max(0, ksEnter - ksExit),
                  transform: `scale(${Math.max(0, ksEnter * (1 - ksExit * 0.15))})`,
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
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8 * scale,
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    boxSizing: 'border-box',
                  }}
                >
                  <div style={{display: 'flex', alignItems: 'center', gap: 8 * scale}}>
                    <MessageSquare size={24 * scale} color={BRAND_COLORS.coral} />
                    <span style={{fontSize: 24 * scale, fontWeight: 800, color: BRAND_COLORS.deepNavy}}>
                      {LOCATIONS.overlandpark.sender}
                    </span>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: 10 * scale, flexWrap: 'wrap'}}>
                    <span style={{fontSize: 19 * scale, fontWeight: 700, color: BRAND_COLORS.deepNavy, opacity: 0.75}}>
                      {LOCATIONS.overlandpark.city}, {LOCATIONS.overlandpark.state}
                    </span>
                    <span style={{width: 4 * scale, height: 4 * scale, borderRadius: '50%', backgroundColor: '#94a3b8'}} />
                    <span style={{backgroundColor: BRAND_COLORS.blushPink, color: BRAND_COLORS.deepNavy, padding: `${5 * scale}px ${14 * scale}px`, borderRadius: 100 * scale, fontSize: 17.5 * scale, fontWeight: 800}}>
                      {LOCATIONS.overlandpark.kidsCount} • {LOCATIONS.overlandpark.kidsAge}
                    </span>
                  </div>
                  <div style={{fontSize: 60 * scale, fontWeight: 900, color: BRAND_COLORS.coral, lineHeight: 1, marginTop: 2 * scale, display: 'flex', alignItems: 'baseline'}}>
                    ${ksPrice.toLocaleString()}
                    <span style={{fontSize: 24 * scale, fontWeight: 600, color: BRAND_COLORS.deepNavy, opacity: 0.55, marginLeft: 8 * scale}}>/mo</span>
                  </div>
                  <div style={{fontSize: 24 * scale, lineHeight: 1.36, color: BRAND_COLORS.deepNavy, fontFamily: brandSerifFont, fontStyle: 'italic', marginTop: 2 * scale}}>
                    “{LOCATIONS.overlandpark.dmSnippet}”
                  </div>
                </div>
              </foreignObject>
            </g>
          </Marker>
        )}

        {/* ---------------- STOP 2: OREGON (BELOW PIN: NO TOP CLIPPING) ---------------- */}
        {showOregon && (
          <Marker coordinates={LOCATIONS.portland.coords}>
            <g transform={`scale(${1 / currentZoom})`}>
              <g
                transform={`translate(${-26 * scale}, ${-54 * scale}) scale(${orEnter * (1 - orExit)})`}
                style={{transformOrigin: `${26 * scale}px ${54 * scale}px`}}
              >
                <MapPin size={52 * scale} color={BRAND_COLORS.coral} strokeWidth={2.4} fill={BRAND_COLORS.white} />
              </g>

              {/* Renders BELOW pin (+25*scale) to safely clear the top boundary */}
              <foreignObject
                x={LOCATIONS.portland.cardOffsetX * scale}
                y={25 * scale}
                width={590 * scale}
                height={370 * scale}
                style={{
                  opacity: Math.max(0, orEnter - orExit),
                  transform: `scale(${Math.max(0, orEnter * (1 - orExit * 0.15))})`,
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
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8 * scale,
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    boxSizing: 'border-box',
                  }}
                >
                  <div style={{display: 'flex', alignItems: 'center', gap: 8 * scale}}>
                    <MessageSquare size={24 * scale} color={BRAND_COLORS.coral} />
                    <span style={{fontSize: 24 * scale, fontWeight: 800, color: BRAND_COLORS.deepNavy}}>
                      {LOCATIONS.portland.sender}
                    </span>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: 10 * scale, flexWrap: 'wrap'}}>
                    <span style={{fontSize: 19 * scale, fontWeight: 700, color: BRAND_COLORS.deepNavy, opacity: 0.75}}>
                      {LOCATIONS.portland.city}, {LOCATIONS.portland.state}
                    </span>
                    <span style={{width: 4 * scale, height: 4 * scale, borderRadius: '50%', backgroundColor: '#94a3b8'}} />
                    <span style={{backgroundColor: BRAND_COLORS.blushPink, color: BRAND_COLORS.deepNavy, padding: `${5 * scale}px ${14 * scale}px`, borderRadius: 100 * scale, fontSize: 17.5 * scale, fontWeight: 800}}>
                      {LOCATIONS.portland.kidsCount} • {LOCATIONS.portland.kidsAge}
                    </span>
                  </div>
                  <div style={{fontSize: 60 * scale, fontWeight: 900, color: BRAND_COLORS.coral, lineHeight: 1, marginTop: 2 * scale, display: 'flex', alignItems: 'baseline'}}>
                    ${orPrice.toLocaleString()}
                    <span style={{fontSize: 24 * scale, fontWeight: 600, color: BRAND_COLORS.deepNavy, opacity: 0.55, marginLeft: 8 * scale}}>/mo</span>
                  </div>
                  <div style={{fontSize: 24 * scale, lineHeight: 1.36, color: BRAND_COLORS.deepNavy, fontFamily: brandSerifFont, fontStyle: 'italic', marginTop: 2 * scale}}>
                    “{LOCATIONS.portland.dmSnippet}”
                  </div>
                </div>
              </foreignObject>
            </g>
          </Marker>
        )}

        {/* ---------------- STOP 3: NEBRASKA ---------------- */}
        {showNebraska && (
          <Marker coordinates={LOCATIONS.omaha.coords}>
            <g transform={`scale(${1 / currentZoom})`}>
              <g
                transform={`translate(${-26 * scale}, ${-54 * scale}) scale(${neEnter * (1 - neExit)})`}
                style={{transformOrigin: `${26 * scale}px ${54 * scale}px`}}
              >
                <MapPin size={52 * scale} color={BRAND_COLORS.coral} strokeWidth={2.4} fill={BRAND_COLORS.white} />
              </g>

              <foreignObject
                x={LOCATIONS.omaha.cardOffsetX * scale}
                y={-125 * scale}
                width={590 * scale}
                height={370 * scale}
                style={{
                  opacity: Math.max(0, neEnter - neExit),
                  transform: `scale(${Math.max(0, neEnter * (1 - neExit * 0.15))})`,
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
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8 * scale,
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    boxSizing: 'border-box',
                  }}
                >
                  <div style={{display: 'flex', alignItems: 'center', gap: 8 * scale}}>
                    <MessageSquare size={24 * scale} color={BRAND_COLORS.coral} />
                    <span style={{fontSize: 24 * scale, fontWeight: 800, color: BRAND_COLORS.deepNavy}}>
                      {LOCATIONS.omaha.sender}
                    </span>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: 10 * scale, flexWrap: 'wrap'}}>
                    <span style={{fontSize: 19 * scale, fontWeight: 700, color: BRAND_COLORS.deepNavy, opacity: 0.75}}>
                      {LOCATIONS.omaha.city}, {LOCATIONS.omaha.state}
                    </span>
                    <span style={{width: 4 * scale, height: 4 * scale, borderRadius: '50%', backgroundColor: '#94a3b8'}} />
                    <span style={{backgroundColor: BRAND_COLORS.blushPink, color: BRAND_COLORS.deepNavy, padding: `${5 * scale}px ${14 * scale}px`, borderRadius: 100 * scale, fontSize: 17.5 * scale, fontWeight: 800}}>
                      {LOCATIONS.omaha.kidsCount} • {LOCATIONS.omaha.kidsAge}
                    </span>
                  </div>
                  <div style={{fontSize: 60 * scale, fontWeight: 900, color: BRAND_COLORS.coral, lineHeight: 1, marginTop: 2 * scale, display: 'flex', alignItems: 'baseline'}}>
                    ${nePrice.toLocaleString()}
                    <span style={{fontSize: 24 * scale, fontWeight: 600, color: BRAND_COLORS.deepNavy, opacity: 0.55, marginLeft: 8 * scale}}>/mo</span>
                  </div>
                  <div style={{fontSize: 24 * scale, lineHeight: 1.36, color: BRAND_COLORS.deepNavy, fontFamily: brandSerifFont, fontStyle: 'italic', marginTop: 2 * scale}}>
                    “{LOCATIONS.omaha.dmSnippet}”
                  </div>
                </div>
              </foreignObject>
            </g>
          </Marker>
        )}

        {/* ---------------- STOP 4: CHICAGO (CLIMAX) ---------------- */}
        {showChicago && (
          <Marker coordinates={LOCATIONS.chicago.coords}>
            <g transform={`scale(${1 / currentZoom})`}>
              <g
                transform={`translate(${-26 * scale}, ${-54 * scale}) scale(${chiEnter})`}
                style={{transformOrigin: `${26 * scale}px ${54 * scale}px`}}
              >
                <MapPin size={52 * scale} color={BRAND_COLORS.coral} strokeWidth={2.4} fill={BRAND_COLORS.white} />
              </g>

              <foreignObject
                x={LOCATIONS.chicago.cardOffsetX * scale}
                y={-120 * scale}
                width={590 * scale}
                height={370 * scale}
                style={{
                  opacity: chiEnter,
                  transform: `scale(${chiEnter})`,
                  transformOrigin: '0% 50%',
                  overflow: 'visible',
                }}
              >
                <div
                  style={{
                    width: 510 * scale,
                    background: 'rgba(255, 255, 255, 0.97)',
                    border: `${3 * scale}px solid ${BRAND_COLORS.coral}`,
                    borderRadius: 26 * scale,
                    padding: `${22 * scale}px ${26 * scale}px`,
                    boxShadow: `0 ${22 * scale}px ${55 * scale}px rgba(255, 93, 60, 0.25)`,
                    backdropFilter: 'blur(16px)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8 * scale,
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    boxSizing: 'border-box',
                  }}
                >
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: 8 * scale}}>
                      <MessageSquare size={24 * scale} color={BRAND_COLORS.coral} />
                      <span style={{fontSize: 24 * scale, fontWeight: 800, color: BRAND_COLORS.deepNavy}}>
                        {LOCATIONS.chicago.sender}
                      </span>
                    </div>
                    <div
                      style={{
                        backgroundColor: BRAND_COLORS.coral,
                        color: BRAND_COLORS.white,
                        padding: `${4 * scale}px ${12 * scale}px`,
                        borderRadius: 100 * scale,
                        fontSize: 13 * scale,
                        fontWeight: 900,
                        letterSpacing: '0.08em',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4 * scale,
                      }}
                    >
                      <AlertCircle size={14 * scale} color="#FFF" />
                      PEAK EXPENSE
                    </div>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: 10 * scale, flexWrap: 'wrap'}}>
                    <span style={{fontSize: 19 * scale, fontWeight: 700, color: BRAND_COLORS.deepNavy, opacity: 0.75}}>
                      {LOCATIONS.chicago.city}, {LOCATIONS.chicago.state}
                    </span>
                    <span style={{width: 4 * scale, height: 4 * scale, borderRadius: '50%', backgroundColor: '#94a3b8'}} />
                    <span style={{backgroundColor: BRAND_COLORS.blushPink, color: BRAND_COLORS.deepNavy, padding: `${5 * scale}px ${14 * scale}px`, borderRadius: 100 * scale, fontSize: 17.5 * scale, fontWeight: 800}}>
                      {LOCATIONS.chicago.kidsCount} • {LOCATIONS.chicago.kidsAge}
                    </span>
                  </div>
                  <div style={{fontSize: 64 * scale, fontWeight: 900, color: BRAND_COLORS.coral, lineHeight: 1, marginTop: 2 * scale, display: 'flex', alignItems: 'baseline'}}>
                    ${chiPrice.toLocaleString()}
                    <span style={{fontSize: 24 * scale, fontWeight: 600, color: BRAND_COLORS.deepNavy, opacity: 0.55, marginLeft: 8 * scale}}>/mo</span>
                  </div>
                  <div style={{fontSize: 24 * scale, lineHeight: 1.36, color: BRAND_COLORS.deepNavy, fontFamily: brandSerifFont, fontStyle: 'italic', marginTop: 2 * scale}}>
                    “{LOCATIONS.chicago.dmSnippet}”
                  </div>
                </div>
              </foreignObject>
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
          background: isChicagoActive ? BRAND_COLORS.deepNavy : 'rgba(255, 255, 255, 0.98)',
          border: `${2 * scale}px solid ${isChicagoActive ? BRAND_COLORS.coral : 'rgba(35, 64, 111, 0.16)'}`,
          backdropFilter: 'blur(12px)',
          borderRadius: 100 * scale,
          padding: `${16 * scale}px ${40 * scale}px`,
          boxShadow: `0 ${10 * scale}px ${30 * scale}px rgba(35, 64, 111, 0.12)`,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          transition: 'background 0.3s ease, border-color 0.3s ease',
        }}
      >
        <MessageSquare size={28 * scale} color={BRAND_COLORS.coral} />
        <span
          style={{
            fontSize: 24 * scale,
            fontWeight: 800,
            letterSpacing: '0.06em',
            color: isChicagoActive ? BRAND_COLORS.white : BRAND_COLORS.deepNavy,
          }}
        >
          {isChicagoActive ? 'HIGHEST REPORTED: CHICAGO, IL' : 'REAL DMs: NATIONWIDE SPRINT'}
        </span>
      </div>
    </AbsoluteFill>
  );
};

export default Scene13_SprintFinale;