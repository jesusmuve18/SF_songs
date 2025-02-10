document.addEventListener("DOMContentLoaded", () => {
    if (!("ontouchstart" in window)) return; // Solo en pantallas táctiles

    let touchTimeout;
    let inputRange;

    document.addEventListener("touchstart", (event) => {
        if (event.touches.length !== 1) return; // Solo un dedo

        touchTimeout = setTimeout(() => {
            if (!inputRange) {
                // Crear el input range solo si no existe
                inputRange = document.createElement("input");
                inputRange.type = "range";
                inputRange.min = 0;
                inputRange.max = 100;
                inputRange.value = 50;
                inputRange.style.position = "fixed";
                inputRange.style.left = "50%";
                inputRange.style.top = "80%";
                inputRange.style.width = "200px";
                inputRange.style.transform = "translateX(-50%)";

                document.body.appendChild(inputRange);
            }
        }, 500); // Mantener presionado por 500ms
    });

    document.addEventListener("touchmove", (event) => {
        if (!inputRange) return;
        inputRange.classList.remove("hidden");
        const touch = event.touches[0];
        let newValue = 50 + ((touch.pageX - inputRange.offsetLeft) / inputRange.offsetWidth) * 100;
        inputRange.value = Math.max(0, Math.min(100, newValue));
    });

    document.addEventListener("touchend", () => {
        clearTimeout(touchTimeout);
        document.querySelector("input").classList.add("hidden");
    });
});
