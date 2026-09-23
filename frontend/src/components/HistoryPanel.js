import { useState } from 'react';
import { History, Trash2, RefreshCw } from 'lucide-react';
import { readQueryHistory, clearQueryHistory } from '@/lib/queryHistory';

export default function HistoryPanel({ onReplay }) {
  const [items, setItems] = useState(readQueryHistory);
  const [notice, setNotice] = useState('');
  return <section className="space-y-4" data-testid="history-panel">
    <div className="flex items-center justify-between gap-3">
      <h2 className="font-heading font-semibold text-ink flex items-center gap-2"><History className="w-5 h-5" /> Recent queries</h2>
      <div className="flex gap-2">
        <button aria-label="Refresh query history" className="p-3" onClick={() => setItems(readQueryHistory())}><RefreshCw className="w-4 h-4" /></button>
        {items.length > 0 && <button aria-label="Clear history in this browser" className="p-3" onClick={() => {
          if (clearQueryHistory()) { setItems([]); setNotice('History cleared from this browser.'); }
          else setNotice('Browser storage is unavailable. History could not be cleared.');
        }}><Trash2 className="w-4 h-4" /></button>}
      </div>
    </div>
    <p className="text-sm text-quiet">Your last 30 queries stay in this browser for up to 90 days. Run one again to get current results.</p>
    <p role="status" className="text-sm text-quiet">{notice}</p>
    {items.length === 0 ? <p className="rounded-xl border border-line bg-surface p-8 text-quiet" data-testid="history-empty">No queries yet. Ask about a time or currency conversion to get started.</p> :
      <ul className="space-y-2">{items.map(item => <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface p-4">
        <div className="min-w-0"><p className="text-sm text-ink break-words">{item.query}</p><time className="text-xs text-quiet" dateTime={item.timestamp}>{new Date(item.timestamp).toLocaleString()}</time></div>
        <button className="btn-primary" onClick={() => onReplay?.(item.query)} aria-label={`Run again: ${item.query}`}>Run again</button>
      </li>)}</ul>}
  </section>;
}
