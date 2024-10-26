// Обработчик клика на кнопке или стрелке
document.querySelector('.size-button').addEventListener('click', function() {
    var dropdown = this.nextElementSibling;
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
});

// Обработчик клика на элементах списка размеров
document.querySelectorAll('.size-list li').forEach(function(item) {
    item.addEventListener('click', function() {
        var button = this.closest('.size-dropdown').querySelector('.size-button');
        var arrow = button.querySelector('.arrow'); // Получаем элемент стрелки
        button.textContent = 'Размер: ' + this.textContent; // Обновляем текст кнопки
        button.style.color = '#000'; // Меняем цвет текста на черный
        button.appendChild(arrow); // Добавляем стрелку обратно в кнопку
        var dropdown = this.parentElement; // Получаем родительский элемент ul
        dropdown.style.display = 'none'; // Закрываем выпадающее меню
    });
});

// Закрытие выпадающего списка при клике вне кнопки или списка
window.addEventListener('click', function(event) {
    if (!event.target.closest('.size-dropdown')) {
        var dropdowns = document.querySelectorAll('.size-list');
        dropdowns.forEach(function(dropdown) {
            dropdown.style.display = 'none';
        });
    }
});
