document.addEventListener('DOMContentLoaded', function () {
    // Проверяем, есть ли сохраненный выбор в Local Storage
    const savedCategory = localStorage.getItem('selectedCategory');

    if (savedCategory) {
        // Если выбор сохранен, перенаправляем пользователя на соответствующую страницу
        window.location.href = savedCategory;
    }

    // Добавляем обработчики клика на ссылки категорий
    document.querySelectorAll('.category-link').forEach(link => {
        link.addEventListener('click', function (event) {
            // Сохраняем выбранный URL категории в Local Storage
            const categoryUrl = this.getAttribute('href');
            localStorage.setItem('selectedCategory', categoryUrl);
        });
    });
});

