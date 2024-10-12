document.addEventListener("DOMContentLoaded", function() {
    const filterMenu = document.querySelector(".filter-container");
    const originalPosition = filterMenu.getBoundingClientRect().top + window.scrollY; // Получаем первоначальное положение

    window.addEventListener("scroll", function() {
        const scrollPosition = window.scrollY; // Позиция прокрутки

        if (scrollPosition > originalPosition) {
            filterMenu.classList.add("fixed"); // Добавляем класс для фиксированного позиционирования
            filterMenu.style.position = "fixed"; // Устанавливаем фиксированное позиционирование
            filterMenu.style.top = "0"; // Прикрепляем к верхней части окна
            filterMenu.style.width = `${filterMenu.offsetWidth}px`; // Устанавливаем ширину, чтобы сохранить ее
        } else {
            filterMenu.classList.remove("fixed"); // Убираем класс, если меню снова в пределах видимости
            filterMenu.style.position = ""; // Сбрасываем позиционирование
            filterMenu.style.top = ""; // Сбрасываем позицию
            filterMenu.style.width = ""; // Сбрасываем ширину
        }
    });
});
