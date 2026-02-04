// admin.js - Скрипты для админ-панели

let isAdminLoggedIn = false;

// Инициализация админ-панели
document.addEventListener('DOMContentLoaded', function() {
    // Проверка авторизации
    checkAdminAuth();
    
    if (isAdminLoggedIn) {
        initAdminPanel();
    }
    
    // Обработка формы входа
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            adminLogin();
        });
    }
    
    // Инициализация вкладок
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchAdminTab(tabName);
        });
    });
    
    // Обработка формы товара
    const productForm = document.getElementById('product-form');
    if (productForm) {
        productForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveProduct();
        });
    }
    
    // Обработка формы пользователя
    const userForm = document.getElementById('user-form');
    if (userForm) {
        userForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveUser();
        });
    }
    
    // Обработка формы категории
    const categoryForm = document.getElementById('category-form');
    if (categoryForm) {
        categoryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveCategory();
        });
    }
});

// Проверка авторизации администратора
function checkAdminAuth() {
    const adminAuth = localStorage.getItem('adminLoggedIn');
    if (adminAuth === 'true') {
        isAdminLoggedIn = true;
        document.getElementById('admin-login').style.display = 'none';
        document.getElementById('admin-panel').style.display = 'block';
    }
}

// Вход в админ-панель
function adminLogin() {
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;
    
    // Проверка учетных данных
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const adminUser = users.find(u => 
        u.email === email && 
        u.password === password && 
        u.role === 'admin'
    );
    
    if (adminUser) {
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('currentAdmin', JSON.stringify(adminUser));
        
        isAdminLoggedIn = true;
        document.getElementById('admin-login').style.display = 'none';
        document.getElementById('admin-panel').style.display = 'block';
        
        initAdminPanel();
        showNotification('Добро пожаловать в админ-панель!', 'success');
    } else {
        alert('Неверные учетные данные или недостаточно прав');
    }
}

// Выход из админ-панели
function logoutAdmin() {
    if (confirm('Выйти из админ-панели?')) {
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('currentAdmin');
        
        document.getElementById('admin-login').style.display = 'block';
        document.getElementById('admin-panel').style.display = 'none';
        
        isAdminLoggedIn = false;
        showNotification('Вы вышли из админ-панели', 'info');
    }
}

// Инициализация админ-панели
function initAdminPanel() {
    // Загрузка статистики
    loadAdminStats();
    
    // Загрузка данных для вкладок
    loadProductsTable();
    loadOrdersTable();
    loadUsersTable();
    loadReviewsTable();
    loadCategories();
    
    // Установка текущего пользователя
    const currentAdmin = JSON.parse(localStorage.getItem('currentAdmin'));
    if (currentAdmin) {
        document.getElementById('admin-user-name').textContent = currentAdmin.name;
    }
}

// Загрузка статистики
function loadAdminStats() {
    // Заказы
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    document.getElementById('total-orders-admin').textContent = orders.length;
    
    // Статистика по статусам заказов
    const processing = orders.filter(o => o.status === 'processing').length;
    const delivered = orders.filter(o => o.status === 'delivered').length;
    const cancelled = orders.filter(o => o.status === 'cancelled').length;
    
    document.getElementById('processing-orders').textContent = processing;
    document.getElementById('delivered-orders').textContent = delivered;
    document.getElementById('cancelled-orders').textContent = cancelled;
    
    // Пользователи
    const users = JSON.parse(localStorage.getItem('users')) || [];
    document.getElementById('total-users').textContent = users.length;
    
    // Товары
    const products = JSON.parse(localStorage.getItem('products')) || getDefaultProducts();
    document.getElementById('total-products').textContent = products.length;
    
    // Отзывы
    const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    document.getElementById('total-reviews-admin').textContent = reviews.length;
}

// Переключение вкладок админки
function switchAdminTab(tabName) {
    // Скрыть все вкладки
    document.querySelectorAll('.admin-tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Убрать активный класс у всех кнопок
    document.querySelectorAll('.admin-tab').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Показать выбранную вкладку
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Активировать соответствующую кнопку
    document.querySelector(`.admin-tab[data-tab="${tabName}"]`).classList.add('active');
}

// Загрузка таблицы товаров
function loadProductsTable() {
    const products = JSON.parse(localStorage.getItem('products')) || getDefaultProducts();
    const container = document.getElementById('products-table');
    
    container.innerHTML = products.map(product => `
        <tr>
            <td>${product.id}</td>
            <td>
                <img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
            </td>
            <td>${product.name}</td>
            <td>${getCategoryName(product.category)}</td>
            <td>${product.price.toLocaleString()} ₽</td>
            <td>
                <span class="status ${product.inStock ? 'delivered' : 'cancelled'}">
                    ${product.inStock ? 'В наличии' : 'Нет в наличии'}
                </span>
            </td>
            <td>${product.rating}/5</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="editProduct(${product.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" onclick="deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function getCategoryName(categoryCode) {
    const categories = {
        'kitchen': 'Кухонная техника',
        'cleaning': 'Уборка',
        'climate': 'Климат',
        'electronics': 'Электроника',
        'appliances': 'Крупная техника'
    };
    return categories[categoryCode] || categoryCode;
}

// Поиск товаров в админке
function searchProductsAdmin() {
    const searchTerm = document.getElementById('product-search').value.toLowerCase();
    const category = document.getElementById('product-category-filter').value;
    
    const products = JSON.parse(localStorage.getItem('products')) || getDefaultProducts();
    let filtered = products;
    
    if (searchTerm) {
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(searchTerm) ||
            p.description.toLowerCase().includes(searchTerm) ||
            p.code.toLowerCase().includes(searchTerm)
        );
    }
    
    if (category !== 'all') {
        filtered = filtered.filter(p => p.category === category);
    }
    
    const container = document.getElementById('products-table');
    container.innerHTML = filtered.map(product => `
        <tr>
            <td>${product.id}</td>
            <td>
                <img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
            </td>
            <td>${product.name}</td>
            <td>${getCategoryName(product.category)}</td>
            <td>${product.price.toLocaleString()} ₽</td>
            <td>
                <span class="status ${product.inStock ? 'delivered' : 'cancelled'}">
                    ${product.inStock ? 'В наличии' : 'Нет в наличии'}
                </span>
            </td>
            <td>${product.rating}/5</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="editProduct(${product.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" onclick="deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Фильтрация товаров в админке
function filterProductsAdmin() {
    searchProductsAdmin(); // Используем ту же функцию
}

// Показать форму добавления товара
function showAddProductForm() {
    document.getElementById('add-product-modal').style.display = 'flex';
}

// Закрыть форму добавления товара
function closeAddProduct() {
    document.getElementById('add-product-modal').style.display = 'none';
    document.getElementById('product-form').reset();
}

// Сохранение товара
function saveProduct() {
    const product = {
        id: Date.now(),
        name: document.getElementById('product-name').value,
        category: document.getElementById('product-category').value,
        price: parseInt(document.getElementById('product-price').value),
        oldPrice: document.getElementById('product-old-price').value ? 
                  parseInt(document.getElementById('product-old-price').value) : null,
        code: document.getElementById('product-code').value || `PROD-${Date.now()}`,
        inStock: parseInt(document.getElementById('product-stock').value) > 0,
        description: document.getElementById('product-description-short').value,
        fullDescription: document.getElementById('product-description-full').value,
        image: document.getElementById('product-image').value || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        rating: 0,
        reviews: 0
    };
    
    // Парсинг характеристик
    try {
        const specsText = document.getElementById('product-specs').value;
        if (specsText) {
            product.specifications = JSON.parse(specsText);
        }
    } catch (e) {
        alert('Ошибка в формате характеристик. Используйте JSON формат.');
        return;
    }
    
    // Сохранение товара
    const products = JSON.parse(localStorage.getItem('products')) || getDefaultProducts();
    products.push(product);
    localStorage.setItem('products', JSON.stringify(products));
    
    closeAddProduct();
    loadProductsTable();
    loadAdminStats();
    showNotification('Товар успешно добавлен', 'success');
}

// Редактирование товара
function editProduct(productId) {
    const products = JSON.parse(localStorage.getItem('products')) || getDefaultProducts();
    const product = products.find(p => p.id === productId);
    
    if (product) {
        // Заполнение формы данными товара
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-category').value = product.category;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-old-price').value = product.oldPrice || '';
        document.getElementById('product-code').value = product.code;
        document.getElementById('product-stock').value = product.inStock ? 10 : 0;
        document.getElementById('product-description-short').value = product.description;
        document.getElementById('product-description-full').value = product.fullDescription || '';
        document.getElementById('product-image').value = product.image;
        
        if (product.specifications) {
            document.getElementById('product-specs').value = JSON.stringify(product.specifications, null, 2);
        }
        
        // Изменение заголовка формы
        document.querySelector('#add-product-modal .modal-header h3').textContent = 'Редактировать товар';
        
        // Изменение обработчика формы
        const form = document.getElementById('product-form');
        form.onsubmit = function(e) {
            e.preventDefault();
            updateProduct(productId);
        };
        
        showAddProductForm();
    }
}

// Обновление товара
function updateProduct(productId) {
    const products = JSON.parse(localStorage.getItem('products')) || getDefaultProducts();
    const index = products.findIndex(p => p.id === productId);
    
    if (index !== -1) {
        products[index] = {
            ...products[index],
            name: document.getElementById('product-name').value,
            category: document.getElementById('product-category').value,
            price: parseInt(document.getElementById('product-price').value),
            oldPrice: document.getElementById('product-old-price').value ? 
                     parseInt(document.getElementById('product-old-price').value) : null,
            code: document.getElementById('product-code').value,
            inStock: parseInt(document.getElementById('product-stock').value) > 0,
            description: document.getElementById('product-description-short').value,
            fullDescription: document.getElementById('product-description-full').value,
            image: document.getElementById('product-image').value
        };
        
        try {
            const specsText = document.getElementById('product-specs').value;
            if (specsText) {
                products[index].specifications = JSON.parse(specsText);
            }
        } catch (e) {
            alert('Ошибка в формате характеристик');
            return;
        }
        
        localStorage.setItem('products', JSON.stringify(products));
        closeAddProduct();
        loadProductsTable();
        showNotification('Товар успешно обновлен', 'success');
    }
}

// Удаление товара
function deleteProduct(productId) {
    if (confirm('Удалить этот товар? Это действие нельзя отменить.')) {
        let products = JSON.parse(localStorage.getItem('products')) || getDefaultProducts();
        products = products.filter(p => p.id !== productId);
        localStorage.setItem('products', JSON.stringify(products));
        
        loadProductsTable();
        loadAdminStats();
        showNotification('Товар удален', 'info');
    }
}

// Загрузка таблицы заказов
function loadOrdersTable() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const container = document.getElementById('orders-table');
    
    container.innerHTML = orders.map(order => {
        const user = users.find(u => u.id === order.userId) || { name: 'Неизвестный пользователь' };
        
        return `
            <tr>
                <td>#${order.id}</td>
                <td>${user.name}</td>
                <td>${order.date}</td>
                <td>${order.total.toLocaleString()} ₽</td>
                <td>
                    <span class="status ${order.status}">
                        ${getOrderStatusText(order.status)}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-edit" onclick="viewOrderDetailsAdmin(${order.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-edit" onclick="editOrderStatus(${order.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function getOrderStatusText(status) {
    const statusMap = {
        'processing': 'В обработке',
        'delivered': 'Доставлен',
        'cancelled': 'Отменен'
    };
    return statusMap[status] || status;
}

// Поиск заказов
function searchOrders() {
    const searchTerm = document.getElementById('order-search').value.toLowerCase();
    const status = document.getElementById('order-status-filter-admin').value;
    
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    let filtered = orders;
    
    if (searchTerm) {
        filtered = filtered.filter(order => {
            const user = users.find(u => u.id === order.userId);
            return (
                order.id.toString().includes(searchTerm) ||
                (user && user.name.toLowerCase().includes(searchTerm))
            );
        });
    }
    
    if (status !== 'all') {
        filtered = filtered.filter(order => order.status === status);
    }
    
    const container = document.getElementById('orders-table');
    container.innerHTML = filtered.map(order => {
        const user = users.find(u => u.id === order.userId) || { name: 'Неизвестный пользователь' };
        
        return `
            <tr>
                <td>#${order.id}</td>
                <td>${user.name}</td>
                <td>${order.date}</td>
                <td>${order.total.toLocaleString()} ₽</td>
                <td>
                    <span class="status ${order.status}">
                        ${getOrderStatusText(order.status)}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-edit" onclick="viewOrderDetailsAdmin(${order.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-edit" onclick="editOrderStatus(${order.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Фильтрация заказов
function filterOrders() {
    searchOrders(); // Используем ту же функцию
}

// Просмотр деталей заказа
function viewOrderDetailsAdmin(orderId) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders.find(o => o.id === orderId);
    const products = JSON.parse(localStorage.getItem('products')) || getDefaultProducts();
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.id === order.userId);
    
    if (order) {
        let details = `
            <h3>Заказ #${order.id}</h3>
            <p><strong>Покупатель:</strong> ${user ? user.name : 'Неизвестный'}</p>
            <p><strong>Дата:</strong> ${order.date}</p>
            <p><strong>Статус:</strong> ${getOrderStatusText(order.status)}</p>
            <p><strong>Адрес доставки:</strong> ${order.address || 'Не указан'}</p>
            <p><strong>Способ оплаты:</strong> ${order.paymentMethod || 'Не указан'}</p>
            <hr>
            <h4>Состав заказа:</h4>
            <ul>
        `;
        
        order.items.forEach(item => {
            const product = products.find(p => p.id === item.productId);
            if (product) {
                details += `<li>${product.name} - ${item.quantity} шт. × ${item.price.toLocaleString()} ₽ = ${(item.quantity * item.price).toLocaleString()} ₽</li>`;
            }
        });
        
        details += `
            </ul>
            <hr>
            <p><strong>Итого:</strong> ${order.total.toLocaleString()} ₽</p>
        `;
        
        alert(details);
    }
}

// Изменение статуса заказа
function editOrderStatus(orderId) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders.find(o => o.id === orderId);
    
    if (order) {
        const newStatus = prompt('Введите новый статус заказа (processing/delivered/cancelled):', order.status);
        
        if (newStatus && ['processing', 'delivered', 'cancelled'].includes(newStatus)) {
            order.status = newStatus;
            localStorage.setItem('orders', JSON.stringify(orders));
            loadOrdersTable();
            loadAdminStats();
            showNotification('Статус заказа обновлен', 'success');
        }
    }
}

// Загрузка таблицы пользователей
function loadUsersTable() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const container = document.getElementById('users-table');
    
    container.innerHTML = users.map(user => `
        <tr>
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone || 'Не указан'}</td>
            <td>
                <span class="status ${user.role === 'admin' ? 'delivered' : 'processing'}">
                    ${user.role === 'admin' ? 'Администратор' : 'Пользователь'}
                </span>
            </td>
            <td>${user.createdAt || user.regDate || 'Неизвестно'}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="editUser(${user.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    ${user.role !== 'admin' ? `
                        <button class="btn-delete" onclick="deleteUser(${user.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : ''}
                </div>
            </td>
        </tr>
    `).join('');
}

// Поиск пользователей
function searchUsers() {
    const searchTerm = document.getElementById('user-search').value.toLowerCase();
    const role = document.getElementById('user-role-filter').value;
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    let filtered = users;
    
    if (searchTerm) {
        filtered = filtered.filter(u => 
            u.name.toLowerCase().includes(searchTerm) ||
            u.email.toLowerCase().includes(searchTerm) ||
            (u.phone && u.phone.includes(searchTerm))
        );
    }
    
    if (role !== 'all') {
        filtered = filtered.filter(u => u.role === role);
    }
    
    const container = document.getElementById('users-table');
    container.innerHTML = filtered.map(user => `
        <tr>
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone || 'Не указан'}</td>
            <td>
                <span class="status ${user.role === 'admin' ? 'delivered' : 'processing'}">
                    ${user.role === 'admin' ? 'Администратор' : 'Пользователь'}
                </span>
            </td>
            <td>${user.createdAt || user.regDate || 'Неизвестно'}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="editUser(${user.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    ${user.role !== 'admin' ? `
                        <button class="btn-delete" onclick="deleteUser(${user.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : ''}
                </div>
            </td>
        </tr>
    `).join('');
}

// Фильтрация пользователей
function filterUsers() {
    searchUsers(); // Используем ту же функцию
}

// Показать форму добавления пользователя
function showAddUserForm() {
    document.getElementById('add-user-modal').style.display = 'flex';
}

// Закрыть форму добавления пользователя
function closeAddUser() {
    document.getElementById('add-user-modal').style.display = 'none';
    document.getElementById('user-form').reset();
}

// Сохранение пользователя
function saveUser() {
    const password = document.getElementById('user-password-admin').value;
    const passwordConfirm = document.getElementById('user-password-confirm-admin').value;
    
    if (password !== passwordConfirm) {
        alert('Пароли не совпадают');
        return;
    }
    
    const user = {
        id: Date.now(),
        name: document.getElementById('user-name-admin').value,
        email: document.getElementById('user-email-admin').value,
        phone: document.getElementById('user-phone-admin').value,
        password: password,
        role: document.getElementById('user-role-admin').value,
        createdAt: new Date().toISOString().split('T')[0]
    };
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Проверка уникальности email
    if (users.some(u => u.email === user.email)) {
        alert('Пользователь с таким email уже существует');
        return;
    }
    
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    
    closeAddUser();
    loadUsersTable();
    loadAdminStats();
    showNotification('Пользователь успешно добавлен', 'success');
}

// Редактирование пользователя
function editUser(userId) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.id === userId);
    
    if (user) {
        alert(`Редактирование пользователя ${user.name}. В реальном проекте здесь будет форма редактирования.`);
    }
}

// Удаление пользователя
function deleteUser(userId) {
    if (confirm('Удалить этого пользователя? Это действие нельзя отменить.')) {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        users = users.filter(u => u.id !== userId);
        localStorage.setItem('users', JSON.stringify(users));
        
        loadUsersTable();
        loadAdminStats();
        showNotification('Пользователь удален', 'info');
    }
}

// Загрузка таблицы отзывов
function loadReviewsTable() {
    const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    const products = JSON.parse(localStorage.getItem('products')) || getDefaultProducts();
    const container = document.getElementById('reviews-table');
    
    container.innerHTML = reviews.map(review => {
        const product = products.find(p => p.id === review.productId);
        
        return `
            <tr>
                <td>${review.id}</td>
                <td>${product ? product.name : 'Товар удален'}</td>
                <td>${review.author}</td>
                <td>${review.rating}/5</td>
                <td>${review.date}</td>
                <td>
                    <span class="status delivered">
                        Опубликован
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-edit" onclick="viewReview(${review.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-delete" onclick="deleteReviewAdmin(${review.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Поиск отзывов
function searchReviews() {
    const searchTerm = document.getElementById('review-search').value.toLowerCase();
    const rating = document.getElementById('review-rating-filter').value;
    
    const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    const products = JSON.parse(localStorage.getItem('products')) || getDefaultProducts();
    
    let filtered = reviews;
    
    if (searchTerm) {
        filtered = filtered.filter(review => 
            review.author.toLowerCase().includes(searchTerm) ||
            review.title.toLowerCase().includes(searchTerm) ||
            review.text.toLowerCase().includes(searchTerm)
        );
    }
    
    if (rating !== 'all') {
        filtered = filtered.filter(review => review.rating === parseInt(rating));
    }
    
    const container = document.getElementById('reviews-table');
    container.innerHTML = filtered.map(review => {
        const product = products.find(p => p.id === review.productId);
        
        return `
            <tr>
                <td>${review.id}</td>
                <td>${product ? product.name : 'Товар удален'}</td>
                <td>${review.author}</td>
                <td>${review.rating}/5</td>
                <td>${review.date}</td>
                <td>
                    <span class="status delivered">
                        Опубликован
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-edit" onclick="viewReview(${review.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-delete" onclick="deleteReviewAdmin(${review.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Фильтрация отзывов
function filterReviews() {
    searchReviews(); // Используем ту же функцию
}

// Просмотр отзыва
function viewReview(reviewId) {
    const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    const review = reviews.find(r => r.id === reviewId);
    const products = JSON.parse(localStorage.getItem('products')) || getDefaultProducts();
    const product = products.find(p => p.id === review.productId);
    
    if (review) {
        let details = `
            <h3>Отзыв #${review.id}</h3>
            <p><strong>Товар:</strong> ${product ? product.name : 'Товар удален'}</p>
            <p><strong>Автор:</strong> ${review.author}</p>
            <p><strong>Email:</strong> ${review.email}</p>
            <p><strong>Оценка:</strong> ${review.rating}/5</p>
            <p><strong>Дата:</strong> ${review.date}</p>
            <hr>
            <p><strong>Заголовок:</strong> ${review.title}</p>
            <p><strong>Текст отзыва:</strong></p>
            <p>${review.text}</p>
        `;
        
        if (review.pros) {
            details += `<p><strong>Достоинства:</strong> ${review.pros}</p>`;
        }
        
        if (review.cons) {
            details += `<p><strong>Недостатки:</strong> ${review.cons}</p>`;
        }
        
        alert(details);
    }
}

// Удаление отзыва
function deleteReviewAdmin(reviewId) {
    if (confirm('Удалить этот отзыв? Это действие нельзя отменить.')) {
        let reviews = JSON.parse(localStorage.getItem('reviews')) || [];
        reviews = reviews.filter(r => r.id !== reviewId);
        localStorage.setItem('reviews', JSON.stringify(reviews));
        
        loadReviewsTable();
        loadAdminStats();
        showNotification('Отзыв удален', 'info');
    }
}

// Загрузка категорий
function loadCategories() {
    const categories = [
        { id: 1, name: 'Кухонная техника', code: 'kitchen', icon: 'fas fa-blender', count: 4 },
        { id: 2, name: 'Техника для уборки', code: 'cleaning', icon: 'fas fa-vacuum', count: 1 },
        { id: 3, name: 'Климатическая техника', code: 'climate', icon: 'fas fa-fan', count: 1 },
        { id: 4, name: 'Электроника', code: 'electronics', icon: 'fas fa-tv', count: 1 },
        { id: 5, name: 'Крупная бытовая техника', code: 'appliances', icon: 'fas fa-home', count: 1 }
    ];
    
    const container = document.querySelector('.categories-grid');
    if (container) {
        container.innerHTML = categories.map(category => `
            <div class="category-admin-card">
                <div class="category-header">
                    <i class="${category.icon}"></i>
                    <h3>${category.name}</h3>
                </div>
                <div class="category-info">
                    <p>Код: ${category.code}</p>
                    <p>Товаров: ${category.count}</p>
                </div>
                <div class="category-actions">
                    <button class="btn-edit" onclick="editCategory(${category.id})">
                        <i class="fas fa-edit"></i> Редактировать
                    </button>
                    ${category.id > 5 ? `
                        <button class="btn-delete" onclick="deleteCategory(${category.id})">
                            <i class="fas fa-trash"></i> Удалить
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }
}

// Показать форму добавления категории
function showAddCategoryForm() {
    document.getElementById('add-category-modal').style.display = 'flex';
}

// Закрыть форму добавления категории
function closeAddCategory() {
    document.getElementById('add-category-modal').style.display = 'none';
    document.getElementById('category-form').reset();
}

// Сохранение категории
function saveCategory() {
    const category = {
        id: Date.now(),
        name: document.getElementById('category-name').value,
        code: document.getElementById('category-code').value,
        description: document.getElementById('category-description').value,
        icon: document.getElementById('category-icon').value
    };
    
    alert(`Категория "${category.name}" сохранена. В реальном проекте здесь будет сохранение в базу данных.`);
    closeAddCategory();
    showNotification('Категория сохранена', 'success');
}

// Редактирование категории
function editCategory(categoryId) {
    alert(`Редактирование категории #${categoryId}`);
}

// Удаление категории
function deleteCategory(categoryId) {
    if (confirm('Удалить эту категорию? Это действие нельзя отменить.')) {
        alert(`Категория #${categoryId} удалена`);
        showNotification('Категория удалена', 'info');
    }
}

// Сохранение настроек магазина
function saveStoreSettings() {
    const settings = {
        storeName: document.getElementById('store-name').value,
        storeEmail: document.getElementById('store-email').value,
        storePhone: document.getElementById('store-phone').value,
        freeDeliveryThreshold: parseInt(document.getElementById('free-delivery-threshold').value),
        deliveryCost: parseInt(document.getElementById('delivery-cost').value),
        workingHours: document.getElementById('working-hours').value,
        storeAddress: document.getElementById('store-address').value
    };
    
    localStorage.setItem('storeSettings', JSON.stringify(settings));
    showNotification('Настройки магазина сохранены', 'success');
}

// Загрузка настроек магазина
function loadStoreSettings() {
    const settings = JSON.parse(localStorage.getItem('storeSettings'));
    
    if (settings) {
        document.getElementById('store-name').value = settings.storeName;
        document.getElementById('store-email').value = settings.storeEmail;
        document.getElementById('store-phone').value = settings.storePhone;
        document.getElementById('free-delivery-threshold').value = settings.freeDeliveryThreshold;
        document.getElementById('delivery-cost').value = settings.deliveryCost;
        document.getElementById('working-hours').value = settings.workingHours;
        document.getElementById('store-address').value = settings.storeAddress;
    }
}

// Инициализация настроек при загрузке страницы
window.addEventListener('load', function() {
    if (document.getElementById('store-name')) {
        loadStoreSettings();
    }
});

// Стили для админ-панели
const adminStyles = document.createElement('style');
adminStyles.textContent = `
    .admin-login {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 70vh;
    }
    
    .login-container {
        background: white;
        padding: 40px;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow);
        width: 100%;
        max-width: 400px;
    }
    
    .admin-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 30px;
        background: white;
        border-bottom: 1px solid #eee;
        margin-bottom: 30px;
        border-radius: var(--border-radius) var(--border-radius) 0 0;
    }
    
    .admin-user {
        display: flex;
        align-items: center;
        gap: 20px;
    }
    
    .admin-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        padding: 0 30px 30px;
    }
    
    .admin-tabs {
        display: flex;
        background: white;
        border-bottom: 1px solid #eee;
        padding: 0 30px;
        overflow-x: auto;
    }
    
    .admin-tab {
        padding: 20px 30px;
        background: none;
        border: none;
        border-bottom: 3px solid transparent;
        cursor: pointer;
        white-space: nowrap;
        display: flex;
        align-items: center;
        gap: 10px;
        color: var(--gray);
        font-weight: 500;
        transition: var(--transition);
    }
    
    .admin-tab:hover,
    .admin-tab.active {
        color: var(--secondary);
        border-bottom-color: var(--secondary);
    }
    
    .admin-content {
        padding: 30px;
        background: white;
        border-radius: 0 0 var(--border-radius) var(--border-radius);
    }
    
    .admin-tab-content {
        display: none;
    }
    
    .admin-tab-content.active {
        display: block;
    }
    
    .tab-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 1px solid #eee;
    }
    
    .search-filter {
        display: flex;
        gap: 20px;
        margin-bottom: 30px;
        flex-wrap: wrap;
    }
    
    .search-filter input,
    .search-filter select {
        padding: 12px 15px;
        border: 1px solid #ddd;
        border-radius: var(--border-radius);
        font-size: 1rem;
        min-width: 250px;
    }
    
    .admin-table-container {
        overflow-x: auto;
        margin-top: 20px;
    }
    
    .order-stats {
        display: flex;
        gap: 15px;
    }
    
    .stat-badge {
        padding: 8px 15px;
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: 500;
    }
    
    .stat-badge.processing {
        background-color: rgba(52, 152, 219, 0.1);
        color: var(--secondary);
    }
    
    .stat-badge.delivered {
        background-color: rgba(46, 204, 113, 0.1);
        color: var(--success);
    }
    
    .stat-badge.cancelled {
        background-color: rgba(231, 76, 60, 0.1);
        color: var(--accent);
    }
    
    .categories-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
    }
    
    .category-admin-card {
        background: var(--light-gray);
        padding: 20px;
        border-radius: var(--border-radius);
        border: 1px solid #ddd;
    }
    
    .category-header {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-bottom: 15px;
    }
    
    .category-header i {
        font-size: 1.5rem;
        color: var(--secondary);
    }
    
    .category-actions {
        display: flex;
        gap: 10px;
        margin-top: 15px;
    }
    
    .settings-form-admin {
        max-width: 800px;
    }
    
    @media (max-width: 768px) {
        .admin-header {
            flex-direction: column;
            gap: 20px;
            text-align: center;
        }
        
        .admin-tabs {
            flex-direction: column;
        }
        
        .admin-tab {
            border-bottom: 1px solid #eee;
            border-left: 3px solid transparent;
        }
        
        .admin-tab.active {
            border-left-color: var(--secondary);
        }
        
        .tab-header {
            flex-direction: column;
            gap: 20px;
            align-items: stretch;
        }
        
        .search-filter input,
        .search-filter select {
            min-width: auto;
            width: 100%;
        }
        
        .order-stats {
            justify-content: center;
        }
    }
`;
document.head.appendChild(adminStyles);