const API_URL = 'http://localhost:5000/api';

let currentCategory = 'all';
let currentSearch = '';
let minPrice = 0;
let maxPrice = 10000;
let minRating = 0;
let inStockOnly = false;
let onSaleOnly = false;
let currentSort = 'default';
let isFilterOpen = false;
let activeFiltersCount = 0;

let cart = JSON.parse(localStorage.getItem('cart') || '[]');
let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

const categoryIcons = {
    'dogs': '🐕',
    'cats': '🐈',
    'birds': '🦜',
    'fish': '🐠',
    'rodents': '🐹'
};

const categoryNames = {
    'dogs': 'Собаки',
    'cats': 'Кошки',
    'birds': 'Птицы',
    'fish': 'Рыбки',
    'rodents': 'Грызуны'
};

const productDescriptions = {
    'dogs': [
        'Премиальный корм для собак всех пород. Содержит все необходимые витамины и минералы для здоровья и активности вашего питомца.',
        'Мягкая игрушка из натурального каучука. Помогает массировать десны и очищать зубы во время игры.',
        'Прочный поводок из нейлона с мягкой ручкой. Регулируемая длина, светоотражающие элементы для безопасности в темное время суток.',
        'Элегантный кожаный ошейник с металлической пряжкой. Доступен в разных размерах, регулируется под шею питомца.',
        'Уютная лежанка с мягким наполнителем и съемным чехлом. Легко стирается в машинке, подходит для собак мелких и средних пород.',
        'Керамическая миска на противоскользящем основании. Безопасна для посудомоечной машины, объем 500 мл.',
        'Натуральные мясные лакомства без добавок и консервантов. Идеально подходят для дрессировки и поощрения.',
        'Гипоаллергенный шампунь с алоэ вера. Бережно очищает шерсть, не вызывает раздражения, подходит для частого применения.',
        'Профессиональная расческа-пуходерка с закругленными зубьями. Эффективно удаляет отмершую шерсть, не травмируя кожу.',
        'Удобная тканевая переноска с сетчатыми вставками для вентиляции. Складывается для хранения, подходит для собак до 8 кг.'
    ],
    'cats': [
        'Сбалансированный корм для кошек с курицей. Поддерживает здоровье мочевыводящей системы и красоту шерсти.',
        'Экологичный древесный наполнитель с отличным поглощением запахов. Комкуется, удобен в использовании, можно смывать в унитаз.',
        'Прочная когтеточка с домиком из натурального сизаля. Помогает сохранить мебель в целости и дает кошке личное пространство.',
        'Забавная игрушка-мышка с кошачьей мятой внутри. Привлекает внимание кошки, стимулирует охотничьи инстинкты.',
        'Мягкий домик-лежанка с бортиками. Создает ощущение защищенности, подходит для кошек любого размера.',
        'Двойная миска из нержавеющей стали на подставке. Удобна для одновременного кормления и поения.',
        'Вкусные подушечки с витаминами и таурином. Поддерживают здоровье сердца и зрения, нравятся кошкам.',
        'Пластиковая переноска с металлической дверцей. Прочная, вентилируемая, подходит для путешествий и визитов к ветеринару.',
        'Расческа для кошек с частыми и редкими зубьями. Удаляет колтуны и массирует кожу.',
        'Когтерезка с ограничителем для безопасного подстригания когтей. Острые лезвия из нержавеющей стали.'
    ],
    'birds': [
        'Зерновая смесь для попугаев с добавлением витаминов. Содержит просо, овес, канареечное семя и фруктовые добавки.',
        'Просторная металлическая клетка с выдвижным поддоном. В комплекте жердочки, кормушки и поилки.',
        'Подвесная игрушка с колокольчиками и деревянными элементами. Развивает мелкую моторику и развлекает птицу.',
        'Навесная купалка из прозрачного пластика. Легко крепится к клетке, позволяет птице принимать ванну.',
        'Автоматическая кормушка с дозатором. Позволяет оставлять корм на несколько дней, не беспокоясь о питании птицы.',
        'Ниппельная поилка с антибактериальным покрытием. Обеспечивает постоянный доступ к чистой воде.',
        'Деревянная жердочка разного диаметра. Полезна для здоровья лап, предотвращает натоптыши.',
        'Минеральный камень с йодом. Источник кальция и микроэлементов, помогает стачивать клюв.',
        'Фруктово-ореховое лакомство для попугаев. Натуральный состав, без сахара и красителей.',
        'Жидкие витамины для птиц в период линьки. Добавляются в питьевую воду, укрепляют перья и иммунитет.'
    ],
    'fish': [
        'Качественные хлопья для тропических рыб. Сбалансированный состав для ежедневного кормления.',
        'Аквариум 20 литров со светодиодной подсветкой. Отличный стартовый набор для начинающих аквариумистов.',
        'Внутренний фильтр с губкой и активированным углем. Обеспечивает механическую и биологическую фильтрацию.',
        'Погружной обогреватель 50W с терморегулятором. Поддерживает постоянную температуру воды.',
        'Светодиодная лампа для аквариумных растений. Спектр света способствует фотосинтезу и росту растений.',
        'Декоративный цветной грунт для аквариума. Безопасен для рыб, не окрашивает воду.',
        'Искусственные растения из мягкого пластика. Создают укрытия для рыб, легко моются.',
        'Сачок для рыб из мелкой сетки. Удобная ручка, не травмирует рыб.',
        'Кондиционер для воды, удаляющий хлор и тяжелые металлы. Делает водопроводную воду безопасной для рыб.',
        'Наклейка-термометр для контроля температуры воды. Легко крепится снаружи аквариума.'
    ],
    'rodents': [
        'Зерновая смесь для хомяков и морских свинок. Содержит злаки, семена и сушеные овощи.',
        'Просторная клетка для крыс и хомяков с трубами и домиком. Многоуровневая, с колесом и лесенками.',
        'Прессованные опилки из хвойных пород. Отлично впитывают влагу и нейтрализуют запахи.',
        'Бесшумное беговое колесо на подшипниках. Позволяет грызунам выплескивать энергию даже ночью.',
        'Деревянный домик с плоской крышей. Можно использовать как укрытие и как дополнительную полку.',
        'Шариковая поилка с металлическим носиком. Надежная, не протекает, удобна для грызунов.',
        'Керамическая кормушка с широким дном. Устойчивая, не переворачивается, легко моется.',
        'Ароматное сено для шиншилл и дегу. Источник клетчатки, помогает стачивать зубы.',
        'Йогуртовые капли для грызунов. Любимое лакомство, содержит кальций и витамины.',
        'Минеральный камень для стачивания зубов. Обогащен микроэлементами, необходимыми для здоровья.'
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('Страница загружена');
    loadCategories();
    loadProducts();
    updateCounters();
    initEventListeners();
    initModals();
    initFilter();
});

function initEventListeners() {
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            currentSearch = document.getElementById('searchInput').value;
            loadProducts();
        });
    }

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                currentSearch = e.target.value;
                loadProducts();
            }
        });
    }

    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.addEventListener('click', showCart);
    }

    const favoritesBtn = document.getElementById('favoritesBtn');
    if (favoritesBtn) {
        favoritesBtn.addEventListener('click', showFavorites);
    }
    
    const clearCartBtn = document.getElementById('clearCartBtn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }

    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', openCheckout);
    }

    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshProducts);
    }

    const filterBtn = document.getElementById('filterToggleBtn');
    if (filterBtn) {
        filterBtn.addEventListener('click', toggleFilter);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isFilterOpen) {
            closeFilter();
        }
    });

    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', submitOrder);
    }

    document.querySelectorAll('.footer-section ul li a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const text = e.target.textContent;
            showToast(`📬 ${text} - информация отправлена на email`);
        });
    });
}

function initModals() {
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}

function initFilter() {
    const closeBtn = document.getElementById('closeFilterBtn');
    const overlay = document.getElementById('filterOverlay');
    const applyBtn = document.getElementById('applyFilterBtn');
    const resetBtn = document.getElementById('resetFilterBtn');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeFilter);
    }
    
    if (overlay) {
        overlay.addEventListener('click', closeFilter);
    }
    
    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            applyFilters();
            closeFilter();
        });
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            resetFilters();
            closeFilter();
        });
    }
}

function toggleFilter() {
    const drawer = document.getElementById('filterDrawer');
    const overlay = document.getElementById('filterOverlay');
    const btn = document.getElementById('filterToggleBtn');
    
    if (drawer && overlay && btn) {
        isFilterOpen = !isFilterOpen;
        
        if (isFilterOpen) {
            drawer.classList.add('open');
            overlay.classList.add('active');
            btn.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            drawer.classList.remove('open');
            overlay.classList.remove('active');
            btn.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
}

function closeFilter() {
    const drawer = document.getElementById('filterDrawer');
    const overlay = document.getElementById('filterOverlay');
    const btn = document.getElementById('filterToggleBtn');
    
    if (drawer && overlay && btn) {
        isFilterOpen = false;
        drawer.classList.remove('open');
        overlay.classList.remove('active');
        btn.classList.remove('active');
        document.body.style.overflow = '';
    }
}

async function loadCategories() {
    try {
        const response = await fetch(`${API_URL}/categories`);
        const categories = await response.json();
        
        const list = document.getElementById('categoriesList');
        if (!list) return;
        
        list.innerHTML = '<li data-category="all" class="active">🏠 Все</li>';
        
        categories.forEach(cat => {
            list.innerHTML += `<li data-category="${cat.id}">${cat.icon} ${cat.name}</li>`;
        });
        
        document.querySelectorAll('#categoriesList li').forEach(item => {
            item.addEventListener('click', function() {
                document.querySelectorAll('#categoriesList li').forEach(li => {
                    li.classList.remove('active');
                });
                this.classList.add('active');
                currentCategory = this.dataset.category;
                loadProducts();
            });
        });
        
    } catch (error) {
        console.error('Ошибка загрузки категорий:', error);
    }
}

async function loadProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    grid.innerHTML = '<div class="loading">Загрузка товаров...</div>';
    
    try {
        let url = `${API_URL}/products?min_price=${minPrice}&max_price=${maxPrice}`;
        
        if (currentCategory !== 'all') {
            url += `&category=${currentCategory}`;
        }
        
        if (currentSearch) {
            url += `&search=${encodeURIComponent(currentSearch)}`;
        }
        
        console.log('Запрос товаров:', url);
        
        const response = await fetch(url);
        const products = await response.json();
        
        console.log('Получено товаров:', products.length);
        
        if (!products || products.length === 0) {
            grid.innerHTML = '<div class="loading">😕 Товары не найдены</div>';
            return;
        }
        
        let filtered = products.filter(p => {
            if (minRating > 0 && p.rating < minRating) return false;
            if (inStockOnly && !p.in_stock) return false;
            if (onSaleOnly && !p.old_price) return false;
            return true;
        });
        
        if (currentSort === 'price_asc') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (currentSort === 'price_desc') {
            filtered.sort((a, b) => b.price - a.price);
        } else if (currentSort === 'rating_desc') {
            filtered.sort((a, b) => b.rating - a.rating);
        }
        
        if (filtered.length === 0) {
            grid.innerHTML = '<div class="loading">😕 Товары не найдены</div>';
            return;
        }
        
        renderProducts(filtered);
        
    } catch (error) {
        console.error('Ошибка загрузки товаров:', error);
        grid.innerHTML = '<div class="loading">❌ Ошибка загрузки</div>';
    }
}

function renderProducts(products) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    let html = '';
    
    products.forEach(product => {
        const discount = product.old_price ? Math.round((1 - product.price / product.old_price) * 100) : 0;
        const icon = categoryIcons[product.category] || '🐾';
        const inCart = cart.some(item => item.id === product.id);
        const inFav = favorites.some(item => item.id === product.id);
        
        const fullStars = Math.floor(product.rating);
        const halfStar = product.rating % 1 >= 0.5;
        let stars = '';
        for (let i = 0; i < fullStars; i++) stars += '★';
        if (halfStar) stars += '½';
        for (let i = stars.length; i < 5; i++) stars += '☆';
        
        html += `
            <div class="product-card" data-id="${product.id}">
                ${discount ? `<div class="product-badge">-${discount}%</div>` : ''}
                
                <div class="product-actions">
                    <button class="action-btn ${inFav ? 'active' : ''}" onclick="event.stopPropagation(); toggleFavorite(${product.id})">
                        <i class="fa${inFav ? 's' : 'r'} fa-heart"></i>
                    </button>
                </div>
                
                <div class="product-image" onclick="showProductDetails(${product.id})">
                    ${icon}
                </div>
                
                <div class="product-name" onclick="showProductDetails(${product.id})">${product.name}</div>
                
                <div class="product-rating" onclick="showProductDetails(${product.id})">
                    ${stars} (${product.rating})
                </div>
                
                <div class="product-price" onclick="showProductDetails(${product.id})">
                    <span class="current-price">${product.price}</span>
                    ${product.old_price ? `<span class="old-price">${product.old_price}</span>` : ''}
                </div>
                
                <div class="${product.in_stock ? 'in-stock' : 'out-of-stock'}" onclick="showProductDetails(${product.id})">
                    <i class="fas ${product.in_stock ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                    ${product.in_stock ? 'В наличии' : 'Нет в наличии'}
                </div>
                
                <button class="add-to-cart" 
                        onclick="addToCart(${product.id})"
                        ${!product.in_stock ? 'disabled' : ''}>
                    ${inCart ? '✓ В КОРЗИНЕ' : 'В КОРЗИНУ'}
                </button>
            </div>
        `;
    });
    
    grid.innerHTML = html;
}

function applyFilters() {
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    const ratingFilter = document.getElementById('ratingFilter');
    const inStockFilter = document.getElementById('inStockFilter');
    const saleFilter = document.getElementById('saleFilter');
    const sortSelect = document.getElementById('sortSelect');
    
    minPrice = parseInt(minPriceInput?.value) || 0;
    maxPrice = parseInt(maxPriceInput?.value) || 10000;
    minRating = parseFloat(ratingFilter?.value) || 0;
    inStockOnly = inStockFilter?.checked || false;
    onSaleOnly = saleFilter?.checked || false;
    currentSort = sortSelect?.value || 'default';
    
    updateActiveFiltersDisplay();
    loadProducts();
}

function resetFilters() {
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    const ratingFilter = document.getElementById('ratingFilter');
    const inStockFilter = document.getElementById('inStockFilter');
    const saleFilter = document.getElementById('saleFilter');
    const sortSelect = document.getElementById('sortSelect');
    
    if (minPriceInput) minPriceInput.value = 0;
    if (maxPriceInput) maxPriceInput.value = 10000;
    if (ratingFilter) ratingFilter.value = '0';
    if (inStockFilter) inStockFilter.checked = false;
    if (saleFilter) saleFilter.checked = false;
    if (sortSelect) sortSelect.value = 'default';
    
    minPrice = 0;
    maxPrice = 10000;
    minRating = 0;
    inStockOnly = false;
    onSaleOnly = false;
    currentSort = 'default';
    
    updateActiveFiltersDisplay();
    loadProducts();
}

function updateActiveFiltersDisplay() {
    const container = document.getElementById('activeFilters');
    if (!container) return;
    
    let html = '';
    activeFiltersCount = 0;
    
    if (minPrice > 0 || maxPrice < 10000) {
        activeFiltersCount++;
        html += `
            <div class="filter-chip">
                Цена: ${minPrice}₽ - ${maxPrice}₽
                <button class="remove-chip" onclick="removeFilter('price')">&times;</button>
            </div>
        `;
    }
    
    if (minRating > 0) {
        activeFiltersCount++;
        html += `
            <div class="filter-chip">
                Рейтинг: от ${minRating} ★
                <button class="remove-chip" onclick="removeFilter('rating')">&times;</button>
            </div>
        `;
    }
    
    if (inStockOnly) {
        activeFiltersCount++;
        html += `
            <div class="filter-chip">
                В наличии
                <button class="remove-chip" onclick="removeFilter('stock')">&times;</button>
            </div>
        `;
    }
    
    if (onSaleOnly) {
        activeFiltersCount++;
        html += `
            <div class="filter-chip">
                Со скидкой
                <button class="remove-chip" onclick="removeFilter('sale')">&times;</button>
            </div>
        `;
    }
    
    container.innerHTML = html;
    
    const badge = document.getElementById('filterActiveBadge');
    if (badge) {
        badge.style.display = activeFiltersCount > 0 ? 'flex' : 'none';
    }
}

function removeFilter(filterType) {
    switch(filterType) {
        case 'price':
            document.getElementById('minPrice').value = 0;
            document.getElementById('maxPrice').value = 10000;
            minPrice = 0;
            maxPrice = 10000;
            break;
        case 'rating':
            document.getElementById('ratingFilter').value = '0';
            minRating = 0;
            break;
        case 'stock':
            document.getElementById('inStockFilter').checked = false;
            inStockOnly = false;
            break;
        case 'sale':
            document.getElementById('saleFilter').checked = false;
            onSaleOnly = false;
            break;
    }
    applyFilters();
}

async function refreshProducts() {
    const btn = document.getElementById('refreshBtn');
    if (!btn) return;
    
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    
    try {
        await fetch(`${API_URL}/clear`, { method: 'POST' });
        await loadProducts();
        showToast('Товары обновлены');
    } catch (error) {
        showToast('Ошибка обновления', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
}

function addToCart(productId) {
    const card = document.querySelector(`.product-card[data-id="${productId}"]`);
    if (!card) return;
    
    const product = {
        id: productId,
        name: card.querySelector('.product-name').textContent,
        price: parseInt(card.querySelector('.current-price').textContent.replace(/[^\d]/g, '')),
        image: card.querySelector('.product-image').textContent.trim(),
        quantity: 1
    };
    
    const existing = cart.find(item => item.id === productId);
    
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push(product);
    }
    
    saveCart();
    updateCounters();
    showToast('Товар добавлен в корзину');
    
    const btn = card.querySelector('.add-to-cart');
    if (btn) btn.textContent = '✓ В КОРЗИНЕ';
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCounters();
    showCart();
    showToast('Товар удален из корзины');
}

function updateQuantity(productId, delta) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            showCart();
        }
    }
}

function clearCart() {
    if (confirm('Очистить корзину?')) {
        cart = [];
        saveCart();
        updateCounters();
        showCart();
        showToast('Корзина очищена');
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function showCart() {
    const modal = document.getElementById('cartModal');
    const content = document.getElementById('cartContent');
    const totalSpan = document.getElementById('cartTotal');
    
    if (!modal) return;
    
    if (cart.length === 0) {
        content.innerHTML = '<p style="text-align: center; padding: 40px;">Корзина пуста</p>';
        totalSpan.textContent = 'Итого: 0 ₽';
    } else {
        let html = '';
        let total = 0;
        
        cart.forEach(item => {
            total += item.price * item.quantity;
            html += `
                <div class="cart-item">
                    <div class="cart-item-image">${item.image}</div>
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">${item.price} ₽</div>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                    <button class="action-btn" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        });
        
        content.innerHTML = html;
        totalSpan.textContent = `Итого: ${total} ₽`;
    }
    
    modal.style.display = 'block';
}

function openCheckout() {
    if (cart.length === 0) {
        showToast('Корзина пуста', 'warning');
        return;
    }
    
    const modal = document.getElementById('checkoutModal');
    const orderSummary = document.getElementById('orderSummary');
    const totalAmount = document.getElementById('totalAmount');
    
    let summaryHtml = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        summaryHtml += `
            <div class="order-summary-item">
                <span>${item.name} x${item.quantity}</span>
                <span>${itemTotal} ₽</span>
            </div>
        `;
    });
    
    orderSummary.innerHTML = summaryHtml;
    totalAmount.innerHTML = `Итого: ${total} ₽`;
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateInput = document.getElementById('deliveryDate');
    if (dateInput) {
        dateInput.min = tomorrow.toISOString().split('T')[0];
        dateInput.value = tomorrow.toISOString().split('T')[0];
    }
    
    modal.style.display = 'block';
}

function submitOrder(e) {
    e.preventDefault();
    
    const name = document.getElementById('name')?.value;
    const phone = document.getElementById('phone')?.value;
    const email = document.getElementById('email')?.value;
    const address = document.getElementById('address')?.value;
    
    if (!name || !phone || !email || !address) {
        showToast('Заполните все обязательные поля', 'error');
        return;
    }
    
    const orderNumber = '#GOSI-' + new Date().getFullYear() + '-' + 
                       String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    
    cart = [];
    saveCart();
    updateCounters();
    
    document.getElementById('checkoutModal').style.display = 'none';
    
    const successModal = document.getElementById('successModal');
    document.getElementById('orderNumber').textContent = orderNumber;
    successModal.style.display = 'block';
    
    showToast('Заказ успешно оформлен!');
}

function toggleFavorite(productId) {
    const index = favorites.findIndex(item => item.id === productId);
    const card = document.querySelector(`.product-card[data-id="${productId}"]`);
    const btn = card?.querySelector('.action-btn');
    
    if (index === -1) {
        const category = card?.querySelector('.product-image').textContent.trim();
        const categoryKey = Object.keys(categoryIcons).find(key => categoryIcons[key] === category) || 'dogs';
        const descriptions = productDescriptions[categoryKey] || productDescriptions.dogs;
        const randomDesc = descriptions[Math.floor(Math.random() * descriptions.length)];
        
        const product = {
            id: productId,
            name: card.querySelector('.product-name').textContent,
            price: parseInt(card.querySelector('.current-price').textContent.replace(/[^\d]/g, '')),
            image: card.querySelector('.product-image').textContent.trim(),
            description: randomDesc,
            category: categoryKey
        };
        favorites.push(product);
        if (btn) {
            btn.classList.add('active');
            btn.innerHTML = '<i class="fas fa-heart"></i>';
        }
        showToast('Добавлено в избранное ❤️');
    } else {
        favorites.splice(index, 1);
        if (btn) {
            btn.classList.remove('active');
            btn.innerHTML = '<i class="far fa-heart"></i>';
        }
        showToast('Удалено из избранного');
    }
    
    saveFavorites();
    updateCounters();
}

function removeFromFavorites(productId) {
    favorites = favorites.filter(item => item.id !== productId);
    saveFavorites();
    updateCounters();
    showFavorites();
    showToast('Удалено из избранного');
}

function saveFavorites() {
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function showFavorites() {
    const modal = document.getElementById('favoritesModal');
    const content = document.getElementById('favoritesContent');
    
    if (!modal) return;
    
    if (favorites.length === 0) {
        content.innerHTML = '<p style="text-align: center; padding: 40px;">Избранное пусто</p>';
    } else {
        let html = '<div class="products-grid">';
        favorites.forEach(item => {
            html += `
                <div class="product-card" data-id="${item.id}">
                    <div class="product-actions">
                        <button class="action-btn active" onclick="event.stopPropagation(); removeFromFavorites(${item.id})">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                    <div class="product-image" onclick="showProductDetails(${item.id})">
                        ${item.image}
                    </div>
                    <div class="product-name" onclick="showProductDetails(${item.id})">${item.name}</div>
                    <div class="product-price" onclick="showProductDetails(${item.id})">
                        <span class="current-price">${item.price}</span>
                    </div>
                    <div class="in-stock" onclick="showProductDetails(${item.id})">
                        <i class="fas fa-check-circle"></i> В наличии
                    </div>
                    <button class="add-to-cart" onclick="addToCart(${item.id})">В КОРЗИНУ</button>
                </div>
            `;
        });
        html += '</div>';
        content.innerHTML = html;
    }
    
    modal.style.display = 'block';
}

async function showProductDetails(productId) {
    try {
        let product = favorites.find(item => item.id === productId);
        
        if (!product) {
            const card = document.querySelector(`.product-card[data-id="${productId}"]`);
            if (card) {
                const category = card.querySelector('.product-image').textContent.trim();
                const categoryKey = Object.keys(categoryIcons).find(key => categoryIcons[key] === category) || 'dogs';
                const descriptions = productDescriptions[categoryKey] || productDescriptions.dogs;
                const randomDesc = descriptions[Math.floor(Math.random() * descriptions.length)];
                
                product = {
                    id: productId,
                    name: card.querySelector('.product-name').textContent,
                    price: parseInt(card.querySelector('.current-price').textContent.replace(/[^\d]/g, '')),
                    image: card.querySelector('.product-image').textContent.trim(),
                    description: randomDesc,
                    category: categoryKey,
                    rating: parseFloat(card.querySelector('.product-rating').textContent.match(/[\d.]+/)[0]),
                    in_stock: card.querySelector('.in-stock') !== null,
                    delivery_date: 'Завтра',
                    site: 'GoSiMarket'
                };
            }
        }
        
        if (!product) {
            const response = await fetch(`${API_URL}/products/${productId}`);
            const serverProduct = await response.json();
            
            if (serverProduct && !serverProduct.error) {
                const descriptions = productDescriptions[serverProduct.category] || productDescriptions.dogs;
                const randomDesc = descriptions[Math.floor(Math.random() * descriptions.length)];
                
                product = {
                    ...serverProduct,
                    description: randomDesc
                };
            }
        }
        
        if (!product) {
            showToast('Товар не найден', 'error');
            return;
        }
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';
        
        const icon = categoryIcons[product.category] || '🐾';
        const inFav = favorites.some(item => item.id === productId);
        
        const fullStars = Math.floor(product.rating || 4.5);
        const halfStar = (product.rating || 4.5) % 1 >= 0.5;
        let stars = '';
        for (let i = 0; i < fullStars; i++) stars += '★';
        if (halfStar) stars += '½';
        for (let i = stars.length; i < 5; i++) stars += '☆';
        
        modal.innerHTML = `
            <div class="modal-content modal-lg">
                <div class="modal-header">
                    <h2>${product.name}</h2>
                    <button class="close-modal"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
                        <div style="text-align: center;">
                            <div style="font-size: 120px; margin-bottom: 20px;">${icon}</div>
                            <div style="font-size: 36px; font-weight: 800; color: var(--primary); margin-bottom: 10px;">${product.price} ₽</div>
                            ${product.old_price ? `<div style="font-size: 18px; color: var(--text-light); text-decoration: line-through; margin-bottom: 10px;">${product.old_price} ₽</div>` : ''}
                            <div style="font-size: 18px; color: var(--warning); margin-bottom: 15px;">${stars} (${product.rating || 4.5})</div>
                            <div style="font-size: 16px; color: var(--success); margin-bottom: 20px;">
                                <i class="fas fa-check-circle"></i> ${product.in_stock ? 'В наличии' : 'Нет в наличии'}
                            </div>
                            <div style="display: flex; gap: 10px; justify-content: center;">
                                <button class="primary-btn" onclick="addToCart(${product.id})">В КОРЗИНУ</button>
                                <button class="secondary-btn" onclick="toggleFavorite(${product.id})">
                                    <i class="fa${inFav ? 's' : 'r'} fa-heart"></i> ${inFav ? 'В избранном' : 'В избранное'}
                                </button>
                            </div>
                        </div>
                        <div>
                            <h3 style="color: var(--primary); margin-bottom: 15px;">Описание товара</h3>
                            <p style="line-height: 1.8; color: var(--text);">${product.description || 'Описание отсутствует'}</p>
                            
                            <h3 style="color: var(--primary); margin: 25px 0 15px;">Характеристики</h3>
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr style="border-bottom: 1px solid var(--border-soft);">
                                    <td style="padding: 10px 0; color: var(--text-light);">Категория</td>
                                    <td style="padding: 10px 0; font-weight: 500;">${categoryNames[product.category] || product.category}</td>
                                </tr>
                                <tr style="border-bottom: 1px solid var(--border-soft);">
                                    <td style="padding: 10px 0; color: var(--text-light);">Доставка</td>
                                    <td style="padding: 10px 0; font-weight: 500;">${product.delivery_date || 'Завтра'}</td>
                                </tr>
                                <tr style="border-bottom: 1px solid var(--border-soft);">
                                    <td style="padding: 10px 0; color: var(--text-light);">Магазин</td>
                                    <td style="padding: 10px 0; font-weight: 500;">${product.site || 'GoSiMarket'}</td>
                                </tr>
                                ${product.discount ? `
                                <tr style="border-bottom: 1px solid var(--border-soft);">
                                    <td style="padding: 10px 0; color: var(--text-light);">Скидка</td>
                                    <td style="padding: 10px 0; font-weight: 500; color: var(--danger);">-${product.discount}%</td>
                                </tr>` : ''}
                            </table>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="primary-btn" onclick="addToCart(${product.id})">Добавить в корзину</button>
                    <button class="secondary-btn" onclick="toggleFavorite(${product.id})">
                        <i class="fa${inFav ? 's' : 'r'} fa-heart"></i> ${inFav ? 'Убрать из избранного' : 'В избранное'}
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
    } catch (error) {
        console.error('Ошибка загрузки товара:', error);
        showToast('Ошибка загрузки товара', 'error');
    }
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.background = type === 'success' ? 'linear-gradient(135deg, #D32F2F, #B71C1C)' : '#ff6b6b';
    toast.style.color = 'white';
    toast.innerHTML = message;
    container.appendChild(toast);
    
    setTimeout(() => toast.remove(), 3000);
}

function updateCounters() {
    const cartCount = document.getElementById('cartCount');
    const favCount = document.getElementById('favoritesCount');
    
    if (cartCount) {
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }
    if (favCount) {
        favCount.textContent = favorites.length;
    }
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.toggleFavorite = toggleFavorite;
window.removeFromFavorites = removeFromFavorites;
window.showProductDetails = showProductDetails;
window.removeFilter = removeFilter;
window.closeAllModals = closeAllModals;
window.showToast = showToast;