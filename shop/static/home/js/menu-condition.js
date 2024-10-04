const categoryItems = document.querySelectorAll('.category-item');

categoryItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        categoryItems.forEach(el => {
            if (el !== item) {
                el.classList.add('inactive'); // Добавляем класс для серого цвета
            }
        });
        item.classList.add('active'); // Выделяем текущую категорию
    });

    item.addEventListener('mouseleave', () => {
        categoryItems.forEach(el => {
            el.classList.remove('inactive'); // Убираем класс для серого цвета
        });
        item.classList.remove('active'); // Убираем выделение
    });
});
