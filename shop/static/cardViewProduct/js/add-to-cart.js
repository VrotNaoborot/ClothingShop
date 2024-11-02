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

        // Логика добавления в корзину
        console.log("Товар добавлен в корзину с цветом ID:", selectedColorId, "и размером ID:", selectedSizeId);

        // Здесь выполняем запрос для добавления в корзину
        var csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

        fetch(`/add-to-cart/${productId}/{selectedColorId}&size=${selectedSizeId}`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrfToken,
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (response.ok) {
                console.log('Товар успешно добавлен в корзину');
                // Можете перенаправить пользователя или обновить корзину на странице
            } else {
                console.error('Ошибка при добавлении товара в корзину');
            }
        })
        .catch(error => {
            console.error('Ошибка:', error);
        });
    }

    // Привязываем функцию к кнопке
    document.querySelector('.cart-add-button').onclick = addToCart;
});
