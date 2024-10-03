document.querySelectorAll('.category-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        const dropdown = document.getElementById('clothes-menu');
        dropdown.style.display = 'block';
    });

    item.addEventListener('mouseleave', function() {
        const dropdown = document.getElementById('clothes-menu');
        dropdown.style.display = 'none';
    });
});
