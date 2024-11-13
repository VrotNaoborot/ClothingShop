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
            let subCategory = this.getAttribute('data-url').toLowerCase();

            const currentPath = window.location.pathname;
            let baseUrl = currentPath.includes('/catalog/') ? currentPath.split('/catalog/')[0] : currentPath;

            // Убираем лишний слэш, если он есть
            if (baseUrl.endsWith('/')) {
                baseUrl = baseUrl.slice(0, -1);
            }

            // Проверяем, является ли подкатегория брендом
            let fullUrl;
            if (subCategory.startsWith('brand-')) {
                // Извлекаем название бренда после "brand-"
                const brandName = subCategory.split('brand-')[1];
                // Формируем URL с параметром brand
                fullUrl = `${baseUrl}/catalog/${category}?brand=${brandName}`;
            }
            else if (subCategory.startsWith('season-')) {
                const seasonName = subCategory.split('season-')[1];
                fullUrl = `${baseUrl}/catalog/${category}?season=${seasonName}`;
            }
             else {
                // Формируем обычный URL для подкатегории
                fullUrl = `${baseUrl}/catalog/${category}/${subCategory}`;
            }

            // Перенаправляем на сформированный URL
            window.location.href = fullUrl;
        });
    });
});
