const ratings = document.querySelectorAll('.rating');
if (ratings.length > 0) {
    initRatings();
}

function initRatings() {
    let ratingActive, ratingValue;

    for (let index = 0; index < ratings.length; index++) {
        const rating = ratings[index];
        initRating(rating);
    }
}

function initRating(rating) {
    initRatingVars(rating);
    setRatingActiveWidth();
}

function initRatingVars(rating) {
    ratingActive = rating.querySelector('.rating__active'); // querySelector возвращает один элемент
    ratingValue = rating.querySelector('.rating__value'); // querySelector возвращает один элемент
}

function setRatingActiveWidth(index = ratingValue.innerHTML) {
    const ratingActiveWidth = index * 20; // Умножаем на 20, чтобы получить процент (5 звезд = 100%)
    ratingActive.style.width = `${ratingActiveWidth}%`;
}
