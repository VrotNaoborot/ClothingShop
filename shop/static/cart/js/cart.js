document.addEventListener('DOMContentLoaded', function () {
    let currentStockId; // Переменная для хранения идентификатора товара

    // Обработчик для уменьшения количества
    document.querySelectorAll('.qt-minus').forEach(button => {
        button.addEventListener('click', function () {
            const qtElement = this.nextElementSibling;
            let quantity = parseInt(qtElement.innerText);
            const stockId = this.getAttribute('data-stock-id'); // Получаем stock_id

            if (quantity > 1) {
                quantity--;
                qtElement.innerText = quantity;
                updatePrice(this, quantity);
                updateTotal();
                updateCartItem(this, quantity); // Обновляем корзину на сервере
            } else if (quantity === 1) {
                currentStockId = stockId;
                document.getElementById("confirmModal").style.display = "block"; // Показываем модальное окно
            }
        });
    });

    // Обработчик для увеличения количества
    document.querySelectorAll('.qt-plus').forEach(button => {
        button.addEventListener('click', function () {
            const qtElement = this.previousElementSibling;
            let quantity = parseInt(qtElement.innerText);

            quantity++;
            qtElement.innerText = quantity;
            updatePrice(this, quantity);
            updateTotal();
            updateCartItem(this, quantity); // Обновляем корзину на сервере
        });
    });

    // Обработчик удаления товара
    document.querySelectorAll('.remove').forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault(); // Отменяем стандартное поведение ссылки
            const stockId = this.getAttribute('data-stock-id');
            currentStockId = stockId; // Сохраняем идентификатор товара
            document.getElementById("confirmModal").style.display = "block"; // Показываем модальное окно
        });
    });

    // Закрытие модального окна (отмена)
    document.getElementById("cancelDelete").addEventListener("click", function () {
        document.getElementById("confirmModal").style.display = "none";
    });

    // Подтверждение удаления товара
    document.getElementById("confirmDelete").addEventListener("click", function () {
        removeCartItem(currentStockId); // Вызываем функцию удаления
        document.getElementById("confirmModal").style.display = "none"; // Закрываем модальное окно
    });

    // Получение CSRF-токена
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

    // Функция удаления товара из корзины
    function removeCartItem(stockId) {
        const csrfToken = getCookie('csrftoken');  // Получаем CSRF-токен

        fetch(`/cart/remove/${stockId}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken  // Добавляем CSRF-токен в заголовки
            },
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Успешно удалено, находим и удаляем элемент товара из DOM
                const productElement = document.querySelector(`[data-stock-id="${stockId}"]`).closest('section');
                if (productElement) {
                    productElement.remove();
                }

                // Проверяем, остались ли товары в корзине
                const remainingItems = document.querySelectorAll('.product');
                if (remainingItems.length === 0) {
                    // Отображаем сообщение о пустой корзине
                    const emptyCartMessage = document.querySelector('.empty-cart');
                    if (emptyCartMessage) {
                        emptyCartMessage.style.display = 'block';
                    }

                    // Скрываем футер с итогами
                    const siteFooter = document.getElementById('site-footer');
                    if (siteFooter) {
                        siteFooter.style.display = 'none';
                    }
                }

                updateTotal();  // Обновляем общую сумму
            } else {
                console.error('Error removing item:', data.error);
            }
        })
        .catch(error => console.error('Error:', error));
    }

    // Функция для обновления цены каждого товара
    function updatePrice(element, quantity) {
        const product = element.closest('.product');
        const priceElement = product.querySelector('.price');
        const fullPriceElement = product.querySelector('.full-price');

        const unitPrice = parseFloat(priceElement.innerText.replace(' ₽', '').replace(/\s/g, '').replace(',', ''));
        const fullPrice = unitPrice * quantity;

        // Форматируем fullPrice и заменяем запятые на пробелы
        fullPriceElement.innerText = `${new Intl.NumberFormat('ru-RU', { minimumFractionDigits: 0 }).format(fullPrice).replace(/,/g, ' ')} ₽`;
    }

    // Функция для обновления общей суммы
    function updateTotal() {
        let total = 0;
        document.querySelectorAll('.full-price').forEach(fullPriceElement => {
            const price = parseFloat(fullPriceElement.innerText.replace(' ₽', '').replace(/\s/g, '').replace(',', ''));
            total += price;
        });

        // Обновляем текст в элементе total
        const totalElement = document.querySelector('#site-footer .total span');
        totalElement.innerText = new Intl.NumberFormat('ru-RU').format(total).replace(/,/g, ' ');
    }

    // Функция для обновления количества товара в корзине на сервере
    function updateCartItem(element, quantity) {
        const stockId = element.getAttribute('data-stock-id'); // Получаем stock_id

        fetch(`/cart/update/${stockId}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken') // Передаем CSRF-токен
            },
            body: JSON.stringify({ quantity: quantity })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Количество обновлено на сервере!');
            } else {
                console.error('Ошибка обновления количества на сервере:', data.error);
            }
        })
        .catch(error => console.error('Ошибка при запросе на сервер:', error));
    }

    // Начальный расчет общей суммы при загрузке страницы
    updateTotal();
});
