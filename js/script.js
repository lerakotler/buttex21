// Инициализация данных
function initializeData() {
    // Данные товаров
    if (!localStorage.getItem('products')) {
        const defaultProducts = getDefaultProducts();
        localStorage.setItem('products', JSON.stringify(defaultProducts));
    }
    
    // Корзина
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
    
    // Избранное
    if (!localStorage.getItem('favorites')) {
        localStorage.setItem('favorites', JSON.stringify([]));
    }
    
    // Отзывы
    if (!localStorage.getItem('reviews')) {
        localStorage.setItem('reviews', JSON.stringify([]));
    }
    
    // Пользователи (для демо)
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([
            {
                id: 1,
                email: 'admin@technodom.ru',
                password: 'admin123',
                name: 'Администратор',
                role: 'admin',
                phone: '+7 (999) 123-45-67',
                address: 'Москва, ул. Техническая, 15',
                createdAt: '2024-01-01'
            }
        ]));
    }
    
    // Заказы (для демо)
    if (!localStorage.getItem('orders')) {
        localStorage.setItem('orders', JSON.stringify([
            {
                id: 1001,
                userId: 1,
                items: [
                    { productId: 1, quantity: 1, price: 45999 },
                    { productId: 3, quantity: 1, price: 24999 }
                ],
                total: 70998,
                status: 'delivered',
                date: '2024-02-15',
                address: 'Москва, ул. Техническая, 15',
                paymentMethod: 'card'
            }
        ]));
    }
}

// Получение товаров по умолчанию
function getDefaultProducts() {
    return [
        {
            id: 1,
            name: 'Холодильник Samsung RB37',
            description: 'Двухкамерный холодильник с системой No Frost',
            fullDescription: 'Современный двухкамерный холодильник Samsung с системой No Frost. Общий объем 367 литров, инверторный компрессор, класс энергопотребления А++. Идеальное решение для семьи из 3-4 человек.',
            price: 45999,
            oldPrice: 52999,
            discount: 13,
            image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            category: 'kitchen',
            rating: 4.7,
            reviews: 128,
            inStock: true,
            code: 'SAM-RB37',
            features: [
                'Система No Frost',
                'Инверторный компрессор',
                'Класс энергопотребления А++',
                'Зона свежести'
            ],
            specifications: {
                'Тип': 'Двухкамерный',
                'Общий объем': '367 л',
                'Система разморозки': 'No Frost',
                'Компрессор': 'Инверторный',
                'Энергопотребление': 'А++',
                'Уровень шума': '38 дБ',
                'Габариты (ВxШxГ)': '178x60x65 см',
                'Цвет': 'Нержавеющая сталь'
            }
        },
        {
            id: 2,
            name: 'Стиральная машина LG F2J3',
            description: 'Стиральная машина с сушкой, загрузка 8 кг',
            fullDescription: 'Стиральная машина LG с функцией сушки. Загрузка 8 кг для стирки и 5 кг для сушки. Прямой привод, 14 программ стирки, класс энергопотребления А+++. Технология Steam для деликатной стирки.',
            price: 62999,
            oldPrice: 69999,
            discount: 10,
            image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            category: 'appliances',
            rating: 4.8,
            reviews: 94,
            inStock: true,
            code: 'LG-F2J3',
            features: [
                'Функция сушки',
                'Прямой привод',
                'Технология Steam',
                '14 программ стирки'
            ],
            specifications: {
                'Загрузка стирка/сушка': '8/5 кг',
                'Класс энергопотребления': 'А+++',
                'Класс стирки': 'А',
                'Скорость отжима': '1400 об/мин',
                'Габариты (ВxШxГ)': '85x60x55 см',
                'Тип загрузки': 'Фронтальная',
                'Уровень шума': '72 дБ',
                'Цвет': 'Белый'
            }
        },
        {
            id: 3,
            name: 'Робот-пылесос Xiaomi Mi Robot',
            description: 'Умный робот-пылесос с навигацией LDS',
            fullDescription: 'Робот-пылесос Xiaomi с лазерной навигацией LDS. Автоматическое построение карты помещения, управление через приложение, мощность всасывания 2500 Па. Работает до 2,5 часов без подзарядки.',
            price: 24999,
            oldPrice: 29999,
            discount: 17,
            image: '../img/pile.PNG',
            category: 'cleaning',
            rating: 4.6,
            reviews: 213,
            inStock: true,
            code: 'XIA-ROBOT',
            features: [
                'Лазерная навигация LDS',
                'Управление через приложение',
                'Мощность всасывания 2500 Па',
                'Работа до 2,5 часов'
            ],
            specifications: {
                'Тип уборки': 'Сухая',
                'Емкость аккумулятора': '5200 мАч',
                'Время работы': '2,5 часа',
                'Мощность всасывания': '2500 Па',
                'Емкость пылесборника': '0,6 л',
                'Уровень шума': '65 дБ',
                'Высота': '9,6 см',
                'Вес': '3,8 кг'
            }
        },
        {
            id: 4,
            name: 'Кофемашина DeLonghi Magnifica',
            description: 'Автоматическая кофемашина для дома',
            fullDescription: 'Автоматическая кофемашина DeLonghi Magnifica. Приготовление эспрессо, капучино, латте. Встроенная кофемолка, система капучинатора, 13 степеней помола. Идеально для любителей качественного кофе.',
            price: 39999,
            oldPrice: null,
            discount: null,
            image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            category: 'kitchen',
            rating: 4.9,
            reviews: 67,
            inStock: true,
            code: 'DEL-MAG',
            features: [
                'Встроенная кофемолка',
                'Система капучинатора',
                '13 степеней помола',
                'Быстрый нагрев'
            ],
            specifications: {
                'Тип': 'Автоматическая',
                'Объем резервуара': '1,8 л',
                'Кофемолка': 'Встроенная',
                'Давление': '15 бар',
                'Мощность': '1450 Вт',
                'Цвет': 'Черный',
                'Размеры': '34x24x43 см',
                'Вес': '9 кг'
            }
        },
        {
            id: 5,
            name: 'Телевизор Sony Bravia 55"',
            description: '4K телевизор с технологией OLED',
            fullDescription: 'Телевизор Sony Bravia 55 дюймов с OLED матрицей. Разрешение 4K, HDR, Smart TV на Android. Процессор X1 Ultimate, акустика Acoustic Surface. Превосходное качество изображения и звука.',
            price: 89999,
            oldPrice: 99999,
            discount: 10,
            image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            category: 'electronics',
            rating: 4.8,
            reviews: 45,
            inStock: true,
            code: 'SON-BRA55',
            features: [
                'OLED матрица',
                'Разрешение 4K HDR',
                'Smart TV на Android',
                'Процессор X1 Ultimate'
            ],
            specifications: {
                'Диагональ': '55 дюймов',
                'Разрешение': '3840x2160 (4K)',
                'Тип матрицы': 'OLED',
                'HDR': 'Dolby Vision, HLG',
                'Smart TV': 'Android TV',
                'Частота обновления': '120 Гц',
                'Размеры с подставкой': '123x71x24 см',
                'Вес': '18,5 кг'
            }
        },
        {
            id: 6,
            name: 'Кондиционер Daikin FTXB',
            description: 'Инверторный кондиционер для квартиры',
            fullDescription: 'Инверторный кондиционер Daikin для квартиры и офиса. Мощность охлаждения 2,5 кВт, класс энергоэффективности А+++. Тихая работа, автоматический режим, ночной режим. Управление через Wi-Fi.',
            price: 54999,
            oldPrice: 62999,
            discount: 13,
            image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            category: 'climate',
            rating: 4.7,
            reviews: 89,
            inStock: true,
            code: 'DAI-FTXB',
            features: [
                'Инверторная технология',
                'Класс энергоэффективности А+++',
                'Управление через Wi-Fi',
                'Тихая работа'
            ],
            specifications: {
                'Тип': 'Сплит-система',
                'Мощность охлаждения': '2,5 кВт',
                'Площадь обслуживания': '25 м²',
                'Энергоэффективность': 'А+++',
                'Уровень шума': '19 дБ',
                'Хладагент': 'R32',
                'Гарантия': '3 года',
                'Вес внутреннего блока': '9 кг'
            }
        },
        {
            id: 7,
            name: 'Микроволновая печь Panasonic NN',
            description: 'Микроволновка с грилем и конвекцией',
            fullDescription: 'Микроволновая печь Panasonic с функцией гриля и конвекции. Объем 27 литров, мощность 1000 Вт, 5 уровней мощности. Инверторная технология для равномерного нагрева, сенсорное управление.',
            price: 12999,
            oldPrice: 15999,
            discount: 19,
            image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            category: 'kitchen',
            rating: 4.5,
            reviews: 156,
            inStock: true,
            code: 'PAN-NN27',
            features: [
                'Гриль и конвекция',
                'Инверторная технология',
                'Объем 27 литров',
                'Сенсорное управление'
            ],
            specifications: {
                'Тип': 'Соло + гриль + конвекция',
                'Объем': '27 л',
                'Мощность микроволн': '1000 Вт',
                'Мощность гриля': '1200 Вт',
                'Управление': 'Сенсорное',
                'Размеры': '48x35x28 см',
                'Вес': '15 кг',
                'Цвет': 'Нержавеющая сталь'
            }
        },
        {
            id: 8,
            name: 'Посудомоечная машина Bosch SMS',
            description: 'Встраиваемая посудомоечная машина',
            fullDescription: 'Встраиваемая посудомоечная машина Bosch. Загрузка 14 комплектов посуды, класс энергопотребления А+++, уровень шума 44 дБ. 6 программ мойки, технология VarioSpeed для быстрой мойки.',
            price: 42999,
            oldPrice: 48999,
            discount: 12,
            image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            category: 'kitchen',
            rating: 4.8,
            reviews: 112,
            inStock: true,
            code: 'BOS-SMS14',
            features: [
                'Загрузка 14 комплектов',
                'Класс энергопотребления А+++',
                'Уровень шума 44 дБ',
                'Технология VarioSpeed'
            ],
            specifications: {
                'Тип': 'Встраиваемая',
                'Загрузка': '14 комплектов',
                'Энергопотребление': 'А+++',
                'Расход воды': '9,5 л/цикл',
                'Уровень шума': '44 дБ',
                'Программы': '6',
                'Габариты (ВxШxГ)': '82x60x55 см',
                'Вес': '30 кг'
            }
        }
    ];
}

// Функции корзины
function addToCart(productId) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            productId: productId,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    if (window.location.pathname.includes('../pages/cart.html')) {
        loadCart();
    }
    
    showNotification('Товар добавлен в корзину!');
}

function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.productId !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    if (window.location.pathname.includes('../pages/cart.html')) {
        loadCart();
    }
    
    showNotification('Товар удален из корзины');
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    document.querySelectorAll('.cart-count').forEach(element => {
        element.textContent = totalItems;
    });
    
    return totalItems;
}

// Функции избранного
function toggleFavorite(productId) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const index = favorites.indexOf(productId);
    
    if (index === -1) {
        favorites.push(productId);
        showNotification('Добавлено в избранное');
    } else {
        favorites.splice(index, 1);
        showNotification('Удалено из избранного');
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavCount();
    
    // Обновление кнопки на текущей странице
    const favBtn = document.querySelector(`.fav-btn[onclick*="${productId}"]`);
    if (favBtn) {
        favBtn.classList.toggle('active');
    }
}

function isFavorite(productId) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    return favorites.includes(productId);
}

function updateFavCount() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    document.querySelectorAll('.fav-count').forEach(element => {
        element.textContent = favorites.length;
    });
    
    return favorites.length;
}

// Уведомления
function showNotification(message, type = 'success') {
    // Создаем уведомление
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Стили для уведомления
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#2ecc71' : '#e74c3c'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
        z-index: 9999;
        animation: slideIn 0.3s ease;
        max-width: 350px;
    `;
    
    document.body.appendChild(notification);
    
    // Автоматическое удаление через 3 секунды
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 3000);
    
    // Добавляем стили для анимации
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.2rem;
                cursor: pointer;
                padding: 0;
                line-height: 1;
            }
        `;
        document.head.appendChild(style);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    updateCartCount();
    updateFavCount();
    
    // Проверяем текущую страницу и вызываем соответствующие функции
    const currentPage = window.location.pathname.split('/').pop();
    
    switch(currentPage) {
        case '../index.html':
            // Функции для главной страницы уже в inline script
            break;
        case '../pages/catalog.html':
            // Функции для каталога уже в inline script
            break;
        case '../pages/product.html':
            // Функции для страницы товара уже в inline script
            break;
        case '../pages/cart.html':
            // Функции для корзины уже в inline script
            break;
        case '../pages/favorites.html':
            // Функции для избранного будут в файле favorites.html
            break;
        case '../pages/account.html':
            // Функции для кабинета будут в файле account.html
            break;
        case '../pages/admin.html':
            // Функции для админки будут в файле admin.html
            break;
    }
});

// Вспомогательная функция для получения звезд рейтинга
function getRatingStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === fullStars + 1 && halfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    
    return stars;
}

// Исправление ссылок на товары
function fixProductLinks() {
    // Обработчик для всех ссылок на товары
    document.addEventListener('click', function(event) {
        const link = event.target.closest('a[href*="../pages/product.html?id="]');
        if (link) {
            event.preventDefault();
            const href = link.getAttribute('href');
            const productId = href.split('id=')[1];
            if (productId) {
                window.location.href = `../pages/product.html?id=${productId}`;
            }
        }
        
        // Обработчик для кликов по изображениям товаров
        const productImage = event.target.closest('.product-image img');
        if (productImage) {
            const productCard = productImage.closest('.product-card');
            if (productCard) {
                const link = productCard.querySelector('a[href*="product.html?id="]');
                if (link) {
                    event.preventDefault();
                    const href = link.getAttribute('href');
                    const productId = href.split('id=')[1];
                    if (productId) {
                        window.location.href = `product.html?id=${productId}`;
                    }
                }
            }
        }
    });
}

// Запускаем при загрузке страницы
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixProductLinks);
} else {
    fixProductLinks();
}
