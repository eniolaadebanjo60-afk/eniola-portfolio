import { useRef, useMemo, useEffect, useLayoutEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const THEME = "curse";
const IMAGE = "";
const VIDEO = "/videos/anime-bg.mp4";

const THEMES = {
  sea: {
    top: [0.45, 0.78, 1.0],
    bottom: [1.0, 0.93, 0.86],
    cloud: [1.0, 1.0, 1.0],
    amount: 0.8,
    speed: 0.02,
    bias: 1.0,
  },
  curse: {
    top: [0.72, 0.74, 1.0],
    bottom: [0.98, 0.93, 0.97],
    cloud: [0.36, 0.3, 0.76],
    amount: 0.3,
    speed: 0.05,
    bias: 0.0,
  },
};

const SETTINGS = {
  wide: { scale: 0.85, x: 0.27, y: 0.14 },
  narrow: { scale: 0.55, x: 0.26, y: 0.3 },
};

const OUTLINE = "#3a2d66";
const HULL = { color: [0.72, 0.45, 0.28], shade: [0.5, 0.3, 0.22] };
const SAIL = { color: [1.0, 0.98, 0.94], shade: [0.82, 0.84, 0.93] };
const FLAG = { color: [0.95, 0.3, 0.3], shade: [0.7, 0.2, 0.25] };

const reduceMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const simplex = `
vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
`;

function useMouse() {
  const mouse = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const move = (e) => {
      mouse.current.x = e.clientX / window.innerWidth;
      mouse.current.y = 1 - e.clientY / window.innerHeight;
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  return mouse;
}

function Sky({ mouse, theme }) {
  const mat = useRef();
  const smooth = useRef({ x: 0.5, y: 0.5 });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAspect: { value: 1 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uTop: { value: new THREE.Vector3(...theme.top) },
      uBottom: { value: new THREE.Vector3(...theme.bottom) },
      uCloud: { value: new THREE.Vector3(...theme.cloud) },
      uAmount: { value: theme.amount },
      uSpeed: { value: theme.speed },
      uBias: { value: theme.bias },
    }),
    [theme]
  );

  useFrame((state) => {
    smooth.current.x += (mouse.current.x - smooth.current.x) * 0.04;
    smooth.current.y += (mouse.current.y - smooth.current.y) * 0.04;
    const u = mat.current.uniforms;
    u.uTime.value = reduceMotion ? 0 : state.clock.elapsedTime;
    u.uAspect.value = state.size.width / state.size.height;
    u.uMouse.value.set(smooth.current.x, smooth.current.y);
  });

  return (
    <mesh renderOrder={-2} frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec2 vUv;
          uniform float uTime;
          uniform float uAspect;
          uniform vec2 uMouse;
          uniform vec3 uTop;
          uniform vec3 uBottom;
          uniform vec3 uCloud;
          uniform float uAmount;
          uniform float uSpeed;
          uniform float uBias;
          ${simplex}

          float fbm(vec2 p) {
            float s = 0.0;
            float a = 0.5;
            for (int i = 0; i < 4; i++) {
              s += a * snoise(p);
              p *= 2.0;
              a *= 0.5;
            }
            return s;
          }

          void main() {
            vec2 uv = vec2(vUv.x * uAspect, vUv.y);
            vec3 sky = mix(uBottom, uTop, smoothstep(0.0, 1.0, vUv.y));
            vec2 shift = (uMouse - 0.5) * 0.15;
            float t = uTime * uSpeed;
            vec2 p = vec2(uv.x * 0.9 + t + shift.x, uv.y * 2.2 + shift.y - t * 0.5);
            float cloud = smoothstep(0.05, 0.55, fbm(p));
            float low = smoothstep(0.85, 0.2, vUv.y);
            cloud *= mix(1.0, 0.35 + 0.65 * low, uBias);
            vec3 col = mix(sky, uCloud, cloud * uAmount);
            gl_FragColor = vec4(col, 1.0);
          }
        `}
      />
    </mesh>
  );
}

function Toon({ color, shade }) {
  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Vector3(...color) },
      uShade: { value: new THREE.Vector3(...shade) },
    }),
    []
  );

  return (
    <shaderMaterial
      uniforms={uniforms}
      vertexShader={`
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `}
      fragmentShader={`
        uniform vec3 uColor;
        uniform vec3 uShade;
        varying vec3 vNormal;
        void main() {
          float d = dot(normalize(vNormal), normalize(vec3(-0.5, 0.8, 0.7)));
          vec3 col = mix(uShade, uColor, step(0.15, d));
          col = mix(col, vec3(1.0), step(0.93, d) * 0.3);
          gl_FragColor = vec4(col, 1.0);
        }
      `}
    />
  );
}

function Piece({ palette, outline = 1.1, children, ...props }) {
  return (
    <mesh {...props}>
      {children}
      <Toon color={palette.color} shade={palette.shade} />
      <mesh scale={outline}>
        {children}
        <meshBasicMaterial color={OUTLINE} side={THREE.BackSide} />
      </mesh>
    </mesh>
  );
}

function Waves() {
  const mat = useRef();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAspect: { value: 1 },
      uScroll: { value: 0 },
      uC1: { value: new THREE.Vector3(0.8, 0.92, 0.97) },
      uC2: { value: new THREE.Vector3(0.7, 0.88, 0.96) },
      uC3: { value: new THREE.Vector3(0.6, 0.83, 0.94) },
    }),
    []
  );

  useFrame((state) => {
    const u = mat.current.uniforms;
    u.uTime.value = reduceMotion ? 0 : state.clock.elapsedTime;
    u.uAspect.value = state.size.width / state.size.height;
    u.uScroll.value = Math.min(window.scrollY / window.innerHeight, 1);
  });

  return (
    <mesh renderOrder={-1} frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec2 vUv;
          uniform float uTime;
          uniform float uAspect;
          uniform float uScroll;
          uniform vec3 uC1;
          uniform vec3 uC2;
          uniform vec3 uC3;

          float layer(float x, float base, float amp, float freq, float speed, float phase) {
            return base
              + amp * sin(x * freq + uTime * speed + phase)
              + amp * 0.5 * sin(x * freq * 1.9 - uTime * speed * 1.3);
          }

          void main() {
            float x = vUv.x * uAspect;
            float y = vUv.y;
            float drop = uScroll * 0.3;
            float h1 = layer(x, 0.15 - drop, 0.012, 5.0, 0.9, 0.0);
            float h2 = layer(x, 0.11 - drop, 0.014, 4.0, 1.2, 2.0);
            float h3 = layer(x, 0.07 - drop, 0.016, 3.0, 1.5, 4.0);

            if (y > h1) discard;

            vec3 col = uC1;
            col = mix(col, uC2, step(y, h2));
            col = mix(col, uC3, step(y, h3));

            float f1 = smoothstep(h1 - 0.007, h1, y);
            float f2 = smoothstep(h2 - 0.007, h2, y) * (1.0 - step(h2, y));
            float f3 = smoothstep(h3 - 0.007, h3, y) * (1.0 - step(h3, y));
            col = mix(col, vec3(1.0), max(f1, max(f2, f3)) * 0.75);

            gl_FragColor = vec4(col, 1.0);
          }
        `}
      />
    </mesh>
  );
}

function Ship({ mouse }) {
  const group = useRef();

  useFrame((state) => {
    const t = reduceMotion ? 0 : state.clock.elapsedTime;
    const { viewport } = state;
    const narrow = viewport.width < 5;
    const scrolled = window.scrollY / window.innerHeight;
    const drop = Math.min(scrolled, 1) * 0.3;

    group.current.position.set(
      viewport.width * (narrow ? 0.18 : 0.24) + scrolled * viewport.width * 0.9,
      (-0.5 + 0.17 - drop) * viewport.height + Math.sin(t * 1.5) * 0.06,
      0
    );
    group.current.scale.setScalar(narrow ? 0.55 : 0.8);
    group.current.rotation.set(
      0,
      -0.5 + (mouse.current.x - 0.5) * 0.4,
      Math.sin(t * 1.2) * 0.05
    );
  });

  return (
    <group ref={group}>
      <Piece palette={HULL}>
        <boxGeometry args={[1.8, 0.32, 0.55]} />
      </Piece>
      <Piece palette={HULL} position={[-0.8, 0.25, 0]}>
        <boxGeometry args={[0.45, 0.32, 0.55]} />
      </Piece>
      <Piece palette={HULL} position={[1.05, 0.02, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.27, 0.5, 4]} />
      </Piece>
      <Piece palette={HULL} position={[0, 0.95, 0]} outline={1.5}>
        <cylinderGeometry args={[0.04, 0.04, 1.7, 12]} />
      </Piece>
      <Piece palette={SAIL} position={[0.05, 0.85, 0.06]} outline={[1.06, 1.05, 3]}>
        <boxGeometry args={[0.9, 0.9, 0.04]} />
      </Piece>
      <Piece palette={SAIL} position={[0.05, 1.55, 0.06]} outline={[1.08, 1.1, 3]}>
        <boxGeometry args={[0.6, 0.4, 0.04]} />
      </Piece>
      <Piece palette={FLAG} position={[0.16, 1.85, 0]} outline={1.25}>
        <boxGeometry args={[0.28, 0.14, 0.02]} />
      </Piece>
    </group>
  );
}

function Glow({ color, halo = false }) {
  const uniforms = useMemo(
    () => ({ uColor: { value: new THREE.Vector3(...color) } }),
    []
  );

  return (
    <shaderMaterial
      uniforms={uniforms}
      transparent={halo}
      depthWrite={!halo}
      vertexShader={`
        varying vec3 vN;
        varying vec3 vV;
        void main() {
          vN = normalize(normalMatrix * normal);
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vV = -mv.xyz;
          gl_Position = projectionMatrix * mv;
        }
      `}
      fragmentShader={
        halo
          ? `
        uniform vec3 uColor;
        varying vec3 vN;
        varying vec3 vV;
        void main() {
          float a = pow(max(dot(normalize(vN), normalize(vV)), 0.0), 2.5) * 0.4;
          gl_FragColor = vec4(uColor, a);
        }
      `
          : `
        uniform vec3 uColor;
        varying vec3 vN;
        varying vec3 vV;
        void main() {
          float f = pow(1.0 - max(dot(normalize(vN), normalize(vV)), 0.0), 2.0);
          vec3 col = mix(vec3(1.0), uColor, smoothstep(0.0, 0.9, f));
          gl_FragColor = vec4(col, 1.0);
        }
      `
      }
    />
  );
}

function Orb({ color, radius, innerRef }) {
  return (
    <group ref={innerRef} scale={radius}>
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <Glow color={color} />
      </mesh>
      <mesh scale={1.9}>
        <sphereGeometry args={[1, 32, 32]} />
        <Glow color={color} halo />
      </mesh>
    </group>
  );
}

function Orbs({ mouse }) {
  const group = useRef();
  const blue = useRef();
  const red = useRef();
  const core = useRef();
  const ring = useRef();

  useFrame((state) => {
    const t = reduceMotion ? 0 : state.clock.elapsedTime;
    const { viewport } = state;
    const cfg = viewport.width < 5 ? SETTINGS.narrow : SETTINGS.wide;
    const scrolled = (window.scrollY / window.innerHeight) * viewport.height;
    const mx = mouse.current.x - 0.5;
    const my = mouse.current.y - 0.5;
    const a = t * 0.9;

    group.current.position.set(
      viewport.width * cfg.x + mx * 0.5,
      viewport.height * cfg.y + scrolled + my * 0.3,
      0
    );
    group.current.scale.setScalar(cfg.scale);
    group.current.rotation.set(-my * 0.3, mx * 0.5, 0);

    blue.current.position.set(Math.cos(a) * 1.25, Math.sin(a) * 0.45, Math.sin(a) * 0.8);
    red.current.position.set(-Math.cos(a) * 1.25, -Math.sin(a) * 0.45, -Math.sin(a) * 0.8);
    core.current.scale.setScalar(0.42 + 0.05 * Math.sin(t * 3));
    ring.current.rotation.set(1.2, 0.3, t * 0.3);
  });

  return (
    <group ref={group}>
      <Orb color={[0.25, 0.55, 1.0]} radius={0.32} innerRef={blue} />
      <Orb color={[1.0, 0.25, 0.3]} radius={0.32} innerRef={red} />
      <Orb color={[0.62, 0.3, 1.0]} radius={0.42} innerRef={core} />
      <mesh ref={ring}>
        <torusGeometry args={[1.25, 0.015, 8, 96]} />
        <meshBasicMaterial color="#7c5cff" transparent opacity={0.55} />
      </mesh>
    </group>
  );
}

function Bits() {
  const mesh = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const data = useMemo(
    () =>
      Array.from({ length: 44 }, () => ({
        x: Math.random(),
        y: Math.random(),
        z: -1 + Math.random() * 1.5,
        speed: 0.1 + Math.random() * 0.2,
        sway: Math.random() * 6.28,
        size: 0.4 + Math.random() * 0.9,
      })),
    []
  );

  useLayoutEffect(() => {
    const tints = ["#6b4fd8", "#8f6bff", "#3b2f9e", "#b49cff"];
    const c = new THREE.Color();
    data.forEach((_, i) => {
      c.set(tints[i % 4]);
      mesh.current.setColorAt(i, c);
    });
    mesh.current.instanceColor.needsUpdate = true;
  }, [data]);

  useFrame((state) => {
    const t = reduceMotion ? 0 : state.clock.elapsedTime;
    const { width, height } = state.viewport;
    const H = height + 1;

    data.forEach((p, i) => {
      const y = ((p.y * H + t * p.speed) % H) - H / 2;
      const x = (p.x - 0.5) * (width + 1) + Math.sin(t * 0.7 + p.sway) * 0.3;
      dummy.position.set(x, y, p.z);
      dummy.scale.setScalar(p.size);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, 44]} frustumCulled={false}>
      <circleGeometry args={[0.04, 12]} />
      <meshBasicMaterial transparent opacity={0.6} depthWrite={false} />
    </instancedMesh>
  );
}

function Scene() {
  const mouse = useMouse();

  return (
    <>
      <Sky mouse={mouse} theme={THEMES[THEME]} />
      {THEME === "sea" ? (
        <>
          <Waves />
          <Ship mouse={mouse} />
        </>
      ) : (
        <>
          <Bits />
          <Orbs mouse={mouse} />
        </>
      )}
    </>
  );
}

function MediaBackground() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes bg-drift {
          from { transform: scale(1.08) translate(0, 0); }
          to { transform: scale(1.18) translate(-2%, -1.5%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .bg-media { animation: none !important; }
        }
      `}</style>

      {VIDEO ? (
        <video
          className="bg-media"
          src={VIDEO}
          autoPlay
          muted
          loop
          playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "saturate(0.85)",
          }}
        />
      ) : (
        <div
          className="bg-media"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${IMAGE})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "saturate(0.85)",
            animation: "bg-drift 30s ease-in-out infinite alternate",
          }}
        />
      )}

      <div
        style={{ position: "absolute", inset: 0, background: "rgba(var(--bg-rgb), 0.5)" }}
      />
    </div>
  );
}

export default function SmoothBackground() {
  if (IMAGE || VIDEO) return <MediaBackground />;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none" }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}