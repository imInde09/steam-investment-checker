from typing import List, Dict, Any, Tuple

def analyze_data(transactions: List[Dict[str, Any]], prices: Dict[Tuple[str, str], float]):
    """
    Calculates P/L per item, matching buys and sells.
    """
    results = []
    total_spent = 0.0
    total_earned = 0.0
    overall_pl = 0.0

    from collections import defaultdict
    groups = defaultdict(lambda: {'purchases': [], 'sales': []})

    for tx in transactions:
        app_id = tx['app_id']
        market_name = tx['market_name']
        if tx['type'] == 'purchase':
            groups[(app_id, market_name)]['purchases'].append(tx)
        elif tx['type'] == 'sale':
            groups[(app_id, market_name)]['sales'].append(tx)

    for (app_id, market_name), txs in groups.items():
        # Sort chronologically (oldest first if date format allows, assuming string sort is okay for now, or just leave as is since CSV is usually reverse chronological, so reverse it)
        purchases = txs['purchases'][::-1] # assuming CSV is newest first
        sales = txs['sales'][::-1]
        
        current_price = prices.get((app_id, market_name), 0.0)
        
        while purchases or sales:
            if purchases and sales:
                p = purchases.pop(0)
                s = sales.pop(0)
                total_spent += p['price']
                total_earned += s['price']
                margin = s['price'] - p['price']
                overall_pl += margin
                
                pl_percent = (margin / p['price']) * 100 if p['price'] > 0 else 0.0
                
                results.append({
                    'item_name': p['item_name'],
                    'market_name': market_name,
                    'app_id': app_id,
                    'game_name': p['game_name'],
                    'type': 'matched',
                    'buy_date': p['date'],
                    'sell_date': s['date'],
                    'buy_price': p['price'],
                    'sell_price': s['price'],
                    'margin': margin,
                    'current_price': current_price,
                    'pl_amount': margin,
                    'pl_percent': pl_percent,
                })
            elif purchases:
                p = purchases.pop(0)
                total_spent += p['price']
                pl_amount = current_price - p['price']
                overall_pl += pl_amount
                pl_percent = (pl_amount / p['price']) * 100 if p['price'] > 0 else 0.0
                
                results.append({
                    'item_name': p['item_name'],
                    'market_name': market_name,
                    'app_id': app_id,
                    'game_name': p['game_name'],
                    'type': 'purchase_only',
                    'buy_date': p['date'],
                    'sell_date': None,
                    'buy_price': p['price'],
                    'sell_price': None,
                    'margin': None,
                    'current_price': current_price,
                    'pl_amount': pl_amount,
                    'pl_percent': pl_percent,
                })
            elif sales:
                s = sales.pop(0)
                total_earned += s['price']
                
                results.append({
                    'item_name': s['item_name'],
                    'market_name': market_name,
                    'app_id': app_id,
                    'game_name': s['game_name'],
                    'type': 'sale_only',
                    'buy_date': None,
                    'sell_date': s['date'],
                    'buy_price': None,
                    'sell_price': s['price'],
                    'margin': None,
                    'current_price': current_price,
                    'pl_amount': 0.0,
                    'pl_percent': 0.0,
                })

    aggregated_results = {}
    for r in results:
        key = (
            r['market_name'], 
            r['type'], 
            r['buy_date'], 
            r['sell_date'], 
            r['buy_price'], 
            r['sell_price']
        )
        if key in aggregated_results:
            agg = aggregated_results[key]
            agg['qty'] += 1
            if r['margin'] is not None:
                agg['margin'] += r['margin']
            agg['pl_amount'] += r['pl_amount']
        else:
            r['qty'] = 1
            aggregated_results[key] = r

    final_results = list(aggregated_results.values())

    summary = {
        'total_spent': total_spent,
        'total_earned': total_earned,
        'overall_pl': overall_pl,
        'total_transactions': sum(r['qty'] for r in final_results)
    }
    
    return final_results, summary
