document.addEventListener('DOMContentLoaded', function() {
    const categoryTitles = document.querySelectorAll('.category-name');
    categoryTitles.forEach(title => {
        title.addEventListener('click', function() {
            const category = this.parentElement;
            const subcategory = category.querySelector('.subcategory');
            const arrow = this.querySelector('.arrow');
            const categoryValue = category.getAttribute('data-category'); // Получаем значение data-category

            // Переадресация на URL категории
            if (categoryValue) {
                const currentUrl = window.location.href;
                const catalogIndex = currentUrl.indexOf('/catalog/');

                // Если нашли 'catalog/' в URL, формируем новый URL с выбранной категорией
                if (catalogIndex !== -1) {
                    const baseUrl = currentUrl.slice(0, catalogIndex + 9); // Обрезаем URL после 'catalog/'
                    window.location.href = `${baseUrl}${categoryValue}/`;
                    return;
                }
            }

            // Блокируем кнопку, чтобы предотвратить быстрые клики
            if (category.classList.contains('disabled')) return;
            category.classList.add('disabled');
            setTimeout(() => category.classList.remove('disabled'), 300);

            const isActive = category.classList.contains('active');
            const isOpening = !isActive;

            if (isOpening) {
                // Открываем категорию
                category.classList.add('active');
                arrow.classList.add('white');
                arrow.style.transform = 'rotate(180deg)';
                subcategory.style.opacity = '1';
                subcategory.style.maxHeight = '500px';

                const items = subcategory.querySelectorAll('li');
                items.forEach((item, index) => {
                    item.style.transitionDelay = `${index * 100}ms`;
                    item.style.opacity = 1;
                    item.style.transform = 'translateY(0)';
                });
            } else {
                // Закрываем категорию
                const items = subcategory.querySelectorAll('li');
                for (let i = items.length - 1; i >= 0; i--) {
                    const item = items[i];
                    item.style.opacity = 0;
                    item.style.transform = 'translateY(10px)';
                    item.style.transitionDelay = `${(items.length - 1 - i) * 100}ms`;
                }

                setTimeout(() => {
                    subcategory.style.opacity = '0';
                    subcategory.style.maxHeight = '0';
                }, 100);

                setTimeout(() => {
                    category.classList.remove('active');
                    subcategory.classList.remove('active');
                    arrow.classList.remove('white');
                    arrow.style.transform = 'rotate(0deg)';
                }, 200);
            }
        });
    });

    // Обработчик для подкатегорий
    const subcategoryItems = document.querySelectorAll('.subcategory li');
    subcategoryItems.forEach(item => {
        item.addEventListener('click', function() {
            const subcategoryValue = item.getAttribute('data-subcategory');
            const categoryElement = item.closest('.category');
            const categoryValue = categoryElement.getAttribute('data-category');

            // Получаем текущий URL и обрезаем его после '/catalog/'
            const currentUrl = window.location.href;
            const catalogIndex = currentUrl.indexOf('/catalog/');
            if (catalogIndex !== -1) {
                const baseUrl = currentUrl.slice(0, catalogIndex + 9);

                // Перенаправление с добавлением категории и подкатегории
                window.location.href = `${baseUrl}${categoryValue}/${subcategoryValue}/`;
            }
        });
    });
});
