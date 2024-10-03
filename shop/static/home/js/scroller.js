document.querySelectorAll('.catalog-container').forEach(function(catalogContainer) {
    const catalogItems = catalogContainer.querySelector('.catalog-items');
    const scrollAmount = catalogItems.offsetWidth; // Ширина видимой части каталога

    const scrollBtnLeft = catalogContainer.querySelector('.scroll-btn.left');
    const scrollBtnRight = catalogContainer.querySelector('.scroll-btn.right');

    scrollBtnLeft.addEventListener('click', function() {
        console.log('Current scroll position (left):', catalogItems.scrollLeft);
        catalogItems.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    });

    scrollBtnRight.addEventListener('click', function() {
        console.log('Current scroll position (right):', catalogItems.scrollLeft);
        catalogItems.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });
});
