import React, {useMemo} from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
} from 'remotion';
import {TrendingUp, Home, ArrowUpRight} from 'lucide-react';
import {
  BRAND_COLORS,
  brandSerifFont,
} from '../../constants/mapConfig';

/**
 * SCENE 15: CINEMATIC DATA VISUALIZATION (240 frames @ 30fps = 8.0s)
 * - Broadcast / Vox-style visual journalism
 * - Extra-large, mobile-optimized typography across all elements
 * - Animated "US Mortgage Benchmark" line ($2,850/mo)
 * - Sculptural vertical pillars with bold tabular counters
 */
export const Scene15_DataVisualization: React.FC = () => {
  const frame = useCurrentFrame();
  const {height, fps} = useVideoConfig();

  // 4K Mobile scale multiplier (2.0 at 3840x2160)
  const scale = useMemo(() => height / 1080, [height]);

  // ---------------------------------------------------------------------------
  // 1. DATASET & CHART SCALING
  // ---------------------------------------------------------------------------
  const pillars = useMemo(
    () => [
      {
        city: 'Norfolk',
        state: 'VA',
        cost: 1285,
        delay: 15,
        bgGradient: 'linear-gradient(180deg, #A2D2DB 0%, #6EABB7 100%)',
        isPeak: false,
      },
      {
        city: 'Littleton',
        state: 'CO',
        cost: 1460,
        delay: 24,
        bgGradient: 'linear-gradient(180deg, #B2DDE4 0%, #80BCC7 100%)',
        isPeak: false,
      },
      {
        city: 'Des Moines',
        state: 'IA',
        cost: 2600,
        delay: 33,
        bgGradient: 'linear-gradient(180deg, #F8C3B8 0%, #EAA092 100%)',
        isPeak: false,
      },
      {
        city: 'Charlottesville',
        state: 'VA',
        cost: 3000,
        delay: 42,
        bgGradient: 'linear-gradient(180deg, #FFA08C 0%, #F5785E 100%)',
        isPeak: false,
      },
      {
        city: 'Portland',
        state: 'OR',
        cost: 4000,
        delay: 51,
        bgGradient: 'linear-gradient(180deg, #FF7657 0%, #E84D2B 100%)',
        isPeak: false,
      },
      {
        city: 'Chicago',
        state: 'IL',
        cost: 6000,
        delay: 60,
        bgGradient: 'linear-gradient(180deg, #FF5D3C 0%, #D42B08 100%)',
        isPeak: true,
      },
    ],
    []
  );

  const MAX_CEILING = 6500;
  const MORTGAGE_BENCHMARK = 2850;
  const mortgageRatio = MORTGAGE_BENCHMARK / MAX_CEILING;

  // ---------------------------------------------------------------------------
  // 2. TIMING & SPRINGS
  // ---------------------------------------------------------------------------
  // Header animation
  const headerSpring = spring({
    frame,
    fps,
    config: {damping: 15, stiffness: 100},
  });

  // Mortgage line drawing across
  const lineProgress = interpolate(frame, [20, 55], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

  // Bottom quote banner spring
  const quoteSpring = spring({
    frame: frame - 80,
    fps,
    config: {damping: 14, stiffness: 90},
  });

  // Chicago peak beacon pulse
  const peakPulse = Math.sin((frame - 80) * 0.14) * 0.5 + 0.5;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BRAND_COLORS.canvasBg,
        padding: `${50 * scale}px ${70 * scale}px`,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        overflow: 'hidden',
      }}
    >
      {/* --------------------------------------------------------------------- */}
      {/* 1. BROADCAST HEADLINE                                                 */}
      {/* --------------------------------------------------------------------- */}
      <div
        style={{
          transform: `translateY(${(1 - headerSpring) * -25}px)`,
          opacity: headerSpring,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{display: 'flex', alignItems: 'center', gap: 12 * scale, marginBottom: 8 * scale}}>
            <span
              style={{
                backgroundColor: BRAND_COLORS.coral,
                color: BRAND_COLORS.white,
                padding: `${6 * scale}px ${16 * scale}px`,
                borderRadius: 100 * scale,
                fontSize: 16 * scale,
                fontWeight: 900,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              The Cost Spectrum
            </span>
            <span
              style={{
                fontSize: 20 * scale,
                fontWeight: 700,
                color: BRAND_COLORS.deepNavy,
                opacity: 0.65,
                letterSpacing: '0.04em',
              }}
            >
              16 Real Parent Submissions
            </span>
          </div>
          <h1
            style={{
              fontFamily: brandSerifFont,
              fontSize: 56 * scale,
              fontWeight: 900,
              color: BRAND_COLORS.deepNavy,
              margin: 0,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
            }}
          >
            The Childcare Escalation Curve
          </h1>
        </div>

        {/* Spread Delta Callout */}
        <div
          style={{
            textAlign: 'right',
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(12px)',
            padding: `${14 * scale}px ${28 * scale}px`,
            borderRadius: 22 * scale,
            border: `2px solid rgba(255, 255, 255, 0.95)`,
            boxShadow: `0 ${10 * scale}px ${30 * scale}px rgba(35, 64, 111, 0.08)`,
          }}
        >
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 * scale}}>
            <TrendingUp size={24 * scale} color={BRAND_COLORS.coral} />
            <span style={{fontSize: 38 * scale, fontWeight: 900, color: BRAND_COLORS.coral, lineHeight: 1}}>
              +367%
            </span>
          </div>
          <span style={{fontSize: 16 * scale, fontWeight: 700, color: '#64748b', display: 'block', marginTop: 4 * scale}}>
            Lowest to Highest Spread
          </span>
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* 2. THE HERO CHART STAGE                                               */}
      {/* --------------------------------------------------------------------- */}
      <div
        style={{
          position: 'relative',
          height: '60%',
          width: '100%',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          paddingBottom: 56 * scale,
        }}
      >
        {/* MORTGAGE BENCHMARK THRESHOLD LINE */}
        <div
          style={{
            position: 'absolute',
            bottom: `${mortgageRatio * 100}%`,
            left: 0,
            right: 0,
            width: `${lineProgress * 100}%`,
            borderTop: `${3 * scale}px dashed ${BRAND_COLORS.deepNavy}`,
            opacity: lineProgress * 0.45,
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        {/* Benchmark Label Badge */}
        <div
          style={{
            position: 'absolute',
            bottom: `calc(${mortgageRatio * 100}% + ${10 * scale}px)`,
            left: 0,
            opacity: interpolate(lineProgress, [0.3, 1], [0, 1], {extrapolateLeft: 'clamp'}),
            display: 'flex',
            alignItems: 'center',
            gap: 10 * scale,
            backgroundColor: BRAND_COLORS.deepNavy,
            color: BRAND_COLORS.white,
            padding: `${8 * scale}px ${20 * scale}px`,
            borderRadius: 100 * scale,
            boxShadow: `0 ${8 * scale}px ${24 * scale}px rgba(35, 64, 111, 0.22)`,
            zIndex: 10,
          }}
        >
          <Home size={20 * scale} color={BRAND_COLORS.coral} />
          <span style={{fontSize: 18 * scale, fontWeight: 800, letterSpacing: '0.04em'}}>
            US Average Home Mortgage: $2,850/mo
          </span>
        </div>

        {/* THE 6 PILLARS */}
        {pillars.map((item) => {
          const barSpring = spring({
            frame: frame - item.delay,
            fps,
            config: {damping: 14, stiffness: 100, mass: 0.8},
          });

          const barHeightPercent = (item.cost / MAX_CEILING) * 100;
          const animatedHeight = barSpring * barHeightPercent;
          const animatedCost = Math.round(barSpring * item.cost);

          return (
            <div
              key={item.city}
              style={{
                flex: 1,
                maxWidth: 165 * scale,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
                position: 'relative',
                zIndex: 2,
              }}
            >
              {/* Floating Price Counter */}
              <div
                style={{
                  opacity: barSpring,
                  transform: `translateY(${(1 - barSpring) * 15}px)`,
                  marginBottom: 14 * scale,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                {item.isPeak && (
                  <div
                    style={{
                      backgroundColor: '#DC2626',
                      color: BRAND_COLORS.white,
                      padding: `${4 * scale}px ${14 * scale}px`,
                      borderRadius: 100 * scale,
                      fontSize: 14 * scale,
                      fontWeight: 900,
                      letterSpacing: '0.08em',
                      marginBottom: 8 * scale,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4 * scale,
                      boxShadow: `0 0 ${18 * scale * peakPulse}px rgba(220, 38, 38, 0.65)`,
                    }}
                  >
                    PEAK <ArrowUpRight size={15 * scale} />
                  </div>
                )}
                <div
                  style={{
                    fontSize: item.isPeak ? 46 * scale : 34 * scale,
                    fontWeight: 900,
                    color: item.isPeak ? '#DC2626' : BRAND_COLORS.deepNavy,
                    fontVariantNumeric: 'tabular-nums',
                    letterSpacing: '-0.02em',
                    lineHeight: 1,
                  }}
                >
                  ${animatedCost.toLocaleString()}
                </div>
                <span
                  style={{
                    fontSize: 18 * scale,
                    fontWeight: 700,
                    color: '#64748b',
                    marginTop: 2 * scale,
                  }}
                >
                  /mo
                </span>
              </div>

              {/* Sculptural Pillar */}
              <div
                style={{
                  width: '100%',
                  height: `${animatedHeight}%`,
                  background: item.bgGradient,
                  borderRadius: `${20 * scale}px ${20 * scale}px ${6 * scale}px ${6 * scale}px`,
                  boxShadow: item.isPeak
                    ? `0 0 ${35 * scale * peakPulse}px rgba(255, 93, 60, 0.45), 0 20px 40px rgba(35, 64, 111, 0.16)`
                    : `0 ${16 * scale}px ${35 * scale}px rgba(35, 64, 111, 0.12)`,
                  transition: 'box-shadow 0.15s ease',
                  border: `2.5px solid rgba(255, 255, 255, 0.85)`,
                  borderBottom: 'none',
                  boxSizing: 'border-box',
                }}
              />

              {/* City & State Label Below Axis */}
              <div
                style={{
                  position: 'absolute',
                  bottom: -48 * scale,
                  textAlign: 'center',
                  width: '130%',
                }}
              >
                <div
                  style={{
                    fontSize: 22 * scale,
                    fontWeight: 800,
                    color: BRAND_COLORS.deepNavy,
                    letterSpacing: '-0.01em',
                    lineHeight: 1.1,
                  }}
                >
                  {item.city}
                </div>
                <div
                  style={{
                    fontSize: 17 * scale,
                    fontWeight: 700,
                    color: '#64748b',
                    letterSpacing: '0.04em',
                    marginTop: 2 * scale,
                  }}
                >
                  {item.state}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* 3. EDITORIAL TAKEAWAY RIBBON                                          */}
      {/* --------------------------------------------------------------------- */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(16px)',
          borderRadius: 24 * scale,
          padding: `${22 * scale}px ${38 * scale}px`,
          border: `2px solid rgba(255, 255, 255, 0.95)`,
          boxShadow: `0 ${16 * scale}px ${45 * scale}px rgba(35, 64, 111, 0.08)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transform: `translateY(${(1 - quoteSpring) * 30}px)`,
          opacity: quoteSpring,
          gap: 24 * scale,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 16 * scale}}>
          <div
            style={{
              width: 14 * scale,
              height: 14 * scale,
              borderRadius: '50%',
              backgroundColor: BRAND_COLORS.coral,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: brandSerifFont,
              fontSize: 26 * scale,
              color: BRAND_COLORS.deepNavy,
              fontStyle: 'italic',
              lineHeight: 1.25,
            }}
          >
            "Childcare isn't just an expense anymore. In over half the country, it has surpassed the average US mortgage."
          </span>
        </div>

        <span
          style={{
            backgroundColor: BRAND_COLORS.blushPink,
            color: BRAND_COLORS.deepNavy,
            fontSize: 18 * scale,
            fontWeight: 800,
            padding: `${8 * scale}px ${20 * scale}px`,
            borderRadius: 100 * scale,
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          2.8x Average College Tuition
        </span>
      </div>
    </AbsoluteFill>
  );
};

export default Scene15_DataVisualization;