import random
from datetime import datetime, timedelta
import json

def parse_products(site, category):
    """
    Расширенная функция для парсинга товаров для домашних питомцев
    """
    products = []
    

    categories = {
        'dogs': [
            {'name': 'Royal Canin Корм для собак (сухой)', 'base_price': 2500, 'brand': 'Royal Canin', 'subcategory': 'Корма'},
            {'name': 'Purina Pro Plan Корм для собак', 'base_price': 2800, 'brand': 'Purina', 'subcategory': 'Корма'},
            {'name': 'Acana Корм для щенков', 'base_price': 3500, 'brand': 'Acana', 'subcategory': 'Корма'},
            {'name': 'Игрушка-косточка Kong', 'base_price': 1200, 'brand': 'Kong', 'subcategory': 'Игрушки'},
            {'name': 'Поводок Flexi', 'base_price': 1800, 'brand': 'Flexi', 'subcategory': 'Амуниция'},
            {'name': 'Ошейник с LED подсветкой', 'base_price': 900, 'brand': 'Trixie', 'subcategory': 'Амуниция'},
            {'name': 'Лежанка анатомическая', 'base_price': 4500, 'brand': 'Ferplast', 'subcategory': 'Лежанки'},
            {'name': 'Миска двойная нержавейка', 'base_price': 850, 'brand': 'Trixie', 'subcategory': 'Миски'},
            {'name': 'Лакомства Pedigree Dentastix', 'base_price': 450, 'brand': 'Pedigree', 'subcategory': 'Лакомства'},
            {'name': 'Шампунь для длинношерстных', 'base_price': 650, 'brand': 'Beaphar', 'subcategory': 'Гигиена'}
        ],
        'cats': [
            {'name': 'Whiskas Корм для кошек', 'base_price': 800, 'brand': 'Whiskas', 'subcategory': 'Корма'},
            {'name': 'Royal Canin British Shorthair', 'base_price': 2200, 'brand': 'Royal Canin', 'subcategory': 'Корма'},
            {'name': 'Наполнитель Ever Clean', 'base_price': 1500, 'brand': 'Ever Clean', 'subcategory': 'Наполнители'},
            {'name': 'Игрушка-мышка на пружине', 'base_price': 350, 'brand': 'Trixie', 'subcategory': 'Игрушки'},
            {'name': 'Когтеточка-столбик', 'base_price': 2800, 'brand': 'Ferplast', 'subcategory': 'Когтеточки'},
            {'name': 'Домик-лежанка мягкий', 'base_price': 3200, 'brand': 'Trixie', 'subcategory': 'Домики'},
            {'name': 'Миска керамическая', 'base_price': 550, 'brand': 'Ferplast', 'subcategory': 'Миски'},
            {'name': 'Лакомства Dreamies', 'base_price': 280, 'brand': 'Dreamies', 'subcategory': 'Лакомства'}
        ],
        'birds': [
            {'name': 'Корм Fiory для попугаев', 'base_price': 650, 'brand': 'Fiory', 'subcategory': 'Корма'},
            {'name': 'Клетка для волнистых', 'base_price': 3800, 'brand': 'Ferplast', 'subcategory': 'Клетки'},
            {'name': 'Игрушка-колокольчик', 'base_price': 420, 'brand': 'Trixie', 'subcategory': 'Игрушки'},
            {'name': 'Купалка навесная', 'base_price': 580, 'brand': 'Ferplast', 'subcategory': 'Купалки'},
            {'name': 'Кормушка автоматическая', 'base_price': 750, 'brand': 'Trixie', 'subcategory': 'Кормушки'}
        ],
        'fish': [
            {'name': 'Аквариум Tetra 20л', 'base_price': 3500, 'brand': 'Tetra', 'subcategory': 'Аквариумы'},
            {'name': 'Аквариум Aquael 50л', 'base_price': 6500, 'brand': 'Aquael', 'subcategory': 'Аквариумы'},
            {'name': 'Корм TetraMin', 'base_price': 450, 'brand': 'Tetra', 'subcategory': 'Корма'},
            {'name': 'Фильтр внутренний Aquael', 'base_price': 2400, 'brand': 'Aquael', 'subcategory': 'Фильтры'},
            {'name': 'Обогреватель Tetra 50W', 'base_price': 1800, 'brand': 'Tetra', 'subcategory': 'Обогреватели'},
            {'name': 'Лампа светодиодная', 'base_price': 2100, 'brand': 'Aquael', 'subcategory': 'Освещение'}
        ],
        'rodents': [
            {'name': 'Клетка Ferplast для хомяка', 'base_price': 2800, 'brand': 'Ferplast', 'subcategory': 'Клетки'},
            {'name': 'Корм Little One', 'base_price': 350, 'brand': 'Little One', 'subcategory': 'Корма'},
            {'name': 'Опилки прессованные', 'base_price': 280, 'brand': 'Little One', 'subcategory': 'Наполнители'},
            {'name': 'Колесо беговое', 'base_price': 650, 'brand': 'Trixie', 'subcategory': 'Игрушки'},
            {'name': 'Домик деревянный', 'base_price': 550, 'brand': 'Ferplast', 'subcategory': 'Домики'}
        ],
        'toys': [
            {'name': 'Интерактивный мяч для собак', 'base_price': 890, 'brand': 'Kong', 'subcategory': 'Для собак'},
            {'name': 'Удочка с перьями', 'base_price': 450, 'brand': 'Trixie', 'subcategory': 'Для кошек'},
            {'name': 'Лазерная указка USB', 'base_price': 650, 'brand': 'Petsafe', 'subcategory': 'Для кошек'},
            {'name': 'Канат для перетягивания', 'base_price': 390, 'brand': 'Kong', 'subcategory': 'Для собак'}
        ],
        'care': [
            {'name': 'Шампунь для кошек 4 в 1', 'base_price': 580, 'brand': 'Beaphar', 'subcategory': 'Шампуни'},
            {'name': 'Расческа-пуходерка', 'base_price': 620, 'brand': 'Trixie', 'subcategory': 'Расчески'},
            {'name': 'Когтерезка гильотинная', 'base_price': 750, 'brand': 'Ferplast', 'subcategory': 'Когтерезки'},
            {'name': 'Зубная паста для собак', 'base_price': 480, 'brand': 'Beaphar', 'subcategory': 'Зубные пасты'}
        ]
    }
    

    sites = {
        'ozon': 'Ozon',
        'wildberries': 'Wildberries',
        'yandex': 'Яндекс.Маркет',
        'petshop': 'Petshop.ru',
        'zoozavr': 'Зоозавр',
        'all': random.choice(['Ozon', 'Wildberries', 'Яндекс.Маркет', 'Petshop.ru', 'Зоозавр', 'Четыре Лапы'])
    }
    

    items = categories.get(category, categories['dogs'])
    

    for i, item in enumerate(items):

        for variant in range(random.randint(1, 3)):

            price = item['base_price'] * random.uniform(0.9, 1.2)
            price = round(price / 10) * 10
            

            discount = 0
            old_price = None
            if random.random() > 0.6:
                discount = random.choice([5, 10, 15, 20, 25, 30])
                old_price = price * (1 + discount/100)
                old_price = round(old_price / 10) * 10
                price = int(price)
                old_price = int(old_price)

            delivery_days = random.randint(1, 5)
            delivery_date = (datetime.now() + timedelta(days=delivery_days)).strftime('%d.%m')
            

            variants = ['', 'Премиум', 'Эконом', 'Большая упаковка', 'Малая упаковка', 'Новинка', 'Хит']
            variant_text = random.choice(variants)
            name = f"{item['name']} {variant_text}".strip()
            

            in_stock = random.random() > 0.1
            

            rating = round(random.uniform(3.8, 5.0), 1)
            reviews_count = random.randint(10, 1000)

            site_name = sites.get(site, site)
            if site == 'all':
                site_name = random.choice(['Ozon', 'Wildberries', 'Petshop.ru', 'Зоозавр'])
            

            emoji_map = {
                'dogs': '🐕',
                'cats': '🐈',
                'birds': '🦜',
                'fish': '🐠',
                'rodents': '🐹',
                'toys': '🧸',
                'care': '🧴'
            }
            emoji = emoji_map.get(category, '🐾')
            

            descriptions = [
                f'Высококачественный {name.lower()} для вашего питомца. Изготовлен из безопасных материалов.',
                f'Премиум {name.lower()}. Рекомендовано ветеринарами.',
                f'{name} - лучший выбор для заботливых хозяев. Гипоаллергенно.',
                f'Популярный {name.lower()} с отличными отзывами. Быстрая доставка.'
            ]
            

            specifications = {
                'Бренд': item['brand'],
                'Страна': random.choice(['Россия', 'Германия', 'США', 'Франция']),
                'Вес упаковки': f'{random.choice([0.5, 1, 2, 3, 5, 10])} кг',
                'Срок годности': '24 месяца',
                'Тип': item.get('subcategory', 'Основной')
            }
            
            products.append({
                'name': name,
                'price': int(price) if isinstance(price, float) else price,
                'old_price': old_price,
                'image_url': f'https://via.placeholder.com/300x200/8B4513/ffffff?text={emoji}+{item["brand"]}',
                'category': category,
                'subcategory': item.get('subcategory', ''),
                'in_stock': in_stock,
                'delivery_date': delivery_date,
                'rating': rating,
                'reviews_count': reviews_count,
                'site': site_name,
                'is_popular': random.random() > 0.7,
                'is_new': random.random() > 0.8,
                'discount': discount,
                'brand': item['brand'],
                'description': random.choice(descriptions),
                'specifications': specifications
            })
    
    random.shuffle(products)
    return products
