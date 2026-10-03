import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/* ===========================================================================
   SCENE 01 — MARKET NETWORK
   ---------------------------------------------------------------------------
   The hero globe from the comp: a dark sphere of continent-ish point noise,
   a lattice of red nodes on its surface, great-circle arcs between them, and
   red energy pulses travelling along those arcs.

   Everything is generated from a seeded PRNG so the composition is identical
   on every load — a hero that reshuffles itself each refresh reads as noise,
   not infrastructure.

   Budget: one Points cloud, one LineSegments, one instanced node mesh, one
   small Points cloud for pulses. Four draw calls total.
   =========================================================================== */

/** Mulberry32 — tiny deterministic PRNG. */
function rng(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Evenly distributed points on a sphere (Fibonacci lattice). */
function fibonacciSphere(count, radius, jitter = 0, rand = Math.random) {
  const pts = []
  const phi = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2
    const r = Math.sqrt(Math.max(0, 1 - y * y))
    const theta = phi * i
    const j = jitter ? 1 + (rand() - 0.5) * jitter : 1
    pts.push(
      new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r).multiplyScalar(radius * j)
    )
  }
  return pts
}

const RADIUS = 2.05

function useNetwork(density) {
  return useMemo(() => {
    const rand = rng(20260928)

    /* ── Surface dust: the "continents" ──────────────────────────────────
       Clustered around a handful of seed points so the sphere reads as
       landmass-and-ocean rather than uniform static. */
    const dustCount = density === 'low' ? 1400 : density === 'mid' ? 2800 : 4400
    const seeds = fibonacciSphere(9, 1, 0, rand)
    const dust = new Float32Array(dustCount * 3)
    const dustAlpha = new Float32Array(dustCount)
    const dustTint = new Float32Array(dustCount)

    // Two of the nine landmasses are "hot" — their lights read red rather than
    // white, which is what gives the comp's globe its glowing-cities look.
    const hotSeeds = new Set([2, 6])

    for (let i = 0; i < dustCount; i++) {
      const seedIndex = Math.floor(rand() * seeds.length)
      const seed = seeds[seedIndex]
      // Random direction biased toward the seed → soft blobs.
      const spread = 0.42 + rand() * 0.5
      const v = new THREE.Vector3(
        seed.x + (rand() - 0.5) * spread * 2,
        seed.y + (rand() - 0.5) * spread * 2,
        seed.z + (rand() - 0.5) * spread * 2
      )
        .normalize()
        .multiplyScalar(RADIUS * (1 + rand() * 0.004))

      dust.set([v.x, v.y, v.z], i * 3)
      // Mostly dim, with roughly one point in twelve bright. These stack
      // additively, so a uniformly bright field blows the sphere out to white.
      dustAlpha[i] = rand() < 0.13 ? 0.6 + rand() * 0.4 : 0.1 + rand() * 0.26
      dustTint[i] = hotSeeds.has(seedIndex) ? 0.55 + rand() * 0.45 : rand() * 0.14
    }

    /* ── Network nodes ───────────────────────────────────────────────── */
    const nodeCount = density === 'low' ? 26 : density === 'mid' ? 40 : 54
    const nodes = fibonacciSphere(nodeCount, RADIUS * 1.005, 0.015, rand)

    /* ── Connections: each node links to its 2–3 nearest neighbours, so
          the lattice is local and even rather than a tangle of long chords. */
    const edges = []
    const seen = new Set()
    nodes.forEach((a, i) => {
      const near = nodes
        .map((b, j) => ({ j, d: a.distanceTo(b) }))
        .filter((o) => o.j !== i)
        .sort((x, y) => x.d - y.d)
        .slice(0, 2 + (i % 2))

      near.forEach(({ j }) => {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`
        if (seen.has(key)) return
        seen.add(key)
        edges.push([i, j])
      })
    })

    /* Arcs bowed outward along the great circle, sampled into segments. */
    const SEG = 10
    const linePos = new Float32Array(edges.length * SEG * 2 * 3)
    const lineAlpha = new Float32Array(edges.length * SEG * 2)
    const paths = []

    let p = 0
    let q = 0
    edges.forEach(([i, j]) => {
      const a = nodes[i]
      const b = nodes[j]
      const pts = []
      for (let s = 0; s <= SEG; s++) {
        const t = s / SEG
        const v = a.clone().lerp(b, t).normalize()
        // bow: peaks at the midpoint. Kept shallow so arcs stay inside the
        // atmosphere shell instead of breaking the globe's silhouette.
        const lift = 1 + Math.sin(t * Math.PI) * 0.035
        pts.push(v.multiplyScalar(RADIUS * 1.008 * lift))
      }
      paths.push(pts)

      for (let s = 0; s < SEG; s++) {
        const v0 = pts[s]
        const v1 = pts[s + 1]
        linePos.set([v0.x, v0.y, v0.z, v1.x, v1.y, v1.z], p)
        p += 6
        // fade the ends so edges don't terminate in a hard dot
        const f = Math.sin((s / SEG) * Math.PI) * 0.75 + 0.25
        lineAlpha[q] = f
        lineAlpha[q + 1] = f
        q += 2
      }
    })

    /* ── Pulses: packets of value moving through the network ─────────── */
    const pulseCount = density === 'low' ? 10 : density === 'mid' ? 18 : 26
    const pulses = Array.from({ length: pulseCount }, (_, i) => ({
      path: paths[Math.floor(rand() * paths.length)],
      t: rand(),
      speed: 0.1 + rand() * 0.2,
      dir: rand() > 0.5 ? 1 : -1,
    }))

    return { dust, dustAlpha, dustTint, nodes, linePos, lineAlpha, pulses, paths, pulseCount }
  }, [density])
}

/* ── Shader for the dust/pulse point clouds: round, soft, per-point alpha ── */
const POINT_VERT = /* glsl */ `
  attribute float alpha;
  attribute float size;
  attribute float tint;
  varying float vAlpha;
  varying float vTint;
  void main() {
    vAlpha = alpha;
    vTint = tint;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    // 10.0 is tuned against the camera distance (z ≈ 6) to land dust at
    // 1.5–3 device px. Larger and the points merge into a solid disc.
    gl_PointSize = size * (10.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`

const POINT_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uHot;
  varying float vAlpha;
  varying float vTint;
  void main() {
    vec2 c = gl_PointCoord - vec2(0.5);
    float d = length(c);
    if (d > 0.5) discard;
    float soft = smoothstep(0.5, 0.08, d);
    gl_FragColor = vec4(mix(uColor, uHot, vTint), vAlpha * soft);
  }
`

export default function MarketNetwork({ density = 'high', pointer, paused = false }) {
  const net = useNetwork(density)
  const group = useRef()
  const pulseGeo = useRef()
  const { viewport } = useThree()

  /* Dust geometry */
  const dustGeo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(net.dust, 3))
    g.setAttribute('alpha', new THREE.BufferAttribute(net.dustAlpha, 1))
    g.setAttribute('tint', new THREE.BufferAttribute(net.dustTint, 1))
    const sizes = new Float32Array(net.dustAlpha.length)
    for (let i = 0; i < sizes.length; i++) sizes[i] = 1.0 + (i % 5) * 0.22
    g.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
    return g
  }, [net])

  /* Line geometry */
  const lineGeo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(net.linePos, 3))
    g.setAttribute('alpha', new THREE.BufferAttribute(net.lineAlpha, 1))
    return g
  }, [net])

  /* Pulse geometry — positions rewritten every frame */
  const pulsePos = useMemo(() => new Float32Array(net.pulseCount * 3), [net])
  const pulseAlpha = useMemo(() => new Float32Array(net.pulseCount).fill(1), [net])
  const pulseSize = useMemo(() => new Float32Array(net.pulseCount).fill(4.2), [net])
  const pulseTint = useMemo(() => new Float32Array(net.pulseCount).fill(0), [net])

  useFrame((state, delta) => {
    if (paused) return
    const dt = Math.min(delta, 0.05)

    /* Slow, continuous rotation — markets never stop moving. */
    if (group.current) {
      group.current.rotation.y += dt * 0.055

      /* Mouse parallax: the globe leans toward the cursor, it does not spin
         with it. Heavily damped so it reads as weight, not reactivity. */
      const px = pointer?.current?.x ?? 0
      const py = pointer?.current?.y ?? 0
      group.current.rotation.x += (py * 0.17 - 0.1 - group.current.rotation.x) * 0.045
      group.current.position.x += (px * 0.12 - group.current.position.x) * 0.045
    }

    /* Advance pulses along their arcs */
    const arr = pulsePos
    net.pulses.forEach((pulse, i) => {
      pulse.t += pulse.speed * pulse.dir * dt
      if (pulse.t > 1) pulse.t -= 1
      if (pulse.t < 0) pulse.t += 1

      const pts = pulse.path
      const f = pulse.t * (pts.length - 1)
      const i0 = Math.floor(f)
      const i1 = Math.min(i0 + 1, pts.length - 1)
      const m = f - i0

      arr[i * 3] = pts[i0].x + (pts[i1].x - pts[i0].x) * m
      arr[i * 3 + 1] = pts[i0].y + (pts[i1].y - pts[i0].y) * m
      arr[i * 3 + 2] = pts[i0].z + (pts[i1].z - pts[i0].z) * m

      // breathe, so the packets twinkle rather than slide flatly
      pulseAlpha[i] = 0.55 + Math.sin(state.clock.elapsedTime * 3 + i) * 0.45
    })

    if (pulseGeo.current) {
      pulseGeo.current.attributes.position.needsUpdate = true
      pulseGeo.current.attributes.alpha.needsUpdate = true
    }
  })

  // Keep the globe a sensible size on narrow viewports.
  const scale = Math.min(1, Math.max(0.62, viewport.width / 10))

  return (
    <group ref={group} scale={scale} rotation={[-0.1, 0, 0.12]}>
      {/* Occluder: an almost-black sphere just inside the radius so the far
          side of the network is hidden and the globe reads as solid. */}
      <mesh>
        <sphereGeometry args={[RADIUS * 0.985, 48, 48]} />
        <meshBasicMaterial color="#060607" />
      </mesh>

      {/* Continent dust */}
      <points geometry={dustGeo}>
        <shaderMaterial
          vertexShader={POINT_VERT}
          fragmentShader={POINT_FRAG}
          uniforms={{
            uColor: { value: new THREE.Color('#c6c6ce') },
            uHot: { value: new THREE.Color('#FF4A2E') },
          }}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Connection arcs */}
      <lineSegments geometry={lineGeo}>
        <shaderMaterial
          vertexShader={/* glsl */ `
            attribute float alpha;
            varying float vAlpha;
            void main() {
              vAlpha = alpha;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={/* glsl */ `
            uniform vec3 uColor;
            varying float vAlpha;
            void main() { gl_FragColor = vec4(uColor, vAlpha * 0.5); }
          `}
          uniforms={{ uColor: { value: new THREE.Color('#FF0B2A') } }}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* Nodes */}
      {net.nodes.map((n, i) => (
        <mesh key={i} position={n}>
          <sphereGeometry args={[0.022, 8, 8]} />
          <meshBasicMaterial color="#FF2F46" toneMapped={false} />
        </mesh>
      ))}

      {/* Travelling pulses */}
      <points>
        <bufferGeometry ref={pulseGeo}>
          <bufferAttribute attach="attributes-position" args={[pulsePos, 3]} />
          <bufferAttribute attach="attributes-alpha" args={[pulseAlpha, 1]} />
          <bufferAttribute attach="attributes-size" args={[pulseSize, 1]} />
          <bufferAttribute attach="attributes-tint" args={[pulseTint, 1]} />
        </bufferGeometry>
        <shaderMaterial
          vertexShader={POINT_VERT}
          fragmentShader={POINT_FRAG}
          uniforms={{
            uColor: { value: new THREE.Color('#FF4B5E') },
            uHot: { value: new THREE.Color('#FF4B5E') },
          }}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Atmosphere — a faint red halo hugging the limb */}
      <mesh scale={1.025}>
        <sphereGeometry args={[RADIUS, 48, 48]} />
        <shaderMaterial
          side={THREE.BackSide}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexShader={/* glsl */ `
            varying vec3 vN;
            void main() {
              vN = normalize(normalMatrix * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={/* glsl */ `
            varying vec3 vN;
            void main() {
              float rim = pow(1.0 - abs(vN.z), 6.0);
              gl_FragColor = vec4(1.0, 0.16, 0.22, rim * 0.6);
            }
          `}
        />
      </mesh>
    </group>
  )
}
