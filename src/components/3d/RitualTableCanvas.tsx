'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RITUALS_DATA } from '@/data/rituals';
import { 
  Sparkles, 
  RotateCcw, 
  Eye, 
  Check, 
  Info, 
  ShoppingBag, 
  X, 
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface ActiveObjectDetail {
  id: string;
  name: string;
  sanskritName: string;
  purpose: string;
  quantity: string;
  status: 'Required' | 'Optional';
  boxNumber: number;
  regionalNote: string;
}

export const RitualTableCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { addProduct } = useCart();
  const [activeRitualId, setActiveRitualId] = useState('satyanarayana-swamy-puja');
  const [activeObject, setActiveObject] = useState<ActiveObjectDetail | null>(null);
  const [is3DMode, setIs3DMode] = useState(true);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [addedNotice, setAddedNotice] = useState(false);

  // References for Three.js instance
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const objectsMapRef = useRef<{ [key: string]: THREE.Group | THREE.Mesh }>({});
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // Check WebGL support on mount
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGLSupported(false);
        setIs3DMode(false);
      }
    } catch {
      setWebGLSupported(false);
      setIs3DMode(false);
    }
  }, []);

  // Initialize Three.js Scene
  useEffect(() => {
    if (!is3DMode || !webGLSupported || !mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 560;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x1a1412); // Deep rich temple wood / dark ambient
    scene.fog = new THREE.FogExp2(0x1a1412, 0.04);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 4.2, 7.5);
    camera.lookAt(0, 0.4, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    rendererRef.current = renderer;

    // Clear previous children
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xfff1db, 0.9);
    scene.add(ambientLight);

    // Warm temple spotlight
    const mainSpot = new THREE.SpotLight(0xffd58f, 3.8);
    mainSpot.position.set(2, 9, 4);
    mainSpot.angle = Math.PI / 4.5;
    mainSpot.penumbra = 0.6;
    mainSpot.castShadow = true;
    mainSpot.shadow.mapSize.width = 1024;
    mainSpot.shadow.mapSize.height = 1024;
    scene.add(mainSpot);

    // Golden Diya Flame Point Light (flickers in render loop)
    const diyaLight = new THREE.PointLight(0xffaa22, 2.5, 6);
    diyaLight.position.set(-1.8, 1.2, 0.8);
    scene.add(diyaLight);

    // Fill light
    const fillLight = new THREE.DirectionalLight(0xe8d0a0, 0.6);
    fillLight.position.set(-5, 4, -2);
    scene.add(fillLight);

    // 5. Materials
    const brassMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.88,
      roughness: 0.22,
    });

    const woodMaterial = new THREE.MeshStandardMaterial({
      color: 0x2b1810,
      roughness: 0.7,
      metalness: 0.1,
    });

    const vermillionMaterial = new THREE.MeshStandardMaterial({
      color: 0xb32817,
      roughness: 0.9,
      metalness: 0.02,
    });

    const turmericMaterial = new THREE.MeshStandardMaterial({
      color: 0xe6a100,
      roughness: 0.88,
      metalness: 0.02,
    });

    const riceMaterial = new THREE.MeshStandardMaterial({
      color: 0xf5eedc,
      roughness: 0.6,
      metalness: 0.05,
    });

    const flowerOrange = new THREE.MeshStandardMaterial({
      color: 0xf57c00,
      roughness: 0.7,
    });

    const leafGreen = new THREE.MeshStandardMaterial({
      color: 0x2e6243,
      roughness: 0.4,
    });

    // 6. Build the Altar (Puja Peeta)
    const tableGroup = new THREE.Group();
    // Rosewood tabletop
    const tableGeo = new THREE.CylinderGeometry(3.6, 3.8, 0.35, 48);
    const tableMesh = new THREE.Mesh(tableGeo, woodMaterial);
    tableMesh.position.y = -0.18;
    tableMesh.receiveShadow = true;
    tableGroup.add(tableMesh);

    // Brass inlaid border ring
    const ringGeo = new THREE.TorusGeometry(3.65, 0.04, 16, 64);
    ringGeo.rotateX(Math.PI / 2);
    const ringMesh = new THREE.Mesh(ringGeo, brassMaterial);
    ringMesh.position.y = -0.01;
    tableGroup.add(ringMesh);
    scene.add(tableGroup);

    // Object Registry for Raycasting & Assembly
    const objects: { [key: string]: THREE.Group | THREE.Mesh } = {};

    // -------------------------------------------------------------
    // Item 1: Brass Kalasha with Coconut & Mango Leaves
    // -------------------------------------------------------------
    const kalashaGroup = new THREE.Group();
    kalashaGroup.name = 'kalasha';

    // Lower pot body
    const potGeo = new THREE.SphereGeometry(0.72, 32, 32);
    potGeo.scale(1, 0.9, 1);
    const potMesh = new THREE.Mesh(potGeo, brassMaterial);
    potMesh.position.y = 0.65;
    potMesh.castShadow = true;
    kalashaGroup.add(potMesh);

    // Flared pot neck
    const neckGeo = new THREE.CylinderGeometry(0.55, 0.42, 0.45, 32);
    const neckMesh = new THREE.Mesh(neckGeo, brassMaterial);
    neckMesh.position.y = 1.25;
    neckMesh.castShadow = true;
    kalashaGroup.add(neckMesh);

    // 5 Mango leaves
    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5;
      const leafGeo = new THREE.ConeGeometry(0.18, 0.85, 8);
      leafGeo.rotateZ(0.35);
      const leaf = new THREE.Mesh(leafGeo, leafGreen);
      leaf.position.set(Math.cos(angle) * 0.4, 1.45, Math.sin(angle) * 0.4);
      leaf.rotation.y = angle;
      kalashaGroup.add(leaf);
    }

    // Crowned Coconut
    const coconutGeo = new THREE.SphereGeometry(0.48, 24, 24);
    coconutGeo.scale(0.9, 1.2, 0.9);
    const coconutMat = new THREE.MeshStandardMaterial({ color: 0x5c3a21, roughness: 0.95 });
    const coconutMesh = new THREE.Mesh(coconutGeo, coconutMat);
    coconutMesh.position.y = 1.7;
    coconutMesh.castShadow = true;
    kalashaGroup.add(coconutMesh);

    kalashaGroup.position.set(0, 0, -0.4);
    scene.add(kalashaGroup);
    objects['kalasha'] = kalashaGroup;

    // -------------------------------------------------------------
    // Item 2: Twin Traditional Diya Lamps (Left & Right)
    // -------------------------------------------------------------
    const diyaGroup = new THREE.Group();
    diyaGroup.name = 'diya';

    const buildDiya = (x: number, z: number) => {
      const subDiya = new THREE.Group();
      // Base
      const baseMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.42, 0.1, 24), brassMaterial);
      subDiya.add(baseMesh);
      // Stem
      const stemMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.9, 16), brassMaterial);
      stemMesh.position.y = 0.5;
      subDiya.add(stemMesh);
      // Oil Cup
      const cupMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.15, 0.25, 24), brassMaterial);
      cupMesh.position.y = 1.0;
      subDiya.add(cupMesh);
      // Glowing Flame
      const flameMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
      const flameMesh = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.26, 12), flameMat);
      flameMesh.position.set(0, 1.25, 0);
      flameMesh.name = 'flame';
      subDiya.add(flameMesh);

      subDiya.position.set(x, 0, z);
      return subDiya;
    };

    diyaGroup.add(buildDiya(-1.9, 0.6));
    diyaGroup.add(buildDiya(1.9, 0.6));
    scene.add(diyaGroup);
    objects['diya'] = diyaGroup;

    // -------------------------------------------------------------
    // Item 3: Solid Brass Puja Bell (Ghanta)
    // -------------------------------------------------------------
    const bellGroup = new THREE.Group();
    bellGroup.name = 'bell';
    const bellDome = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.38, 0.45, 24), brassMaterial);
    bellDome.position.y = 0.25;
    bellGroup.add(bellDome);
    const bellHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 0.6, 16), brassMaterial);
    bellHandle.position.y = 0.75;
    bellGroup.add(bellHandle);
    // Nandi finial top
    const finial = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 12), brassMaterial);
    finial.position.y = 1.1;
    bellGroup.add(finial);
    bellGroup.position.set(-1.1, 0, 1.3);
    scene.add(bellGroup);
    objects['bell'] = bellGroup;

    // -------------------------------------------------------------
    // Item 4: Kumkum & Haldi Brass Vati Bowls
    // -------------------------------------------------------------
    const powderGroup = new THREE.Group();
    powderGroup.name = 'kumkum';

    // Kumkum Vati
    const kPlate = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.2, 0.1, 24), brassMaterial);
    kPlate.position.set(0.7, 0.05, 1.4);
    powderGroup.add(kPlate);
    const kPowder = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.18, 16), vermillionMaterial);
    kPowder.position.set(0.7, 0.18, 1.4);
    powderGroup.add(kPowder);

    // Haldi Vati
    const hPlate = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.2, 0.1, 24), brassMaterial);
    hPlate.position.set(1.4, 0.05, 1.3);
    powderGroup.add(hPlate);
    const hPowder = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.18, 16), turmericMaterial);
    hPowder.position.set(1.4, 0.18, 1.3);
    powderGroup.add(hPowder);

    scene.add(powderGroup);
    objects['kumkum'] = powderGroup;

    // -------------------------------------------------------------
    // Item 5: Fresh Flower Petals & Garland
    // -------------------------------------------------------------
    const flowerGroup = new THREE.Group();
    flowerGroup.name = 'flowers';
    // Ring of marigold flower spheres around the altar center
    for (let i = 0; i < 18; i++) {
      const angle = (i * Math.PI * 2) / 18;
      const flowerMesh = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), flowerOrange);
      flowerMesh.position.set(Math.cos(angle) * 1.55, 0.08, Math.sin(angle) * 1.55);
      flowerGroup.add(flowerMesh);
    }
    scene.add(flowerGroup);
    objects['flowers'] = flowerGroup;

    // -------------------------------------------------------------
    // Item 6: Incense Dhoop Stand with Rising Particles
    // -------------------------------------------------------------
    const incenseGroup = new THREE.Group();
    incenseGroup.name = 'incense';
    const incStand = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 0.12, 18), brassMaterial);
    incStand.position.set(-1.4, 0.06, -1.2);
    incenseGroup.add(incStand);

    // 3 Incense sticks
    for (let i = -1; i <= 1; i++) {
      const stick = new THREE.Mesh(
        new THREE.CylinderGeometry(0.015, 0.015, 0.7, 8),
        new THREE.MeshStandardMaterial({ color: 0x3d2719 })
      );
      stick.position.set(-1.4 + i * 0.06, 0.45, -1.2);
      stick.rotation.z = i * 0.15;
      incenseGroup.add(stick);
    }
    scene.add(incenseGroup);
    objects['incense'] = incenseGroup;

    // -------------------------------------------------------------
    // Item 7: Camphor Aarti Plate
    // -------------------------------------------------------------
    const camphorGroup = new THREE.Group();
    camphorGroup.name = 'camphor';
    const thaliMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.58, 0.08, 32), brassMaterial);
    thaliMesh.position.set(0, 0.04, 1.65);
    camphorGroup.add(thaliMesh);

    // Camphor crystals
    const crystalMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.1 });
    const crystal = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.08, 0.16), crystalMat);
    crystal.position.set(0, 0.1, 1.65);
    camphorGroup.add(crystal);
    scene.add(camphorGroup);
    objects['camphor'] = camphorGroup;

    objectsMapRef.current = objects;

    // Raycaster for Hover & Click
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        // Trace up to find named group
        let hitObject: THREE.Object3D | null = intersects[0].object;
        while (hitObject && hitObject.parent && !objects[hitObject.name]) {
          hitObject = hitObject.parent;
        }

        if (hitObject && objects[hitObject.name]) {
          selectItemDetail(hitObject.name);
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle Diya flame flicker
      diyaLight.intensity = 2.2 + Math.sin(elapsedTime * 8) * 0.4 + Math.cos(elapsedTime * 14) * 0.2;

      // Slow camera auto-rotation when not interacted
      if (isAutoRotating) {
        const radius = 7.8;
        const speed = 0.15;
        camera.position.x = Math.sin(elapsedTime * speed) * radius;
        camera.position.z = Math.cos(elapsedTime * speed) * radius;
        camera.lookAt(0, 0.4, 0);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight || 560;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.dispose();
    };
  }, [is3DMode, webGLSupported]);

  // Handle Progressive Assembly when Ritual changes
  useEffect(() => {
    const objects = objectsMapRef.current;
    if (!objects) return;

    // Reset scales/visibilities smoothly
    Object.keys(objects).forEach((key) => {
      const obj = objects[key];
      obj.visible = true;
    });

    // Custom configuration per ritual
    if (activeRitualId === 'ganapati-puja') {
      // Ganapati highlights Durva, Diya, Modak mold, Bell
      if (objects['kalasha']) objects['kalasha'].position.set(0, 0, -0.6);
    } else if (activeRitualId === 'varalakshmi-vrata') {
      if (objects['kalasha']) objects['kalasha'].position.set(0, 0, -0.3);
    } else {
      if (objects['kalasha']) objects['kalasha'].position.set(0, 0, -0.4);
    }
  }, [activeRitualId]);

  const selectItemDetail = (id: string) => {
    const details: { [key: string]: ActiveObjectDetail } = {
      kalasha: {
        id: 'sn-01',
        name: 'Handcrafted Brass Kalasha with Crowned Coconut',
        sanskritName: 'श्री कलश स्थापना',
        purpose: 'Vedic sanctified water vessel representing cosmic containment and divinity',
        quantity: '1 Complete Setup',
        status: 'Required',
        boxNumber: 2,
        regionalNote: 'Wound with sacred Moli thread; filled with pure water, cardamom, and clove.',
      },
      diya: {
        id: 'sn-03',
        name: 'Twin Solid Brass Kuthuvilakku Lamps',
        sanskritName: 'दीप युग्मम्',
        purpose: 'Dispels negative energetic impurities and invites the primal fire (Agni)',
        quantity: '1 Pair (7 Inch)',
        status: 'Required',
        boxNumber: 1,
        regionalNote: 'Lit facing East with pure cow ghee wicks or sesame oil.',
      },
      bell: {
        id: 'sn-04',
        name: 'Cast Brass Puja Bell with Nandi Finial',
        sanskritName: 'घण्टा नाद',
        purpose: 'Acoustic purification that invokes devas and dispels adverse spirits',
        quantity: '1 Piece',
        status: 'Required',
        boxNumber: 1,
        regionalNote: 'Rung continuously during Prathama Deeparadhana and Mangala Aarti.',
      },
      kumkum: {
        id: 'sn-05',
        name: 'Madurai Kumkum & Salem Haldi Sacred Powders',
        sanskritName: 'हरिद्रा कुङ्कुमम्',
        purpose: 'Divine Shakti sanctification of Kalasha, forehead, and offerings',
        quantity: '100g Each',
        status: 'Required',
        boxNumber: 2,
        regionalNote: 'Prepared from organic Salem turmeric and slaked lime. Zero synthetic pigments.',
      },
      flowers: {
        id: 'sn-08',
        name: 'Golden Marigold Garland & Fragrant Petals',
        sanskritName: 'पुष्प माला',
        purpose: 'Reverential decoration honoring the deity’s presence and cosmic fragrance',
        quantity: '500g Fresh Pack',
        status: 'Required',
        boxNumber: 3,
        regionalNote: 'Strung fresh on the morning of delivery from Krishnagiri flower farms.',
      },
      incense: {
        id: 'sn-09',
        name: 'Temple Loban Dhoop Sticks',
        sanskritName: 'धूपम्',
        purpose: 'Spatial purification carrying prayers upward on scented holy smoke',
        quantity: '30 Sticks',
        status: 'Required',
        boxNumber: 4,
        regionalNote: 'Natural resin base free of charcoal and artificial synthetic oils.',
      },
      camphor: {
        id: 'sn-10',
        name: 'Pure Bhimseni Edible Flake Camphor',
        sanskritName: 'भीमसेनी कर्पूरम्',
        purpose: 'Smokeless sublime flame symbolizing the dissolution of individual ego',
        quantity: '50g Jar',
        status: 'Required',
        boxNumber: 4,
        regionalNote: '100% pure crystalline flake. Certified residue-free burn.',
      },
    };

    if (details[id]) {
      setActiveObject(details[id]);
      setIsAutoRotating(false);
    }
  };

  const handleAddObjectToKit = () => {
    if (!activeObject) return;
    addProduct({
      id: `table-item-${activeObject.id}`,
      slug: `table-item-${activeObject.id}`,
      sku: `PK-${activeObject.id.toUpperCase()}`,
      name: activeObject.name,
      sanskritName: activeObject.sanskritName,
      category: 'Vessels & Brassware',
      price: 650,
      weightOrVolume: 'Standard',
      rating: 4.9,
      reviewCount: 88,
      inStock: true,
      inventoryByHub: { blr: 100, maa: 80, hyd: 70 },
      description: activeObject.purpose,
      ritualRelevance: activeObject.regionalNote,
      shelfLife: 'Lifetime / Long',
      storage: 'Dry cool mandir shelf',
      usedInRituals: [activeRitualId],
      image: 'https://images.unsplash.com/photo-1615865417491-9941019fbc00?auto=format&fit=crop&w=600&q=80',
      boxSequence: activeObject.boxNumber as 1 | 2 | 3 | 4,
    });

    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  return (
    <div id="table3d" className="relative w-full rounded-3xl overflow-hidden bg-temple-900 border border-brass-600/40 shadow-2xl">
      {/* Top Experience Controls Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Ritual Switcher Buttons */}
        <div className="flex items-center space-x-1.5 p-1 rounded-full bg-temple-900/80 backdrop-blur-md border border-brass-700/60 pointer-events-auto shadow-md">
          {RITUALS_DATA.slice(0, 4).map((ritual) => (
            <button
              key={ritual.id}
              type="button"
              onClick={() => setActiveRitualId(ritual.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeRitualId === ritual.id
                  ? 'bg-brass-500 text-temple-900 shadow-brass font-bold'
                  : 'text-sandalwood-300 hover:text-white hover:bg-temple-800'
              }`}
            >
              {ritual.name.replace('Sri ', '').split(' ')[0]} {ritual.name.includes('Pravesh') ? 'Pravesh' : 'Puja'}
            </button>
          ))}
        </div>

        {/* View Options & 2D/3D Fallback Toggle */}
        <div className="flex items-center space-x-2 pointer-events-auto">
          {webGLSupported && (
            <button
              type="button"
              onClick={() => setIsAutoRotating(!isAutoRotating)}
              className="px-3 py-1.5 rounded-full bg-temple-900/80 backdrop-blur-md border border-brass-700/60 text-xs text-sandalwood-300 hover:text-white flex items-center space-x-1.5"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isAutoRotating ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isAutoRotating ? 'Pause Orbit' : 'Auto Rotate'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIs3DMode(!is3DMode)}
            className="px-3 py-1.5 rounded-full bg-brass-900/80 backdrop-blur-md border border-brass-500/60 text-xs text-brass-300 hover:text-white flex items-center space-x-1.5 font-medium"
          >
            <Eye className="w-3.5 h-3.5 text-brass-400" />
            <span>{is3DMode ? '2D Altar Pins' : '3D WebGL Setup'}</span>
          </button>
        </div>
      </div>

      {/* Main Visual Display: 3D Canvas OR High-Fidelity 2D Interactive Fallback */}
      {is3DMode && webGLSupported ? (
        <div
          ref={mountRef}
          className="w-full h-[520px] sm:h-[600px] cursor-grab active:cursor-grabbing"
          title="Click and drag to rotate the ritual setup. Click on any item to view details."
        />
      ) : (
        /* High Fidelity 2D Fallback with Interactive Hot-Spot Pins */
        <div className="relative w-full h-[520px] sm:h-[600px] bg-gradient-to-b from-temple-950 via-temple-900 to-temple-950 flex items-center justify-center p-6">
          <div className="relative max-w-2xl w-full aspect-[16/10] rounded-2xl overflow-hidden border border-brass-700/50 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1200&q=80"
              alt="Authentic Vedic Puja Altar Setup"
              className="w-full h-full object-cover brightness-90"
            />
            {/* Interactive Pins over Altar */}
            <button
              type="button"
              onClick={() => selectItemDetail('kalasha')}
              className="absolute top-[35%] left-[50%] -translate-x-1/2 -translate-y-1/2 group"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brass-500 text-temple-950 font-bold text-xs shadow-brass animate-pulse group-hover:scale-110 transition-transform">
                1
              </span>
              <span className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-0.5 rounded bg-temple-900 text-sandalwood-100 text-[10px] whitespace-nowrap border border-brass-600">
                Brass Kalasha
              </span>
            </button>

            <button
              type="button"
              onClick={() => selectItemDetail('diya')}
              className="absolute top-[48%] left-[22%] -translate-x-1/2 -translate-y-1/2 group"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brass-500 text-temple-950 font-bold text-xs shadow-brass group-hover:scale-110 transition-transform">
                2
              </span>
              <span className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-0.5 rounded bg-temple-900 text-sandalwood-100 text-[10px] whitespace-nowrap border border-brass-600">
                Kuthuvilakku Diya
              </span>
            </button>

            <button
              type="button"
              onClick={() => selectItemDetail('bell')}
              className="absolute top-[65%] left-[35%] -translate-x-1/2 -translate-y-1/2 group"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brass-500 text-temple-950 font-bold text-xs shadow-brass group-hover:scale-110 transition-transform">
                3
              </span>
              <span className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-0.5 rounded bg-temple-900 text-sandalwood-100 text-[10px] whitespace-nowrap border border-brass-600">
                Puja Bell
              </span>
            </button>

            <button
              type="button"
              onClick={() => selectItemDetail('kumkum')}
              className="absolute top-[68%] left-[65%] -translate-x-1/2 -translate-y-1/2 group"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brass-500 text-temple-950 font-bold text-xs shadow-brass group-hover:scale-110 transition-transform">
                4
              </span>
              <span className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-0.5 rounded bg-temple-900 text-sandalwood-100 text-[10px] whitespace-nowrap border border-brass-600">
                Kumkum & Haldi
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Instructions & Quick Hint */}
      <div className="absolute bottom-4 left-4 z-20 pointer-events-none hidden sm:flex items-center space-x-2 text-xs text-sandalwood-300 bg-temple-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-brass-800/60">
        <Sparkles className="w-3.5 h-3.5 text-brass-400" />
        <span>Click any ritual item to inspect its Vedic significance & box sequence</span>
      </div>

      {/* Item Detail Inspector Drawer / Modal */}
      {activeObject && (
        <div className="absolute right-4 bottom-4 sm:top-16 sm:bottom-auto z-30 w-[calc(100%-2rem)] sm:w-80 bg-sandalwood-50 rounded-2xl p-5 shadow-2xl border border-brass-500/80 transition-all duration-300">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brass-700 bg-brass-100 px-2 py-0.5 rounded">
                Box 0{activeObject.boxNumber} • {activeObject.status}
              </span>
              <h4 className="font-serif-title text-base font-bold text-temple-900 mt-1">
                {activeObject.name}
              </h4>
              <p className="text-xs font-serif-title text-vermillion-700 font-medium">
                {activeObject.sanskritName}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveObject(null)}
              className="p-1 rounded-lg text-temple-400 hover:text-temple-900 hover:bg-sandalwood-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-temple-700 mt-3 leading-relaxed">
            {activeObject.purpose}
          </p>

          <div className="mt-3 p-2.5 rounded-xl bg-brass-50 border border-brass-200/60 text-[11px] text-temple-700 space-y-1">
            <div className="flex justify-between font-medium">
              <span>Required Quantity:</span>
              <span className="font-bold text-temple-900">{activeObject.quantity}</span>
            </div>
            <p className="text-brass-800 italic">{activeObject.regionalNote}</p>
          </div>

          <div className="mt-4 flex items-center space-x-2">
            <button
              type="button"
              onClick={handleAddObjectToKit}
              className="flex-1 py-2.5 rounded-xl bg-temple-900 hover:bg-temple-800 text-sandalwood-50 text-xs font-bold flex items-center justify-center space-x-1.5 shadow-temple transition-all"
            >
              {addedNotice ? (
                <>
                  <Check className="w-3.5 h-3.5 text-tulsi-400" />
                  <span>Added to Cart</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5 text-brass-300" />
                  <span>Add to Kit</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
