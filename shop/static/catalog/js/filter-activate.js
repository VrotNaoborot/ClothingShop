document.querySelectorAll('.apply-btn').forEach(button => {
    button.addEventListener('click', () => {
        const params = new URLSearchParams(window.location.search);

        // Пример для материалов
        document.querySelectorAll('#fmaterials-menu input[type="checkbox"]:checked').forEach(input => {
            params.append('material', input.id.replace('material-', ''));
        });

        // Пример для цветов
        document.querySelectorAll('#fcolor-menu input[type="checkbox"]:checked').forEach(input => {
            params.append('color', input.id.replace('color-', ''));
        });

        // Добавьте аналогичные обработчики для остальных фильтров (размер, бренд и т.д.)

        // Изменяем URL
        window.location.search = params.toString();
    });
});
