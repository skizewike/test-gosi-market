import requests
import json

class WildberriesParser:
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        self.base_url = 'https://www.wildberries.ru'
    
    def search_products(self, query):
        try:
            url = f"https://search.wb.ru/exactmatch/ru/common/v4/search?query={query}"
            response = requests.get(url, headers=self.headers)
            data = response.json()
            
            products = []
            for item in data.get('data', {}).get('products', [])[:10]:
                products.append({
                    'name': item.get('name', ''),
                    'price': item.get('salePriceU', 0) // 100,
                    'site': 'Wildberries'
                })
            
            return products
        except Exception as e:
            print(f"Wildberries parser error: {e}")
            return []