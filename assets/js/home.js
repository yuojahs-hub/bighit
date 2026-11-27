/* Banner Scanline Typography */
(function () {
    const scanlineGroup = document.querySelector("#bighitScanlines");

    if (!scanlineGroup) return;

    const svgNS = "http://www.w3.org/2000/svg";

    /* 가로선 모션 설정값 */
    const settings = {
        width: 1200,
        height: 540,

        spacing: 8,
        maxThickness: 8.6,
        minThickness: 0.6,

        duration: 5000,
        stagger: 15,

        hold: 800,
        shrink: 600,
        wait: 200,
        expand: 600,
    };

    const lines = [];

    /* 기존 가로선 초기화 */
    scanlineGroup.replaceChildren();

    /* SVG 가로선 생성 */
    for (let y = settings.spacing / 2; y < settings.height; y += settings.spacing) {
        const line = document.createElementNS(svgNS, "rect");

        line.setAttribute("x", 0);
        line.setAttribute("width", settings.width);
        line.setAttribute("y", y - settings.maxThickness / 2);
        line.setAttribute("height", settings.maxThickness);
        line.setAttribute("shape-rendering", "crispEdges");

        scanlineGroup.appendChild(line);

        lines.push({
            element: line,
            centerY: y,
        });
    }

    /* 애니메이션 시작 시간 */
    let elapsed = 0;
    let lastTime = null;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    /* 부드러운 가속 및 감속 */
    function easeInOut(t) {
        return -(Math.cos(Math.PI * t) - 1) / 2;
    }

    /* 가로선 두께 애니메이션 */
    /* 부드러운 가속 및 감속 */
    function easeInOut(t) {
        return -(Math.cos(Math.PI * t) - 1) / 2;
    }

    /* 가로선 두께 애니메이션 */
    function animate(now) {
        if (lastTime !== null) {
            elapsed += Math.min(now - lastTime, 50);
        }

        lastTime = now;

        const totalStagger = (lines.length - 1) * settings.stagger;

        const expandStart = settings.hold + totalStagger + settings.shrink + settings.wait;

        const cycleDuration = Math.max(
            settings.duration,
            expandStart + totalStagger + settings.expand + 300,
        );

        const cycle = elapsed % cycleDuration;

        lines.forEach((line, index) => {
            /* 위에서 아래로 */
            const shrinkTime = cycle - settings.hold - index * settings.stagger;

            /* 아래에서 위로 */
            const reverseIndex = lines.length - 1 - index;

            const expandTime = cycle - expandStart - reverseIndex * settings.stagger;

            let thickness = settings.maxThickness;

            if (!reduceMotion.matches) {
                const shrinkProgress = easeInOut(
                    Math.max(0, Math.min(shrinkTime / settings.shrink, 1)),
                );

                const expandProgress = easeInOut(
                    Math.max(0, Math.min(expandTime / settings.expand, 1)),
                );

                const range = settings.maxThickness - settings.minThickness;

                thickness = settings.maxThickness - range * shrinkProgress + range * expandProgress;
            }

            /* 가로선 중심 위치 고정 */
            line.element.setAttribute("y", (line.centerY - thickness / 2).toFixed(3));

            line.element.setAttribute("height", thickness.toFixed(3));
        });

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
})();

/* --- Banner Scanline Typography --- */

/* Number Counter */
(function () {
    const numberCounters = document.querySelectorAll(".count");

    if (!numberCounters.length) return;

    const counterObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = Number(counter.dataset.target);

                    const duration = 2500;
                    const startTime = performance.now();

                    function update(now) {
                        const progress = Math.min((now - startTime) / duration, 1);

                        const eased = 1 - Math.pow(1 - progress, 4);
                        const current = Math.floor(target * eased);

                        counter.textContent = current;

                        if (progress < 1) {
                            requestAnimationFrame(update);
                        } else {
                            counter.textContent = target;
                        }
                    }

                    requestAnimationFrame(update);

                    counterObserver.unobserve(counter);
                }
            });
        },
        {
            threshold: 0.5,
        },
    );

    numberCounters.forEach((counter) => {
        counterObserver.observe(counter);
    });
})();

/* --- Number Counter --- */

/* Brand Micro Text Track */
(function () {
    const micro = document.querySelector("#banner .brand_micro");
    const track = document.querySelector("#banner .brand_micro_track");

    if (!micro || !track || !track.firstElementChild) return;

    const original = track.firstElementChild.cloneNode(true);

    function fillMicroTrack() {
        if (micro.clientWidth === 0) return;

        track.replaceChildren();

        /* 화면 너비만큼 텍스트 자동 생성 */
        do {
            track.appendChild(original.cloneNode(true));
        } while (track.scrollWidth < micro.clientWidth);

        /* 끊김 없는 무한 반복을 위한 복제 */
        const items = Array.from(track.children);

        items.forEach((item) => {
            track.appendChild(item.cloneNode(true));
        });
    }

    /* 폰트 로딩 후 실행 */
    document.fonts.ready.then(() => {
        fillMicroTrack();

        /* 화면 크기 변경 시 자동 재배치 */
        const microObserver = new ResizeObserver(fillMicroTrack);

        microObserver.observe(micro);
    });
})();

/* --- Brand Micro Text Track --- */
