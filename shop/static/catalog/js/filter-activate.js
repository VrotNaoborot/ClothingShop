document.querySelectorAll('.apply-btn').forEach(button => {
    button.addEventListener('click', () => {
        const params = new URLSearchParams(window.location.search);

        // Пример для материалов
        document.querySelectorAll('#fmaterials-menu input[type="checkbox"]:checked').forEach(input => {
            params.delete('material'); // Убираем старый параметр и добавляем новый
            params.append('material', input.id.replace('material-', ''));
        });

        // Пример для цветов
        document.querySelectorAll('#fcolor-menu input[type="checkbox"]:checked').forEach(input => {
            params.delete('color'); // Убираем старый параметр и добавляем новый
            params.append('color', input.id.replace('color-', ''));
        });


        // Размер
        document.querySelectorAll('#fsize-menu input[type="checkbox"]:checked').forEach(input => {
            params.delete('size'); // Убираем старый параметр и добавляем новый
            params.append('size', input.id.replace('size-', ''));
        });

        // Бренд
        document.querySelectorAll('#fbrand-menu input[type="checkbox"]:checked').forEach(input => {
            params.delete('brand'); // Убираем старый параметр и добавляем новый
            params.append('brand', input.id.replace('brand-', ''));
        });

        // Страна производства
        document.querySelectorAll('#fcountry-menu input[type="checkbox"]:checked').forEach(input => {
            params.delete('country'); // Убираем старый параметр и добавляем новый
            params.append('country', input.id.replace('country-', ''));
        });

        // Цена - добавление только после нажатия на кнопку "Применить"
        const minPrice = document.getElementById('minPrice').value;
        const maxPrice = document.getElementById('maxPrice').value;
        const priceButton = document.querySelector('#fprice-menu .apply-btn');

        // Проверка, если кнопка для цены активирована
        if (priceButton && priceButton.disabled === false) {
            if (minPrice) {
                params.set('min_price', minPrice);
            } else {
                params.delete('min_price'); // Удаляем, если пусто
            }
            if (maxPrice) {
                params.set('max_price', maxPrice);
            } else {
                params.delete('max_price'); // Удаляем, если пусто
            }
        }

        // Изменяем URL
        window.location.search = params.toString();
    });
});

// Обработчик для фильтра скидок
document.getElementById('fdiscount').addEventListener('click', () => {
    const params = new URLSearchParams(window.location.search);
    params.set('discount', 'true');
    window.location.search = params.toString();
});
