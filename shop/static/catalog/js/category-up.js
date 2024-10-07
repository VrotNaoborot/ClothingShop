const categoryTitles = document.querySelectorAll('.category-name');

categoryTitles.forEach(title => {
    title.addEventListener('click', function() {
        const category = this.parentElement; // Получаем родительский элемент категории
        const subcategory = category.querySelector('.subcategory'); // Получаем подкатегории
        const arrow = this.querySelector('.arrow');

        // Переключаем класс активности для категории
        const isActive = category.classList.toggle('active'); // Добавляем/убираем активный класс к категории

        // Показ стрелки
        arrow.classList.toggle('white');

        // Поворот стрелки
        if (isActive) {
            arrow.style.transform = 'rotate(180deg)'; // Поворачиваем стрелку на 180 градусов при открытии
        } else {
            arrow.style.transform = 'rotate(0deg)'; // Возвращаем стрелку в исходное положение при закрытии
        }

        // Плавное появление или исчезновение сабкатегорий
        if (isActive) { // Если категория активна
            subcategory.style.opacity = '1'; // Показываем подкатегории
            subcategory.style.maxHeight = '500px'; // Установите значение, которое соответствует максимальной высоте ваших элементов
            const items = subcategory.querySelectorAll('li');
            items.forEach((item, index) => {
                item.style.transitionDelay = `${index * 100}ms`; // Задержка для каждого элемента
                item.style.opacity = 1; // Показать элемент
                item.style.transform = 'translateY(0)'; // Сбросить сдвиг
            });
        } else { // Если категория не активна
            const items = subcategory.querySelectorAll('li');
            // Перебираем элементы в обратном порядке для исчезновения
            for (let i = items.length - 1; i >= 0; i--) {
                const item = items[i];
                item.style.opacity = 0; // Скрыть элемент
                item.style.transform = 'translateY(10px)'; // Сдвинуть вниз
                item.style.transitionDelay = `${(items.length - 1 - i) * 100}ms`; // Установка задержки для анимации
            }

            // Используем задержку перед скрытием подкатегорий
            setTimeout(() => {
                subcategory.style.opacity = '0'; // Установите opacity на 0
                subcategory.style.maxHeight = '0'; // Установите максимальную высоту на 0
            }, 100); // Немедленно после завершения анимации исчезновения

            // Убираем активный класс только после завершения анимации
            setTimeout(() => {
                if (!subcategory.classList.contains('active')) {
                    category.classList.remove('active'); // Убираем активный класс у категории
                }
                subcategory.classList.remove('active'); // Убираем класс активности подкатегорий
            }, items.length * 100 + 500); // Общее время анимации
        }
    });
});
