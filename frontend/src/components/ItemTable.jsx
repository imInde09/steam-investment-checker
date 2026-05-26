import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

const ItemTable = ({ items }) => {
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'pl_amount', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortConfig]);

  const formatCurrency = (val) => '₹' + Math.abs(val).toFixed(2);

  const handleSort = (key) => {
    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const filteredItems = items.filter(item => 
    item.market_name.toLowerCase().includes(search.toLowerCase()) ||
    item.game_name.toLowerCase().includes(search.toLowerCase())
  );

  const sortedItems = [...filteredItems].sort((a, b) => {
    let aVal = a[sortConfig.key];
    let bVal = b[sortConfig.key];
    
    // Handle null values
    if (aVal === null) aVal = -Infinity;
    if (bVal === null) bVal = -Infinity;
    
    if (aVal < bVal) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aVal > bVal) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(sortedItems.length / itemsPerPage));
  const paginatedItems = sortedItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <input 
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%', maxWidth: '400px', padding: '0.75rem 1rem', borderRadius: '0.5rem',
            backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)',
            color: 'white', outline: 'none'
          }}
        />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)' }}>
          <span style={{ fontSize: '0.875rem' }}>
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedItems.length)} of {sortedItems.length}
          </span>
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{
                background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '0.25rem',
                color: currentPage === 1 ? 'var(--border-color)' : 'var(--text-primary)', padding: '0.25rem', cursor: currentPage === 1 ? 'default' : 'pointer'
              }}
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={{
                background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '0.25rem',
                color: currentPage === totalPages ? 'var(--border-color)' : 'var(--text-primary)', padding: '0.25rem', cursor: currentPage === totalPages ? 'default' : 'pointer'
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Qty</th>
              <th onClick={() => handleSort('market_name')} style={{ padding: '1rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>Item Name ↕</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Buy Date</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Sell Date</th>
              <th onClick={() => handleSort('type')} style={{ padding: '1rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>Status ↕</th>
              <th onClick={() => handleSort('buy_price')} style={{ padding: '1rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>Buy Price ↕</th>
              <th onClick={() => handleSort('sell_price')} style={{ padding: '1rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>Sell Price ↕</th>
              <th onClick={() => handleSort('current_price')} style={{ padding: '1rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>Current ↕</th>
              <th onClick={() => handleSort('margin')} style={{ padding: '1rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>Margin (₹) ↕</th>
              <th onClick={() => handleSort('pl_percent')} style={{ padding: '1rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>P/L (%) ↕</th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.map((item, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem', fontWeight: '600' }}>{item.qty}x</td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div>
                      <div style={{ fontWeight: '500' }}>{item.market_name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.game_name}</div>
                    </div>
                    <a 
                      href={`https://steamcommunity.com/market/listings/${item.app_id}/${encodeURIComponent(item.market_name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'var(--text-secondary)', transition: 'color 0.2s', display: 'flex' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-color)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                      title="View on Steam Market"
                    >
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>{item.buy_date || 'N/A'}</td>
                <td style={{ padding: '1rem' }}>{item.sell_date || 'N/A'}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase',
                    backgroundColor: item.type === 'matched' ? 'rgba(34, 197, 94, 0.1)' : (item.type === 'purchase_only' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(168, 85, 247, 0.1)'),
                    color: item.type === 'matched' ? '#22c55e' : (item.type === 'purchase_only' ? '#60a5fa' : '#c084fc')
                  }}>
                    {item.type.replace('_', ' ')}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>{item.buy_price !== null ? formatCurrency(item.buy_price) : 'N/A'}</td>
                <td style={{ padding: '1rem' }}>{item.sell_price !== null ? formatCurrency(item.sell_price) : 'N/A'}</td>
                <td style={{ padding: '1rem' }}>{formatCurrency(item.current_price)}</td>
                <td style={{ padding: '1rem' }}>
                  {item.margin !== null ? (
                    item.margin !== 0 ? (
                      <span style={{ 
                        padding: '0.25rem 0.5rem', borderRadius: '0.375rem', fontWeight: '500',
                        backgroundColor: item.margin > 0 ? 'var(--success-bg)' : 'var(--danger-bg)',
                        color: item.margin > 0 ? 'var(--success-color)' : 'var(--danger-color)'
                      }}>
                        {item.margin > 0 ? '+' : '-'}{formatCurrency(item.margin)}
                      </span>
                    ) : <span style={{ color: 'var(--text-secondary)' }}>₹0.00</span>
                  ) : 'N/A'}
                </td>
                <td style={{ padding: '1rem' }}>
                  {item.pl_percent !== 0 ? (
                    <span style={{ 
                      padding: '0.25rem 0.5rem', borderRadius: '0.375rem', fontWeight: '500',
                      backgroundColor: item.pl_percent > 0 ? 'var(--success-bg)' : 'var(--danger-bg)',
                      color: item.pl_percent > 0 ? 'var(--success-color)' : 'var(--danger-color)'
                    }}>
                      {item.pl_percent > 0 ? '+' : '-'}{Math.abs(item.pl_percent).toFixed(2)}%
                    </span>
                  ) : <span style={{ color: 'var(--text-secondary)' }}>0.00%</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ItemTable;
