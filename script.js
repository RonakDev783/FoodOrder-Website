const navLinks = document.querySelector('.nav-links');

function onToggleMenu(e) {
    const mobileMenu = document.getElementById('mobileMenu');
    const isOpening = mobileMenu.classList.contains('translate-x-full');

    if (isOpening) {
        mobileMenu.classList.remove('translate-x-full');
        document.body.classList.add('overflow-hidden');
        e.name = 'close-outline';
    } else {
        mobileMenu.classList.add('translate-x-full');
        document.body.classList.remove('overflow-hidden');
        e.name = 'list-outline';
    }
}

// Close mobile menu on clicking a link
function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.add('translate-x-full');
    document.body.classList.remove('overflow-hidden');
}

// Filter Foods function for food.html
function filterFoods(category) {
    const cards = document.querySelectorAll('.food-card');
    const buttons = document.querySelectorAll('.filter-btn');

    buttons.forEach(btn => {
        if (btn.dataset.category === category) {
            btn.classList.remove('bg-white', 'text-gray-700', 'border', 'border-gray-300');
            btn.classList.add('bg-pink-500', 'text-white');
        } else {
            btn.classList.add('bg-white', 'text-gray-700', 'border', 'border-gray-300');
            btn.classList.remove('bg-pink-500', 'text-white');
        }
    });

    cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
            card.classList.add('animate-fadeIn');
        } else {
            card.style.display = 'none';
        }
    });
}

// PREMIUM CART SYSTEM LOGIC
let cart = JSON.parse(localStorage.getItem('foodOrderCart')) || [];

function saveCart() {
    localStorage.setItem('foodOrderCart', JSON.stringify(cart));
}

function toggleCart(open) {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    if (open) {
        drawer.classList.remove('translate-x-full');
        overlay.classList.remove('pointer-events-none', 'opacity-0');
        document.body.classList.add('overflow-hidden');
    } else {
        drawer.classList.add('translate-x-full');
        overlay.classList.add('pointer-events-none', 'opacity-0');
        document.body.classList.remove('overflow-hidden');
    }
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-24 right-8 bg-black/80 text-white px-6 py-3 rounded-2xl backdrop-blur-md z-[2000] animate-fadeIn shadow-2xl flex items-center gap-3 border border-white/10';
    toast.innerHTML = `
        <ion-icon name="checkmark-circle" class="text-green-400 text-xl"></ion-icon>
        <span class="text-sm font-bold">${message}</span>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

function addToCart(name, price, image) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, image, quantity: 1 });
    }
    saveCart();
    updateCartUI();
    showToast(`${name} added to cart!`);

    if (window.navigator.vibrate) window.navigator.vibrate(10);
}

function updateQuantity(index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity < 1) {
        const name = cart[index].name;
        cart.splice(index, 1);
        showToast(`${name} removed`);
    }
    saveCart();
    updateCartUI();
}

function updateCartUI() {
    const list = document.getElementById('cartItemsList');
    const badge = document.getElementById('cartBadge');
    const subtotalEl = document.getElementById('cartSubtotal');
    const totalEl = document.getElementById('cartTotal');

    if (!list) return;

    if (cart.length === 0) {
        list.innerHTML = `
            <div id="emptyCartState" class="h-full flex flex-col items-center justify-center text-center py-20">
                <div class="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center mb-6">
                    <ion-icon name="fast-food-outline" class="text-5xl text-pink-200"></ion-icon>
                </div>
                <h3 class="text-lg font-bold text-gray-800 mb-2">Your cart is empty</h3>
                <p class="text-gray-500 text-sm mb-8 px-10">Looks like you haven't added anything to your order yet.</p>
                <button onclick="toggleCart(false)" class="bg-pink-600 text-white font-bold py-3 px-8 rounded-full hover:bg-pink-700 transition-all shadow-lg shadow-pink-100">
                    Browse Menu
                </button>
            </div>
        `;
        badge.classList.add('hidden');
        subtotalEl.innerText = '₹0';
        totalEl.innerText = '₹0';
    } else {
        badge.classList.remove('hidden');
        badge.innerText = cart.reduce((sum, item) => sum + item.quantity, 0);

        list.innerHTML = cart.map((item, index) => `
            <div class="flex items-center gap-4 animate-fadeIn bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:border-pink-200 transition-colors">
                <div class="relative">
                    <img src="${item.image}" class="w-16 h-16 object-cover rounded-xl shadow-sm" alt="${item.name}">
                    <span class="absolute -top-2 -right-2 bg-pink-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-white">${item.quantity}</span>
                </div>
                <div class="flex-1">
                    <h4 class="font-bold text-gray-800 text-sm leading-tight mb-1">${item.name}</h4>
                    <p class="text-pink-600 font-extrabold text-sm">₹${item.price * item.quantity}</p>
                    <div class="flex items-center gap-3 mt-2">
                        <div class="flex items-center bg-gray-50 rounded-lg p-1">
                            <button onclick="updateQuantity(${index}, -1)" class="w-6 h-6 rounded-md bg-white shadow-sm flex items-center justify-center hover:text-pink-600">
                                <ion-icon name="remove-outline"></ion-icon>
                            </button>
                            <span class="px-3 text-xs font-bold text-gray-700">${item.quantity}</span>
                            <button onclick="updateQuantity(${index}, 1)" class="w-6 h-6 rounded-md bg-white shadow-sm flex items-center justify-center hover:text-pink-600">
                                <ion-icon name="add-outline"></ion-icon>
                            </button>
                        </div>
                    </div>
                </div>
                <button onclick="updateQuantity(${index}, -999)" class="text-gray-300 hover:text-red-500 transition-all p-2 bg-gray-50 rounded-full">
                    <ion-icon name="trash-outline" class="text-lg"></ion-icon>
                </button>
            </div>
        `).join('');

        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        subtotalEl.innerText = '₹' + subtotal;
        totalEl.innerText = '₹' + subtotal;
    }
}

document.addEventListener('DOMContentLoaded', updateCartUI);
