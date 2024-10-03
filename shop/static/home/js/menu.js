// Выбор всех категорий, которые имеют подменю
const categories = document.querySelectorAll('.category-item[data-category]');

// Навешиваем события на каждую категорию с подменю
categories.forEach(category => {
    category.addEventListener('mouseenter', function() {
        // Показать соответствующее подменю
        const menuId = this.getAttribute('data-category');
        const dropdownMenu = document.getElementById(menuId + '-menu');
        if (dropdownMenu) {
            dropdownMenu.style.display = 'block';
        }
    });

    category.addEventListener('mouseleave', function() {
        // Скрыть подменю
        const menuId = this.getAttribute('data-category');
        const dropdownMenu = document.getElementById(menuId + '-menu');
        if (dropdownMenu) {
            dropdownMenu.style.display = 'none';
        }
    });
});

// Навешиваем события на сами подменю, чтобы они скрывались при уходе курсора
const dropdownMenus = document.querySelectorAll('.dropdown-menu');

dropdownMenus.forEach(menu => {
    menu.addEventListener('mouseenter', function() {
        this.style.display = 'block';
    });
    menu.addEventListener('mouseleave', function() {
        this.style.display = 'none';
    });
});
