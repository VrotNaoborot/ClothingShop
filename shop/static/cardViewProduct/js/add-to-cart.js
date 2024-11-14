document.addEventListener('DOMContentLoaded', function () {
    function addToCart() {
        var selectedColorId = document.getElementById('selected-color-id').value;
        var selectedSizeId = document.getElementById('selected-size-id').value;

        var colorError = document.getElementById('color-error');
        var sizeError = document.getElementById('size-error');

        var hasError = false;

        // Сброс видимости ошибок
        colorError.style.display = 'none';
        sizeError.style.display = 'none';

        // Проверка на выбранный цвет
        if (!selectedColorId) {
            colorError.style.display = 'block';
            hasError = true;
        }

        // Проверка на выбранный размер
        if (!selectedSizeId) {
            sizeError.style.display = 'block';
            hasError = true;
        }

        // Если ошибки есть, не добавляем в корзину
        if (hasError) return;

        // Извлечение product_id из URL
        var urlParts = window.location.pathname.split('/');
        var productId = urlParts[2]; // Получаем ID продукта (например, 1)

        var csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

        // Отправляем запрос на добавление в корзину
        fetch(`/add-to-cart/${productId}/color=${selectedColorId}&size=${selectedSizeId}/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrfToken,
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (!response.ok) {
                // Логируем ошибку для диагностики
                return response.json().then(errorData => {
                    throw new Error(`Ошибка: ${errorData.message}`);
                });
            }
            console.log('Товар успешно добавлен в корзину');
            // Перезагружаем страницу после успешного добавления
            window.location.reload(); // Это обновит текущую страницу
        })
        .catch(error => {
            console.error('Ошибка при выполнении fetch:', error);
        });
    }

    // Привязываем функцию к кнопке
    document.querySelector('.cart-add-button').onclick = addToCart;
});
