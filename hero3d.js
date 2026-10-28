// Procedural joojeh kabob skewer for the hero.
// shortcut: built from primitives, swap for a scanned .glb (GLTFLoader) when the restaurant has one.
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const host = document.getElementById('hero3d');
if (host) init();

function init() {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  host.append(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, .1, 100);
  camera.position.set(0, .3, 11);

  scene.add(new THREE.HemisphereLight(0xffe2b8, 0x391018, 1.2));
  const key = new THREE.DirectionalLight(0xffd29a, 2.6);
  key.position.set(4, 6, 6);
  scene.add(key);
  const rim = new THREE.PointLight(0xff7a1a, 60, 20);
  rim.position.set(-3, -2.5, -2);
  scene.add(rim);

  // Canvas texture: base color with char spots
  function charTex(base, dark, spots = 60) {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const g = c.getContext('2d');
    g.fillStyle = base;
    g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < spots; i++) {
      const x = Math.random() * 256, y = Math.random() * 256, r = 4 + Math.random() * 18;
      const grd = g.createRadialGradient(x, y, 0, x, y, r);
      grd.addColorStop(0, dark);
      grd.addColorStop(1, 'transparent');
      g.fillStyle = grd;
      g.fillRect(x - r, y - r, r * 2, r * 2);
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }

  // Lumpy sphere: sine noise on vertices
  function lump(r, mat, scale, seed) {
    const geo = new THREE.SphereGeometry(r, 48, 32);
    const p = geo.attributes.position, v = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i);
      const n = Math.sin(v.x * 6 + seed) * Math.sin(v.y * 5 + seed * 2) * Math.sin(v.z * 7 + seed * 3);
      v.multiplyScalar(1 + n * .14);
      p.setXYZ(i, v.x * scale[0], v.y * scale[1], v.z * scale[2]);
    }
    geo.computeVertexNormals();
    return new THREE.Mesh(geo, mat);
  }

  const kabob = new THREE.Group();
  scene.add(kabob);

  const steel = new THREE.MeshStandardMaterial({ color: 0xd7dadd, metalness: 1, roughness: .25 });
  kabob.add(new THREE.Mesh(new THREE.BoxGeometry(8.6, .16, .035), steel));
  const tip = new THREE.Mesh(new THREE.ConeGeometry(.08, .5, 4), steel);
  tip.rotation.z = -Math.PI / 2;
  tip.position.x = 4.55;
  kabob.add(tip);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(.34, .055, 12, 40), steel);
  ring.position.x = -4.65;
  kabob.add(ring);

  const joojehTex = charTex('#e8952c', 'rgba(70,25,5,.85)', 70);
  const joojeh = new THREE.MeshStandardMaterial({ map: joojehTex, bumpMap: joojehTex, bumpScale: .04, roughness: .6 });
  const tomato = new THREE.MeshStandardMaterial({ map: charTex('#d8321e', 'rgba(40,5,0,.8)', 18), roughness: .25 });
  const pepper = new THREE.MeshStandardMaterial({ map: charTex('#3f8a2c', 'rgba(10,25,5,.8)', 22), roughness: .35, side: THREE.DoubleSide });
  const onion = new THREE.MeshStandardMaterial({ color: 0xc58ab8, roughness: .4 });

  const pieces = ['j', 'p', 'j', 't', 'j', 'o', 'j', 't', 'j', 'p'];
  pieces.forEach((k, i) => {
    const x = -3.7 + i * .82;
    let m;
    if (k === 'j') m = lump(.48, joojeh, [1.05, .95, .9], i * 1.7);
    if (k === 't') m = lump(.36, tomato, [.8, 1, 1], i);
    if (k === 'p') {
      m = new THREE.Mesh(new THREE.CylinderGeometry(.5, .5, .55, 24, 1, true, 0, Math.PI * .8), pepper);
      m.rotation.set(0, 0, Math.PI / 2);
    }
    if (k === 'o') {
      m = new THREE.Group();
      for (let r = 0; r < 4; r++) {
        const t = new THREE.Mesh(new THREE.TorusGeometry(.18 + r * .09, .03, 8, 32, Math.PI * 1.3), onion);
        t.rotation.y = Math.PI / 2;
        t.position.x = (r - 1.5) * .06;
        m.add(t);
      }
    }
    m.position.x = x;
    m.rotation.x += Math.random() * Math.PI;
    kabob.add(m);
  });

  // Rising embers
  const N = 140, emb = new Float32Array(N * 3), speed = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    emb.set([(Math.random() - .5) * 9, -3 + Math.random() * 6, (Math.random() - .5) * 3], i * 3);
    speed[i] = .006 + Math.random() * .02;
  }
  const embGeo = new THREE.BufferGeometry();
  embGeo.setAttribute('position', new THREE.BufferAttribute(emb, 3));
  const embers = new THREE.Points(embGeo, new THREE.PointsMaterial({ color: 0xffa040, size: .06, transparent: true, opacity: .9, blending: THREE.AdditiveBlending, depthWrite: false }));
  scene.add(embers);

  // Interaction: pointer leans the skewer, drag spins it
  let tx = 0, ty = 0, spin = 0, vel = 0, dragX = null;
  addEventListener('pointermove', e => { tx = (e.clientY / innerHeight - .5) * .5; ty = (e.clientX / innerWidth - .5) * .8; });
  host.addEventListener('pointerdown', e => { dragX = e.clientX; host.setPointerCapture(e.pointerId); });
  host.addEventListener('pointermove', e => { if (dragX === null) return; vel = (e.clientX - dragX) * .01; dragX = e.clientX; });
  const release = () => { dragX = null; };
  host.addEventListener('pointerup', release);
  host.addEventListener('pointercancel', release);

  function resize() {
    const { width, height } = host.getBoundingClientRect();
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    // keep the whole skewer in frame on narrow screens
    camera.position.z = width / height < 1.1 ? 15 : 9.5;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(host);
  resize();

  let running = false, t = 0;
  function frame() {
    if (!running) return;
    t += .016;
    if (!reduced) spin += .004;
    spin += vel;
    vel *= .94;
    kabob.rotation.set(tx - .25, spin, -.32 + ty * .2);
    kabob.position.y = Math.sin(t * 1.3) * .12;
    const p = embGeo.attributes.position;
    for (let i = 0; i < N; i++) {
      let y = p.getY(i) + speed[i];
      if (y > 3.5) y = -3;
      p.setY(i, y);
      p.setX(i, p.getX(i) + Math.sin(t * 2 + i) * .003);
    }
    p.needsUpdate = true;
    rim.intensity = 50 + Math.sin(t * 7) * 8 + Math.random() * 6; // charcoal flicker
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }
  new IntersectionObserver(([e]) => {
    const was = running;
    running = e.isIntersecting;
    if (running && !was) frame();
  }).observe(host);
  host.classList.add('ready');
}
