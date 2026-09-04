import React, {useMemo, Suspense} from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useLoader} from '@react-three/fiber';
import {PerspectiveCamera} from '@react-three/drei';
import * as THREE from 'three';
import {Marker} from 'react-simple-maps';
import {MapPin, MessageSquare} from 'lucide-react';
import {
  BRAND_COLORS,
  WATER_MASK_URL,
  US_LAT,
  US_LNG,
  GLOBE_RADIUS,
  CAMERA_PRESETS,
  LOCATIONS,
  latLngToVector3,
  brandSerifFont,
} from '../../constants/mapConfig';
import {USMapRig} from '../../components/USMapRig';

// Shaders for stylized light 3D globe
const globeVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const globeFragmentShader = `
  uniform sampler2D u_waterMap;
  uniform vec3 u_oceanColor;
  uniform vec3 u_landColor;
  uniform vec3 u_borderColor;
  uniform vec3 u_lightDir;
  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    float water = texture2D(u_waterMap, vUv).r;
    float isOcean = smoothstep(0.44, 0.56, water);
    float coastEdge = 1.0 - smoothstep(0.0, 0.10, abs(water - 0.5));
    
    vec3 baseColor = mix(u_landColor, u_oceanColor, isOcean);
    baseColor = mix(baseColor, u_borderColor, coastEdge * 0.7);
    
    float diff = max(dot(vNormal, u_lightDir), 0.0);
    float light = 0.85 + 0.25 * diff;
    gl_FragColor = vec4(baseColor * light, 1.0);
  }
`;

const LightGlobe: React.FC = () => {
  const waterTexture = useLoader(THREE.TextureLoader, WATER_MASK_URL);
  const uniforms = useMemo(
    () => ({
      u_waterMap: {value: waterTexture},
      u_oceanColor: {value: new THREE.Color(BRAND_COLORS.iceBlue)},
      u_landColor: {value: new THREE.Color(BRAND_COLORS.white)},
      u_borderColor: {value: new THREE.Color(BRAND_COLORS.deepNavy)},
      u_lightDir: {value: new THREE.Vector3(1.0, 1.2, 1.4).normalize()},
    }),
    [waterTexture]
  );

  return (
    <group>
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
        <shaderMaterial
          vertexShader={globeVertexShader}
          fragmentShader={globeFragmentShader}
          uniforms={uniforms}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS + 0.003, 24, 12]} />
        <meshBasicMaterial
          color={BRAND_COLORS.deepNavy}
          wireframe
          transparent
          opacity={0.08}
        />
      </mesh>
      <mesh scale={1.03}>
        <sphereGeometry args={[GLOBE_RADIUS, 48, 48]} />
        <meshBasicMaterial
          color={BRAND_COLORS.blushPink}
          transparent
          opacity={0.35}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
};

const GlobeMarker: React.FC<{
  position: THREE.Vector3;
  appearFrame: number;
}> = ({position, appearFrame}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const ringQuaternion = useMemo(() => {
    const normal = position.clone().normalize();
    return new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
  }, [position]);

  if (frame < appearFrame) return null;

  const localFrame = frame - appearFrame;
  const popScale = spring({frame: localFrame, fps, config: {damping: 12, stiffness: 200}});
  const rippleProgress = (localFrame % 28) / 28;
  const rippleScale = interpolate(rippleProgress, [0, 1], [0.8, 3.4]);
  const rippleOpacity = interpolate(rippleProgress, [0, 0.4, 1], [0.9, 0.4, 0]);

  return (
    <group position={position.toArray()} scale={[popScale, popScale, popScale]}>
      <mesh>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshBasicMaterial color={BRAND_COLORS.coral} />
      </mesh>
      <mesh quaternion={ringQuaternion} scale={[rippleScale, rippleScale, 1]}>
        <ringGeometry args={[0.04, 0.075, 32]} />
        <meshBasicMaterial
          color={BRAND_COLORS.coral}
          transparent
          opacity={rippleOpacity}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

export const Scene1_GlobeToVirginia: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height, fps} = useVideoConfig();

  // 4K Responsive Scale Factor (2.0 at 3840x2160)
  const scale = useMemo(() => height / 1080, [height]);
  const GLOBE_DURATION = 120;
  const CROSSFADE = 25;

  const location = LOCATIONS.norfolk;

  // 3D Globe Rotations & Camera Zoom
  const targetRotationY = ((-90 - US_LNG) * Math.PI) / 180;
  const targetTiltX = (US_LAT * Math.PI) / 180;

  const spinRotationY = interpolate(
    frame,
    [0, 75],
    [targetRotationY - Math.PI * 4, targetRotationY],
    {extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)}
  );
  const tiltX = interpolate(frame, [0, 75], [0.1, targetTiltX], {
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const cameraZ = interpolate(frame, [75, 120], [6, 2.3], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const usPosition = useMemo(
    () => latLngToVector3(US_LAT, US_LNG, GLOBE_RADIUS + 0.015),
    []
  );

  // Crossfade between 3D Globe and 2D Map
  const globeOpacity = interpolate(
    frame,
    [GLOBE_DURATION - CROSSFADE, GLOBE_DURATION],
    [1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad)}
  );
  const mapOpacity = interpolate(
    frame,
    [GLOBE_DURATION - CROSSFADE, GLOBE_DURATION],
    [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad)}
  );

  // 2D Timeline
  const mapLocalFrame = Math.max(0, frame - (GLOBE_DURATION - CROSSFADE));

  // Virginia highlight (frame 35 local)
  const highlightProgress = spring({
    frame: mapLocalFrame - 35,
    fps,
    config: {damping: 16, stiffness: 80},
  });

  // Camera zoom into Virginia (frames 68 to 110 local)
  const ZOOM_START = 68;
  const ZOOM_DURATION = 42;
  const zoomProgress = interpolate(
    mapLocalFrame,
    [ZOOM_START, ZOOM_START + ZOOM_DURATION],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.cubic),
    }
  );

  // Framed camera parameters with txFactor = -0.28
  const currentZoom = interpolate(
    zoomProgress,
    [0, 1],
    [CAMERA_PRESETS.fullUS.zoom, CAMERA_PRESETS.virginia.zoom]
  );
  const currentTx = interpolate(
    zoomProgress,
    [0, 1],
    [0, CAMERA_PRESETS.virginia.txFactor * width]
  );
  const currentTy = interpolate(
    zoomProgress,
    [0, 1],
    [0, CAMERA_PRESETS.virginia.tyFactor * height]
  );

  // Upper Third Header Badge (frame 112)
  const headerSpring = spring({
    frame: mapLocalFrame - 112,
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

  // Pin drops at frame 118
  const pinSpring = spring({
    frame: mapLocalFrame - 118,
    fps,
    config: {damping: 12, stiffness: 180, mass: 0.6},
  });
  const pinScale = interpolate(pinSpring, [0, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const localRippleFrame = Math.max(0, mapLocalFrame - 121);
  const rippleScale = interpolate((localRippleFrame % 30) / 30, [0, 1], [1, 2.6]);
  const rippleOpacity = interpolate((localRippleFrame % 30) / 30, [0, 1], [0.75, 0]);

  // DM Card pops at frame 128
  const cardSpring = spring({
    frame: mapLocalFrame - 128,
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

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND_COLORS.canvasBg, overflow: "hidden" }}>
      {/* GLOBAL SVG OVERFLOW OVERRIDE: Eliminates SVG viewBox edge slicing */}
      <style>{`
        svg, .rsm-svg {
          overflow: visible !important;
        }
      `}</style>

      {/* 3D Light Globe Layer */}
      <AbsoluteFill style={{opacity: globeOpacity}}>
        <ThreeCanvas width={width} height={height}>
          <ambientLight intensity={1.1} />
          <directionalLight position={[5, 6, 7]} intensity={1.3} color="#FFFFFF" />
          <directionalLight position={[-6, -3, -4]} intensity={0.4} color={BRAND_COLORS.lilac} />
          <group rotation={[tiltX, spinRotationY, 0]}>
            <Suspense fallback={null}>
              <LightGlobe />
            </Suspense>
            <GlobeMarker position={usPosition} appearFrame={75} />
          </group>
          <PerspectiveCamera makeDefault position={[0, 0, cameraZ]} fov={45} />
        </ThreeCanvas>
      </AbsoluteFill>

      {/* 2D Map Layer */}
      <AbsoluteFill style={{opacity: mapOpacity}}>
        <USMapRig
          width={width}
          height={height}
          scale={scale}
          currentZoom={currentZoom}
          currentTx={currentTx}
          currentTy={currentTy}
          transformOrigin={CAMERA_PRESETS.virginia.origin}
          highlightedState={location.state}
          highlightProgress={highlightProgress}
        >
          {mapLocalFrame >= 118 && (
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

                {/* Pin */}
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

                {/* Unclipped DM Cost Card (Safety buffered width & height) */}
                {cardOpacity > 0 && (
                  <foreignObject
                    x={location.cardOffsetX * scale}
                    y={location.cardOffsetY * scale + cardY}
                    width={560 * scale}
                    height={320 * scale}
                    style={{opacity: cardOpacity, overflow: 'visible'}}
                  >
                    <div
                      style={{
                        width: 490 * scale, // Fixed width leaves 70px buffer inside foreignObject
                        background: 'rgba(255, 255, 255, 0.97)',
                        border: `${2.5 * scale}px solid rgba(255, 255, 255, 0.95)`,
                        borderRadius: 24 * scale,
                        padding: `${20 * scale}px ${24 * scale}px`,
                        boxShadow: `0 ${18 * scale}px ${42 * scale}px rgba(35, 64, 111, 0.16)`,
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 6 * scale,
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                        boxSizing: 'border-box',
                      }}
                    >
                      {/* Row 1: Sender Handle & Demographic Tag */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 10 * scale,
                        }}
                      >
                        <div style={{display: 'flex', alignItems: 'center', gap: 8 * scale}}>
                          <MessageSquare size={22 * scale} color={BRAND_COLORS.coral} />
                          <span
                            style={{
                              fontSize: 22 * scale,
                              fontWeight: 800,
                              color: BRAND_COLORS.deepNavy,
                              letterSpacing: '-0.01em',
                            }}
                          >
                            {location.sender}
                          </span>
                        </div>
                        <div
                          style={{
                            backgroundColor: BRAND_COLORS.blushPink,
                            color: BRAND_COLORS.deepNavy,
                            padding: `${4 * scale}px ${10 * scale}px`,
                            borderRadius: 100 * scale,
                            fontSize: 14 * scale,
                            fontWeight: 700,
                            letterSpacing: '0.01em',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {location.kidsCount} • {location.kidsAge}
                        </div>
                      </div>

                      {/* Row 2: Location */}
                      <div
                        style={{
                          fontSize: 18 * scale,
                          fontWeight: 700,
                          color: BRAND_COLORS.deepNavy,
                          opacity: 0.75,
                        }}
                      >
                        {location.city}, {location.state}
                      </div>

                      {/* Row 3: Hero Monthly Price */}
                      <div
                        style={{
                          fontSize: 58 * scale,
                          fontWeight: 900,
                          color: BRAND_COLORS.coral,
                          lineHeight: 1,
                          letterSpacing: '-0.02em',
                          display: 'flex',
                          alignItems: 'baseline',
                        }}
                      >
                        {location.cost}
                        <span
                          style={{
                            fontSize: 22 * scale,
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
                          fontSize: 20 * scale,
                          lineHeight: 1.32,
                          color: BRAND_COLORS.deepNavy,
                          fontFamily: brandSerifFont,
                          fontStyle: 'italic',
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

        {/* Upper Third Header Badge */}
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
            backdropFilter: 'blur(16px)',
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
    </AbsoluteFill>
  );
};