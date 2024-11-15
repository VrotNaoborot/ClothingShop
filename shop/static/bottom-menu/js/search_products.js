document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    searchInput.addEventListener('input', () => {
        const query = searchInput.value;
        console.log(query);

        if (query.length > 2) {  // Начинаем поиск, если больше 2 символов
            fetch(`/search/?q=${encodeURIComponent(query)}`)
                .then(response => response.json())
                .then(data => {
                    const results = data.results;
                    searchResults.innerHTML = '';

                    if (results.length) {
                        results.forEach(item => {
                            const link = document.createElement('a');
                            link.href = item.url;
                            link.textContent = item.name;
                            searchResults.appendChild(link);
                        });
                        searchResults.style.display = 'block';
                    } else {
                        searchResults.innerHTML = '<p>Ничего не найдено</p>';
                    }
                })
                .catch(error => console.error('Error fetching search results:', error));
        } else {
            searchResults.style.display = 'none';
        }
    });

    // Скрытие выпадающего меню при клике вне поиска
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            searchResults.style.display = 'none';
        }
    });
});