document.addEventListener('DOMContentLoaded', function() {
    const categoryTitles = document.querySelectorAll('.category-name');
    categoryTitles.forEach(title => {
        title.addEventListener('click', function() {
            const category = this.parentElement;
            const subcategory = category.querySelector('.subcategory');
            const arrow = this.querySelector('.arrow');

            // Блокируем кнопку, чтобы предотвратить быстрые клики
            if (category.classList.contains('disabled')) return; // Если кнопка заблокирована, ничего не делаем
            category.classList.add('disabled');
            setTimeout(() => category.classList.remove('disabled'), 300); // Разблокировка через 300ms

            const isActive = category.classList.contains('active');
            const isOpening = !isActive;  // Если категория не активна, значит открываем

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
                }, 100); // Скрываем элементы сразу, не ожидая окончания анимации

                setTimeout(() => {
                    // Убираем активный класс немедленно после скрытия
                    category.classList.remove('active');
                    subcategory.classList.remove('active');
                    arrow.classList.remove('white');
                    arrow.style.transform = 'rotate(0deg)';
                }, 200); // Убираем активный класс после небольшой задержки
            }
        });
    });
});
