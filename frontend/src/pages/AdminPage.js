import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, Download, RefreshCw, ArrowLeft, Mail, Calendar } from "lucide-react";
import axios from "axios";
import SEOHead from "@/components/SEOHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

const API = (process.env.REACT_APP_BACKEND_URL && process.env.NODE_ENV !== "production") ? process.env.REACT_APP_BACKEND_URL : "";

function fmt(ts) {
  if (!ts) return "—";
  return new Date(ts).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

export default function AdminPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API}/api/users`);
      setData(res.data);
    } catch (e) {
      setError("Failed to load leads.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const exportCSV = () => {
    if (!data?.users?.length) return;
    const header = "Name,Email,Joined\n";
    const rows = data.users.map(u => `"${u.name || ""}","${u.email || ""}","${fmt(u.timestamp)}"`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "globalsync-leads.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-paper text-ink">
      <SEOHead title="Admin" description="GlobalSync AI internal administration panel and telemetry management console." canonical="/admin" noIndex={true} />
      <SiteNav />
      <main className="max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-quiet hover:text-zinc-300 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-heading text-2xl font-bold text-ink flex items-center gap-2">
                <Users className="w-6 h-6 text-pine" /> Lead Dashboard
              </h1>
              <p className="text-quiet text-sm mt-0.5">Collected user registrations</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={load}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface hover:bg-wash text-sm text-zinc-300 transition-colors"
              data-testid="admin-refresh-btn"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
            <button
              onClick={exportCSV}
              disabled={!data?.users?.length}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-pine text-paper font-bold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed text-sm transition-colors"
              data-testid="admin-export-btn"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
          </div>
        </div>

        {/* Stats */}
        {data && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-surface rounded-xl border border-zinc-800 p-5" data-testid="admin-total-count">
              <div className="text-3xl font-bold text-ink font-heading">{data.total}</div>
              <div className="text-quiet text-sm mt-1">Total Leads</div>
            </div>
            <div className="bg-surface rounded-xl border border-zinc-800 p-5">
              <div className="text-3xl font-bold text-pine font-heading">
                {data.users?.filter(u => {
                  const d = new Date(u.timestamp);
                  const now = new Date();
                  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                }).length ?? 0}
              </div>
              <div className="text-quiet text-sm mt-1">This Month</div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-surface rounded-2xl border border-zinc-800 overflow-hidden" data-testid="admin-leads-table">
          {loading && (
            <div className="p-12 text-center text-quiet">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-3 text-quiet" />
              Loading leads...
            </div>
          )}
          {error && (
            <div className="p-12 text-center text-red-800">{error}</div>
          )}
          {!loading && !error && data?.users?.length === 0 && (
            <div className="p-12 text-center text-quiet">
              <Mail className="w-8 h-8 mx-auto mb-3 text-zinc-700" />
              No leads collected yet.
            </div>
          )}
          {!loading && !error && data?.users?.length > 0 && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left px-5 py-3 text-quiet font-medium">Name</th>
                  <th className="text-left px-5 py-3 text-quiet font-medium">Email</th>
                  <th className="text-left px-5 py-3 text-quiet font-medium">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Joined</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.users.map((u, i) => (
                  <tr key={u.id || i} className="border-b border-zinc-800/50 hover:bg-surface/30 transition-colors" data-testid={`admin-lead-row-${i}`}>
                    <td className="px-5 py-3 text-zinc-200 font-medium">{u.name || <span className="text-quiet italic">—</span>}</td>
                    <td className="px-5 py-3 text-zinc-400">{u.email}</td>
                    <td className="px-5 py-3 text-quiet">{fmt(u.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
