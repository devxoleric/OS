/**
 * 3D SHAPE CREATOR v1.0
 * Interactive 3D shapes with scroll-based exit
 * Creates 20+ different geometric shapes
 * Compatible with existing Xoleric AI interface
 */

(function() {
    'use strict';

    // ===================== CONFIGURATION =====================
    const config = {
        containerId: 'shape-container',
        canvasId: 'shape-canvas',
        shapeCount: 20,
        scrollThreshold: 10,
        scrollCount: 0,
        isActive: true,
        currentShape: 0,
        shapes: [],
        scene: null,
        camera: null,
        renderer: null,
        controls: null
    };

    // ===================== CREATE CONTAINER =====================
    function createContainer() {
        // Container div yaratish
        const container = document.createElement('div');
        container.id = config.containerId;
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.zIndex = '9999';
        container.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
        container.style.display = 'none';
        container.style.justifyContent = 'center';
        container.style.alignItems = 'center';
        container.style.flexDirection = 'column';
        
        // Header qismi
        const header = document.createElement('div');
        header.style.position = 'absolute';
        header.style.top = '20px';
        header.style.left = '20px';
        header.style.color = '#00ff00';
        header.style.fontFamily = 'monospace';
        header.style.zIndex = '10000';
        header.style.fontSize = '14px';
        header.innerHTML = `
            <div>3D SHAPE CREATOR v1.0</div>
            <div id="shape-counter">Shape: 1/${config.shapeCount}</div>
            <div id="scroll-counter">Scroll to exit: 0/${config.scrollThreshold}</div>
            <div style="margin-top: 10px; font-size: 12px; color: #888;">
                ← → to navigate | ESC to exit
            </div>
        `;
        container.appendChild(header);

        // Exit button
        const exitBtn = document.createElement('button');
        exitBtn.style.position = 'absolute';
        exitBtn.style.top = '20px';
        exitBtn.style.right = '20px';
        exitBtn.style.padding = '10px 20px';
        exitBtn.style.backgroundColor = '#ff0000';
        exitBtn.style.color = '#fff';
        exitBtn.style.border = 'none';
        exitBtn.style.borderRadius = '5px';
        exitBtn.style.cursor = 'pointer';
        exitBtn.style.fontFamily = 'monospace';
        exitBtn.style.zIndex = '10000';
        exitBtn.innerText = 'EXIT (ESC)';
        exitBtn.onclick = exitShapeMode;
        container.appendChild(exitBtn);

        // Canvas container
        const canvasWrapper = document.createElement('div');
        canvasWrapper.style.width = '100%';
        canvasWrapper.style.height = '100%';
        canvasWrapper.style.overflow = 'hidden';
        canvasWrapper.id = 'canvas-wrapper';
        container.appendChild(canvasWrapper);

        document.body.appendChild(container);
        return container;
    }

    // ===================== INIT THREE.JS =====================
    function initThree() {
        // Three.js ni yuklash (agar mavjud bo'lmasa)
        if (typeof THREE === 'undefined') {
            loadThreeJS();
            return false;
        }
        return setupScene();
    }

    function loadThreeJS() {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        script.onload = function() {
            // OrbitControls ni yuklash
            loadOrbitControls();
        };
        document.head.appendChild(script);
    }

    function loadOrbitControls() {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js';
        script.onload = function() {
            setupScene();
        };
        document.head.appendChild(script);
    }

    function setupScene() {
        const container = document.getElementById('canvas-wrapper');
        if (!container) return;

        // Scene
        config.scene = new THREE.Scene();
        config.scene.background = new THREE.Color(0x050510);

        // Camera
        config.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        config.camera.position.set(5, 5, 10);
        config.camera.lookAt(0, 0, 0);

        // Renderer
        config.renderer = new THREE.WebGLRenderer({ antialias: true });
        config.renderer.setSize(window.innerWidth, window.innerHeight);
        config.renderer.shadowMap.enabled = true;
        config.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.innerHTML = '';
        container.appendChild(config.renderer.domElement);

        // Controls (agar mavjud bo'lsa)
        if (typeof THREE.OrbitControls !== 'undefined') {
            config.controls = new THREE.OrbitControls(config.camera, config.renderer.domElement);
            config.controls.enableDamping = true;
            config.controls.dampingFactor = 0.05;
            config.controls.autoRotate = true;
            config.controls.autoRotateSpeed = 1.0;
            config.controls.enableZoom = true;
            config.controls.maxPolarAngle = Math.PI / 2;
        }

        // Lights
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404060);
        config.scene.add(ambientLight);

        // Main light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 7);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        config.scene.add(directionalLight);

        // Back light
        const backLight = new THREE.PointLight(0x4466ff, 0.5);
        backLight.position.set(-5, 0, -5);
        config.scene.add(backLight);

        // Colored lights
        const colors = [0xff0066, 0x00ff99, 0x66ccff];
        colors.forEach((color, i) => {
            const light = new THREE.PointLight(color, 0.8);
            light.position.set(
                Math.sin(i * Math.PI * 2 / 3) * 5,
                2,
                Math.cos(i * Math.PI * 2 / 3) * 5
            );
            config.scene.add(light);
        });

        // Grid helper
        const gridHelper = new THREE.GridHelper(20, 20, 0x00ff00, 0x336633);
        config.scene.add(gridHelper);

        // Axis helper
        const axesHelper = new THREE.AxesHelper(5);
        config.scene.add(axesHelper);

        // Stars background
        const starsGeometry = new THREE.BufferGeometry();
        const starsCount = 2000;
        const starsPositions = new Float32Array(starsCount * 3);
        for (let i = 0; i < starsCount * 3; i += 3) {
            starsPositions[i] = (Math.random() - 0.5) * 200;
            starsPositions[i+1] = (Math.random() - 0.5) * 200;
            starsPositions[i+2] = (Math.random() - 0.5) * 200;
        }
        starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
        const starsMaterial = new THREE.PointsMaterial({color: 0xffffff, size: 0.2});
        const stars = new THREE.Points(starsGeometry, starsMaterial);
        config.scene.add(stars);

        // Create all shapes
        createAllShapes();

        // Show first shape
        showShape(0);

        // Start animation
        animate();

        // Handle resize
        window.addEventListener('resize', onWindowResize, false);

        return true;
    }

    // ===================== CREATE 20+ DIFFERENT SHAPES =====================
    function createAllShapes() {
        const shapes = [];

        // 1. Cube (Kub) - 4 burchak
        const cubeGeo = new THREE.BoxGeometry(2, 2, 2);
        const cubeMat = new THREE.MeshStandardMaterial({ 
            color: 0xff3366, 
            emissive: 0x330000,
            wireframe: false,
            transparent: true,
            opacity: 0.9
        });
        const cube = new THREE.Mesh(cubeGeo, cubeMat);
        cube.castShadow = true;
        cube.receiveShadow = true;
        shapes.push({ mesh: cube, name: 'Cube (4 burchak)', color: '#ff3366' });

        // 2. Sphere (Sfera) - aylana
        const sphereGeo = new THREE.SphereGeometry(1.5, 32, 32);
        const sphereMat = new THREE.MeshStandardMaterial({ 
            color: 0x33ccff, 
            emissive: 0x003366,
            wireframe: false
        });
        const sphere = new THREE.Mesh(sphereGeo, sphereMat);
        sphere.castShadow = true;
        sphere.receiveShadow = true;
        shapes.push({ mesh: sphere, name: 'Sphere (Aylana)', color: '#33ccff' });

        // 3. Cylinder (Silindr)
        const cylinderGeo = new THREE.CylinderGeometry(1.2, 1.2, 2.5, 32);
        const cylinderMat = new THREE.MeshStandardMaterial({ 
            color: 0x66ff33, 
            emissive: 0x003300,
            wireframe: false
        });
        const cylinder = new THREE.Mesh(cylinderGeo, cylinderMat);
        cylinder.castShadow = true;
        cylinder.receiveShadow = true;
        shapes.push({ mesh: cylinder, name: 'Cylinder', color: '#66ff33' });

        // 4. Cone (Konus)
        const coneGeo = new THREE.ConeGeometry(1.5, 2.5, 32);
        const coneMat = new THREE.MeshStandardMaterial({ 
            color: 0xffaa00, 
            emissive: 0x331900,
            wireframe: false
        });
        const cone = new THREE.Mesh(coneGeo, coneMat);
        cone.castShadow = true;
        cone.receiveShadow = true;
        shapes.push({ mesh: cone, name: 'Cone (Konus)', color: '#ffaa00' });

        // 5. Torus (Donut)
        const torusGeo = new THREE.TorusGeometry(1.5, 0.4, 16, 64);
        const torusMat = new THREE.MeshStandardMaterial({ 
            color: 0xff44aa, 
            emissive: 0x330022,
            wireframe: false
        });
        const torus = new THREE.Mesh(torusGeo, torusMat);
        torus.castShadow = true;
        torus.receiveShadow = true;
        shapes.push({ mesh: torus, name: 'Torus (Donut)', color: '#ff44aa' });

        // 6. TorusKnot (Tugun)
        const knotGeo = new THREE.TorusKnotGeometry(1.2, 0.3, 64, 8, 2, 3);
        const knotMat = new THREE.MeshStandardMaterial({ 
            color: 0xaa44ff, 
            emissive: 0x220044,
            wireframe: false
        });
        const knot = new THREE.Mesh(knotGeo, knotMat);
        knot.castShadow = true;
        knot.receiveShadow = true;
        shapes.push({ mesh: knot, name: 'Torus Knot', color: '#aa44ff' });

        // 7. Octahedron (8 burchak)
        const octaGeo = new THREE.OctahedronGeometry(1.5);
        const octaMat = new THREE.MeshStandardMaterial({ 
            color: 0x44ffaa, 
            emissive: 0x004422,
            wireframe: false
        });
        const octa = new THREE.Mesh(octaGeo, octaMat);
        octa.castShadow = true;
        octa.receiveShadow = true;
        shapes.push({ mesh: octa, name: 'Octahedron (8 burchak)', color: '#44ffaa' });

        // 8. Dodecahedron (12 burchak)
        const dodecaGeo = new THREE.DodecahedronGeometry(1.4);
        const dodecaMat = new THREE.MeshStandardMaterial({ 
            color: 0xffaa44, 
            emissive: 0x442200,
            wireframe: false
        });
        const dodeca = new THREE.Mesh(dodecaGeo, dodecaMat);
        dodeca.castShadow = true;
        dodeca.receiveShadow = true;
        shapes.push({ mesh: dodeca, name: 'Dodecahedron (12 burchak)', color: '#ffaa44' });

        // 9. Icosahedron (20 burchak)
        const icosaGeo = new THREE.IcosahedronGeometry(1.5);
        const icosaMat = new THREE.MeshStandardMaterial({ 
            color: 0x44aaff, 
            emissive: 0x002244,
            wireframe: false
        });
        const icosa = new THREE.Mesh(icosaGeo, icosaMat);
        icosa.castShadow = true;
        icosa.receiveShadow = true;
        shapes.push({ mesh: icosa, name: 'Icosahedron (20 burchak)', color: '#44aaff' });

        // 10. Tetrahedron (4 burchak - piramida)
        const tetraGeo = new THREE.TetrahedronGeometry(1.5);
        const tetraMat = new THREE.MeshStandardMaterial({ 
            color: 0xff6644, 
            emissive: 0x331100,
            wireframe: false
        });
        const tetra = new THREE.Mesh(tetraGeo, tetraMat);
        tetra.castShadow = true;
        tetra.receiveShadow = true;
        shapes.push({ mesh: tetra, name: 'Tetrahedron (4 burchakli piramida)', color: '#ff6644' });

        // 11. Ring (Halqa)
        const ringGeo = new THREE.RingGeometry(1, 1.8, 64);
        const ringMat = new THREE.MeshStandardMaterial({ 
            color: 0xff88cc, 
            emissive: 0x330022,
            side: THREE.DoubleSide,
            wireframe: false
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.castShadow = true;
        ring.receiveShadow = true;
        ring.rotation.x = Math.PI / 2;
        shapes.push({ mesh: ring, name: 'Ring (Halqa)', color: '#ff88cc' });

        // 12. Plane (Tekislik)
        const planeGeo = new THREE.PlaneGeometry(3, 3);
        const planeMat = new THREE.MeshStandardMaterial({ 
            color: 0x88ff88, 
            emissive: 0x003300,
            side: THREE.DoubleSide,
            wireframe: false
        });
        const plane = new THREE.Mesh(planeGeo, planeMat);
        plane.castShadow = true;
        plane.receiveShadow = true;
        plane.rotation.x = Math.PI / 2;
        shapes.push({ mesh: plane, name: 'Plane (Tekislik)', color: '#88ff88' });

        // 13. Circle (Doira)
        const circleGeo = new THREE.CircleGeometry(1.5, 32);
        const circleMat = new THREE.MeshStandardMaterial({ 
            color: 0xffaa88, 
            emissive: 0x332200,
            side: THREE.DoubleSide,
            wireframe: false
        });
        const circle = new THREE.Mesh(circleGeo, circleMat);
        circle.castShadow = true;
        circle.receiveShadow = true;
        shapes.push({ mesh: circle, name: 'Circle (Doira)', color: '#ffaa88' });

        // 14. Extruded Shape (3D yulduz)
        const starShape = new THREE.Shape();
        starShape.moveTo(0, 1.5);
        for (let i = 0; i < 5; i++) {
            const angle = (i * 4 * Math.PI / 5) - Math.PI / 2;
            const x = Math.cos(angle) * 1.5;
            const y = Math.sin(angle) * 1.5;
            if (i === 0) starShape.lineTo(x, y);
            else starShape.lineTo(x, y);
            
            const innerAngle = angle + (2 * Math.PI / 10);
            const innerX = Math.cos(innerAngle) * 0.7;
            const innerY = Math.sin(innerAngle) * 0.7;
            starShape.lineTo(innerX, innerY);
        }
        starShape.closePath();
        
        const extrudeSettings = {
            steps: 2,
            depth: 0.5,
            bevelEnabled: true,
            bevelThickness: 0.2,
            bevelSize: 0.2,
            bevelOffset: 0,
            bevelSegments: 1
        };
        
        const starGeo = new THREE.ExtrudeGeometry(starShape, extrudeSettings);
        const starMat = new THREE.MeshStandardMaterial({ color: 0xffdd44, emissive: 0x442200 });
        const star = new THREE.Mesh(starGeo, starMat);
        star.castShadow = true;
        star.receiveShadow = true;
        shapes.push({ mesh: star, name: 'Star (Yulduz)', color: '#ffdd44' });

        // 15. Icosahedron Wireframe
        const icoWireGeo = new THREE.IcosahedronGeometry(1.5);
        const icoWireMat = new THREE.MeshStandardMaterial({ 
            color: 0x00ffff, 
            wireframe: true,
            emissive: 0x004444
        });
        const icoWire = new THREE.Mesh(icoWireGeo, icoWireMat);
        icoWire.castShadow = true;
        icoWire.receiveShadow = true;
        shapes.push({ mesh: icoWire, name: 'Icosahedron Wireframe', color: '#00ffff' });

        // 16. Sphere Wireframe
        const sphereWireGeo = new THREE.SphereGeometry(1.5, 16, 16);
        const sphereWireMat = new THREE.MeshStandardMaterial({ 
            color: 0xff00ff, 
            wireframe: true,
            emissive: 0x330033
        });
        const sphereWire = new THREE.Mesh(sphereWireGeo, sphereWireMat);
        sphereWire.castShadow = true;
        sphereWire.receiveShadow = true;
        shapes.push({ mesh: sphereWire, name: 'Sphere Wireframe', color: '#ff00ff' });

        // 17. Cone Wireframe
        const coneWireGeo = new THREE.ConeGeometry(1.5, 2.5, 16);
        const coneWireMat = new THREE.MeshStandardMaterial({ 
            color: 0xffff00, 
            wireframe: true,
            emissive: 0x333300
        });
        const coneWire = new THREE.Mesh(coneWireGeo, coneWireMat);
        coneWire.castShadow = true;
        coneWire.receiveShadow = true;
        shapes.push({ mesh: coneWire, name: 'Cone Wireframe', color: '#ffff00' });

        // 18. Torus Wireframe
        const torusWireGeo = new THREE.TorusGeometry(1.5, 0.4, 8, 24);
        const torusWireMat = new THREE.MeshStandardMaterial({ 
            color: 0x00ff88, 
            wireframe: true,
            emissive: 0x003322
        });
        const torusWire = new THREE.Mesh(torusWireGeo, torusWireMat);
        torusWire.castShadow = true;
        torusWire.receiveShadow = true;
        shapes.push({ mesh: torusWire, name: 'Torus Wireframe', color: '#00ff88' });

        // 19. Octahedron Wireframe
        const octaWireGeo = new THREE.OctahedronGeometry(1.5);
        const octaWireMat = new THREE.MeshStandardMaterial({ 
            color: 0x88ff00, 
            wireframe: true,
            emissive: 0x224400
        });
        const octaWire = new THREE.Mesh(octaWireGeo, octaWireMat);
        octaWire.castShadow = true;
        octaWire.receiveShadow = true;
        shapes.push({ mesh: octaWire, name: 'Octahedron Wireframe', color: '#88ff00' });

        // 20. Dodecahedron Wireframe
        const dodecaWireGeo = new THREE.DodecahedronGeometry(1.4);
        const dodecaWireMat = new THREE.MeshStandardMaterial({ 
            color: 0xff8800, 
            wireframe: true,
            emissive: 0x442200
        });
        const dodecaWire = new THREE.Mesh(dodecaWireGeo, dodecaWireMat);
        dodecaWire.castShadow = true;
        dodecaWire.receiveShadow = true;
        shapes.push({ mesh: dodecaWire, name: 'Dodecahedron Wireframe', color: '#ff8800' });

        // 21. Custom Shape - Pyramid (Piramida)
        const pyramidGeo = new THREE.ConeGeometry(1.5, 2.5, 4);
        const pyramidMat = new THREE.MeshStandardMaterial({ 
            color: 0xffaa55, 
            emissive: 0x332200,
            wireframe: false
        });
        const pyramid = new THREE.Mesh(pyramidGeo, pyramidMat);
        pyramid.castShadow = true;
        pyramid.receiveShadow = true;
        shapes.push({ mesh: pyramid, name: 'Pyramid (Piramida)', color: '#ffaa55' });

        // 22. Double Cone (Ikki konus)
        const doubleConeGroup = new THREE.Group();
        const cone1 = new THREE.Mesh(new THREE.ConeGeometry(1.2, 2, 16), new THREE.MeshStandardMaterial({ color: 0x55aaff, emissive: 0x002244 }));
        cone1.position.y = 1;
        cone1.castShadow = true;
        cone1.receiveShadow = true;
        const cone2 = new THREE.Mesh(new THREE.ConeGeometry(1.2, 2, 16), new THREE.MeshStandardMaterial({ color: 0x55aaff, emissive: 0x002244 }));
        cone2.position.y = -1;
        cone2.rotation.x = Math.PI;
        cone2.castShadow = true;
        cone2.receiveShadow = true;
        doubleConeGroup.add(cone1);
        doubleConeGroup.add(cone2);
        shapes.push({ mesh: doubleConeGroup, name: 'Double Cone (Ikki konus)', color: '#55aaff' });

        // 23. Hexagon (6 burchak)
        const hexagonGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.5, 6);
        const hexagonMat = new THREE.MeshStandardMaterial({ color: 0x88aaff, emissive: 0x112244 });
        const hexagon = new THREE.Mesh(hexagonGeo, hexagonMat);
        hexagon.castShadow = true;
        hexagon.receiveShadow = true;
        shapes.push({ mesh: hexagon, name: 'Hexagon (6 burchak)', color: '#88aaff' });

        // 24. Pentagon (5 burchak)
        const pentagonGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.5, 5);
        const pentagonMat = new THREE.MeshStandardMaterial({ color: 0xaaff88, emissive: 0x224411 });
        const pentagon = new THREE.Mesh(pentagonGeo, pentagonMat);
        pentagon.castShadow = true;
        pentagon.receiveShadow = true;
        shapes.push({ mesh: pentagon, name: 'Pentagon (5 burchak)', color: '#aaff88' });

        // 25. Triangle (3 burchak)
        const triangleGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.5, 3);
        const triangleMat = new THREE.MeshStandardMaterial({ color: 0xffaa88, emissive: 0x442211 });
        const triangle = new THREE.Mesh(triangleGeo, triangleMat);
        triangle.castShadow = true;
        triangle.receiveShadow = true;
        shapes.push({ mesh: triangle, name: 'Triangle (3 burchak)', color: '#ffaa88' });

        config.shapes = shapes;
        
        // Add all shapes to scene but hide them
        shapes.forEach(shape => {
            config.scene.add(shape.mesh);
            shape.mesh.visible = false;
        });
    }

    function showShape(index) {
        if (index < 0) index = config.shapes.length - 1;
        if (index >= config.shapes.length) index = 0;
        
        // Hide all
        config.shapes.forEach(shape => {
            shape.mesh.visible = false;
        });
        
        // Show current
        config.shapes[index].mesh.visible = true;
        config.currentShape = index;
        
        // Update counter
        const counter = document.getElementById('shape-counter');
        if (counter) {
            counter.innerHTML = `Shape: ${index + 1}/${config.shapes.length} - ${config.shapes[index].name}`;
        }
        
        // Auto-rotate to show shape
        if (config.controls) {
            config.controls.autoRotate = true;
        }
    }

    function nextShape() {
        showShape(config.currentShape + 1);
    }

    function prevShape() {
        showShape(config.currentShape - 1);
    }

    // ===================== ANIMATION LOOP =====================
    function animate() {
        if (!config.isActive) return;
        
        requestAnimationFrame(animate);
        
        if (config.controls) {
            config.controls.update();
        }
        
        // Add some floating animation to shapes
        if (config.shapes.length > 0 && config.shapes[config.currentShape]) {
            const time = Date.now() * 0.001;
            const shape = config.shapes[config.currentShape].mesh;
            
            // Gentle floating
            shape.position.y = Math.sin(time) * 0.3;
            
            // Rotation for wireframes
            if (config.shapes[config.currentShape].name.includes('Wireframe')) {
                shape.rotation.x += 0.002;
                shape.rotation.y += 0.003;
            }
        }
        
        if (config.renderer && config.scene && config.camera) {
            config.renderer.render(config.scene, config.camera);
        }
    }

    // ===================== WINDOW RESIZE =====================
    function onWindowResize() {
        if (config.camera) {
            config.camera.aspect = window.innerWidth / window.innerHeight;
            config.camera.updateProjectionMatrix();
        }
        if (config.renderer) {
            config.renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }

    // ===================== SCROLL HANDLER =====================
    function handleScroll(event) {
        if (!config.isActive) return;
        
        config.scrollCount++;
        
        const scrollCounter = document.getElementById('scroll-counter');
        if (scrollCounter) {
            scrollCounter.innerHTML = `Scroll to exit: ${config.scrollCount}/${config.scrollThreshold}`;
        }
        
        // Change shape on scroll
        if (event.deltaY > 0) {
            // Scroll down - next shape
            nextShape();
        } else {
            // Scroll up - previous shape
            prevShape();
        }
        
        // Exit after threshold
        if (config.scrollCount >= config.scrollThreshold) {
            exitShapeMode();
        }
        
        // Prevent default scrolling
        event.preventDefault();
    }

    // ===================== KEYBOARD HANDLER =====================
    function handleKeyDown(event) {
        if (!config.isActive) return;
        
        switch(event.key) {
            case 'ArrowLeft':
                prevShape();
                event.preventDefault();
                break;
            case 'ArrowRight':
                nextShape();
                event.preventDefault();
                break;
            case 'Escape':
                exitShapeMode();
                event.preventDefault();
                break;
            case ' ':
                // Toggle auto-rotate
                if (config.controls) {
                    config.controls.autoRotate = !config.controls.autoRotate;
                }
                event.preventDefault();
                break;
        }
    }

    // ===================== ENTER SHAPE MODE =====================
    function enterShapeMode() {
        const container = document.getElementById(config.containerId);
        if (!container) {
            createContainer();
        }
        
        document.getElementById(config.containerId).style.display = 'flex';
        config.isActive = true;
        config.scrollCount = 0;
        
        // Update counter
        const scrollCounter = document.getElementById('scroll-counter');
        if (scrollCounter) {
            scrollCounter.innerHTML = `Scroll to exit: 0/${config.scrollThreshold}`;
        }
        
        // Initialize Three.js if needed
        if (!config.scene) {
            initThree();
        } else {
            // Show current shape
            showShape(config.currentShape);
        }
        
        // Add event listeners
        window.addEventListener('wheel', handleScroll, { passive: false });
        window.addEventListener('keydown', handleKeyDown);
        
        // Disable body scroll
        document.body.style.overflow = 'hidden';
    }

    // ===================== EXIT SHAPE MODE =====================
    function exitShapeMode() {
        const container = document.getElementById(config.containerId);
        if (container) {
            container.style.display = 'none';
        }
        
        config.isActive = false;
        
        // Remove event listeners
        window.removeEventListener('wheel', handleScroll);
        window.removeEventListener('keydown', handleKeyDown);
        
        // Enable body scroll
        document.body.style.overflow = 'auto';
    }

    // ===================== INITIALIZE =====================
    function init() {
        // Create container but keep hidden
        createContainer();
        
        // Add command to XolericAI if it exists
        if (typeof XolericAI !== 'undefined') {
            // Add shape command to AI responses
            const originalAnalyze = XolericAI.analyze;
            XolericAI.analyze = function(input) {
                if (input.toLowerCase().includes('3d') || 
                    input.toLowerCase().includes('shakl') || 
                    input.toLowerCase().includes('shape') ||
                    input.toLowerCase().includes('geometrik')) {
                    setTimeout(() => {
                        enterShapeMode();
                    }, 100);
                    return "3D shakllar yaratilmoqda! 20+ xil geometrik shakllarni ko'rish uchun scroll qiling. Chiqish uchun 10 marta scroll qiling yoki ESC bosing.";
                }
                return originalAnalyze.call(this, input);
            };
        }
        
        // Add global command
        window.enterShapeMode = enterShapeMode;
        window.exitShapeMode = exitShapeMode;
        
        console.log('3D Shape Creator loaded. Type "3D" or "shakl" to start.');
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
