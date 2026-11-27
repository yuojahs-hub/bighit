document.addEventListener("DOMContentLoaded", () => {
    const section = document.querySelector(".member-scroll");
    const members = document.querySelectorAll(".member");
    const symbol = document.querySelector(".member-symbol img");

    if (!section || !members.length || !symbol) return;

    let currentIndex = -1;
    let ticking = false;

    const totalMembers = members.length;

    // 스크롤 위치에 따라 멤버 변경
    function updateMember() {
        const rect = section.getBoundingClientRect();

        // 실제 sticky 스크롤 가능 거리
        const scrollDistance = section.offsetHeight - window.innerHeight;

        if (scrollDistance <= 0) return;

        // 현재 스크롤 진행률 (0 ~ 1)
        const progress = Math.max(0, Math.min(1, -rect.top / scrollDistance));

        // 현재 멤버 인덱스
        const index = Math.min(totalMembers - 1, Math.floor(progress * totalMembers));

        // 같은 멤버라면 실행하지 않음
        if (index === currentIndex) return;

        currentIndex = index;

        // 멤버 활성화
        members.forEach((member, i) => {
            member.classList.toggle("active", i === index);
        });

        // 심볼 90도 회전
        symbol.style.setProperty("--symbol-rotation", `${index * 90}deg`);
    }

    // 스크롤 이벤트 최적화
    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateMember();
                ticking = false;
            });

            ticking = true;
        }
    }

    // 이벤트 등록
    window.addEventListener("scroll", onScroll, {
        passive: true,
    });

    window.addEventListener("resize", updateMember);

    // 최초 실행
    updateMember();
});

//
// 배경 이미지 변경 함수
function changeBackground(swiper) {
    const activeImg = swiper.el.querySelector(".swiper-slide-active img");

    if (activeImg) {
        document.querySelector("#discographyBg").src = activeImg.src;
    }
}

// Discography Swiper
const discographySwiper = new Swiper(".txt_discography", {
    loop: true,

    navigation: {
        nextEl: ".txt_discography .swiper-button-next",
        prevEl: ".txt_discography .swiper-button-prev",
    },

    on: {
        init: function () {
            changeBackground(this);
        },

        slideChangeTransitionStart: function () {
            changeBackground(this);
        },
    },
});
