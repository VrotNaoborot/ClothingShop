document.addEventListener("DOMContentLoaded", function () {
    // Получаем параметры из URL
    const urlParams = new URLSearchParams(window.location.search);
    console.log("Params: ", urlParams);

    // Список фильтров
    const filters = {
        "fmaterial": "material",
        "fcolor": "color",
        "fsize": "size",
        "fbrand": "brand",
        "fcountry": "country",
        "fprice": "price",
        "fdiscount": "discount"
    };

    // Функция для обновления состояния кнопки "Применить"
    function updateApplyButtonState() {
        const menus = document.querySelectorAll(".dropdown-content");

        menus.forEach(menu => {
            let changes = false;

            // Разделяем id по тире и берем первое слово
            const menuIdParts = menu.id.split('-');
            const menuKey = menuIdParts[0].slice(1);  // Убираем первую букву (f => "")

            // Проверяем, существует ли параметр в URL с таким именем
            if (urlParams.has(menuKey)) {
                changes = true;
            }
            if (menuKey === 'price' && (urlParams.has('minPrice') || urlParams.has('maxPrice'))) {
                changes = true;
            }

            const checkboxes = menu.querySelectorAll("input[type='checkbox']");
            const isAnyChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);
            const applyBtn = menu.querySelector(".apply-btn");

            if (applyBtn) {
                applyBtn.style.display = "inline-block";

                // Кнопка активна, если есть выбранные чекбоксы или фильтры уже есть в URL
                applyBtn.disabled = !(isAnyChecked || changes);
            }
        });
    }

    window.updateApplyButtonState = updateApplyButtonState;

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
            const paramValues = urlParams.getAll(paramName); // Используем getAll для получения всех значений
            paramValues.forEach(value => {
                const checkbox = document.querySelector(`input[type="checkbox"][id="${paramName}-${value.toLowerCase()}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                }
            });
        }
    });

    // Проверка на наличие параметров minPrice и maxPrice и активация кнопки fprice
    if (urlParams.has("minPrice") || urlParams.has("maxPrice")) {
        const priceButton = document.getElementById("fprice");
        if (priceButton) {
            priceButton.classList.add("filter-button-activate");
            const arrowSpan = priceButton.querySelector("span.arrow");
            if (arrowSpan) {
                arrowSpan.classList.add("white");
                arrowSpan.style.opacity = "1";
            }
        }
        // paint-slider
        console.log("change color");
        const minValue = parseInt(sliderOne.min); // минимальное значение из атрибута min
        const maxValue = parseInt(sliderTwo.max); // максимальное значение из атрибута max
        const range = maxValue - minValue;

        // Обновляем значения полей minPrice и maxPrice
        const minPrice = urlParams.get("minPrice");
        const maxPrice = urlParams.get("maxPrice");

        const minPriceInput = document.getElementById('minPrice');
        const maxPriceInput = document.getElementById('maxPrice');

        if (minPriceInput && minPrice) {
            minPriceInput.value = minPrice;
        }
        if (maxPriceInput && maxPrice) {
            maxPriceInput.value = maxPrice;
        }

        // Также обновляем ползунки
        const slider1 = document.getElementById('slider-1');
        const slider2 = document.getElementById('slider-2');

        if (slider1 && slider2) {
            slider1.value = minPrice || slider1.min;
            slider2.value = maxPrice || slider2.max;
        }

        // Вычисляем проценты для позиции ползунков относительно диапазона
        const percent1 = ((sliderOne.value - minPrice) / range) * 100;
        const percent2 = ((sliderTwo.value - minPrice) / range) * 100;

        // Устанавливаем цвет фона трека
        sliderTrack.style.background = `linear-gradient(to right, #dadae5 ${percent1}%, #999 ${percent1}%, #999 ${percent2}%, #dadae5 ${percent2}%)`;

    }



    // Добавляем обработчик изменения состояния чекбоксов
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener("change", function () {
            updateApplyButtonState();  // Обновляем состояние кнопки при изменении чекбоксов
        });
    });

    // Изначально проверим, если в URL есть фильтры или чекбоксы выбраны, то кнопка должна быть активной
    updateApplyButtonState();
});
