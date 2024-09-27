'use strict';

$('.header-production-button').click(function() {
	$('.header-production-menu').slideToggle(200);
});


$('.main-section').mouseover(function() {
	hideMenu();
})

$('.info-section').mouseover(function() {
	hideMenu();
})

$('.products-section').mouseover(function() {
	hideMenu();
})

function hideMenu() {
	$('.header-production-menu').slideUp(200);
}

$('.catalog-button').click(function() {
	$('.catalog-button').slideUp(100);
	$('.main-section').slideUp(300);
	$('.products-section').slideDown(200);
})

$('.cart-button').click(function() {
	$('.cart-section').slideToggle(300);
});

var cart = [];
var totalPrice = 0;


function addToCart() {
	$(this).html('<i class="fa-solid fa-check"></i></i>Добавлено');
	$(this).removeClass();

	let itemId = $(this).attr('item-id');
	let itemCost = $(this).attr('item-cost');
	totalPrice += Number(itemCost);

	if (cart[itemId] == undefined) {
		cart[itemId] = 1;
	}
	else {
		cart[itemId]++;
	}

	showCart();
}

function showCart() {
	let out = '';

	for (let item in cart) {
		out += '<p>' + item + ': ' + cart[item] + ' шт.</p>';
	}
	out += '<a href="order.html"><button>Заказать - ' + totalPrice + 'BYN</button></a>';

	$('.cart-section-items').html(out);
}