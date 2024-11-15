document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-input');
    const searchResults = document.querySelector('.search-results');

    // Обработчик события ввода
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim();

        if (query.length > 0) {
            fetch(`/search?q=${encodeURIComponent(query)}`)
                .then(response => response.json())
                .then(data => {
                    searchResults.innerHTML = ''; // Очищаем старые результаты

                    if (data.results.length > 0) {
                        data.results.forEach(item => {
                            const resultItem = document.createElement('a');
                            resultItem.href = item.url;
                            resultItem.textContent = `${item.category}: ${item.name}`;
                            searchResults.appendChild(resultItem);
                        });
                        searchResults.style.display = 'block'; // Показываем результаты
                    } else {
                        // Если ничего не найдено
                        const noResults = document.createElement('p');
                        noResults.textContent = 'Ничего не найдено';
                        searchResults.appendChild(noResults);
                        searchResults.style.display = 'block';
                    }
                })
                .catch(error => {
                    console.error('Ошибка при поиске:', error);
                });
        } else {
            searchResults.innerHTML = ''; // Очищаем результаты, если ввода нет
            searchResults.style.display = 'none'; // Скрываем результаты
        }
    });

    // Закрытие выпадающего списка при клике вне
    document.addEventListener('click', (event) => {
        if (!searchResults.contains(event.target) && event.target !== searchInput) {
            searchResults.style.display = 'none';
        }
    });
});
