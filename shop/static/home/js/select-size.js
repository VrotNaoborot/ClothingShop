function selectSize(event) {
    const sizeId = event.currentTarget.getAttribute('data-size-id');

    // Пример AJAX-запроса с использованием fetch
    fetch(`/card/${productId}/color/${colorId}/size/`, {
        method: 'GET', // или 'POST', если требуется
        headers: {
            'Content-Type': 'application/json',
            // возможно, добавьте другие заголовки, если нужно
        },
    })
    .then(response => response.json())
    .then(data => {
        console.log('Успех:', data);
        // Обработайте ответ сервера
    })
    .catch((error) => {
        console.error('Ошибка:', error);
    });
}