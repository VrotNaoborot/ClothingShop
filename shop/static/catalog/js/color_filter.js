document.addEventListener("DOMContentLoaded", function() {
    const applyBtn = document.querySelector(".apply-btn");
    const checkboxes = document.querySelectorAll("#fcolor-menu input[type='checkbox']");
    const searchInput = document.querySelector(".color-search");

    // Функция для проверки состояния чекбоксов
    function updateApplyButtonState() {
        const isAnyChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);
        applyBtn.disabled = !isAnyChecked; // Делаем кнопку неактивной, если ничего не выбрано
    }

    // Фильтрация цветов по поисковому запросу
    function filterColors() {
        const searchTerm = searchInput.value.toLowerCase(); // Получаем текст из поля поиска
        const colorItems = document.querySelectorAll("#fcolor-menu ul li"); // Получаем все элементы списка

        colorItems.forEach(item => {
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

    // Добавляем обработчик события для поля поиска
    searchInput.addEventListener("input", filterColors);
});