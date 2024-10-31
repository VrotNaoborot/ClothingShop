document.addEventListener('DOMContentLoaded', function() {
    var selectedColorId = document.getElementById('selected-color-id') ? document.getElementById('selected-color-id').value : null;
    var selectedSizeId = document.getElementById('selected-size-id') ? document.getElementById('selected-size-id').value : null;

    function highlightSelectedColor() {
        document.querySelectorAll('.color-list li').forEach(function(item) {
            if (item.dataset.id === selectedColorId) {
                item.classList.add('selected-color');
            } else {
                item.classList.remove('selected-color');
            }
        });
    }

    function highlightSelectedSize() {
        document.querySelectorAll('.size-list li').forEach(function(item) {
            if (item.dataset.id === selectedSizeId) {
                item.classList.add('selected-size');
            } else {
                item.classList.remove('selected-size');
            }
        });
    }

    // Инициализация отображения выбранного цвета
    if (selectedColorId) {
        document.querySelectorAll('.color-list li').forEach(function(item) {
            if (item.dataset.id === selectedColorId) {
                var button = document.querySelector('.color-button');
                button.innerHTML = 'Цвет: ' + item.textContent + '<span class="arrow"></span>';
                button.style.color = 'black';
                item.parentElement.style.display = 'none';
            }
        });
        highlightSelectedColor();
    }

    // Инициализация отображения выбранного размера
    if (selectedSizeId) {
        document.querySelectorAll('.size-list li').forEach(function(item) {
            if (item.dataset.id === selectedSizeId) {
                var button = document.querySelector('.size-button');
                button.innerHTML = 'Размер: ' + item.textContent + '<span class="arrow"></span>';
                button.style.color = 'black';
                item.parentElement.style.display = 'none';
            }
        });
        highlightSelectedSize();
    }

    // Обработчик для показа/скрытия списка цветов
    document.querySelector('.color-button').addEventListener('click', function() {
        var colorDropdown = this.nextElementSibling;
        var sizeDropdown = document.querySelector('.size-list');

        if (sizeDropdown.style.display === 'block') {
            sizeDropdown.style.display = 'none';
        }

        colorDropdown.style.display = colorDropdown.style.display === 'block' ? 'none' : 'block';

        if (colorDropdown.style.display === 'block') {
            highlightSelectedColor();
        }
    });

    // Обработчик для показа/скрытия списка размеров
    document.querySelector('.size-button').addEventListener('click', function() {
        var sizeDropdown = this.nextElementSibling;
        var colorDropdown = document.querySelector('.color-list');

        if (colorDropdown.style.display === 'block') {
            colorDropdown.style.display = 'none';
        }

        sizeDropdown.style.display = sizeDropdown.style.display === 'block' ? 'none' : 'block';

        if (sizeDropdown.style.display === 'block') {
            highlightSelectedSize();
        }
    });

    // Обработчик кликов на элементах списка цветов
    document.querySelectorAll('.color-list li').forEach(function(item) {
        item.addEventListener('click', function() {
            if (item.classList.contains('selected-color')) {
                document.querySelector('.color-list').style.display = 'none';
                return;
            }

            var button = document.querySelector('.color-button');
            button.innerHTML = 'Цвет: ' + this.textContent + '<span class="arrow"></span>';
            button.style.color = this.querySelector('.color-box').style.backgroundColor;

            selectedColorId = item.dataset.id;
            document.getElementById('selected-color-id').value = selectedColorId;

            this.parentElement.style.display = 'none';
            highlightSelectedColor();
        });
    });

    // Обработчик кликов на элементах списка размеров
    document.querySelectorAll('.size-list li').forEach(function(item) {
        item.addEventListener('click', function() {
            if (item.classList.contains('selected-size')) {
                document.querySelector('.size-list').style.display = 'none';
                return;
            }

            var button = document.querySelector('.size-button');
            button.innerHTML = 'Размер: ' + this.textContent + '<span class="arrow"></span>';
            button.style.color = 'black';

            selectedSizeId = item.dataset.id;
            document.getElementById('selected-size-id').value = selectedSizeId;

            this.parentElement.style.display = 'none';
            highlightSelectedSize();
        });
    });

    // Закрытие списков при клике вне их области
    window.addEventListener('click', function(event) {
        if (!event.target.closest('.size-dropdown') && !event.target.closest('.color-dropdown')) {
            document.querySelector('.size-list').style.display = 'none';
            document.querySelector('.color-list').style.display = 'none';
        }
    });
});
