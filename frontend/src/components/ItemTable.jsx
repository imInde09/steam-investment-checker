import React, { useState } from 'react';

const ItemTable = ({ items }) => {
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'pl_amount', direction: 'desc' });

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
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
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
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <th onClick={() => handleSort('market_name')} style={{ padding: '1rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>Item Name ↕</th>
              <th onClick={() => handleSort('date')} style={{ padding: '1rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>Date ↕</th>
              <th onClick={() => handleSort('type')} style={{ padding: '1rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>Type ↕</th>
              <th onClick={() => handleSort('tx_price')} style={{ padding: '1rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>Tx Price ↕</th>
              <th onClick={() => handleSort('current_price')} style={{ padding: '1rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>Current Price ↕</th>
              <th onClick={() => handleSort('pl_amount')} style={{ padding: '1rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>P/L (₹) ↕</th>
              <th onClick={() => handleSort('pl_percent')} style={{ padding: '1rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>P/L (%) ↕</th>
            </tr>
          </thead>
          <tbody>
            {sortedItems.map((item, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: '500' }}>{item.market_name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.game_name}</div>
                </td>
                <td style={{ padding: '1rem' }}>{item.date}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase',
                    backgroundColor: item.type === 'purchase' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(168, 85, 247, 0.1)',
                    color: item.type === 'purchase' ? '#60a5fa' : '#c084fc'
                  }}>
                    {item.type}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>{formatCurrency(item.tx_price)}</td>
                <td style={{ padding: '1rem' }}>{formatCurrency(item.current_price)}</td>
                <td style={{ padding: '1rem' }}>
                  {item.pl_amount !== 0 ? (
                    <span style={{ 
                      padding: '0.25rem 0.5rem', borderRadius: '0.375rem', fontWeight: '500',
                      backgroundColor: item.pl_amount > 0 ? 'var(--success-bg)' : 'var(--danger-bg)',
                      color: item.pl_amount > 0 ? 'var(--success-color)' : 'var(--danger-color)'
                    }}>
                      {item.pl_amount > 0 ? '+' : '-'}{formatCurrency(item.pl_amount)}
                    </span>
                  ) : <span style={{ color: 'var(--text-secondary)' }}>₹0.00</span>}
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
