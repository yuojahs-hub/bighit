import * as THREE from "three";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

/* 3D Navigation Logo */
const container = document.querySelector("#navLogo3D");
const sourceSVG = document.querySelector("#header .header_logo svg");
const header = document.querySelector("#header");

if (container && sourceSVG && header) {
    /* Scene */
    const scene = new THREE.Scene();

    /* Camera */
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 1000);

    camera.position.set(0, 0, 6);
    camera.lookAt(0, 0, 0);

    /* Renderer */
    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;

    container.appendChild(renderer.domElement);

    /* 금속 반사용 환경광 */
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();

    const environment = pmrem.fromScene(room, 0.04);

    scene.environment = environment.texture;

    room.dispose();
    pmrem.dispose();

    /* 메탈 재질 */
    const material = new THREE.MeshStandardMaterial({
        color: 0xd8dce5,
        metalness: 1,
        roughness: 0.16,
        envMapIntensity: 1.5,
    });

    /* 기존 헤더 SVG 불러오기 */
    const svgCopy = sourceSVG.cloneNode(true);

    const svgText = new XMLSerializer().serializeToString(svgCopy);

    const loader = new SVGLoader();
    const svgData = loader.parse(svgText);

    /* 3D 로고 그룹 */
    const logo = new THREE.Group();

    /* SVG에 입체 두께 추가 */
    svgData.paths.forEach((path) => {
        const shapes = SVGLoader.createShapes(path);

        shapes.forEach((shape) => {
            const geometry = new THREE.ExtrudeGeometry(shape, {
                depth: 12,
                bevelEnabled: true,
                bevelThickness: 0.7,
                bevelSize: 0.5,
                bevelSegments: 3,
                curveSegments: 16,
                steps: 1,
            });

            const mesh = new THREE.Mesh(geometry, material);

            logo.add(mesh);
        });
    });

    /* SVG 좌표계 방향 보정 */
    logo.scale.y = -1;

    /* 로고 중심 정렬 */
    const box = new THREE.Box3().setFromObject(logo);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    logo.position.sub(center);

    /* 회전 기준 그룹 */
    const pivot = new THREE.Group();

    pivot.add(logo);

    /* 로고 크기 */
    const scale = 4.5 / size.x;

    pivot.scale.setScalar(scale);
    pivot.rotation.x = -0.08;

    scene.add(pivot);

    /* 반응형 크기 설정 */
    function resizeLogo() {
        const width = container.clientWidth;
        const height = container.clientHeight;

        if (!width || !height) return;

        renderer.setSize(width, height, false);

        camera.aspect = width / height;
        camera.fov = 35;

        const verticalFov = THREE.MathUtils.degToRad(camera.fov);

        const tanHalfFov = Math.tan(verticalFov / 2);

        /* 회전 시 잘리지 않도록 촬영 범위 확보 */
        camera.position.z = Math.max(
            6,
            6.5 / (2 * tanHalfFov * camera.aspect),
            4.6 / (2 * tanHalfFov),
        );

        camera.lookAt(0, 0, 0);
        camera.updateProjectionMatrix();
    }

    /* 화면 크기 감지 */
    const resizeObserver = new ResizeObserver(resizeLogo);

    resizeObserver.observe(container);

    /* 회전 애니메이션 */
    const clock = new THREE.Clock();

    renderer.setAnimationLoop(() => {
        const delta = Math.min(clock.getDelta(), 0.05);

        /* 모바일 메뉴가 열린 상태에서만 렌더링 */
        if (!header.classList.contains("menu_open")) {
            return;
        }

        /* Y축 360도 회전 */
        pivot.rotation.y += delta * 1.25;

        renderer.render(scene, camera);
    });

    resizeLogo();
}

/* --- 3D Navigation Logo --- */
