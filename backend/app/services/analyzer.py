from typing import List, Dict, Any, Tuple

def analyze_data(transactions: List[Dict[str, Any]], prices: Dict[Tuple[str, str], float]):
    """
    Calculates P/L per item and overall totals.
    """
    results = []
    
    total_spent = 0.0
    total_earned = 0.0
    
    for tx in transactions:
        app_id = tx['app_id']
        market_name = tx['market_name']
        tx_price = tx['price']
        tx_type = tx['type']
        
        current_price = prices.get((app_id, market_name), 0.0)
        
        if tx_type == 'purchase':
            total_spent += tx_price
            pl_amount = current_price - tx_price
        elif tx_type == 'sale':
            total_earned += tx_price
            pl_amount = tx_price - current_price
        else:
            pl_amount = 0.0
            
        if tx_price > 0:
            pl_percent = (pl_amount / tx_price) * 100
        else:
            pl_percent = 0.0
            
        results.append({
            'item_name': tx['item_name'],
            'market_name': market_name,
            'app_id': app_id,
            'game_name': tx['game_name'],
            'date': tx['date'],
            'type': tx_type,
            'tx_price': tx_price,
            'current_price': current_price,
            'pl_amount': pl_amount,
            'pl_percent': pl_percent,
        })
        
    overall_pl = sum(item['pl_amount'] for item in results)
    
    summary = {
        'total_spent': total_spent,
        'total_earned': total_earned,
        'overall_pl': overall_pl,
        'total_transactions': len(results)
    }
    
    return results, summary
