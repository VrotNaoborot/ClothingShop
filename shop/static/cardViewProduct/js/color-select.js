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

// Функция для выбора цвета и редиректа
function selectColor(productId, colorId) {
    const csrfToken = getCookie('csrftoken');

    // Создаем AJAX-запрос
    fetch(`/card/${productId}/color/${colorId}/`, {
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
