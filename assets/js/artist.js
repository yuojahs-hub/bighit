gsap.registerPlugin(ScrollTrigger, Flip);

const mainText = document.querySelector(".main_text");

function toggleMainText(show) {
    const state = Flip.getState(".main_text .group span");

    mainText.classList.toggle("show", show);

    Flip.from(state, {
        duration: 0.8,
        ease: "power2.inOut",
        absolute: false,
        overwrite: true,
    });
}

ScrollTrigger.create({
    trigger: mainText,
    start: "top 80%",

    onEnter: () => toggleMainText(true),
    onLeaveBack: () => toggleMainText(false),
});

gsap.registerPlugin(ScrollTrigger);

const horizontal = document.querySelector("#slider");
const sliderInner = document.querySelector(".slider_inner");

const mm = gsap.matchMedia();

/* 481px 이상에서만 가로 스크롤 적용 */
mm.add("(min-width: 481px)", () => {
    const getDistance = () => Math.max(0, sliderInner.scrollWidth - horizontal.clientWidth);

    gsap.to(sliderInner, {
        x: () => -getDistance(),
        ease: "none",

        scrollTrigger: {
            trigger: horizontal,
            start: "top 56px",
            end: () => "+=" + Math.max(1, getDistance()),

            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
        },
    });
});
