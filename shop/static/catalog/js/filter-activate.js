// Функция для формирования URL с учетом выбранных фильтров
function updateURLWithFilters() {
    // Начальный базовый URL (например, это текущий путь страницы без параметров)
    let baseURL = window.location.pathname + '?';  // Базовый путь без параметров

    // Проходим по всем меню фильтров (с классом dropdown-content)
    document.querySelectorAll('.dropdown-content').forEach(menu => {
        // Проходим по всем чекбоксам в текущем меню
        const checkedInputs = menu.querySelectorAll('input[type="checkbox"]:checked');

        if (menu.id === 'fprice-menu') {
            // Находим кнопку "Применить"
            const applyBtn = menu.querySelector('.apply-btn');

            // Если кнопка "Применить" не отключена, добавляем фильтр цен в URL
            if (applyBtn && !applyBtn.disabled) {
                // Добавляем параметры диапазона цен в URL
                const minPrice = document.getElementById('minPrice').value;
                const maxPrice = document.getElementById('maxPrice').value;
                baseURL += `minPrice=${minPrice}&maxPrice=${maxPrice}&`;
            }
        }

        // Если есть выбранные чекбоксы, добавляем их в URL
        if (checkedInputs.length > 0) {
            checkedInputs.forEach(input => {
                // Извлекаем название фильтра и значение
                const [filterName, filterValue] = input.id.split('-');  // Разделяем ID на две части: filterName и filterValue

                // Логируем id и значение для отладки
                console.log(`Selected filter: ${filterName}=${filterValue}`);

                // Добавляем новый параметр в URL с нужным ключом
                baseURL += `${filterName}=${filterValue}&`;
            });
        }
    });


    // Обработка скидок
    const discountButton = document.querySelector('#fdiscount');
    if (discountButton && discountButton.checked) {
        baseURL += `discount=true&`;
    }

    // Убираем последний лишний амперсанд (&) и обновляем URL
    baseURL = baseURL.slice(0, -1);  // Удаляем последний &

    // Логируем итоговый URL для отладки
    console.log(`Generated URL: ${baseURL}`);

    // Изменяем URL с новыми параметрами
    window.location.href = baseURL;  // Полностью заменяем URL
}

// Добавляем обработчик нажатия на кнопки "Применить"
document.querySelectorAll('.apply-btn').forEach(button => {
    button.addEventListener('click', () => {
        updateURLWithFilters();  // Вызываем функцию для обновления URL с фильтрами
    });
});
