import csv
import io

def parse_csv_content(content: str):
    """
    Parses the Steam Market history CSV string content.
    Returns a list of transaction dictionaries.
    """
    transactions = []
    
    # Use io.StringIO to parse the string content as a CSV file
    f = io.StringIO(content)
    reader = csv.DictReader(f)
    for row in reader:
        # Strip spaces from keys
        row = {k.strip() if k else k: v for k, v in row.items()}
        try:
            item_name = row.get('Item Name', '').strip()
            game_name = row.get('Game Name', '').strip()
            date = row.get('Acted On', row.get('Listed On', '')).strip()
            tx_type = row.get('Type', '').strip().lower()
            market_name = row.get('Market Name', '').strip()
            app_id = row.get('App Id', '').strip()
            
            if not market_name or not app_id:
                continue
                
            price_cents_str = row.get('Price in Cents', '0').strip()
            if not price_cents_str.isdigit():
                continue
            price = int(price_cents_str) / 100.0
            
            transactions.append({
                'item_name': item_name,
                'game_name': game_name,
                'date': date,
                'type': tx_type,
                'market_name': market_name,
                'app_id': app_id,
                'price': price
            })
        except Exception:
            continue
            
    return transactions
