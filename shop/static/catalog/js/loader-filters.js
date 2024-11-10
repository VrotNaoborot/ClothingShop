document.addEventListener("DOMContentLoaded", function () {
    // Получаем параметры из URL
    const urlParams = new URLSearchParams(window.location.search);

    // Список фильтров
    const filters = {
        "fmaterials": "material",
        "fcolor": "color",
        "fsize": "size",
        "fbrand": "brand",
        "fcountry": "country",
        "fprice": "price",
        "fdiscount": "discount"
    };

    // Применяем активные стили к кнопкам и чекбоксам, если параметры присутствуют в URL
    Object.entries(filters).forEach(([filterId, paramName]) => {
        if (urlParams.has(paramName)) {
            const filterButton = document.getElementById(filterId);
            if (filterButton) {
                filterButton.classList.add("filter-button-activate");
                const arrowSpan = filterButton.querySelector("span.arrow");
                if (arrowSpan) {
                    arrowSpan.classList.add("white");
                    arrowSpan.style.opacity = "1";
                }
            }

            // Получаем значения фильтра и применяем их к чекбоксам
            const paramValues = urlParams.get(paramName).split(",");
            paramValues.forEach(value => {
                const checkbox = document.querySelector(`input[type="checkbox"][id="${paramName}-${value.toLowerCase()}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                }
            });
        }
    });

    // Функция для отображения кнопки "Применить"
    function showApplyButton() {
        const applyButton = document.querySelector('.apply-btn');
        if (applyButton) {
            applyButton.disabled = false;
        }
    }

    // Функция для скрытия кнопки "Применить"
    function hideApplyButton() {
        const applyButton = document.querySelector('.apply-btn');
        if (applyButton) {
            applyButton.disabled = true;
        }
    }

    // Добавляем обработчик изменения состояния чекбоксов
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener("change", function () {
            // Если хотя бы один чекбокс снят, показываем кнопку "Применить"
            if (!checkbox.checked) {
                showApplyButton();
            }

            // Проверяем, есть ли активные чекбоксы для показа кнопки
            const anyChecked = Array.from(document.querySelectorAll('input[type="checkbox"]')).some(chk => chk.checked);
            if (anyChecked) {
                showApplyButton();
            } else {
                hideApplyButton(); // Если чекбоксы не выбраны, скрыть кнопку
            }
        });
    });

    // Изначально проверим, если в URL есть фильтры, то кнопка должна быть активной
    const anyChecked = Array.from(document.querySelectorAll('input[type="checkbox"]')).some(chk => chk.checked);
    if (anyChecked) {
        showApplyButton();
    } else {
        hideApplyButton();
    }
});
