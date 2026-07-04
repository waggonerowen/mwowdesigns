/* MWOW hero — a real laptop on a marble kitchen island in a New York penthouse at night.
   Click or press any key: the lid opens and the camera dives into the screen. */
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const mount = document.getElementById("hero-3d");
const stage = document.getElementById("hero-stage");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (mount && stage) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 200);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  mount.appendChild(renderer.domElement);

  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  /* ---- materials ---- */
  const aluminum = new THREE.MeshStandardMaterial({ color: 0xd9dbde, metalness: 0.9, roughness: 0.34 });
  const darkKeys = new THREE.MeshStandardMaterial({ color: 0x1a1c20, metalness: 0.1, roughness: 0.62 });
  const bezelBlack = new THREE.MeshStandardMaterial({ color: 0x0a0b0e, metalness: 0.4, roughness: 0.25 });
  const chrome = new THREE.MeshStandardMaterial({ color: 0xe8eaee, metalness: 1.0, roughness: 0.12 });

  /* ---- 4K screen: MWOW in cool white on night blue ---- */
  const cv = document.createElement("canvas");
  cv.width = 2560;
  cv.height = 1600;
  const cx = cv.getContext("2d");
  cx.fillStyle = "#0d1119";
  cx.fillRect(0, 0, cv.width, cv.height);
  const grad = cx.createRadialGradient(1280, 800, 150, 1280, 800, 1550);
  grad.addColorStop(0, "rgba(143,198,239,0.28)");
  grad.addColorStop(1, "rgba(143,198,239,0)");
  cx.fillStyle = grad;
  cx.fillRect(0, 0, cv.width, cv.height);
  cx.fillStyle = "#eaf3fb";
  cx.font = "800 400px 'Bricolage Grotesque', sans-serif";
  cx.textAlign = "center";
  cx.textBaseline = "middle";
  cx.fillText("MWOW", 1280, 700);
  cx.font = "400 86px 'Space Mono', monospace";
  cx.fillStyle = "#8fa9c4";
  cx.fillText("M A K E   W E B S I T E S   O U R   W A Y", 1280, 1050);
  const screenTex = new THREE.CanvasTexture(cv);
  screenTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const screenMat = new THREE.MeshBasicMaterial({ map: screenTex });

  /* ---- white marble island ---- */
  const mcv = document.createElement("canvas");
  mcv.width = mcv.height = 2048;
  const mx = mcv.getContext("2d");
  mx.fillStyle = "#f3f2ef";
  mx.fillRect(0, 0, 2048, 2048);
  for (let i = 0; i < 60; i++) {
    const g = mx.createRadialGradient(
      Math.random() * 2048, Math.random() * 2048, 20,
      Math.random() * 2048, Math.random() * 2048, 260 + Math.random() * 420
    );
    g.addColorStop(0, `rgba(${196 + Math.random() * 26}, ${198 + Math.random() * 24}, ${205 + Math.random() * 20}, 0.09)`);
    g.addColorStop(1, "rgba(225,225,230,0)");
    mx.fillStyle = g;
    mx.fillRect(0, 0, 2048, 2048);
  }
  /* long dramatic calacatta veins */
  for (let i = 0; i < 14; i++) {
    mx.strokeStyle = `rgba(108,114,128,${0.10 + Math.random() * 0.16})`;
    mx.lineWidth = 1.5 + Math.random() * 4.5;
    mx.beginPath();
    let vx = Math.random() * 2048, vy = -40;
    mx.moveTo(vx, vy);
    while (vy < 2100) {
      const nx = vx + (Math.random() - 0.5) * 340;
      const ny = vy + 180 + Math.random() * 260;
      mx.quadraticCurveTo(vx + (Math.random() - 0.5) * 160, vy + 120, nx, ny);
      vx = nx; vy = ny;
    }
    mx.stroke();
  }
  /* fine hairline veins */
  for (let i = 0; i < 30; i++) {
    mx.strokeStyle = `rgba(140,146,158,${0.04 + Math.random() * 0.08})`;
    mx.lineWidth = 0.5 + Math.random();
    mx.beginPath();
    let vx = Math.random() * 2048, vy = Math.random() * 2048;
    mx.moveTo(vx, vy);
    for (let s = 0; s < 5; s++) {
      const nx = vx + (Math.random() - 0.5) * 420;
      const ny = vy + (Math.random() - 0.5) * 420;
      mx.quadraticCurveTo(vx + (Math.random() - 0.5) * 180, vy + (Math.random() - 0.5) * 180, nx, ny);
      vx = nx; vy = ny;
    }
    mx.stroke();
  }
  const marbleTex = new THREE.CanvasTexture(mcv);
  marbleTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const marble = new THREE.MeshStandardMaterial({ map: marbleTex, metalness: 0.06, roughness: 0.13 });

  const island = new THREE.Mesh(new THREE.BoxGeometry(40, 0.7, 18), marble);
  island.position.y = -1.44; /* countertop face at -1.09 */
  island.receiveShadow = true;
  scene.add(island);

  /* ---- New York skyline through the window ---- */
  const scv = document.createElement("canvas");
  scv.width = 3072;
  scv.height = 1024;
  const sx = scv.getContext("2d");
  const sky = sx.createLinearGradient(0, 0, 0, 1024);
  sky.addColorStop(0, "#010209");
  sky.addColorStop(0.62, "#050b17");
  sky.addColorStop(1, "#0b1426");
  sx.fillStyle = sky;
  sx.fillRect(0, 0, 3072, 1024);
  /* stars */
  for (let i = 0; i < 130; i++) {
    sx.fillStyle = `rgba(220,232,248,${0.25 + Math.random() * 0.5})`;
    sx.fillRect(Math.random() * 3072, Math.random() * 420, 1.6, 1.6);
  }
  /* moon */
  const moon = sx.createRadialGradient(2450, 180, 8, 2450, 180, 120);
  moon.addColorStop(0, "rgba(240,246,255,0.95)");
  moon.addColorStop(0.14, "rgba(230,240,255,0.85)");
  moon.addColorStop(0.4, "rgba(190,210,240,0.12)");
  moon.addColorStop(1, "rgba(190,210,240,0)");
  sx.fillStyle = moon;
  sx.fillRect(2200, 0, 600, 480);
  /* far skyline — a hazy distant ridge of towers */
  sx.fillStyle = "#05080f";
  let bx = 0;
  while (bx < 3072) {
    const bw = 40 + Math.random() * 70;
    const bh = 140 + Math.random() * 200;
    sx.fillRect(bx, 1024 - bh - 90, bw, bh + 90);
    bx += bw + 3;
  }
  /* near towers with fine lit windows */
  bx = -20;
  while (bx < 3072) {
    const bw = 60 + Math.random() * 110;
    const bh = 260 + Math.random() * 420;
    const top = 1024 - bh;
    sx.fillStyle = "#03060c";
    sx.fillRect(bx, top, bw, bh);
    const cols = Math.floor(bw / 13);
    const rows = Math.floor(bh / 16);
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        if (Math.random() < 0.3) {
          sx.fillStyle = Math.random() < 0.68
            ? `rgba(255,214,140,${0.3 + Math.random() * 0.5})`   /* warm apartment light */
            : `rgba(160,205,245,${0.25 + Math.random() * 0.45})`; /* cool office light */
          sx.fillRect(bx + 4 + c * 13, top + 6 + r * 16, 5, 7);
        }
      }
    }
    /* a few spires */
    if (Math.random() < 0.22) {
      sx.fillStyle = "#03060c";
      sx.fillRect(bx + bw / 2 - 2, top - 44, 4, 44);
      sx.fillStyle = "rgba(255,90,90,0.9)";
      sx.fillRect(bx + bw / 2 - 1.5, top - 47, 3, 3);
    }
    bx += bw + 7;
  }
  /* city haze above the rooftops */
  const haze = sx.createLinearGradient(0, 460, 0, 1024);
  haze.addColorStop(0, "rgba(120,150,200,0)");
  haze.addColorStop(1, "rgba(120,150,200,0.12)");
  sx.fillStyle = haze;
  sx.fillRect(0, 460, 3072, 564);
  const skylineTex = new THREE.CanvasTexture(scv);
  skylineTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const skyline = new THREE.Mesh(
    new THREE.PlaneGeometry(96, 32),
    new THREE.MeshBasicMaterial({ map: skylineTex })
  );
  skyline.position.set(0, 6.5, -34);
  scene.add(skyline);

  /* ---- the laptop, facing you straight on ---- */
  const laptop = new THREE.Group();

  const base = new THREE.Group();
  const baseBody = new THREE.Mesh(new RoundedBoxGeometry(4.6, 0.18, 3.1, 4, 0.06), aluminum);
  baseBody.castShadow = true;
  base.add(baseBody);

  const keyGeo = new RoundedBoxGeometry(0.25, 0.035, 0.25, 2, 0.015);
  const keys = new THREE.InstancedMesh(keyGeo, darkKeys, 84);
  const dummy = new THREE.Object3D();
  let k = 0;
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 14; col++) {
      dummy.position.set(-1.885 + col * 0.29, 0.1, -1.15 + row * 0.29);
      dummy.updateMatrix();
      keys.setMatrixAt(k++, dummy.matrix);
    }
  }
  base.add(keys);

  const trackpad = new THREE.Mesh(
    new RoundedBoxGeometry(1.5, 0.02, 0.95, 2, 0.01),
    new THREE.MeshStandardMaterial({ color: 0xc9ccd2, metalness: 0.7, roughness: 0.3 })
  );
  trackpad.position.set(0, 0.095, 1.0);
  base.add(trackpad);
  laptop.add(base);

  const lid = new THREE.Group();
  lid.position.set(0, 0.09, -1.55);
  const lidBody = new THREE.Mesh(new RoundedBoxGeometry(4.6, 3.0, 0.13, 4, 0.05), aluminum);
  lidBody.position.y = 1.5;
  lidBody.castShadow = true;
  lid.add(lidBody);
  const bezel = new THREE.Mesh(new THREE.PlaneGeometry(4.42, 2.82), bezelBlack);
  bezel.position.set(0, 1.5, 0.068);
  lid.add(bezel);
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 2.6), screenMat);
  screen.position.set(0, 1.5, 0.072);
  lid.add(screen);
  /* chrome ring logo on the lid */
  const logo = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.05, 12, 40), chrome);
  logo.position.set(0, 1.5, -0.08);
  lid.add(logo);
  laptop.add(lid);

  laptop.position.y = -1.0;
  scene.add(laptop);

  /* ---- natural night light: moonlight + warm kitchen pendants ---- */
  scene.add(new THREE.AmbientLight(0xaebbd4, 0.5));
  const moonlight = new THREE.DirectionalLight(0xcfdfff, 2.2);
  moonlight.position.set(-6, 10, 5);
  moonlight.castShadow = true;
  moonlight.shadow.mapSize.set(2048, 2048);
  moonlight.shadow.camera.left = moonlight.shadow.camera.bottom = -8;
  moonlight.shadow.camera.right = moonlight.shadow.camera.top = 8;
  moonlight.shadow.radius = 7;
  scene.add(moonlight);
  const pendant = new THREE.PointLight(0xffd9a6, 26, 22);
  pendant.position.set(3.4, 5.4, 2.6);
  scene.add(pendant);
  const screenGlow = new THREE.PointLight(0x8fc6ef, 0, 9);
  scene.add(screenGlow);

  function resize() {
    const { clientWidth: cw, clientHeight: ch } = mount;
    renderer.setSize(cw, ch);
    camera.aspect = cw / ch;
    camera.updateProjectionMatrix();
    const s = cw > 900 ? 1 : 0.78;
    laptop.scale.set(s, s, s);
  }
  resize();
  window.addEventListener("resize", resize);

  /* ---- click or any key opens it ---- */
  let playing = false, done = false, startAt = 0;
  const DURATION = 3000;
  function open() {
    if (playing || done) return;
    if (reducedMotion) {
      done = true;
      stage.classList.add("zooming");
      document.querySelector(".headline-section")?.scrollIntoView({ behavior: "auto" });
      return;
    }
    playing = true;
    startAt = performance.now();
    stage.classList.add("zooming");
  }
  stage.addEventListener("click", open);
  window.addEventListener("keydown", (e) => {
    if (window.scrollY < innerHeight * 0.5 && !e.metaKey && !e.ctrlKey && !e.altKey) open();
  });

  const smooth = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
  const lerp = (a, b, t) => a + (b - a) * t;
  const CLOSED = 1.52;
  const OPEN = -0.22;
  const screenWorld = new THREE.Vector3();
  const look = new THREE.Vector3();

  function tick() {
    let p = 0;
    if (reducedMotion && done) p = 0.55;
    else if (playing || done) {
      p = Math.min((performance.now() - startAt) / DURATION, 1);
      if (p >= 1 && playing) {
        playing = false;
        done = true;
        document.querySelector(".headline-section")?.scrollIntoView({ behavior: "smooth" });
      }
    }
    const openT = smooth(p / 0.55);
    const zoomT = smooth((p - 0.55) / 0.45);

    lid.rotation.x = lerp(CLOSED, OPEN, openT);
    screenGlow.intensity = openT * 3 + zoomT * 8;

    screen.getWorldPosition(screenWorld);
    screenGlow.position.set(screenWorld.x, screenWorld.y, screenWorld.z + 1.1);
    camera.position.x = 0;
    camera.position.y = lerp(1.9 - 0.55 * openT, screenWorld.y, zoomT);
    camera.position.z = lerp(9.2, screenWorld.z + 1.5, zoomT);
    look.set(0, lerp(0.2, screenWorld.y, zoomT), lerp(0, screenWorld.z, zoomT));
    camera.lookAt(look);

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick();
}
