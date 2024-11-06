document.addEventListener('DOMContentLoaded', function () {
    // Обработчик для основного выбора категорий
    document.querySelectorAll('.category-item').forEach(item => {
        item.addEventListener('click', function (event) {
            event.preventDefault();

            // Получаем текущий URL
            const currentPath = window.location.pathname;
            const category = this.getAttribute('data-category');
            let baseUrl;

            // Проверяем, есть ли '/catalog/' в текущем пути
            if (currentPath.includes('/catalog/')) {
                // Если находимся на странице с каталогом, формируем URL без повторного добавления 'catalog'
                baseUrl = currentPath.split('/catalog/')[0]; // Получаем часть пути до 'catalog'
            } else {
                // Если каталога нет, используем текущий путь и добавляем '/catalog'
                baseUrl = currentPath;
            }

            // Формируем полный URL для подкатегории без дублирования слэша
            const fullUrl = `${baseUrl}/catalog/${category}`.replace(/\/+/g, '/'); // Удаляем дублирующиеся слэши

            // Проверяем, есть ли выпадающее меню для этой категории
            const dropdownMenu = document.querySelector(`#${category}-menu`);

            if (dropdownMenu) {
                // Показываем выпадающее меню
                dropdownMenu.style.display = 'block';

                // Устанавливаем обработчики для подкатегорий
                dropdownMenu.querySelectorAll('a[data-url]').forEach(subItem => {
                    subItem.addEventListener('click', function (subEvent) {
                        subEvent.preventDefault();

                        // Формируем URL для подкатегории
                        const subFullUrl = `${fullUrl}/${this.getAttribute('data-url')}`.replace(/\/+/g, '/'); // Удаляем дублирующиеся слэши
                        window.location.href = subFullUrl;
                    });
                });
            } else {
                // Если подменю нет, переходим сразу к основной категории
                window.location.href = fullUrl;
            }
        });
    });
});
