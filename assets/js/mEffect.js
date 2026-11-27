/* CUSTOM CURSOR */
document.addEventListener("DOMContentLoaded", () => {
    const cursorMedia = window.matchMedia(
        "(min-width: 1025px) and (hover: hover) and (pointer: fine)",
    );

    // 커서 요소 자동 생성
    const cursor = document.createElement("div");
    cursor.className = "custom_cursor";
    cursor.setAttribute("aria-hidden", "true");
    document.body.appendChild(cursor);

    // PC 활성화 및 비활성화
    function updateCursor() {
        document.documentElement.classList.toggle("custom_cursor_enabled", cursorMedia.matches);

        cursor.style.opacity = "0";
        cursor.classList.remove("active");
    }

    updateCursor();
    cursorMedia.addEventListener("change", updateCursor);

    // 마우스 위치 추적
    document.addEventListener("pointermove", (e) => {
        if (!cursorMedia.matches) return;

        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
        cursor.style.opacity = "1";

        cursor.classList.toggle("active", Boolean(e.target.closest("a, button")));
    });

    // 클릭 시 기존 커서 숨김 유지
    ["pointerdown", "pointerup", "click"].forEach((event) => {
        document.addEventListener(
            event,
            () => {
                if (!cursorMedia.matches) return;

                document.documentElement.classList.add("custom_cursor_enabled");
            },
            true,
        );
    });

    // 이미지 및 링크 기본 드래그 방지
    document.addEventListener("dragstart", (e) => {
        if (!cursorMedia.matches) return;

        if (e.target.closest("img, a")) {
            e.preventDefault();
        }
    });

    // 화면 밖으로 나가면 숨김
    document.documentElement.addEventListener("pointerleave", () => {
        cursor.style.opacity = "0";
    });

    // 브라우저 포커스를 잃으면 숨김
    window.addEventListener("blur", () => {
        cursor.style.opacity = "0";
    });
});
/* // CUSTOM CURSOR */
