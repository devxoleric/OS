/**
 * 3D SHAKL YARATUVCHI v3.0 - PROFESSIONAL
 * Xoleric OS uchun interaktiv 3D geometrik shakllar generatori
 * 30+ xil o'zbekcha nomlangan shakllar
 * Muallif: Neo (Xoleric Corp)
 */

(function() {
    'use strict';

    // ===================== SOZLAMALAR =====================
    const sozlamalar = {
        konteynerId: '3d-shakl-konteyneri',
        canvasId: '3d-canvas',
        shakllarSoni: 32,
        scrollChegarasi: 10,
        scrollSoni: 0,
        faol: false,
        joriyShakl: 0,
        shakllar: [],
        sahna: null,
        kamera: null,
        renderer: null,
        boshqaruv: null,
        soat: null,
        zarralar: null
    };

    // ===================== KONTEYNER YARATISH =====================
    function konteynerYaratish() {
        const konteyner = document.createElement('div');
        konteyner.id = sozlamalar.konteynerId;
        konteyner.style.position = 'fixed';
        konteyner.style.top = '0';
        konteyner.style.left = '0';
        konteyner.style.width = '100%';
        konteyner.style.height = '100%';
        konteyner.style.zIndex = '10000';
        konteyner.style.backgroundColor = 'rgba(0, 0, 0, 0.98)';
        konteyner.style.display = 'none';
        konteyner.style.justifyContent = 'center';
        konteyner.style.alignItems = 'center';
        konteyner.style.flexDirection = 'column';
        konteyner.style.backdropFilter = 'blur(10px)';
        
        // Sarlavha qismi
        const sarlavha = document.createElement('div');
        sarlavha.style.position = 'absolute';
        sarlavha.style.top = '20px';
        sarlavha.style.left = '20px';
        sarlavha.style.color = '#00ff00';
        sarlavha.style.fontFamily = 'JetBrains Mono, monospace';
        sarlavha.style.zIndex = '10001';
        sarlavha.style.fontSize = '14px';
        sarlavha.style.background = 'rgba(0,0,0,0.8)';
        sarlavha.style.padding = '15px 25px';
        sarlavha.style.borderRadius = '12px';
        sarlavha.style.border = '2px solid #00ff00';
        sarlavha.style.boxShadow = '0 0 30px rgba(0,255,0,0.4)';
        sarlavha.style.backdropFilter = 'blur(5px)';
        sarlavha.innerHTML = `
            <div style="color: #ff00ff; font-size: 20px; margin-bottom: 12px; text-shadow: 0 0 10px #ff00ff;">⚡ 3D SHAKL YARATUVCHI v3.0 ⚡</div>
            <div id="shakl-hisoblagich" style="margin-bottom: 8px; font-size: 16px;">Shakl: 1/${sozlamalar.shakllarSoni}</div>
            <div id="scroll-hisoblagich" style="margin-bottom: 8px; font-size: 16px;">Chiqish uchun scroll: 0/${sozlamalar.scrollChegarasi}</div>
            <div style="margin-top: 15px; font-size: 13px; color: #aaa; border-top: 1px solid #333; padding-top: 10px;">
                ← → strelkalar | BO'SH JOY: aylanish | ESC: chiqish
            </div>
        `;
        konteyner.appendChild(sarlavha);

        // Chiqish tugmasi
        const chiqishTugmasi = document.createElement('button');
        chiqishTugmasi.style.position = 'absolute';
        chiqishTugmasi.style.top = '20px';
        chiqishTugmasi.style.right = '20px';
        chiqishTugmasi.style.padding = '12px 30px';
        chiqishTugmasi.style.backgroundColor = 'rgba(255, 20, 20, 0.9)';
        chiqishTugmasi.style.color = '#fff';
        chiqishTugmasi.style.border = '2px solid #ff3333';
        chiqishTugmasi.style.borderRadius = '8px';
        chiqishTugmasi.style.cursor = 'pointer';
        chiqishTugmasi.style.fontFamily = 'JetBrains Mono, monospace';
        chiqishTugmasi.style.fontSize = '16px';
        chiqishTugmasi.style.fontWeight = 'bold';
        chiqishTugmasi.style.zIndex = '10001';
        chiqishTugmasi.style.boxShadow = '0 0 25px rgba(255,0,0,0.6)';
        chiqishTugmasi.style.transition = 'all 0.3s ease';
        chiqishTugmasi.innerText = 'CHIQISH [ESC]';
        chiqishTugmasi.onmouseover = () => {
            chiqishTugmasi.style.backgroundColor = 'rgba(255, 0, 0, 1)';
            chiqishTugmasi.style.transform = 'scale(1.08)';
            chiqishTugmasi.style.boxShadow = '0 0 35px rgba(255,0,0,0.9)';
        };
        chiqishTugmasi.onmouseout = () => {
            chiqishTugmasi.style.backgroundColor = 'rgba(255, 20, 20, 0.9)';
            chiqishTugmasi.style.transform = 'scale(1)';
            chiqishTugmasi.style.boxShadow = '0 0 25px rgba(255,0,0,0.6)';
        };
        chiqishTugmasi.onclick = rejimdanChiqish;
        konteyner.appendChild(chiqishTugmasi);

        // Pastki ma'lumot paneli
        const pastkiMa'lumot = document.createElement('div');
        pastkiMa'lumot.style.position = 'absolute';
        pastkiMa'lumot.style.bottom = '20px';
        pastkiMa'lumot.style.left = '20px';
        pastkiMa'lumot.style.color = '#00ffff';
        pastkiMa'lumot.style.fontFamily = 'JetBrains Mono, monospace';
        pastkiMa'lumot.style.fontSize = '14px';
        pastkiMa'lumot.style.background = 'rgba(0,0,0,0.7)';
        pastkiMa'lumot.style.padding = '12px 20px';
        pastkiMa'lumot.style.borderRadius = '8px';
        pastkiMa'lumot.style.border = '1px solid #00ffff';
        pastkiMa'lumot.style.boxShadow = '0 0 15px rgba(0,255,255,0.3)';
        pastkiMa'lumot.id = 'shakl-malumot';
        pastkiMa'lumot.innerHTML = 'Joriy: Yuklanmoqda...';
        konteyner.appendChild(pastkiMa'lumot);

        // Boshqaruv paneli
        const boshqaruvPaneli = document.createElement('div');
        boshqaruvPaneli.style.position = 'absolute';
        boshqaruvPaneli.style.bottom = '20px';
        boshqaruvPaneli.style.right = '20px';
        boshqaruvPaneli.style.color = '#ffff00';
        boshqaruvPaneli.style.fontFamily = 'JetBrains Mono, monospace';
        boshqaruvPaneli.style.fontSize = '13px';
        boshqaruvPaneli.style.background = 'rgba(0,0,0,0.7)';
        boshqaruvPaneli.style.padding = '12px 20px';
        boshqaruvPaneli.style.borderRadius = '8px';
        boshqaruvPaneli.style.border = '1px solid #ffff00';
        boshqaruvPaneli.style.boxShadow = '0 0 15px rgba(255,255,0,0.3)';
        boshqaruvPaneli.innerHTML = '🖱️ SCROLL: shaklni almashtirish<br>🔟 10 marta scroll = chiqish';
        konteyner.appendChild(boshqaruvPaneli);

        // Canvas konteyneri
        const canvasKonteyner = document.createElement('div');
        canvasKonteyner.style.width = '100%';
        canvasKonteyner.style.height = '100%';
        canvasKonteyner.style.overflow = 'hidden';
        canvasKonteyner.style.position = 'relative';
        canvasKonteyner.id = 'canvas-konteyner';
        konteyner.appendChild(canvasKonteyner);

        document.body.appendChild(konteyner);
        return konteyner;
    }

    // ===================== THREE.JS NI YUKLASH =====================
    function threeJSYuklash() {
        return new Promise((halQilish, radEtish) => {
            if (typeof THREE !== 'undefined') {
                halQilish();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
            script.onload = () => {
                const boshqaruvScript = document.createElement('script');
                boshqaruvScript.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js';
                boshqaruvScript.onload = halQilish;
                boshqaruvScript.onerror = radEtish;
                document.head.appendChild(boshqaruvScript);
            };
            script.onerror = radEtish;
            document.head.appendChild(script);
        });
    }

    // ===================== SAHNA SOZLASH =====================
    async function sahnaSozlash() {
        try {
            await threeJSYuklash();

            const konteyner = document.getElementById('canvas-konteyner');
            if (!konteyner) return false;

            // Soat
            sozlamalar.soat = new THREE.Clock();

            // Sahna
            sozlamalar.sahna = new THREE.Scene();
            sozlamalar.sahna.background = new THREE.Color(0x0a0a20);
            sozlamalar.sahna.fog = new THREE.Fog(0x0a0a20, 20, 60);

            // Kamera
            sozlamalar.kamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
            sozlamalar.kamera.position.set(8, 4, 16);
            sozlamalar.kamera.lookAt(0, 0, 0);

            // Renderer
            sozlamalar.renderer = new THREE.WebGLRenderer({ 
                antialias: true,
                alpha: false,
                powerPreference: "high-performance"
            });
            sozlamalar.renderer.setSize(window.innerWidth, window.innerHeight);
            sozlamalar.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            sozlamalar.renderer.shadowMap.enabled = true;
            sozlamalar.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            sozlamalar.renderer.outputEncoding = THREE.sRGBEncoding;
            sozlamalar.renderer.toneMapping = THREE.ACESFilmicToneMapping;
            sozlamalar.renderer.toneMappingExposure = 1.3;
            konteyner.innerHTML = '';
            konteyner.appendChild(sozlamalar.renderer.domElement);

            // Boshqaruv
            if (typeof THREE.OrbitControls !== 'undefined') {
                sozlamalar.boshqaruv = new THREE.OrbitControls(sozlamalar.kamera, sozlamalar.renderer.domElement);
                sozlamalar.boshqaruv.enableDamping = true;
                sozlamalar.boshqaruv.dampingFactor = 0.06;
                sozlamalar.boshqaruv.autoRotate = true;
                sozlamalar.boshqaruv.autoRotateSpeed = 1.8;
                sozlamalar.boshqaruv.enableZoom = true;
                sozlamalar.boshqaruv.enablePan = false;
                sozlamalar.boshqaruv.maxPolarAngle = Math.PI / 2;
                sozlamalar.boshqaruv.minDistance = 5;
                sozlamalar.boshqaruv.maxDistance = 30;
            }

            // Yorug'lik tizimi
            yoruglikYaratish();

            // Muhit yaratish
            muhitYaratish();

            // Barcha shakllarni yaratish
            shakllarniYaratish();

            // Zarralar yaratish
            zarralarYaratish();

            // Birinchi shaklni ko'rsatish
            shaklniKorsatish(0);

            // Animatsiyani boshlash
            animatsiya();

            // Oyna o'lchami o'zgarishi
            window.addEventListener('resize', oynaniOzgartirish);

            return true;
        } catch (xato) {
            console.error('3D sahna yaratilmadi:', xato);
            return false;
        }
    }

    // ===================== YORUG'LIK YARATISH =====================
    function yoruglikYaratish() {
        // Asosiy yorug'lik
        const asosiyYoruglik = new THREE.AmbientLight(0x404060, 0.7);
        sozlamalar.sahna.add(asosiyYoruglik);

        // Asosiy yo'naltirilgan yorug'lik
        const asosiyNur = new THREE.DirectionalLight(0xffffff, 1.4);
        asosiyNur.position.set(6, 12, 8);
        asosiyNur.castShadow = true;
        asosiyNur.receiveShadow = true;
        asosiyNur.shadow.mapSize.width = 2048;
        asosiyNur.shadow.mapSize.height = 2048;
        asosiyNur.shadow.camera.near = 0.5;
        asosiyNur.shadow.camera.far = 40;
        asosiyNur.shadow.camera.left = -12;
        asosiyNur.shadow.camera.right = 12;
        asosiyNur.shadow.camera.top = 12;
        asosiyNur.shadow.camera.bottom = -12;
        sozlamalar.sahna.add(asosiyNur);

        // To'ldiruvchi yorug'lik
        const toldiruvchiNur = new THREE.PointLight(0x4466ff, 0.9);
        toldiruvchiNur.position.set(-6, 4, 6);
        sozlamalar.sahna.add(toldiruvchiNur);

        // Orqa yorug'lik
        const orqaNur = new THREE.PointLight(0xff44aa, 0.6);
        orqaNur.position.set(0, 3, -12);
        sozlamalar.sahna.add(orqaNur);

        // Rangli yorug'liklar
        const ranglar = [0xff3366, 0x33ff99, 0x66ccff, 0xffaa33, 0xaa66ff];
        ranglar.forEach((rang, indeks) => {
            const burchak = (indeks / ranglar.length) * Math.PI * 2;
            const nur = new THREE.PointLight(rang, 0.7);
            nur.position.set(
                Math.sin(burchak) * 9,
                3.5,
                Math.cos(burchak) * 9
            );
            sozlamalar.sahna.add(nur);
        });
    }

    // ===================== MUHIT YARATISH =====================
    function muhitYaratish() {
        // Grid yordamchi
        const gridYordamchi = new THREE.GridHelper(35, 35, 0x00ff00, 0x336633);
        gridYordamchi.position.y = -2.2;
        sozlamalar.sahna.add(gridYordamchi);

        // Pol (aks ettiruvchi)
        const polGeometry = new THREE.CircleGeometry(25, 32);
        const polMaterial = new THREE.MeshStandardMaterial({
            color: 0x112233,
            emissive: 0x0a0a20,
            transparent: true,
            opacity: 0.4,
            side: THREE.DoubleSide,
            roughness: 0.2,
            metalness: 0.1
        });
        const pol = new THREE.Mesh(polGeometry, polMaterial);
        pol.rotation.x = -Math.PI / 2;
        pol.position.y = -2.2;
        pol.receiveShadow = true;
        sozlamalar.sahna.add(pol);

        // Yulduzlar fon
        const yulduzlarGeometry = new THREE.BufferGeometry();
        const yulduzlarSoni = 4000;
        const yulduzlarPozitsiyalari = new Float32Array(yulduzlarSoni * 3);
        const yulduzlarRanglari = new Float32Array(yulduzlarSoni * 3);
        
        for (let i = 0; i < yulduzlarSoni; i++) {
            const r = 60 + Math.random() * 60;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            
            yulduzlarPozitsiyalari[i*3] = r * Math.sin(phi) * Math.cos(theta);
            yulduzlarPozitsiyalari[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
            yulduzlarPozitsiyalari[i*3+2] = r * Math.cos(phi);
            
            const rang = new THREE.Color().setHSL(Math.random(), 0.8, 0.5 + Math.random() * 0.5);
            yulduzlarRanglari[i*3] = rang.r;
            yulduzlarRanglari[i*3+1] = rang.g;
            yulduzlarRanglari[i*3+2] = rang.b;
        }
        
        yulduzlarGeometry.setAttribute('position', new THREE.BufferAttribute(yulduzlarPozitsiyalari, 3));
        yulduzlarGeometry.setAttribute('color', new THREE.BufferAttribute(yulduzlarRanglari, 3));
        
        const yulduzlarMaterial = new THREE.PointsMaterial({ 
            size: 0.4,
            vertexColors: true,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending
        });
        
        sozlamalar.zarralar = new THREE.Points(yulduzlarGeometry, yulduzlarMaterial);
        sozlamalar.sahna.add(sozlamalar.zarralar);

        // Suzuvchi sharlar
        const sharSoni = 25;
        for (let i = 0; i < sharSoni; i++) {
            const sharGeo = new THREE.SphereGeometry(0.12 + Math.random() * 0.25, 8);
            const sharMat = new THREE.MeshStandardMaterial({
                color: new THREE.Color().setHSL(Math.random(), 1, 0.6),
                emissive: new THREE.Color().setHSL(Math.random(), 0.8, 0.2)
            });
            const shar = new THREE.Mesh(sharGeo, sharMat);
            
            const burchak = (i / sharSoni) * Math.PI * 2;
            const radius = 14 + Math.random() * 6;
            shar.position.set(
                Math.cos(burchak) * radius,
                (Math.random() - 0.5) * 10,
                Math.sin(burchak) * radius
            );
            
            sozlamalar.sahna.add(shar);
        }
    }

    // ===================== ZARRALAR YARATISH =====================
    function zarralarYaratish() {
        const zarralarSoni = 800;
        const geometry = new THREE.BufferGeometry();
        const pozitsiyalar = new Float32Array(zarralarSoni * 3);
        const ranglar = new Float32Array(zarralarSoni * 3);

        for (let i = 0; i < zarralarSoni; i++) {
            const r = 7 + Math.random() * 12;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            
            pozitsiyalar[i*3] = r * Math.sin(phi) * Math.cos(theta);
            pozitsiyalar[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
            pozitsiyalar[i*3+2] = r * Math.cos(phi);
            
            const rang = new THREE.Color().setHSL(Math.random(), 1, 0.6);
            ranglar[i*3] = rang.r;
            ranglar[i*3+1] = rang.g;
            ranglar[i*3+2] = rang.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(pozitsiyalar, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(ranglar, 3));

        const material = new THREE.PointsMaterial({
            size: 0.18,
            vertexColors: true,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            sizeAttenuation: true
        });

        const zarralar = new THREE.Points(geometry, material);
        sozlamalar.sahna.add(zarralar);
    }

    // ===================== MATERIALLAR YARATISH =====================
    function materialYaratish(rang, nurRangi = 0x000000, simli = false, shaffof = false, shaffoflik = 1) {
        return new THREE.MeshStandardMaterial({
            color: rang,
            emissive: nurRangi,
            wireframe: simli,
            transparent: shaffof,
            opacity: shaffoflik,
            roughness: 0.25,
            metalness: 0.2,
            emissiveIntensity: 0.6
        });
    }

    // ===================== SHAKLLARNI YARATISH =====================
    function shakllarniYaratish() {
        const shakllar = [];

        // 1. Kub - 6 tomonli, 8 burchakli
        const kubGeo = new THREE.BoxGeometry(2.6, 2.6, 2.6);
        const kubMat = materialYaratish(0xff3366, 0x330000);
        const kub = new THREE.Mesh(kubGeo, kubMat);
        kub.castShadow = true;
        kub.receiveShadow = true;
        shakllar.push({ mesh: kub, nom: 'KUB (6 tomon, 8 burchak)', rang: '#ff3366' });

        // 2. Shar - aylana shakl
        const sharGeo = new THREE.SphereGeometry(2.0, 64, 64);
        const sharMat = materialYaratish(0x33ccff, 0x003366);
        const shar = new THREE.Mesh(sharGeo, sharMat);
        shar.castShadow = true;
        shar.receiveShadow = true;
        shakllar.push({ mesh: shar, nom: 'SHAR (Aylana)', rang: '#33ccff' });

        // 3. Silindr - ikki tomoni aylana
        const silindrGeo = new THREE.CylinderGeometry(1.7, 1.7, 3.2, 32);
        const silindrMat = materialYaratish(0x66ff33, 0x003300);
        const silindr = new THREE.Mesh(silindrGeo, silindrMat);
        silindr.castShadow = true;
        silindr.receiveShadow = true;
        shakllar.push({ mesh: silindr, nom: 'SILINDR', rang: '#66ff33' });

        // 4. Konus - uchi uchli
        const konusGeo = new THREE.ConeGeometry(2.0, 3.2, 32);
        const konusMat = materialYaratish(0xffaa00, 0x332200);
        const konus = new THREE.Mesh(konusGeo, konusMat);
        konus.castShadow = true;
        konus.receiveShadow = true;
        shakllar.push({ mesh: konus, nom: 'KONUS', rang: '#ffaa00' });

        // 5. Halqasimon (Donut)
        const halqaGeo = new THREE.TorusGeometry(2.0, 0.6, 20, 72);
        const halqaMat = materialYaratish(0xff44aa, 0x330022);
        const halqa = new THREE.Mesh(halqaGeo, halqaMat);
        halqa.castShadow = true;
        halqa.receiveShadow = true;
        shakllar.push({ mesh: halqa, nom: 'HALQASIMON (Donut)', rang: '#ff44aa' });

        // 6. Tugun (Murakkab)
        const tugunGeo = new THREE.TorusKnotGeometry(1.7, 0.45, 120, 18, 3, 4);
        const tugunMat = materialYaratish(0xaa44ff, 0x220044);
        const tugun = new THREE.Mesh(tugunGeo, tugunMat);
        tugun.castShadow = true;
        tugun.receiveShadow = true;
        shakllar.push({ mesh: tugun, nom: 'TUGUN (Murakkab)', rang: '#aa44ff' });

        // 7. Sakkizburchakli (8 burchak)
        const sakkizburchakGeo = new THREE.OctahedronGeometry(2.0);
        const sakkizburchakMat = materialYaratish(0x44ffaa, 0x004422);
        const sakkizburchak = new THREE.Mesh(sakkizburchakGeo, sakkizburchakMat);
        sakkizburchak.castShadow = true;
        sakkizburchak.receiveShadow = true;
        shakllar.push({ mesh: sakkizburchak, nom: 'SAKKIZBURCHAKLI', rang: '#44ffaa' });

        // 8. O'n ikki burchakli
        const onikkiGeo = new THREE.DodecahedronGeometry(1.8);
        const onikkiMat = materialYaratish(0xffaa44, 0x442200);
        const onikki = new THREE.Mesh(onikkiGeo, onikkiMat);
        onikki.castShadow = true;
        onikki.receiveShadow = true;
        shakllar.push({ mesh: onikki, nom: 'O\'N IKKI BURCHAKLI', rang: '#ffaa44' });

        // 9. Yigirma burchakli
        const yigirmaGeo = new THREE.IcosahedronGeometry(2.0);
        const yigirmaMat = materialYaratish(0x44aaff, 0x002244);
        const yigirma = new THREE.Mesh(yigirmaGeo, yigirmaMat);
        yigirma.castShadow = true;
        yigirma.receiveShadow = true;
        shakllar.push({ mesh: yigirma, nom: 'YIGIRMA BURCHAKLI', rang: '#44aaff' });

        // 10. To'rtburchakli piramida
        const piramidaGeo = new THREE.ConeGeometry(2.0, 3.2, 4);
        const piramidaMat = materialYaratish(0xff6644, 0x331100);
        const piramida = new THREE.Mesh(piramidaGeo, piramidaMat);
        piramida.castShadow = true;
        piramida.receiveShadow = true;
        shakllar.push({ mesh: piramida, nom: 'TO\'RTBURCHAKLI PIRAMIDA', rang: '#ff6644' });

        // 11. Halqa (Yassi)
        const yassiHalqaGeo = new THREE.RingGeometry(1.4, 2.4, 72);
        const yassiHalqaMat = materialYaratish(0xff88cc, 0x330022, false, true, 0.85);
        yassiHalqaMat.side = THREE.DoubleSide;
        const yassiHalqa = new THREE.Mesh(yassiHalqaGeo, yassiHalqaMat);
        yassiHalqa.castShadow = true;
        yassiHalqa.receiveShadow = true;
        yassiHalqa.rotation.x = Math.PI / 2;
        shakllar.push({ mesh: yassiHalqa, nom: 'YASSI HALQA', rang: '#ff88cc' });

        // 12. Tekislik
        const tekislikGeo = new THREE.PlaneGeometry(4.5, 4.5);
        const tekislikMat = materialYaratish(0x88ff88, 0x003300, false, true, 0.7);
        tekislikMat.side = THREE.DoubleSide;
        const tekislik = new THREE.Mesh(tekislikGeo, tekislikMat);
        tekislik.castShadow = true;
        tekislik.receiveShadow = true;
        tekislik.rotation.x = Math.PI / 2;
        shakllar.push({ mesh: tekislik, nom: 'TEKISLIK', rang: '#88ff88' });

        // 13. Doira
        const doiraGeo = new THREE.CircleGeometry(2.0, 48);
        const doiraMat = materialYaratish(0xffaa88, 0x332200, false, true, 0.8);
        doiraMat.side = THREE.DoubleSide;
        const doira = new THREE.Mesh(doiraGeo, doiraMat);
        doira.castShadow = true;
        doira.receiveShadow = true;
        shakllar.push({ mesh: doira, nom: 'DOIRA', rang: '#ffaa88' });

        // 14. Yulduz (3D)
        const yulduzShakli = new THREE.Shape();
        yulduzShakli.moveTo(0, 2.2);
        for (let i = 0; i < 5; i++) {
            const burchak = (i * 4 * Math.PI / 5) - Math.PI / 2;
            const x = Math.cos(burchak) * 2.2;
            const y = Math.sin(burchak) * 2.2;
            yulduzShakli.lineTo(x, y);
            
            const ichkiBurchak = burchak + (2 * Math.PI / 10);
            const ichkiX = Math.cos(ichkiBurchak) * 0.9;
            const ichkiY = Math.sin(ichkiBurchak) * 0.9;
            yulduzShakli.lineTo(ichkiX, ichkiY);
        }
        yulduzShakli.closePath();
        
        const yulduzExtrude = {
            steps: 2,
            depth: 0.6,
            bevelEnabled: true,
            bevelThickness: 0.2,
            bevelSize: 0.2,
            bevelSegments: 3
        };
        
        const yulduzGeo = new THREE.ExtrudeGeometry(yulduzShakli, yulduzExtrude);
        const yulduzMat = materialYaratish(0xffdd44, 0x442200);
        const yulduz = new THREE.Mesh(yulduzGeo, yulduzMat);
        yulduz.castShadow = true;
        yulduz.receiveShadow = true;
        yulduz.rotation.x = Math.PI / 2;
        yulduz.rotation.z = Math.PI / 5;
        shakllar.push({ mesh: yulduz, nom: 'YULDUZ', rang: '#ffdd44' });

        // 15. Yigirma burchakli (Simli)
        const yigirmaSimGeo = new THREE.IcosahedronGeometry(2.0);
        const yigirmaSimMat = materialYaratish(0x00ffff, 0x004444, true);
        const yigirmaSim = new THREE.Mesh(yigirmaSimGeo, yigirmaSimMat);
        yigirmaSim.castShadow = true;
        yigirmaSim.receiveShadow = true;
        shakllar.push({ mesh: yigirmaSim, nom: 'YIGIRMA BURCHAKLI (SIMLI)', rang: '#00ffff' });

        // 16. Shar (Simli)
        const sharSimGeo = new THREE.SphereGeometry(2.0, 18, 18);
        const sharSimMat = materialYaratish(0xff00ff, 0x330033, true);
        const sharSim = new THREE.Mesh(sharSimGeo, sharSimMat);
        sharSim.castShadow = true;
        sharSim.receiveShadow = true;
        shakllar.push({ mesh: sharSim, nom: 'SHAR (SIMLI)', rang: '#ff00ff' });

        // 17. Konus (Simli)
        const konusSimGeo = new THREE.ConeGeometry(2.0, 3.2, 18);
        const konusSimMat = materialYaratish(0xffff00, 0x333300, true);
        const konusSim = new THREE.Mesh(konusSimGeo, konusSimMat);
        konusSim.castShadow = true;
        konusSim.receiveShadow = true;
        shakllar.push({ mesh: konusSim, nom: 'KONUS (SIMLI)', rang: '#ffff00' });

        // 18. Halqasimon (Simli)
        const halqaSimGeo = new THREE.TorusGeometry(2.0, 0.6, 10, 28);
        const halqaSimMat = materialYaratish(0x00ff88, 0x003322, true);
        const halqaSim = new THREE.Mesh(halqaSimGeo, halqaSimMat);
        halqaSim.castShadow = true;
        halqaSim.receiveShadow = true;
        shakllar.push({ mesh: halqaSim, nom: 'HALQASIMON (SIMLI)', rang: '#00ff88' });

        // 19. Sakkizburchakli (Simli)
        const sakkizSimGeo = new THREE.OctahedronGeometry(2.0);
        const sakkizSimMat = materialYaratish(0x88ff00, 0x224400, true);
        const sakkizSim = new THREE.Mesh(sakkizSimGeo, sakkizSimMat);
        sakkizSim.castShadow = true;
        sakkizSim.receiveShadow = true;
        shakllar.push({ mesh: sakkizSim, nom: 'SAKKIZBURCHAKLI (SIMLI)', rang: '#88ff00' });

        // 20. O'n ikki burchakli (Simli)
        const onikkiSimGeo = new THREE.DodecahedronGeometry(1.8);
        const onikkiSimMat = materialYaratish(0xff8800, 0x442200, true);
        const onikkiSim = new THREE.Mesh(onikkiSimGeo, onikkiSimMat);
        onikkiSim.castShadow = true;
        onikkiSim.receiveShadow = true;
        shakllar.push({ mesh: onikkiSim, nom: 'O\'N IKKI BURCHAKLI (SIMLI)', rang: '#ff8800' });

        // 21. Qo'sh konus
        const qoshKonusGroup = new THREE.Group();
        const konus1 = new THREE.Mesh(new THREE.ConeGeometry(1.7, 2.8, 18), materialYaratish(0x55aaff, 0x002244));
        konus1.position.y = 1.4;
        konus1.castShadow = true;
        konus1.receiveShadow = true;
        const konus2 = new THREE.Mesh(new THREE.ConeGeometry(1.7, 2.8, 18), materialYaratish(0x55aaff, 0x002244));
        konus2.position.y = -1.4;
        konus2.rotation.x = Math.PI;
        konus2.castShadow = true;
        konus2.receiveShadow = true;
        qoshKonusGroup.add(konus1);
        qoshKonusGroup.add(konus2);
        shakllar.push({ mesh: qoshKonusGroup, nom: 'QO\'SH KONUS', rang: '#55aaff' });

        // 22. Olti burchakli prizma
        const oltiGeo = new THREE.CylinderGeometry(2.0, 2.0, 1.0, 6);
        const oltiMat = materialYaratish(0x88aaff, 0x112244);
        const olti = new THREE.Mesh(oltiGeo, oltiMat);
        olti.castShadow = true;
        olti.receiveShadow = true;
        shakllar.push({ mesh: olti, nom: 'OLTI BURCHAKLI PRIZMA', rang: '#88aaff' });

        // 23. Besh burchakli prizma
        const beshGeo = new THREE.CylinderGeometry(2.0, 2.0, 1.0, 5);
        const beshMat = materialYaratish(0xaaff88, 0x224411);
        const besh = new THREE.Mesh(beshGeo, beshMat);
        besh.castShadow = true;
        besh.receiveShadow = true;
        shakllar.push({ mesh: besh, nom: 'BESH BURCHAKLI PRIZMA', rang: '#aaff88' });

        // 24. Uch burchakli prizma
        const uchGeo = new THREE.CylinderGeometry(2.0, 2.0, 1.0, 3);
        const uchMat = materialYaratish(0xffaa88, 0x442211);
        const uch = new THREE.Mesh(uchGeo, uchMat);
        uch.castShadow = true;
        uch.receiveShadow = true;
        shakllar.push({ mesh: uch, nom: 'UCH BURCHAKLI PRIZMA', rang: '#ffaa88' });

        // 25. Yurak shakli
        const yurakShakli = new THREE.Shape();
        yurakShakli.moveTo(0, 1.8);
        yurakShakli.bezierCurveTo(1.8, 2.8, 3.0, 1.2, 0, -1.2);
        yurakShakli.bezierCurveTo(-3.0, 1.2, -1.8, 2.8, 0, 1.8);
        
        const yurakExtrude = {
            depth: 0.6,
            bevelEnabled: true,
            bevelSegments: 3,
            bevelSize: 0.1,
            bevelThickness: 0.1
        };
        const yurakGeo = new THREE.ExtrudeGeometry(yurakShakli, yurakExtrude);
        const yurakMat = materialYaratish(0xff3366, 0x330000);
        const yurak = new THREE.Mesh(yurakGeo, yurakMat);
        yurak.castShadow = true;
        yurak.receiveShadow = true;
        yurak.rotation.x = Math.PI / 2;
        yurak.rotation.z = Math.PI;
        yurak.scale.set(0.9, 0.9, 0.9);
        shakllar.push({ mesh: yurak, nom: 'YURAK', rang: '#ff3366' });

        // 26. Spiral
        const spiralNuqtalar = [];
        for (let i = 0; i <= 120; i++) {
            const t = i / 120 * Math.PI * 5;
            spiralNuqtalar.push(new THREE.Vector3(
                Math.cos(t) * 2.3,
                t * 0.3 - 2,
                Math.sin(t) * 2.3
            ));
        }
        const spiralGeo = new THREE.TubeGeometry(
            new THREE.CatmullRomCurve3(spiralNuqtalar),
            240,
            0.25,
            10,
            false
        );
        const spiralMat = materialYaratish(0x44ff88, 0x004422);
        const spiral = new THREE.Mesh(spiralGeo, spiralMat);
        spiral.castShadow = true;
        spiral.receiveShadow = true;
        shakllar.push({ mesh: spiral, nom: 'SPIRAL', rang: '#44ff88' });

        // 27. Kub (Simli)
        const kubSimGeo = new THREE.BoxGeometry(2.6, 2.6, 2.6);
        const kubSimMat = materialYaratish(0xffaa44, 0x442200, true);
        const kubSim = new THREE.Mesh(kubSimGeo, kubSimMat);
        kubSim.castShadow = true;
        kubSim.receiveShadow = true;
        shakllar.push({ mesh: kubSim, nom: 'KUB (SIMLI)', rang: '#ffaa44' });

        // 28. Silindr (Simli)
        const silindrSimGeo = new THREE.CylinderGeometry(1.7, 1.7, 3.2, 12);
        const silindrSimMat = materialYaratish(0x88aaff, 0x112244, true);
        const silindrSim = new THREE.Mesh(silindrSimGeo, silindrSimMat);
        silindrSim.castShadow = true;
        silindrSim.receiveShadow = true;
        shakllar.push({ mesh: silindrSim, nom: 'SILINDR (SIMLI)', rang: '#88aaff' });

        // 29. Tugun 2 (Turli rang)
        const tugun2Geo = new THREE.TorusKnotGeometry(1.7, 0.45, 100, 12, 2, 3);
        const tugun2Mat = materialYaratish(0xffaa66, 0x442200, false, true, 0.9);
        const tugun2 = new THREE.Mesh(tugun2Geo, tugun2Mat);
        tugun2.castShadow = true;
        tugun2.receiveShadow = true;
        shakllar.push({ mesh: tugun2, nom: 'TUGUN (Ikkinchi tur)', rang: '#ffaa66' });

        // 30. Yigirma burchakli (Silliq)
        const yigirmaSilliqGeo = new THREE.IcosahedronGeometry(2.0, 2);
        const yigirmaSilliqMat = materialYaratish(0x88aaff, 0x112244, false, true, 0.9);
        const yigirmaSilliq = new THREE.Mesh(yigirmaSilliqGeo, yigirmaSilliqMat);
        yigirmaSilliq.castShadow = true;
        yigirmaSilliq.receiveShadow = true;
        shakllar.push({ mesh: yigirmaSilliq, nom: 'YIGIRMA BURCHAKLI (SILLIQ)', rang: '#88aaff' });

        // 31. Sakkizburchakli (Silliq)
        const sakkizSilliqGeo = new THREE.OctahedronGeometry(2.0, 2);
        const sakkizSilliqMat = materialYaratish(0xff88aa, 0x442233, false, true, 0.9);
        const sakkizSilliq = new THREE.Mesh(sakkizSilliqGeo, sakkizSilliqMat);
        sakkizSilliq.castShadow = true;
        sakkizSilliq.receiveShadow = true;
        shakllar.push({ mesh: sakkizSilliq, nom: 'SAKKIZBURCHAKLI (SILLIQ)', rang: '#ff88aa' });

        // 32. Qatlamli kub
        const qatlamliGroup = new THREE.Group();
        for (let i = 0; i < 5; i++) {
            const olcham = 2.6 - i * 0.4;
            const qatlamGeo = new THREE.BoxGeometry(olcham, 0.2, olcham);
            const qatlamMat = materialYaratish(new THREE.Color().setHSL(i * 0.1, 1, 0.5));
            const qatlam = new THREE.Mesh(qatlamGeo, qatlamMat);
            qatlam.position.y = -1.2 + i * 0.6;
            qatlam.castShadow = true;
            qatlam.receiveShadow = true;
            qatlamliGroup.add(qatlam);
        }
        shakllar.push({ mesh: qatlamliGroup, nom: 'QATLAMLI KUB', rang: 'ko\'p rangli' });

        sozlamalar.shakllar = shakllar;
        
        // Barcha shakllarni sahnaga qo'shish
        shakllar.forEach(shakl => {
            sozlamalar.sahna.add(shakl.mesh);
            shakl.mesh.visible = false;
        });
    }

    // ===================== SHAKLNI KO'RSATISH =====================
    function shaklniKorsatish(index) {
        if (sozlamalar.shakllar.length === 0) return;
        
        if (index < 0) index = sozlamalar.shakllar.length - 1;
        if (index >= sozlamalar.shakllar.length) index = 0;
        
        // Barchasini yashirish
        sozlamalar.shakllar.forEach(shakl => {
            if (shakl.mesh) {
                shakl.mesh.visible = false;
            }
        });
        
        // Joriyni ko'rsatish
        sozlamalar.shakllar[index].mesh.visible = true;
        sozlamalar.joriyShakl = index;
        
        // Hisoblagichni yangilash
        const hisoblagich = document.getElementById('shakl-hisoblagich');
        if (hisoblagich) {
            hisoblagich.innerHTML = `Shakl: ${index + 1}/${sozlamalar.shakllar.length} - ${sozlamalar.shakllar[index].nom}`;
        }
        
        // Ma'lumotni yangilash
        const malumot = document.getElementById('shakl-malumot');
        if (malumot) {
            malumot.innerHTML = `Joriy: ${sozlamalar.shakllar[index].nom} | Rang: ${sozlamalar.shakllar[index].rang}`;
        }
        
        // Avtomatik aylantirish
        if (sozlamalar.boshqaruv) {
            sozlamalar.boshqaruv.autoRotate = true;
        }
    }

    // ===================== KEYINGI SHAKL =====================
    function keyingiShakl() {
        shaklniKorsatish(sozlamalar.joriyShakl + 1);
    }

    function oldingiShakl() {
        shaklniKorsatish(sozlamalar.joriyShakl - 1);
    }

    // ===================== ANIMATSIYA =====================
    function animatsiya() {
        if (!sozlamalar.faol) return;
        
        requestAnimationFrame(animatsiya);
        
        const vaqt = Date.now() * 0.001;
        
        // Boshqaruvni yangilash
        if (sozlamalar.boshqaruv) {
            sozlamalar.boshqaruv.update();
        }
        
        // Joriy shaklni animatsiya qilish
        if (sozlamalar.shakllar.length > 0 && sozlamalar.shakllar[sozlamalar.joriyShakl]) {
            const shakl = sozlamalar.shakllar[sozlamalar.joriyShakl].mesh;
            
            // Suzish effekti
            shakl.position.y = Math.sin(vaqt * 2) * 0.5;
            
            // Qo'shimcha aylanish
            if (!sozlamalar.boshqaruv?.autoRotate) {
                shakl.rotation.y += 0.006;
            }
            
            // Pulsatsiya
            if (sozlamalar.joriyShakl % 4 === 0) {
                const masshtab = 1 + Math.sin(vaqt * 3) * 0.08;
                shakl.scale.set(masshtab, masshtab, masshtab);
            }
        }
        
        // Zarralarni aylantirish
        if (sozlamalar.zarralar) {
            sozlamalar.zarralar.rotation.y += 0.00015;
            sozlamalar.zarralar.rotation.x += 0.00005;
        }
        
        // Render
        if (sozlamalar.renderer && sozlamalar.sahna && sozlamalar.kamera) {
            sozlamalar.renderer.render(sozlamalar.sahna, sozlamalar.kamera);
        }
    }

    // ===================== OYNA O'LCHAMI O'ZGARGANDA =====================
    function oynaniOzgartirish() {
        if (sozlamalar.kamera) {
            sozlamalar.kamera.aspect = window.innerWidth / window.innerHeight;
            sozlamalar.kamera.updateProjectionMatrix();
        }
        if (sozlamalar.renderer) {
            sozlamalar.renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }

    // ===================== SCROLL BOSHQARUVI =====================
    function scrollBoshqarish(voqea) {
        if (!sozlamalar.faol) return;
        
        sozlamalar.scrollSoni++;
        
        const scrollHisoblagich = document.getElementById('scroll-hisoblagich');
        if (scrollHisoblagich) {
            scrollHisoblagich.innerHTML = `Chiqish uchun scroll: ${sozlamalar.scrollSoni}/${sozlamalar.scrollChegarasi}`;
        }
        
        // Scroll orqali shakl almashtirish
        if (voqea.deltaY > 0) {
            keyingiShakl();
        } else {
            oldingiShakl();
        }
        
        // Chegaraga yetganda chiqish
        if (sozlamalar.scrollSoni >= sozlamalar.scrollChegarasi) {
            rejimdanChiqish();
        }
        
        voqea.preventDefault();
    }

    // ===================== KLIVATURA BOSHQARUVI =====================
    function klaviaturaBoshqarish(voqea) {
        if (!sozlamalar.faol) return;
        
        switch(voqea.key) {
            case 'ArrowLeft':
                oldingiShakl();
                voqea.preventDefault();
                break;
            case 'ArrowRight':
                keyingiShakl();
                voqea.preventDefault();
                break;
            case 'Escape':
                rejimdanChiqish();
                voqea.preventDefault();
                break;
            case ' ':
                if (sozlamalar.boshqaruv) {
                    sozlamalar.boshqaruv.autoRotate = !sozlamalar.boshqaruv.autoRotate;
                }
                voqea.preventDefault();
                break;
        }
    }

    // ===================== REJIMGA KIRISH =====================
    async function rejimgaKirish() {
        const konteyner = document.getElementById(sozlamalar.konteynerId);
        if (!konteyner) {
            konteynerYaratish();
        }
        
        document.getElementById(sozlamalar.konteynerId).style.display = 'flex';
        sozlamalar.faol = true;
        sozlamalar.scrollSoni = 0;
        
        // Hisoblagichni yangilash
        const scrollHisoblagich = document.getElementById('scroll-hisoblagich');
        if (scrollHisoblagich) {
            scrollHisoblagich.innerHTML = `Chiqish uchun scroll: 0/${sozlamalar.scrollChegarasi}`;
        }
        
        // Three.js ni ishga tushirish
        if (!sozlamalar.sahna) {
            await sahnaSozlash();
        } else {
            shaklniKorsatish(sozlamalar.joriyShakl);
        }
        
        // Event listenerlarni qo'shish
        window.addEventListener('wheel', scrollBoshqarish, { passive: false });
        window.addEventListener('keydown', klaviaturaBoshqarish);
        
        // Body scroll ni to'xtatish
        document.body.style.overflow = 'hidden';
    }

    // ===================== REJIMDAN CHIQISH =====================
    function rejimdanChiqish() {
        const konteyner = document.getElementById(sozlamalar.konteynerId);
        if (konteyner) {
            konteyner.style.display = 'none';
        }
        
        sozlamalar.faol = false;
        
        // Event listenerlarni olib tashlash
        window.removeEventListener('wheel', scrollBoshqarish);
        window.removeEventListener('keydown', klaviaturaBoshqarish);
        
        // Body scroll ni qayta yoqish
        document.body.style.overflow = 'auto';
    }

    // ===================== BOSHLANG'ICH SOZLASH =====================
    function boshlash() {
        // Konteyner yaratish
        konteynerYaratish();
        
        // XolericAI ga qo'shimcha buyruq qo'shish
        if (typeof XolericAI !== 'undefined') {
            const originalAnalyze = XolericAI.analyze;
            XolericAI.analyze = function(kiritish) {
                const kichikKiritish = kiritish.toLowerCase();
                if (kichikKiritish.includes('3d') || 
                    kichikKiritish.includes('uch o\'lcham') ||
                    kichikKiritish.includes('shakl') || 
                    kichikKiritish.includes('geometrik') ||
                    kichikKiritish.includes('kub') ||
                    kichikKiritish.includes('aylana') ||
                    kichikKiritish.includes('uch burchak') ||
                    kichikKiritish.includes('to\'rt burchak') ||
                    kichikKiritish.includes('besh burchak') ||
                    kichikKiritish.includes('olti burchak') ||
                    kichikKiritish.includes('sakkiz burchak') ||
                    kichikKiritish.includes('yigirma burchak') ||
                    kichikKiritish.includes('piramida') ||
                    kichikKiritish.includes('konus') ||
                    kichikKiritish.includes('silindr') ||
                    kichikKiritish.includes('yulduz') ||
                    kichikKiritish.includes('yurak') ||
                    kichikKiritish.includes('spiral')) {
                    
                    setTimeout(() => {
                        rejimgaKirish();
                    }, 100);
                    
                    return "🎨 3D SHAKL YARATUVCHI ISHGA TUSHIRILMOQDA!\n\n" +
                           "⚡ 32 xil geometrik shakllar tayyor:\n" +
                           "• Kub, shar, silindr, konus\n" +
                           "• 3,4,5,6,8,12,20 burchakli shakllar\n" +
                           "• Piramida, halqa, tugun, yulduz\n" +
                           "• Yurak, spiral va simli variantlar\n\n" +
                           "📌 FOYDALANISH QO'LLANMASI:\n" +
                           "🖱️ SCROLL: shakllarni almashtirish\n" +
                           "🔟 10 marta scroll: rejimdan chiqish\n" +
                           "← → strelkalar: navigatsiya\n" +
                           "␣ BO'SH JOY: aylanishni to'xtatish\n" +
                           "⎋ ESC: chiqish\n\n" +
                           "⏳ 3D muhit yuklanmoqda...";
                }
                return originalAnalyze.call(this, kiritish);
            };
        }
        
        // Global funksiyalarni qo'shish
        window.shaklRejimigaKirish = rejimgaKirish;
        window.shaklRejimidanChiqish = rejimdanChiqish;
        
        console.log('✅ 3D Shakl Yaratuvi v3.0 yuklandi. "3D" yoki "shakl" deb yozing.');
    }

    // DOM tayyor bo'lganda boshlash
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boshlash);
    } else {
        boshlash();
    }

})();
