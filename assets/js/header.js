/* Header Mobile Menu */
(function () {
    function initHeaderMenu() {
        const header = document.querySelector("#header");
        const toggle = document.querySelector("#headerToggle");
        const nav = document.querySelector("#headerNav");

        if (!header || !toggle || !nav) return;

        /* 이벤트 중복 등록 방지 */
        if (toggle.dataset.menuInitialized === "true") return;

        toggle.dataset.menuInitialized = "true";

        const mobileMedia = window.matchMedia("(max-width: 786px)");

        function setMenu(open) {
            header.classList.toggle("menu_open", open);
            document.body.classList.toggle("menu_open", open);

            toggle.setAttribute("aria-expanded", String(open));
            toggle.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
        }

        /* 햄버거 버튼 클릭 */
        toggle.addEventListener("click", (e) => {
            e.preventDefault();

            if (!mobileMedia.matches) return;

            const isOpen = header.classList.contains("menu_open");

            setMenu(!isOpen);
        });

        /* ESC 키로 메뉴 닫기 */
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && header.classList.contains("menu_open")) {
                setMenu(false);
                toggle.focus();
            }
        });

        /* 메뉴 링크 클릭 시 닫기 */
        nav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                if (mobileMedia.matches) {
                    setMenu(false);
                }
            });
        });

        /* PC 화면 전환 시 초기화 */
        mobileMedia.addEventListener("change", (e) => {
            if (!e.matches) {
                setMenu(false);
            }
        });
    }

    /* HTML 로딩 완료 후 실행 */
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initHeaderMenu);
    } else {
        initHeaderMenu();
    }
})();

/* --- Header Mobile Menu --- */
