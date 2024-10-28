document.addEventListener('DOMContentLoaded', function() {
    // Получаем выбранный color_id из скрытого поля, если оно есть
    var selectedColorId = document.getElementById('selected-color-id') ? document.getElementById('selected-color-id').value : null;

    // Если color_id передан, находим соответствующий элемент списка
    if (selectedColorId) {
        var colorListItems = document.querySelectorAll('.color-list li');
        var colorFound = false; // Флаг для отслеживания, найден ли цвет

        colorListItems.forEach(function(item) {
            var colorId = item.dataset.id; // Получаем id цвета из data-id

            if (colorId === selectedColorId) {
                var button = document.querySelector('.color-button');
                button.textContent = 'Цвет: ' + item.textContent; // Устанавливаем текст кнопки
                button.style.color = 'black'; // Устанавливаем цвет текста кнопки в черный
                item.parentElement.style.display = 'none'; // Закрываем выпадающее меню
                colorFound = true; // Цвет найден
            }
        });
    }


    // Обработчик клика на кнопке или стрелке для размера
    document.querySelector('.size-button').addEventListener('click', function() {
        var dropdown = this.nextElementSibling;
        var colorDropdown = document.querySelector('.color-list');

        // Если выпадающее меню цвета открыто, закрываем его
        if (colorDropdown.style.display === 'block') {
            colorDropdown.style.display = 'none';
        }

        // Переключаем текущее меню размера
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    });

    // Обработчик клика на элементах списка размеров
    document.querySelectorAll('.size-list li').forEach(function(item) {
        item.addEventListener('click', function() {
            var button = this.closest('.size-dropdown').querySelector('.size-button');
            var arrow = button.querySelector('.arrow');
            button.textContent = 'Размер: ' + this.textContent; // Обновляем текст кнопки
            button.style.color = '#000'; // Меняем цвет текста на черный
            button.appendChild(arrow); // Добавляем стрелку обратно в кнопку
            var dropdown = this.parentElement; // Получаем родительский элемент ul
            dropdown.style.display = 'none'; // Закрываем выпадающее меню
        });
    });

    // Обработчик клика на кнопке или стрелке для цвета
    document.querySelector('.color-button').addEventListener('click', function() {
        var dropdown = this.nextElementSibling;
        var sizeDropdown = document.querySelector('.size-list');

        // Если выпадающее меню размера открыто, закрываем его
        if (sizeDropdown.style.display === 'block') {
            sizeDropdown.style.display = 'none';
        }

        // Переключаем текущее меню цвета
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    });

    // Обработчик клика на элементах списка цветов
    document.querySelectorAll('.color-list li').forEach(function(item) {
        item.addEventListener('click', function() {
            var button = document.querySelector('.color-button');
            button.textContent = 'Цвет: ' + this.textContent; // Обновляем текст кнопки
            button.style.color = this.querySelector('.color-box').style.backgroundColor; // Меняем цвет текста на цвет элемента
            button.appendChild(button.querySelector('.arrow')); // Добавляем стрелку обратно в кнопку
            var dropdown = this.parentElement; // Получаем родительский элемент ul
            dropdown.style.display = 'none'; // Закрываем выпадающее меню
        });
    });

    // Закрытие выпадающего списка при клике вне кнопки или списка
    window.addEventListener('click', function(event) {
        if (!event.target.closest('.size-dropdown') && !event.target.closest('.color-dropdown')) {
            document.querySelector('.size-list').style.display = 'none'; // Закрываем меню размера
            document.querySelector('.color-list').style.display = 'none'; // Закрываем меню цвета
        }
    });
});
