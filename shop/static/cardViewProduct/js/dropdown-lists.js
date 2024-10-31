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
        console.log('selected-color');
        highlightSelectedColor();
    }

    // Инициализация отображения выбранного размера
    if (selectedSizeId) {
        console.log('Selected size ID:', selectedSizeId);
        document.querySelectorAll('.size-list li').forEach(function(item) {
            console.log('Checking item:', item.dataset.id);
            if (item.dataset.id === selectedSizeId) {
                var button = document.querySelector('.size-button');
                button.innerHTML = 'Размер: ' + item.textContent + '<span class="arrow"></span>';
                button.style.color = 'black';
                item.parentElement.style.display = 'none';
            }
        });
    } else {
        console.log('Selected size ID not set');
    }

    // Обработчик для показа/скрытия списка размеров
    document.querySelector('.size-button').addEventListener('click', function() {
        var sizeDropdown = this.nextElementSibling;
        sizeDropdown.style.display = sizeDropdown.style.display === 'block' ? 'none' : 'block';
        highlightSelectedSize();
    });

    // Обработчик для показа/скрытия списка цветов
    document.querySelector('.color-button').addEventListener('click', function() {
        var colorDropdown = this.nextElementSibling;
        colorDropdown.style.display = colorDropdown.style.display === 'block' ? 'none' : 'block';
        highlightSelectedColor();
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

    // Обработчик кликов на элементах списка цветов
    document.querySelectorAll('.color-list li').forEach(function(item) {
        item.addEventListener('click', function() {
            if (item.classList.contains('selected-color')) {
                document.querySelector('.color-list').style.display = 'none';
                return;
            }

            var button = document.querySelector('.color-button');
            button.innerHTML = 'Цвет: ' + this.textContent + '<span class="arrow"></span>';
            button.style.color = this.style.backgroundColor;

            selectedColorId = item.dataset.id;
            document.getElementById('selected-color-id').value = selectedColorId;

            this.parentElement.style.display = 'none';
            highlightSelectedColor();
        });
    });

    // Закрытие списков при клике вне их области
    window.addEventListener('click', function(event) {
        if (!event.target.closest('.size-dropdown') && !event.target.closest('.color-dropdown')) {
            document.querySelector('.size-list').style.display = 'none';
            if (document.querySelector('.color-list')) {
                document.querySelector('.color-list').style.display = 'none';
            }
        }
    });
});
