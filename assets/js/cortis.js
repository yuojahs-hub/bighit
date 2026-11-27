var swiper = new Swiper(".hero", {
    effect: "cards",
    grabCursor: true,

    loop: false,
    rewind: true,
    initialSlide: 0,
    speed: 800,

    autoplay: {
        delay: 2500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
        reverseDirection: false,
    },
});

//awards
gsap.registerPlugin(ScrollTrigger);

const awardMedia = gsap.matchMedia();

awardMedia.add("(min-width: 769px)", (context) => {
    const awardTitle = document.querySelector(".award-title");
    const awardLeft = document.querySelector(".award-word.left");
    const awardRight = document.querySelector(".award-word.right");
    const awardLine = document.querySelector(".award-line");
    const awardPaper = document.querySelector(".award-paper");
    const awardStage = document.querySelector(".award-stage");
    const awardReveal = document.querySelector(".awardReveal");
    const awardPaperWindow = document.querySelector(".award-paper-window");
    const awardImg = document.querySelector(".award-paper img");

    if (
        !awardTitle ||
        !awardLeft ||
        !awardRight ||
        !awardLine ||
        !awardPaper ||
        !awardStage ||
        !awardReveal ||
        !awardPaperWindow ||
        !awardImg
    )
        return;

    const originalTop = awardPaperWindow.style.top;
    const originalHeight = awardReveal.style.height;

    function updateAwards() {
        // 01. 가로선의 실제 위치 계산
        const stageRect = awardStage.getBoundingClientRect();
        const lineRect = awardLine.getBoundingClientRect();

        const paperTop = lineRect.top - stageRect.top + lineRect.height / 2;

        awardPaperWindow.style.top = `${paperTop}px`;

        // 02. Awards 영역 자체의 높이 확보
        const paperHeight = awardImg.getBoundingClientRect().height;
        const revealHeight = window.innerHeight;

        awardReveal.style.height = `${revealHeight + paperHeight}px`;
    }

    context.add("setupAwards", () => {
        updateAwards();

        gsap.set(awardLine, {
            flexGrow: 0,
            flexBasis: "0px",
        });

        gsap.set(awardPaper, {
            clipPath: "inset(0 0 100% 0)",
        });

        // 03. 펼쳐지는 동안 장면 고정
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: awardReveal,
                start: "top top",
                end: () => `+=${window.innerHeight * 0.45}`,
                scrub: 1,
                pin: awardStage,
                pinSpacing: true,
                invalidateOnRefresh: true,
            },
        });

        // 04. 선이 먼저 길어짐
        tl.to(
            awardLine,
            {
                flexGrow: 1,
                duration: 1.5,
                ease: "power2.inOut",
            },
            0,
        );

        // 05. 선이 펼쳐진 다음 종이가 내려옴
        tl.to(
            awardPaper,
            {
                clipPath: "inset(0 0 0% 0)",
                duration: 1,
                ease: "none",
            },
            1.7,
        );

        ScrollTrigger.refresh();
    });

    // 이미지 로딩 확인
    if (awardImg.complete && awardImg.naturalHeight > 0) {
        context.setupAwards();
    } else {
        awardImg.addEventListener("load", context.setupAwards, {
            once: true,
        });
    }

    // 화면 크기 변경
    function resizeAwards() {
        updateAwards();
        ScrollTrigger.refresh();
    }

    window.addEventListener("resize", resizeAwards);

    // 768px 이하에서 설정 초기화
    return () => {
        awardImg.removeEventListener("load", context.setupAwards);
        window.removeEventListener("resize", resizeAwards);

        awardPaperWindow.style.top = originalTop;
        awardReveal.style.height = originalHeight;
    };
});
