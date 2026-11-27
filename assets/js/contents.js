// ARTIST TAB
const tabs = document.querySelectorAll(".artist-tab");
const panels = document.querySelectorAll(".tab-panel");

// 모든 아티스트의 배경 타이포
const bgTypos = document.querySelectorAll(".tab-panel .bg_typo");

// 공통 SVG Water Mask 요소
const waterPosition = document.querySelector("#waterPosition");
const waterSpread = document.querySelector("#waterSpread");
const waterShape = document.querySelector("#waterShape");

// 물결 상태
const water = {
    x: 0.5,
    y: 0.5,
    scale: 0,
};

// 탭 전환 중복 클릭 방지
let isSwitching = false;

// 애니메이션 시간
const lineDuration = 0.45;

// ARTIST TAB 전환 애니메이션
tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        // 애니메이션 중이거나 현재 활성화된 탭이면 종료
        if (isSwitching || tab.classList.contains("active")) return;

        isSwitching = true;

        // 현재 패널과 다음 패널
        const currentPanel = document.querySelector(".tab-panel.active");
        const target = tab.dataset.tab;
        const nextPanel = document.getElementById(target);

        if (!currentPanel || !nextPanel) {
            isSwitching = false;
            return;
        }

        // 모든 탭 비활성화
        tabs.forEach((item) => {
            item.classList.remove("active");
        });

        // 클릭한 탭 활성화
        tab.classList.add("active");

        // 모든 배경 타이포 초기화
        bgTypos.forEach((bgTypo) => {
            bgTypo.classList.remove("active");
        });

        // 물결 크기 초기화
        gsap.to(water, {
            scale: 0,
            duration: 0.5,
            ease: "power2.inOut",
            overwrite: "auto",
        });

        // 기존 패널의 프로젝트 글자
        const currentTextElements = currentPanel.querySelectorAll(
            ".project .number, .project .info, .project .view",
        );

        // 기존 선 퇴장 시작
        currentPanel.classList.add("line-leaving");

        // 기존 글자도 동시에 아래로 내려가며 사라짐
        gsap.to(currentTextElements, {
            autoAlpha: 0,
            y: 30,

            duration: lineDuration,
            ease: "power2.in",

            overwrite: "auto",
        });

        // 선과 글자 퇴장이 끝나면 다음 패널로 전환
        gsap.delayedCall(lineDuration, () => {
            // 기존 패널 비활성화
            currentPanel.classList.remove("active", "line-leaving");

            // 기존 패널의 글자 스타일 초기화
            gsap.set(currentTextElements, {
                clearProps: "opacity,visibility,transform",
            });

            // 기존 패널 투명도 초기화
            gsap.set(currentPanel, {
                clearProps: "opacity",
            });

            // 새 패널 활성화
            nextPanel.classList.add("active");

            gsap.set(nextPanel, {
                opacity: 1,
            });

            // 새 패널의 프로젝트 글자
            const textElements = nextPanel.querySelectorAll(
                ".project .number, .project .info, .project .view",
            );

            // 글자를 아래쪽에 숨겨두기
            gsap.set(textElements, {
                autoAlpha: 0,
                y: 30,
            });

            // 새 선 등장 준비
            nextPanel.classList.add("line-entering");

            // 브라우저가 초기 선 상태를 먼저 적용하도록 함
            nextPanel.offsetWidth;

            // 왼쪽에서 오른쪽으로 선 등장
            nextPanel.classList.remove("line-entering");

            // 글자 아래에서 위로 순차 등장
            if (textElements.length > 0) {
                gsap.to(textElements, {
                    autoAlpha: 1,
                    y: 0,

                    duration: 0.65,
                    stagger: 0.08,
                    ease: "power3.out",

                    overwrite: "auto",

                    clearProps: "opacity,visibility,transform",

                    onComplete: () => {
                        isSwitching = false;
                    },
                });
            } else {
                isSwitching = false;
            }
        });
    });
});

// 각 아티스트 패널에 마우스 이벤트 연결
bgTypos.forEach((bgTypo) => {
    const panel = bgTypo.closest(".tab-panel");

    // 마우스 이동
    panel.addEventListener("mousemove", (e) => {
        const rect = bgTypo.getBoundingClientRect();

        // 패널 크기가 없으면 실행하지 않음
        if (!rect.width || !rect.height) return;

        const x = gsap.utils.clamp(0, 1, (e.clientX - rect.left) / rect.width);

        const y = gsap.utils.clamp(0, 1, (e.clientY - rect.top) / rect.height);

        bgTypo.classList.add("active");

        gsap.to(water, {
            x: 0.88 - x * 0.76,
            y: 0.75 - y * 0.5,
            scale: 1,

            duration: 0.9,
            ease: "power3.out",
            overwrite: "auto",
        });
    });

    // 패널에서 마우스 이탈
    panel.addEventListener("mouseleave", () => {
        bgTypo.classList.remove("active");

        gsap.to(water, {
            scale: 0,
            duration: 0.7,
            ease: "power2.inOut",
            overwrite: "auto",
        });
    });
});

// 불규칙한 물방울 형태 생성
gsap.ticker.add((time) => {
    // SVG 요소가 없으면 실행하지 않음
    if (!waterShape || !waterPosition || !waterSpread) return;

    const points = [];
    const pointCount = 24;

    // 가로 크기 변화
    const radiusX = 0.29 * (1 + Math.sin(time * 0.71) * 0.23 + Math.cos(time * 1.37) * 0.12);

    // 세로 크기 변화
    const radiusY = 0.38 * (1 + Math.cos(time * 0.53) * 0.22 + Math.sin(time * 1.11) * 0.14);

    for (let i = 0; i < pointCount; i++) {
        const angle = (i / pointCount) * Math.PI * 2;

        // 불규칙한 물방울 굴곡
        const wave =
            1 +
            Math.sin(angle * 2 + time * 0.65) * 0.22 +
            Math.cos(angle * 3 - time * 0.83) * 0.25 +
            Math.sin(angle * 5 + time * 1.17) * 0.15 +
            Math.cos(angle * 7 - time * 0.48) * 0.07;

        points.push({
            x: Math.cos(angle) * radiusX * wave,
            y: Math.sin(angle) * radiusY * wave,
        });
    }

    const first = points[0];
    const last = points[points.length - 1];

    let path = `M ${(last.x + first.x) / 2}
                ${(last.y + first.y) / 2}`;

    points.forEach((point, i) => {
        const next = points[(i + 1) % points.length];

        const midX = (point.x + next.x) / 2;
        const midY = (point.y + next.y) / 2;

        path += ` Q ${point.x} ${point.y} ${midX} ${midY}`;
    });

    path += " Z";

    // SVG 물결 모양 업데이트
    waterShape.setAttribute("d", path);

    waterPosition.setAttribute("transform", `translate(${water.x} ${water.y})`);

    waterSpread.setAttribute("transform", `scale(${water.scale})`);
});
