document.addEventListener("DOMContentLoaded", function() {
    const filterBtns = document.querySelectorAll(".filter-btn");

    filterBtns.forEach(btn => {
        btn.addEventListener("click", function() {
            // Получаем id кнопки и формируем id для соответствующего выпадающего меню
            const menuId = `${btn.id}-menu`;
            const dropdownContent = document.getElementById(menuId);

            // Проверяем, открыто ли текущее меню
            const isOpen = dropdownContent.classList.contains("show");

            // Закрываем все выпадающие меню и убираем стиль у всех кнопок
            document.querySelectorAll(".dropdown-content").forEach(content => {
                content.classList.remove("show");
            });
            filterBtns.forEach(button => button.classList.remove("is-active")); // Заменили active на is-active

            // Если текущее меню было закрыто, открываем его и добавляем стиль к кнопке
            if (!isOpen) {
                dropdownContent.classList.add("show");
                btn.classList.add("is-active"); // Заменили active на is-active
            }
        });
    });

    // Закрытие выпадающего списка при клике вне него
    window.addEventListener("click", function(event) {
        if (!event.target.closest(".filter-container")) {
            document.querySelectorAll(".dropdown-content").forEach(content => {
                content.classList.remove("show");
            });

            // Убираем стиль у всех кнопок
            filterBtns.forEach(button => button.classList.remove("is-active")); // Заменили active на is-active
        }
    });
});

