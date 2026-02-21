import requests
from bs4 import BeautifulSoup
import random

class OzonParser:
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        self.base_url = 'https://www.ozon.ru'
    
    def search_products(self, query):
        try:
            url = f"{self.base_url}/search/?text={query}"
            response = requests.get(url, headers=self.headers)
            soup = BeautifulSoup(response.text, 'html.parser')
            
            products = []
            items = soup.find_all('div', class_='tile')[:10]
            
            for item in items:
                name = item.find('span', class_='title')
                price = item.find('span', class_='price')
                if name and price:
                    products.append({
                        'name': name.text.strip(),
                        'price': self.parse_price(price.text),
                        'site': 'Ozon'
                    })
            
            return products
        except Exception as e:
            print(f"Ozon parser error: {e}")
            return []
    
    def parse_price(self, price_text):
        digits = ''.join(filter(str.isdigit, price_text))
        return int(digits) if digits else 0