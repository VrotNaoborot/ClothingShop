document.addEventListener('DOMContentLoaded', function () {
    // Обработчик для клика по категории (редирект на категорию)
    document.querySelectorAll('.category-item').forEach(item => {
        item.addEventListener('click', function(event) {
            event.preventDefault(); // Останавливаем обычный клик
            const category = this.dataset.category; // Получаем категорию
            const currentPath = window.location.pathname;

            // Проверяем, что если в URL нет '/catalog/', то добавляем его в начало
            let baseUrl = currentPath.includes('/catalog/') ? currentPath.split('/catalog/')[0] : currentPath;

            // Убираем лишний слэш, если он есть
            if (baseUrl.endsWith('/')) {
                baseUrl = baseUrl.slice(0, -1);
            }

            // Формируем URL для категории
            const fullUrl = `${baseUrl}/catalog/${category}`;
            window.location.href = fullUrl;
        });
    });

    // Обработчик для клика по подкатегории (редирект на категорию с подкатегорией)
    document.querySelectorAll('.dropdown-menu a[data-url]').forEach(subItem => {
        subItem.addEventListener('click', function(event) {
            event.preventDefault(); // Останавливаем обычный клик

            const category = this.closest('.dropdown-menu').getAttribute('id').split('-')[0]; // Получаем категорию
            const subCategory = this.getAttribute('data-url'); // Получаем подкатегорию

            const currentPath = window.location.pathname;
            let baseUrl = currentPath.includes('/catalog/') ? currentPath.split('/catalog/')[0] : currentPath;

            // Убираем лишний слэш, если он есть
            if (baseUrl.endsWith('/')) {
                baseUrl = baseUrl.slice(0, -1);
            }

            // Формируем полный URL для подкатегории
            const fullUrl = `${baseUrl}/catalog/${category}/${subCategory}`;
            window.location.href = fullUrl;
        });
    });
});
