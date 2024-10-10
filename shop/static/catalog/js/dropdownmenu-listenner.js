document.addEventListener("DOMContentLoaded", function() {
    const applyButtons = document.querySelectorAll(".apply-btn"); // Получаем все кнопки "Применить"
    const allCheckboxes = document.querySelectorAll("input[type='checkbox']"); // Получаем все чекбоксы на странице

    // Функция для проверки состояния чекбоксов и обновления кнопки
    function updateApplyButtonState() {
        const menus = document.querySelectorAll(".dropdown-content");
        menus.forEach(menu => {
            const checkboxes = menu.querySelectorAll("input[type='checkbox']");
            const isAnyChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);
            const applyBtn = menu.querySelector(".apply-btn");
            if (applyBtn) {
                applyBtn.disabled = !isAnyChecked; // Делаем кнопку неактивной, если ничего не выбрано
            }
        });
    }

    // Проверяем состояние при загрузке
    updateApplyButtonState();

    // Добавляем обработчик события для всех чекбоксов
    allCheckboxes.forEach(checkbox => {
        checkbox.addEventListener("change", updateApplyButtonState);
    });

    // Все кнопки фильтров и меню
    const filterButtons = document.querySelectorAll(".filter-btn");
    const dropdownMenus = document.querySelectorAll(".dropdown-content");

    // Функция для закрытия всех меню
    function closeAllMenus() {
        dropdownMenus.forEach(menu => {
            menu.style.display = "none";
        });
    }

    // Добавляем обработчики для кнопок фильтров
    filterButtons.forEach(button => {
        button.addEventListener("click", function() {
            const targetMenu = this.nextElementSibling; // Соответствующее меню для кнопки
            const isDisplayed = targetMenu.style.display === "block";

            // Закрываем все меню перед открытием нового
            closeAllMenus();

            // Переключаем видимость текущего меню
            if (!isDisplayed) {
                targetMenu.style.display = "block";
            }
        });
    });

    // Закрытие меню при клике вне его области
    document.addEventListener("click", function(event) {
        if (!event.target.closest(".filter-btn") && !event.target.closest(".dropdown-content")) {
            closeAllMenus();
        }
    });
});
