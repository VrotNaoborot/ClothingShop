function toggleSubcategory(id) {
    const subcategory = document.getElementById(id);
    if (subcategory.classList.contains('hidden')) {
        subcategory.classList.remove('hidden');
    } else {
        subcategory.classList.add('hidden');
    }
}
