// Функция для получения CSRF-токена из cookies
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Функция для выбора размера и редиректа
function selectSize(productId, colorId, sizeId) {
    // Проверяем, является ли размер уже выбранным
    const selectedSizeElement = document.querySelector(`.size-list li[data-id="${sizeId}"]`);
    if (selectedSizeElement.classList.contains('selected-size')) {
        // Если размер уже выбран, просто выходим из функции
        return;
    }

    const csrfToken = getCookie('csrftoken');

    // Создаем AJAX-запрос
    fetch(`/card/${productId}/color/${colorId}/size/${sizeId}/`, {
        method: 'GET',  // Можно изменить на 'POST', если это необходимо
        headers: {
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (response.ok) {
            window.location.href = response.url; // Редирект на URL
        } else {
            console.error('Ошибка при редиректе');
        }
    })
    .catch(error => {
        console.error('Ошибка:', error);
    });
}

// Обработчик кликов на элементах списка размеров
document.querySelectorAll('.size-list li').forEach(function(item) {
    item.addEventListener('click', function() {
        const productId = '1'; // Укажите ваш productId здесь
        const colorId = '1'; // Укажите ваш colorId здесь
        const sizeId = this.dataset.id;
        selectSize(productId, colorId, sizeId);
    });
});
