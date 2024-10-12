document.addEventListener("DOMContentLoaded", function() {
    const applyBtn = document.querySelector(".apply-btn");
    const searchInputs = document.querySelectorAll(".color-search"); // Все поля поиска
    const checkboxes = document.querySelectorAll("#fcolor-menu input[type='checkbox'], #fbrand-menu input[type='checkbox'], #fprice-menu input[type='checkbox']"); // Все чекбоксы в фильтрах

    // Функция для проверки состояния кнопки "Применить"
    function updateApplyButtonState() {
        const isAnyChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);
        applyBtn.disabled = !isAnyChecked; // Делаем кнопку неактивной, если ничего не выбрано
    }

    // Функция фильтрации элементов по поисковому запросу
    function filterItems(searchInput) {
        const searchTerm = searchInput.value.toLowerCase(); // Получаем текст из поля поиска
        const filterMenu = searchInput.closest('.dropdown-content'); // Находим родительский элемент меню
        const items = filterMenu.querySelectorAll('ul li'); // Получаем все элементы списка в меню

        items.forEach(item => {
            const labelText = item.textContent.toLowerCase(); // Получаем текст элемента списка
            item.style.display = labelText.includes(searchTerm) ? "block" : "none"; // Показываем или скрываем элемент
        });
    }

    // Проверяем состояние при загрузке
    updateApplyButtonState();

    // Добавляем обработчик события для всех чекбоксов
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener("change", updateApplyButtonState);
    });

    // Добавляем обработчик события для всех полей поиска
    searchInputs.forEach(searchInput => {
        searchInput.addEventListener("input", () => filterItems(searchInput));
    });
});
