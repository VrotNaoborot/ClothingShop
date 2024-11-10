//document.addEventListener("DOMContentLoaded", function() {
//    const allCheckboxes = document.querySelectorAll("input[type='checkbox']");
//    const urlParams = new URLSearchParams(window.location.search);
//    if (urlParams.has("material")) {
//        console.log("Параметр material найден:", urlParams.get("material"));
//    } else {
//        console.log("Параметр material не найден");
//    }
//
//    // Функция для обновления состояния кнопки "Применить"
//    function updateApplyButtonState() {
//        const menus = document.querySelectorAll(".dropdown-content");
//
//        menus.forEach(menu => {
//            console.log(menu.id);
//            let changes = false;
//
//            // Разделяем id по тире и берем первое слово
//            const menuIdParts = menu.id.split('-');
//            const menuKey = menuIdParts[0].slice(1);  // Убираем первую букву (f => "")
//            console.log('Обработано слово:', menuKey);
//
//            // Проверяем, существует ли параметр в URL с таким именем
//            if (urlParams.has(menuKey)) {
//                changes = true;
//                console.log(`Параметр ${menuKey} найден в URL`);
//            }
//
//            const checkboxes = menu.querySelectorAll("input[type='checkbox']");
//            const isAnyChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);
//            const applyBtn = menu.querySelector(".apply-btn");
//
//            if (applyBtn) {
//                applyBtn.style.display = "inline-block";
//                // Кнопка активна, если есть выбранные чекбоксы или фильтры уже есть в URL
//                console.log("Есть ли выбранные чекбоксы:", isAnyChecked);
//                console.log("Есть ли параметр:", changes);
//                applyBtn.disabled = !(isAnyChecked || changes);
//            }
//        });
//    }
//
//    // Проверяем состояние кнопки при загрузке страницы
//    updateApplyButtonState();
//
//    // Добавляем обработчик события для всех чекбоксов
//    allCheckboxes.forEach(checkbox => {
//        checkbox.addEventListener("change", function() {
//            // Обновляем URL параметры при изменении состояния чекбоксов
//            const checkboxValue = checkbox.value;
//            const checkboxName = checkbox.name;
//
//            if (checkbox.checked) {
//                urlParams.append(checkboxName, checkboxValue);
//            } else {
//                urlParams.delete(checkboxName);
//            }
//
//            updateApplyButtonState();
//        });
//    });
//
//    // Логика для открытия и закрытия меню
//    const filterButtons = document.querySelectorAll(".filter-btn");
//    const dropdownMenus = document.querySelectorAll(".dropdown-content");
//
//    function closeAllMenus() {
//        dropdownMenus.forEach(menu => {
//            menu.style.display = "none";
//        });
//    }
//
//    filterButtons.forEach(button => {
//        button.addEventListener("click", function() {
//            const targetMenu = this.nextElementSibling;
//            const isDisplayed = targetMenu.style.display === "block";
//
//            closeAllMenus();
//
//            if (!isDisplayed) {
//                targetMenu.style.display = "block";
//            }
//        });
//    });
//
//    document.addEventListener("click", function(event) {
//        if (!event.target.closest(".filter-btn") && !event.target.closest(".dropdown-content")) {
//            closeAllMenus();
//        }
//    });
//});
