import React, { useState, useRef } from 'react';
import {
  Database,
  Play,
  RefreshCw,
  Download,
  X,
  Table2,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { sqliteEngine, SQLQueryResult } from '../../lib/sqliteEngine';

const SAMPLE_QUERIES: { label: string; query: string }[] = [
  { label: 'Show all tables', query: 'SHOW TABLES' },
  { label: 'All telemetry events', query: 'SELECT * FROM telemetry_events LIMIT 20' },
  { label: 'Events by brand', query: 'SELECT brand_name, click_count FROM telemetry_events GROUP BY brand_name' },
  { label: 'Premium tier events', query: "SELECT * FROM telemetry_events WHERE tier = 'L1'" },
  { label: 'Hot weather events', query: 'SELECT * FROM telemetry_events WHERE temperature_celsius > 30' },
  { label: 'All products', query: 'SELECT * FROM products' },
  { label: 'Products by tier', query: 'SELECT id, brand, name, tier, price_inr FROM products ORDER BY tier' },
  { label: 'Athlete profiles', query: 'SELECT * FROM athlete_profiles' },
  { label: 'Feedback logs', query: 'SELECT * FROM feedback_logs' },
  { label: 'Product schema', query: 'PRAGMA table_info(products)' },
  { label: 'Telemetry schema', query: 'PRAGMA table_info(telemetry_events)' },
];

interface SQLiteTerminalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SQLiteTerminal: React.FC<SQLiteTerminalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('SELECT * FROM telemetry_events LIMIT 10');
  const [result, setResult] = useState<SQLQueryResult | null>(null);
  const [history, setHistory] = useState<{ query: string; rowCount: number; timeMs: number; error?: string }[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const runQuery = () => {
    const q = query.trim();
    if (!q) return;
    const res = sqliteEngine.executeSQL(q);
    setResult(res);
    setHistory((h) => [
      { query: q, rowCount: res.rowCount, timeMs: res.executionTimeMs, error: res.error },
      ...h.slice(0, 19),
    ]);
    setHistoryIdx(-1);
  };

  const loadHistory = (idx: number) => {
    setHistoryIdx(idx);
    setQuery(history[idx]?.query || query);
  };

  const exportDump = () => {
    const dump = sqliteEngine.exportSQLDump();
    const blob = new Blob([dump], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pyrofit_db_${Date.now()}.sql`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      runQuery();
    }
    if (e.key === 'ArrowUp' && e.ctrlKey && history.length > 0) {
      e.preventDefault();
      const nextIdx = Math.min(historyIdx + 1, history.length - 1);
      loadHistory(nextIdx);
    }
    if (e.key === 'ArrowDown' && e.ctrlKey && historyIdx > 0) {
      e.preventDefault();
      const nextIdx = historyIdx - 1;
      loadHistory(nextIdx);
    }
  };

  const tableNames = sqliteEngine.getTableNames();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/70 pointer-events-auto" onClick={onClose} />
      <div className="relative w-full max-w-4xl bg-bg border border-border shadow-2xl pointer-events-auto max-h-[90vh] flex flex-col mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-carbon flex-shrink-0">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-strava" />
            <div>
              <div className="text-fg text-xs font-space font-bold uppercase tracking-wider">Pyrofit SQLite Terminal</div>
              <div className="text-faint text-[10px]">
                {tableNames.length} tables ·{' '}
                {tableNames.map((t) => `${t}: ${sqliteEngine.getTableRowCount(t)} rows`).join(' · ')}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportDump}
              className="px-2 py-1.5 border border-border text-muted hover:text-fg text-[10px] font-space uppercase flex items-center gap-1 transition-colors"
            >
              <Download className="w-3 h-3" />
              Export .sql
            </button>
            <button
              onClick={() => { sqliteEngine.resetToDefaults(); setResult(null); setHistory([]); }}
              className="px-2 py-1.5 border border-border text-muted hover:text-fg text-[10px] font-space uppercase flex items-center gap-1 transition-colors"
              title="Reset to seed data"
            >
              <RefreshCw className="w-3 h-3" />
              Reset
            </button>
            <button onClick={onClose} className="text-muted hover:text-fg transition-colors p-1 ml-1">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden min-h-0">
          {/* Sidebar: Tables + Sample Queries */}
          <div className="w-48 border-r border-border flex flex-col flex-shrink-0 overflow-hidden">
            {/* Tables */}
            <div className="p-2 border-b border-border">
              <div className="text-[9px] font-space uppercase tracking-wider text-faint mb-1.5 font-bold">Tables</div>
              {tableNames.map((t) => (
                <button
                  key={t}
                  onClick={() => setQuery(`SELECT * FROM ${t} LIMIT 10`)}
                  className="w-full text-left px-2 py-1 flex items-center gap-1.5 text-[11px] text-muted hover:text-fg hover:bg-surface transition-colors rounded-sm"
                >
                  <Table2 className="w-3 h-3 text-strava/60 flex-shrink-0" />
                  <span className="truncate">{t}</span>
                  <span className="ml-auto text-[9px] text-faint">{sqliteEngine.getTableRowCount(t)}</span>
                </button>
              ))}
            </div>

            {/* Sample Queries */}
            <div className="flex-1 overflow-y-auto p-2">
              <div className="text-[9px] font-space uppercase tracking-wider text-faint mb-1.5 font-bold">Samples</div>
              {SAMPLE_QUERIES.map((sq, i) => (
                <button
                  key={i}
                  onClick={() => setQuery(sq.query)}
                  className="w-full text-left px-2 py-1 flex items-center gap-1 text-[10px] text-muted hover:text-fg hover:bg-surface transition-colors mb-0.5"
                >
                  <ChevronRight className="w-2.5 h-2.5 text-strava/60 flex-shrink-0" />
                  <span className="truncate">{sq.label}</span>
                </button>
              ))}
            </div>

            {/* Query History */}
            {history.length > 0 && (
              <div className="p-2 border-t border-border">
                <div className="text-[9px] font-space uppercase tracking-wider text-faint mb-1.5 font-bold">History</div>
                {history.slice(0, 5).map((h, i) => (
                  <button
                    key={i}
                    onClick={() => { setQuery(h.query); setHistoryIdx(i); }}
                    className="w-full text-left px-2 py-1 text-[10px] text-muted hover:text-fg hover:bg-surface transition-colors mb-0.5 truncate"
                    title={h.query}
                  >
                    {h.query.slice(0, 25)}...
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Main: Editor + Results */}
          <div className="flex-1 flex flex-col overflow-hidden min-w-0">
            {/* Query Editor */}
            <div className="p-3 border-b border-border flex-shrink-0 bg-carbon">
              <textarea
                ref={textareaRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={3}
                placeholder="SELECT * FROM telemetry_events LIMIT 10"
                className="w-full bg-bg border border-border px-3 py-2 text-[12px] text-fg font-mono resize-none focus:outline-none focus:border-strava/60 placeholder:text-faint"
                spellCheck={false}
              />
              <div className="flex items-center justify-between mt-2">
                <div className="text-[10px] text-faint font-space">
                  Ctrl+Enter to run · Ctrl+↑↓ to navigate history
                </div>
                <button
                  onClick={runQuery}
                  className="px-4 py-1.5 bg-strava text-on-brand text-[11px] font-space font-bold uppercase hover:bg-strava/90 flex items-center gap-1.5 transition-all"
                >
                  <Play className="w-3 h-3" />
                  Run Query
                </button>
              </div>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-auto min-h-0">
              {!result && (
                <div className="p-6 text-center text-muted text-xs font-space">
                  <Database className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  Run a query to see results.
                </div>
              )}

              {result && (
                <div>
                  {/* Result meta bar */}
                  <div className={`px-3 py-2 flex items-center gap-3 text-[11px] font-space border-b border-border flex-shrink-0 ${result.error ? 'bg-red-500/5' : 'bg-emerald-500/5'}`}>
                    {result.error ? (
                      <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                    ) : (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    )}
                    {result.error ? (
                      <span className="text-red-400 font-bold">{result.error}</span>
                    ) : (
                      <span className="text-emerald-400 font-bold">
                        {result.rowCount} row{result.rowCount !== 1 ? 's' : ''} returned
                      </span>
                    )}
                    <div className="flex items-center gap-1 text-faint ml-auto">
                      <Clock className="w-3 h-3" />
                      {result.executionTimeMs}ms
                    </div>
                  </div>

                  {/* Table */}
                  {!result.error && result.rows.length > 0 && (
                    <div className="overflow-auto">
                      <table className="w-full text-[11px] font-mono border-collapse">
                        <thead className="sticky top-0 bg-carbon border-b border-border">
                          <tr>
                            {result.columns.map((col) => (
                              <th
                                key={col}
                                className="px-3 py-2 text-left text-[10px] font-space uppercase tracking-wider text-strava border-r border-border last:border-r-0 whitespace-nowrap"
                              >
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {result.rows.map((row, ri) => (
                            <tr key={ri} className="border-b border-border/50 hover:bg-surface transition-colors">
                              {row.map((cell, ci) => (
                                <td
                                  key={ci}
                                  className="px-3 py-1.5 text-fg border-r border-border/30 last:border-r-0 max-w-xs overflow-hidden"
                                  title={String(cell ?? 'NULL')}
                                >
                                  {cell === null || cell === undefined ? (
                                    <span className="text-faint italic">NULL</span>
                                  ) : typeof cell === 'number' ? (
                                    <span className="text-sky-400">{cell}</span>
                                  ) : String(cell).startsWith('http') ? (
                                    <a
                                      href={String(cell)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-strava underline-offset-2 underline truncate block max-w-[200px]"
                                    >
                                      {String(cell).slice(0, 40)}…
                                    </a>
                                  ) : (
                                    <span className="text-fg truncate block max-w-[200px]" title={String(cell)}>
                                      {String(cell)}
                                    </span>
                                  )}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {!result.error && result.rows.length === 0 && (
                    <div className="p-6 text-center text-muted text-xs font-space">
                      Query returned 0 rows.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
