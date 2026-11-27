/* Banner Typography */
const typoBg = document.querySelector("#banner .typo_bg");
const originalLines = Array.from(typoBg.children).map((line) => line.cloneNode(true));

/* 랜덤 타이포그래피 스타일 */
function randomTypoStyle(span) {
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

    const isKorean = /[가-힣ㄱ-ㅎㅏ-ㅣ]/.test(span.textContent);

    /* 폰트 랜덤 설정 */
    const font = isKorean
        ? '"Pretendard", sans-serif'
        : pick(['"Pretendard", sans-serif', '"Teko", sans-serif']);

    /* 폰트 크기 랜덤 설정 */
    const size = font.includes("Teko")
        ? pick(["clamp(26px, 2.5vw, 42px)", "clamp(30px, 3vw, 48px)", "clamp(34px, 3.3vw, 54px)"])
        : pick(["clamp(18px, 1.6vw, 28px)", "clamp(22px, 2vw, 34px)", "clamp(26px, 2.3vw, 40px)"]);

    /* 폰트 굵기 랜덤 설정 */
    const weight = pick([300, 400, 500, 600, 700]);

    /* 색상 및 투명도 랜덤 설정 */
    /* 색상 및 투명도 랜덤 설정 */
    /* 색상 랜덤 설정 */
    const color = pick([
        "#535358",
        "#8e90a3",
        "#2b2b2e",
        "#0c0d1a",
        "#8b8eac",
        "#191a20",
        "#1b1b1f",
        "#5c5c5c",
        "#dae1e9",
        "#3e3c47",
        "#0b1b4a",
    ]);

    span.style.setProperty("--typo-font", font);
    span.style.setProperty("--typo-size", size);
    span.style.setProperty("--typo-weight", weight);
    span.style.setProperty("--typo-color", color);
}

/* 배너 텍스트 자동 채우기 */
function fillTypoBackground() {
    typoBg.innerHTML = "";

    const gap = parseFloat(getComputedStyle(typoBg).rowGap) || 0;

    let totalHeight = 0;
    let i = 0;

    while (totalHeight < typoBg.clientHeight + 120) {
        const line = originalLines[i % originalLines.length].cloneNode(true);

        const tracks = Array.from(line.children);

        /* 기존 복제 트랙 제거 */
        tracks.slice(1).forEach((track) => track.remove());

        typoBg.appendChild(line);

        const track = line.firstElementChild;

        /* 문구별 랜덤 스타일 적용 */
        track.querySelectorAll("span").forEach(randomTypoStyle);

        const originalTrack = track.cloneNode(true);

        /* 가로 화면도 빈 공간 없이 채우기 */
        while (track.getBoundingClientRect().width < typoBg.clientWidth) {
            Array.from(originalTrack.children).forEach((span) => {
                const clone = span.cloneNode(true);

                randomTypoStyle(clone);
                track.appendChild(clone);
            });
        }

        /* 끊김 없는 무한 반복 */
        line.appendChild(track.cloneNode(true));

        /* 실제 줄 높이 누적 */
        totalHeight += line.getBoundingClientRect().height + gap;

        i++;
    }
}

/* 폰트 로딩 완료 후 실행 */
document.fonts.ready.then(() => {
    fillTypoBackground();

    let lastWidth = typoBg.clientWidth;
    let lastHeight = typoBg.clientHeight;

    /* 화면 크기 변경 시 배경 재생성 */
    const typoResize = new ResizeObserver(() => {
        const width = typoBg.clientWidth;
        const height = typoBg.clientHeight;

        if (width === lastWidth && height === lastHeight) return;

        lastWidth = width;
        lastHeight = height;

        fillTypoBackground();
    });

    typoResize.observe(typoBg);
});

/* --- Banner Typography --- */

/* Number Counter */
const counters = document.querySelectorAll(".count");

const observer = new IntersectionObserver(
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

                observer.unobserve(counter);
            }
        });
    },
    {
        threshold: 0.5,
    },
);

counters.forEach((counter) => {
    observer.observe(counter);
});

/* --- Number Counter --- */

/* Header Mobile Menu */
const headerNav = document.querySelector(".header_nav");
const headerToggle = document.querySelector("#headerToggle");

headerToggle.addEventListener("click", () => {
    headerNav.classList.toggle("show");
});

/* --- Header Mobile Menu --- */
