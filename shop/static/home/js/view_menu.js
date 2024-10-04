let timeout;
const categories = document.querySelector('.categories');
const dropdownMenus = document.querySelectorAll('.dropdown-menu'); // Получаем все выпадающие меню

categories.addEventListener('mouseenter', () => {
    clearTimeout(timeout);
});

categories.addEventListener('mouseleave', () => {
    timeout = setTimeout(() => {
        dropdownMenus.forEach(menu => menu.style.display = 'none'); // Скрываем все меню
    }, 200); // Задержка перед скрытием
});

dropdownMenus.forEach(menu => {
    menu.addEventListener('mouseenter', () => {
        clearTimeout(timeout);
        menu.style.display = 'block'; // Оставляем меню открытым
    });

    menu.addEventListener('mouseleave', () => {
        timeout = setTimeout(() => {
            menu.style.display = 'none'; // Закрываем меню при уходе курсора
        }, 200); // Задержка перед скрытием
    });
});

// Обработчик для открытия соответствующего меню
document.querySelectorAll('.category-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        const category = this.dataset.category; // Получаем категорию
        dropdownMenus.forEach(menu => {
            if (menu.id === `${category}-menu`) {
                menu.style.display = 'block'; // Показываем только соответствующее меню
            } else {
                menu.style.display = 'none'; // Скрываем остальные меню
            }
        });
    });
});
