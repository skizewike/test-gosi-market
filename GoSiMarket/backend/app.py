from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import sqlite3
import os
import random
from datetime import datetime, timedelta

app = Flask(__name__, static_folder='../frontend', static_url_path='')
CORS(app)

def format_price_99(price):
    base = int(price / 100) * 100
    return base + 99

def init_db():
    db_dir = os.path.join(os.path.dirname(__file__), 'database')
    db_path = os.path.join(db_dir, 'products.db')
    
    print(f"📁 Проверка базы данных: {db_path}")
    
    if not os.path.exists(db_dir):
        os.makedirs(db_dir)
        print(f"✅ Создана папка: {db_dir}")
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            price INTEGER NOT NULL,
            old_price INTEGER,
            image_url TEXT,
            category TEXT,
            in_stock BOOLEAN DEFAULT 1,
            delivery_date TEXT,
            rating REAL,
            site TEXT,
            is_popular BOOLEAN DEFAULT 0,
            is_new BOOLEAN DEFAULT 0,
            discount INTEGER DEFAULT 0
        )
    ''')
    print("✅ Таблица проверена/создана")
    
    cursor.execute("SELECT COUNT(*) FROM products")
    count = cursor.fetchone()[0]
    
    if count == 0:
        print("📦 База пуста, добавляем тестовые товары...")
        test_products = generate_test_products()
        for p in test_products:
            cursor.execute('''
                INSERT INTO products 
                (name, price, old_price, image_url, category, in_stock, delivery_date, rating, site, is_popular, is_new, discount)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', p)
        
        conn.commit()
        print(f"✅ Добавлено товаров: {len(test_products)}")
    else:
        print(f"✅ В базе уже есть {count} товаров")
    
    cursor.execute("SELECT id, name, price, category FROM products LIMIT 5")
    sample = cursor.fetchall()
    if sample:
        print("📊 Пример товаров:")
        for s in sample:
            print(f"   - {s[1]}: {s[2]}₽ ({s[3]})")
    
    conn.close()
    return count if count > 0 else 35

def generate_test_products():
    products = []
    
    categories = ['dogs', 'cats', 'birds', 'fish', 'rodents']
    sites = ['GoSi', 'Ozon', 'Wildberries', 'Яндекс.Маркет']
    
    product_names = {
        'dogs': [
            ("Корм для собак", 500, 2000),
            ("Игрушка-косточка", 300, 800),
            ("Поводок", 400, 1200),
            ("Ошейник", 500, 1500),
            ("Лежанка для собак", 1000, 3000),
            ("Миска для собак", 300, 900),
            ("Лакомство для собак", 200, 600),
            ("Шампунь для собак", 400, 1000)
        ],
        'cats': [
            ("Корм для кошек", 400, 1500),
            ("Когтеточка", 600, 2500),
            ("Игрушка-мышка", 150, 500),
            ("Домик для кошки", 1200, 3500),
            ("Наполнитель для туалета", 300, 900),
            ("Миска для кошек", 250, 700),
            ("Лакомство для кошек", 150, 450)
        ],
        'birds': [
            ("Корм для птиц", 200, 800),
            ("Клетка для птиц", 1500, 4000),
            ("Игрушка для птиц", 200, 600),
            ("Купалка для птиц", 300, 800),
            ("Кормушка", 250, 700),
            ("Поилка", 200, 500)
        ],
        'fish': [
            ("Корм для рыб", 150, 500),
            ("Аквариум", 2000, 5000),
            ("Фильтр для аквариума", 800, 2500),
            ("Обогреватель", 600, 1800),
            ("Лампа для аквариума", 700, 2000),
            ("Грунт для аквариума", 200, 600)
        ],
        'rodents': [
            ("Корм для грызунов", 200, 700),
            ("Клетка для грызунов", 1200, 3500),
            ("Колесо беговое", 300, 900),
            ("Домик для грызунов", 400, 1200),
            ("Поилка для грызунов", 150, 400),
            ("Опилки", 150, 450)
        ]
    }
    
    for category in categories:
        items = product_names[category]
        for name_template, min_price, max_price in items:
            for _ in range(random.randint(2, 3)):
                base_price = random.randint(min_price, max_price)
                price = format_price_99(base_price)
                
                old_price = None
                discount = 0
                if random.random() > 0.7:
                    discount = random.choice([5, 10, 15, 20, 25])
                    old_price = format_price_99(int(price * (1 + discount/100)))
                
                is_popular = random.random() > 0.7
                is_new = random.random() > 0.8
                in_stock = random.random() > 0.2
                
                delivery_days = random.randint(1, 4)
                delivery_date = (datetime.now() + timedelta(days=delivery_days)).strftime('%d.%m')
                
                rating = round(random.uniform(3.5, 5.0), 1)
                
                site = random.choice(sites)
                
                brands = ['Royal Canin', 'Purina', 'Hills', 'Acana', 'Trixie', 'Ferplast']
                brand = random.choice(brands)
                
                products.append((
                    f"{name_template} {brand}",
                    price,
                    old_price,
                    f'https://via.placeholder.com/300x200/D32F2F/ffffff?text={category}',
                    category,
                    in_stock,
                    delivery_date,
                    rating,
                    site,
                    is_popular,
                    is_new,
                    discount
                ))
    
    cheap_products = [
        ("Лакомство маленькое", 99, None, 'https://via.placeholder.com/300x200/D32F2F/ffffff?text=treats', "dogs", True, "15.03", 4.0, "GoSi", False, False, 0),
        ("Мячик резиновый", 149, 199, 'https://via.placeholder.com/300x200/D32F2F/ffffff?text=ball', "dogs", True, "16.03", 4.2, "Ozon", True, False, 25),
        ("Колокольчик", 199, None, 'https://via.placeholder.com/300x200/D32F2F/ffffff?text=bell', "birds", True, "14.03", 4.5, "Wildberries", False, True, 0),
        ("Корм пробная упаковка", 249, 299, 'https://via.placeholder.com/300x200/D32F2F/ffffff?text=food', "cats", True, "15.03", 4.3, "GoSi", False, False, 17),
        ("Игрушка простая", 99, None, 'https://via.placeholder.com/300x200/D32F2F/ffffff?text=toy', "cats", True, "16.03", 4.1, "Ozon", False, True, 0)
    ]
    
    for p in cheap_products:
        products.append(p)
    
    random.shuffle(products)
    return products

@app.route('/')
def index():
    return send_from_directory('../frontend', 'index.html')

@app.route('/api/products')
def get_products():
    category = request.args.get('category', '')
    search = request.args.get('search', '')
    min_price = request.args.get('min_price', 0, type=int)
    max_price = request.args.get('max_price', 100000, type=int)
    
    db_path = os.path.join(os.path.dirname(__file__), 'database', 'products.db')
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        query = "SELECT * FROM products WHERE price >= ? AND price <= ?"
        params = [min_price, max_price]
        
        if category and category != 'all':
            query += " AND category = ?"
            params.append(category)
        
        if search:
            query += " AND name LIKE ?"
            params.append(f'%{search}%')
        
        query += " ORDER BY id DESC LIMIT 50"
        
        cursor.execute(query, params)
        products = cursor.fetchall()
        conn.close()
        
        products_list = []
        for p in products:
            products_list.append({
                'id': p[0],
                'name': p[1],
                'price': p[2],
                'old_price': p[3],
                'image_url': p[4],
                'category': p[5],
                'in_stock': bool(p[6]),
                'delivery_date': p[7],
                'rating': p[8],
                'site': p[9],
                'is_popular': bool(p[10]),
                'is_new': bool(p[11]),
                'discount': p[12] if len(p) > 12 else 0
            })
        
        return jsonify(products_list)
        
    except Exception as e:
        print(f"❌ Ошибка: {e}")
        return jsonify([])

@app.route('/api/products/<int:product_id>')
def get_product(product_id):
    db_path = os.path.join(os.path.dirname(__file__), 'database', 'products.db')
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM products WHERE id = ?", (product_id,))
        product = cursor.fetchone()
        conn.close()
        
        if product:
            return jsonify({
                'id': product[0],
                'name': product[1],
                'price': product[2],
                'old_price': product[3],
                'image_url': product[4],
                'category': product[5],
                'in_stock': bool(product[6]),
                'delivery_date': product[7],
                'rating': product[8],
                'site': product[9],
                'is_popular': bool(product[10]),
                'is_new': bool(product[11]),
                'discount': product[12] if len(product) > 12 else 0
            })
        
        return jsonify({'error': 'Товар не найден'}), 404
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/categories')
def get_categories():
    return jsonify([
        {'id': 'dogs', 'name': 'Собаки', 'icon': '🐕'},
        {'id': 'cats', 'name': 'Кошки', 'icon': '🐈'},
        {'id': 'birds', 'name': 'Птицы', 'icon': '🦜'},
        {'id': 'fish', 'name': 'Рыбки', 'icon': '🐠'},
        {'id': 'rodents', 'name': 'Грызуны', 'icon': '🐹'}
    ])

@app.route('/api/clear', methods=['POST'])
def clear_products():
    db_path = os.path.join(os.path.dirname(__file__), 'database', 'products.db')
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute("DELETE FROM products")
        
        test_products = generate_test_products()
        for p in test_products:
            cursor.execute('''
                INSERT INTO products 
                (name, price, old_price, image_url, category, in_stock, delivery_date, rating, site, is_popular, is_new, discount)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', p)
        
        conn.commit()
        conn.close()
        
        return jsonify({'message': f'Добавлено {len(test_products)} товаров'})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("=" * 50)
    print("🚀 GoSiMarket Server")
    print("=" * 50)
    
    count = init_db()
    
    if count > 0:
        print(f"✅ Сервер готов! Товаров в базе: {count}")
        print(f"🌐 Откройте http://localhost:5000")
    else:
        print("❌ Ошибка: не удалось создать товары")
    
    print("=" * 50)
    app.run(debug=False, port=5000)
