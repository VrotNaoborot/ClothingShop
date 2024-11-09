document.addEventListener("DOMContentLoaded", function () {
    // Получаем параметры из URL
    const urlParams = new URLSearchParams(window.location.search);

    // Список фильтров, где ключи — это ID фильтра, а значения — это название параметра в URL
    const filters = {
        "fmaterials": "material",
        "fcolor": "color",
        "fsize": "size",
        "fbrand": "brand",
        "fcountry": "country",
        "fprice": "price"
    };

    // Применяем активные стили к кнопкам, чекбоксам и заменяем стрелку, если параметры присутствуют
    Object.entries(filters).forEach(([filterId, paramName]) => {
        // Проверяем, передан ли параметр в URL
        if (urlParams.has(paramName)) {
            // Активируем стиль кнопки фильтра
            const filterButton = document.getElementById(filterId);
            if (filterButton) {
                filterButton.classList.add("filter-button-activate");

                // Добавляем класс 'white' к стрелке внутри кнопки
                const arrowSpan = filterButton.querySelector("span.arrow");
                if (arrowSpan) {
                    arrowSpan.classList.add("white");
                    arrowSpan.style.opacity = "1"; // Убедитесь, что стрелка видима
                }
            }

            // Получаем значения параметра и делаем из строки массив, если значений несколько
            const paramValues = urlParams.get(paramName).split(",");

            // Активируем соответствующие чекбоксы
            paramValues.forEach((value) => {
                const checkbox = document.querySelector(`input[type="checkbox"][id="${paramName}-${value.toLowerCase()}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                }
            });
        }
    });
});
