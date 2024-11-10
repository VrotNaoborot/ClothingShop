document.addEventListener('DOMContentLoaded', function() {
    const categoryTitles = document.querySelectorAll('.category-name');
    const currentUrl = window.location.pathname;
    const urlParts = currentUrl.split('/').filter(Boolean);

    let categoryFromUrl = null;
    let subcategoryFromUrl = null;

    console.log("Текущий URL:", currentUrl); // Логируем текущий URL

    // Извлекаем категорию и подкатегорию из URL
    if (urlParts.length >= 3) {
        categoryFromUrl = urlParts[2]; // категория, например, shoes
        if (urlParts.length >= 4) {
            subcategoryFromUrl = urlParts[3]; // подкатегория, например, boots
        }
    }


    categoryTitles.forEach(title => {
        title.addEventListener('click', function() {
            toggleCategory(this);
        });

        // Если категория в URL совпадает с атрибутом data-category, раскрываем её
        const category = title.parentElement;
        const categoryData = category.getAttribute('data-category');


        if (categoryData && categoryData === categoryFromUrl) {
            openCategory(category, title.querySelector('.arrow'));

            // Если есть подкатегория в URL, выделяем соответствующий элемент
            if (subcategoryFromUrl) {
                const subcategoryItems = category.querySelectorAll('.subcategory li');
                let subcategoryFound = false;  // Флаг, чтобы остановить дальнейший поиск

                for (let item of subcategoryItems) {
                    console.log("Проверка подкатегории:", item.getAttribute('data-subcategory')); // Логируем подкатегорию каждого элемента
                    if (!subcategoryFound && item.getAttribute('data-subcategory') === subcategoryFromUrl) {
                        console.log("Подкатегория найдена:", item.getAttribute('data-subcategory')); // Логируем, когда подкатегория найдена
                        item.classList.add('highlighted'); // добавляем класс для выделения подкатегории
                        subcategoryFound = true; // Подкатегория найдена, флаг установлен
                        break;  // Прерываем цикл, так как подкатегория найдена
                    }
                }
            }
        }
    });

    function toggleCategory(title) {
        const category = title.parentElement;
        const subcategory = category.querySelector('.subcategory');
        const arrow = title.querySelector('.arrow');

        if (category.classList.contains('disabled')) return;
        category.classList.add('disabled');
        setTimeout(() => category.classList.remove('disabled'), 300);

        const isActive = category.classList.contains('active');
        const isOpening = !isActive;

        if (isOpening) {
            openCategory(category, arrow);
        } else {
            closeCategory(category, arrow);
        }
    }

    function openCategory(category, arrow) {
        const subcategory = category.querySelector('.subcategory');
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
    }

    function closeCategory(category, arrow) {
        const subcategory = category.querySelector('.subcategory');
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
            arrow.classList.remove('white');
            arrow.style.transform = 'rotate(0deg)';
        }, 200);
    }
});
