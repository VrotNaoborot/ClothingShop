
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
                // Получаем координаты кнопки относительно родительского контейнера
                const btnRect = btn.getBoundingClientRect();
                const parentRect = btn.parentElement.getBoundingClientRect();

                // Задаем позицию меню относительно родителя (не окна браузера)
                dropdownContent.style.left = `${btnRect.left - parentRect.left}px`; // Привязываем левую сторону меню к кнопке
                dropdownContent.style.top = `${btnRect.bottom - parentRect.top}px`;  // Меню появляется сразу под кнопкой

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

