import React, { useState } from 'react';
import {
  BarChart3,
  ExternalLink,
  ShieldCheck,
  Download,
  Trash2,
  Eye,
  X,
  Building2,
  TrendingUp,
  Users,
  Target,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { TelemetryPayload } from '../../types/pyrofit';
import { clearTelemetryEvents, getStoredTelemetryEvents } from '../../lib/telemetryLogger';
import { sqliteEngine } from '../../lib/sqliteEngine';

interface ManufacturerAnalyticsPortalProps {
  onClose?: () => void;
}

export const ManufacturerAnalyticsPortal: React.FC<ManufacturerAnalyticsPortalProps> = ({
  onClose,
}) => {
  const [events, setEvents] = useState<TelemetryPayload[]>(getStoredTelemetryEvents());
  const [inspectedEvent, setInspectedEvent] = useState<TelemetryPayload | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [csvNotice, setCsvNotice] = useState<string | null>(null);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const refreshEvents = () => {
    setEvents(getStoredTelemetryEvents());
  };

  const handleClear = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    clearTelemetryEvents();
    setEvents([]);
    setConfirmClear(false);
  };

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(events, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `pyrofit_b2b_telemetry_${Date.now()}.json`);
    dlAnchor.click();
  };

  const handleDownloadCSV = () => {
    const csv = sqliteEngine.exportTelemetryCSV();
    if (!csv) {
      setCsvNotice('No telemetry data to export yet. Record some product clicks first.');
      setTimeout(() => setCsvNotice(null), 4000);
      return;
    }
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pyrofit_telemetry_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Compute Brand Analytics
  const totalClicks = events.length;
  const brandCounts: Record<string, number> = {};
  const tierCounts: Record<string, number> = {};

  events.forEach((ev) => {
    const brand = ev.product_metadata.brand_name || 'Unknown';
    brandCounts[brand] = (brandCounts[brand] || 0) + 1;

    const tier = ev.product_metadata.tier || 'Unknown';
    tierCounts[tier] = (tierCounts[tier] || 0) + 1;
  });

  const sortedBrands = Object.entries(brandCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="bg-carbon border border-border p-6 md:p-8 space-y-7 shadow-2xl">
      {/* Portal Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-strava font-space text-[10px] tracking-[0.4em] uppercase font-bold">
            <Building2 className="w-4 h-4 text-strava" />
            PYROFIT B2B // TELEMETRY &amp; OUTBOUND REFERRAL ENGINE
          </div>
          <h2 className="italic-heavy text-3xl md:text-4xl text-fg mt-1">
            MANUFACTURER <span className="text-strava">LEAD INTELLIGENCE</span>
          </h2>
          <p className="text-muted text-xs font-light">
            Real-time telemetry event stream of high-intent endurance athlete referrals routed directly to official brand stores.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 border border-border bg-surface text-muted hover:text-fg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* CSV notice */}
      {csvNotice && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-space flex items-center gap-2">
          <span>ℹ</span> {csvNotice}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-surface border border-border">
          <div className="text-[10px] font-space text-faint uppercase">Total Outbound Referrals</div>
          <div className="text-3xl font-space font-black text-strava mt-1">{totalClicks}</div>
          <div className="text-[10px] font-space text-muted mt-1">100% Direct to Official Brand URLs</div>
        </div>

        <div className="p-5 bg-surface border border-border">
          <div className="text-[10px] font-space text-faint uppercase">Top Brand Referral Share</div>
          <div className="text-2xl font-space font-black text-fg mt-1">
            {sortedBrands[0] ? `${sortedBrands[0][0]} (${sortedBrands[0][1]})` : '—'}
          </div>
          <div className="text-[10px] font-space text-muted mt-1">
            {sortedBrands[0] && totalClicks ? `${Math.round((sortedBrands[0][1] / totalClicks) * 100)}% market capture` : 'No data'}
          </div>
        </div>

        <div className="p-5 bg-surface border border-border">
          <div className="text-[10px] font-space text-faint uppercase">Scientific Tier (L1) Share</div>
          <div className="text-3xl font-space font-black text-amber-400 mt-1">
            {tierCounts['L1'] || 0}
          </div>
          <div className="text-[10px] font-space text-muted mt-1">Premium Hydrogel / Pro Formula Clicks</div>
        </div>

        <div className="p-5 bg-surface border border-border">
          <div className="text-[10px] font-space text-faint uppercase">Zero Marketplace Leaks</div>
          <div className="text-3xl font-space font-black text-emerald-400 mt-1">100%</div>
          <div className="text-[10px] font-space text-muted mt-1">Direct official webstore navigation only</div>
        </div>
      </div>

      {/* Brand Share Breakdown */}
      <div className="p-4 bg-surface border border-border">
        <div className="text-xs font-space font-bold text-fg uppercase tracking-wider mb-3">
          Manufacturer Lead Distribution
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {['Maurten', 'Unived', 'Fast&Up', 'Enerzal'].map((brand) => {
            const count = brandCounts[brand] || 0;
            const pct = totalClicks ? Math.round((count / totalClicks) * 100) : 0;
            return (
              <div key={brand} className="p-3 bg-carbon border border-border flex justify-between items-center">
                <div>
                  <div className="italic-heavy text-base text-fg">{brand}</div>
                  <div className="text-[10px] font-space text-faint">{pct}% share</div>
                </div>
                <div className="text-xl font-space font-bold text-strava">{count}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Event Stream Table */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-space font-bold text-strava uppercase tracking-wider">
            Live Outbound Click Telemetry Stream ({events.length} Events)
          </div>
          <span className="text-[10px] font-space text-faint">
            Strict Schema Adherence: Section 5
          </span>
        </div>

        <div className="border border-border overflow-x-auto">
          <table className="w-full text-left text-xs font-space border-collapse">
            <thead>
              <tr className="bg-surface text-faint uppercase text-[10px] border-b border-border">
                <th className="p-3">Timestamp (UTC)</th>
                <th className="p-3">Brand &amp; Product</th>
                <th className="p-3">Tier</th>
                <th className="p-3">Workout Context</th>
                <th className="p-3">Calculated Targets</th>
                <th className="p-3 text-right">Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {events.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-muted font-light">
                    No outbound clicks logged yet. Click "Buy from Official Site" in Screen 2 to generate telemetry events.
                  </td>
                </tr>
              ) : (
                events.map((ev) => (
                  <tr key={ev.click_id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-3 text-faint whitespace-nowrap text-[11px]">
                      {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-fg">{ev.product_metadata.brand_name}</div>
                      <div className="text-[10px] text-muted">{ev.product_metadata.product_name}</div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 text-[9px] border border-border bg-surface font-bold text-strava">
                        {ev.product_metadata.tier}
                      </span>
                    </td>
                    <td className="p-3 text-muted text-[11px]">
                      {ev.workout_context.duration_mins}m · {ev.workout_context.intensity} · {ev.workout_context.temperature_celsius}°C
                    </td>
                    <td className="p-3 text-[11px]">
                      <span className="text-strava font-bold">{ev.calculated_targets.carbs_hourly_g}g/h</span> ·{' '}
                      <span className="text-amber-400">{ev.calculated_targets.sodium_hourly_mg}mg/h</span> ·{' '}
                      <span className="text-sky-400">{ev.calculated_targets.fluids_hourly_ml}ml/h</span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setInspectedEvent(ev)}
                        className="inline-flex items-center gap-1 text-[10px] font-space text-strava hover:underline px-2 py-1 bg-surface border border-border"
                      >
                        <Eye className="w-3 h-3" /> Inspect JSON
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Advanced / Export accordion */}
      <div className="border border-border mt-6">
        <button
          onClick={() => setAdvancedOpen(!advancedOpen)}
          className="w-full flex items-center justify-between px-4 py-3 text-xs font-space font-bold uppercase tracking-wider text-muted hover:text-fg transition-colors"
        >
          <span>Advanced / Export</span>
          {advancedOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {advancedOpen && (
          <div className="border-t border-border p-4 space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleDownloadJSON}
                className="px-3.5 py-2 border border-border bg-surface hover:text-fg text-muted text-xs font-space font-bold uppercase transition-colors flex items-center gap-1.5"
                title="Download full JSON dataset"
              >
                <Download className="w-3.5 h-3.5" /> Export JSON
              </button>
              <button
                onClick={handleDownloadCSV}
                className="px-3.5 py-2 border border-border bg-surface hover:text-emerald-400 text-emerald-400 text-xs font-space font-bold uppercase transition-colors flex items-center gap-1.5"
                title="Download telemetry as CSV"
              >
                <Download className="w-3.5 h-3.5" /> Export CSV
              </button>
              <button
                onClick={handleClear}
                className={`px-3 py-2 border text-xs font-space transition-colors flex items-center gap-1.5 ${
                  confirmClear
                    ? 'border-red-500 bg-red-500/10 text-red-400 font-bold'
                    : 'border-border bg-surface hover:text-red-400 text-faint'
                }`}
                title={confirmClear ? 'Click again to confirm clear' : 'Clear local logs'}
              >
                <Trash2 className="w-3.5 h-3.5" />
                {confirmClear ? 'Confirm?' : ''}
              </button>
              {confirmClear && (
                <button
                  onClick={() => setConfirmClear(false)}
                  className="px-2 py-2 border border-border text-faint hover:text-fg text-xs font-space transition-colors"
                  title="Cancel"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Raw JSON Inspection Modal */}
      {inspectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-carbon border border-border p-6 w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-border">
              <div className="italic-heavy text-lg text-fg">
                TELEMETRY EVENT PAYLOAD // {inspectedEvent.click_id}
              </div>
              <button
                onClick={() => setInspectedEvent(null)}
                className="text-muted hover:text-fg text-xs font-space"
              >
                ✕ Close
              </button>
            </div>
            <pre className="p-4 bg-surface text-strava text-xs font-mono overflow-auto flex-1 border border-border">
              {JSON.stringify(inspectedEvent, null, 2)}
            </pre>
            <div className="pt-3 mt-3 border-t border-border flex justify-between items-center text-[10px] font-space text-faint">
              <span>Section 5 JSON Telemetry Contract</span>
              <a
                href={inspectedEvent.product_metadata.official_target_url}
                target="_blank"
                rel="noreferrer"
                className="text-strava hover:underline flex items-center gap-1"
              >
                Direct Webstore Link <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
