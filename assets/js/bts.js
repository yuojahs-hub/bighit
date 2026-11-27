gsap.registerPlugin(ScrollTrigger);

const memberMedia = gsap.matchMedia();

memberMedia.add("(min-width: 769px)", () => {
    const members = document.querySelector("#members");
    const memberList = members.querySelector(".member_list");
    const memberItems = gsap.utils.toArray("#members .member_item");

    /* 초기 상태 */
    gsap.set(memberItems, {
        width: "0%",
        flexShrink: 0,
    });

    gsap.set(memberItems.slice(0, 2), {
        width: "50%",
    });

    /* 스크롤 애니메이션 */
    const memberTl = gsap.timeline({
        defaults: {
            ease: "none",
        },

        scrollTrigger: {
            trigger: members,
            start: "25% top",
            end: () => "+=" + (memberItems.length - 2) * 650,

            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
        },
    });

    /* 사진 접기 + 펼치기 */
    for (let i = 2; i < memberItems.length; i++) {
        const step = "member" + i;

        // 이전 사진 접기
        memberTl.to(
            memberItems[i - 2],
            {
                width: "0%",
                duration: 1,
            },
            step,
        );

        // 다음 사진 펼치기
        memberTl.to(
            memberItems[i],
            {
                width: "50%",
                duration: 1,
            },
            step,
        );
    }
});

// slider
var swiper = new Swiper(".hero", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: "auto",
    coverflowEffect: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
    },
    pagination: {
        el: ".swiper-pagination",
    },
});

gsap.registerPlugin(ScrollTrigger);

const awardMedia = gsap.matchMedia();

awardMedia.add("(min-width: 769px)", () => {
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

    let awardContext;

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

    function setupAwards() {
        updateAwards();

        awardContext = gsap.context(() => {
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
        });

        ScrollTrigger.refresh();
    }

    // 이미지 로딩 확인
    if (awardImg.complete && awardImg.naturalHeight > 0) {
        setupAwards();
    } else {
        awardImg.addEventListener("load", setupAwards, {
            once: true,
        });
    }

    // 화면 크기 변경
    function resizeAwards() {
        if (!awardContext) return;

        updateAwards();
        ScrollTrigger.refresh();
    }

    window.addEventListener("resize", resizeAwards);

    // 768px 이하에서 기존 애니메이션 및 설정 해제
    return () => {
        awardImg.removeEventListener("load", setupAwards);
        window.removeEventListener("resize", resizeAwards);

        if (awardContext) {
            awardContext.revert();
        }

        awardPaperWindow.style.top = originalTop;
        awardReveal.style.height = originalHeight;
    };
});

// 768px 이하에서는 애니메이션 없이 표시
awardMedia.add("(max-width: 768px)", () => {
    gsap.set(".award-line", {
        flexGrow: 1,
    });

    gsap.set(".award-paper", {
        clipPath: "inset(0 0 0% 0)",
    });
});
