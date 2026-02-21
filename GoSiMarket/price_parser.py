import requests
from bs4 import BeautifulSoup
import re

class PriceParser:
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
    
    def parse_price(self, url):
        try:
            response = requests.get(url, headers=self.headers)
            soup = BeautifulSoup(response.text, 'html.parser')
            
            price_element = soup.find('span', class_='price')
            
            if price_element:
                price_text = price_element.text
                price = re.sub(r'[^\d.]', '', price_text)
                return float(price)
            
            return None
        except Exception as e:
            print(f"Error parsing price: {e}")
            return None