const catalogItems = document.querySelector('.catalog-items');
const scrollAmount = catalogItems.offsetWidth; // Ширина видимой части каталога

function scrollCatalogLeft() {
    console.log('Current scroll position (left):', catalogItems.scrollLeft);

    catalogItems.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
    });
}

function scrollCatalogRight() {
    console.log('Current scroll position (right):', catalogItems.scrollLeft);

    catalogItems.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
    });
}
