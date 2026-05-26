import asyncio
import requests
import urllib.parse
from typing import Set, Tuple, Dict

# In-memory progress tracking
job_progress = {}

async def fetch_prices_async(job_id: str, unique_items: Set[Tuple[str, str]]) -> Dict[Tuple[str, str], float]:
    prices = {}
    total = len(unique_items)
    
    if job_id in job_progress:
        job_progress[job_id].update({
            "status": "processing",
            "total": total,
            "fetched": 0,
            "prices": prices,
            "error": None
        })
    else:
        job_progress[job_id] = {
            "status": "processing",
            "total": total,
            "fetched": 0,
            "prices": prices,
            "error": None
        }
    
    for i, (app_id, market_name) in enumerate(unique_items):
        encoded_name = urllib.parse.quote(market_name)
        url = f"https://steamcommunity.com/market/priceoverview/?appid={app_id}&currency=24&market_hash_name={encoded_name}"
        
        success = False
        retries = 3
        while not success and retries > 0:
            try:
                # Run sync request in a thread pool so we don't block the event loop
                response = await asyncio.to_thread(requests.get, url, timeout=10)
                
                if response.status_code == 200:
                    data = response.json()
                    if data.get('success'):
                        price_str = data.get('lowest_price', '0')
                        clean_price_str = price_str.replace('₹', '').replace(',', '').strip()
                        try:
                            prices[(app_id, market_name)] = float(clean_price_str)
                        except ValueError:
                            prices[(app_id, market_name)] = 0.0
                    else:
                        prices[(app_id, market_name)] = 0.0
                    success = True
                elif response.status_code == 429:
                    await asyncio.sleep(10)
                    retries -= 1
                else:
                    prices[(app_id, market_name)] = 0.0
                    success = True
            except Exception:
                retries -= 1
                await asyncio.sleep(2)
                
            if success:
                # Wait before next item to respect rate limit
                await asyncio.sleep(3.5)
                
        # Update progress
        job_progress[job_id]["fetched"] = i + 1
        
    job_progress[job_id]["status"] = "completed"
    return prices
