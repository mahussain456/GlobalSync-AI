import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, Download, RefreshCw, ArrowLeft, Mail, Calendar } from "lucide-react";
import axios from "axios";
import SEOHead from "@/components/SEOHead";

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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <SEOHead title="Admin" description="Admin panel." canonical="/admin" noIndex={true} />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-gem-sage hover:text-zinc-300 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-heading text-2xl font-bold text-gem-beige flex items-center gap-2">
                <Users className="w-6 h-6 text-gem-gold" /> Lead Dashboard
              </h1>
              <p className="text-gem-sage text-sm mt-0.5">Collected user registrations</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={load}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-zinc-700 text-sm text-zinc-300 transition-colors"
              data-testid="admin-refresh-btn"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
            <button
              onClick={exportCSV}
              disabled={!data?.users?.length}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gem-gold text-gem-forest font-bold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed text-sm transition-colors"
              data-testid="admin-export-btn"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
          </div>
        </div>

        {/* Stats */}
        {data && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-[#0E2A1F] rounded-xl border border-zinc-800 p-5" data-testid="admin-total-count">
              <div className="text-3xl font-bold text-gem-beige font-heading">{data.total}</div>
              <div className="text-gem-sage text-sm mt-1">Total Leads</div>
            </div>
            <div className="bg-[#0E2A1F] rounded-xl border border-zinc-800 p-5">
              <div className="text-3xl font-bold text-gem-gold font-heading">
                {data.users?.filter(u => {
                  const d = new Date(u.timestamp);
                  const now = new Date();
                  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                }).length ?? 0}
              </div>
              <div className="text-gem-sage text-sm mt-1">This Month</div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-[#0E2A1F] rounded-2xl border border-zinc-800 overflow-hidden" data-testid="admin-leads-table">
          {loading && (
            <div className="p-12 text-center text-gem-sage">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-3 text-gem-mist" />
              Loading leads...
            </div>
          )}
          {error && (
            <div className="p-12 text-center text-red-400">{error}</div>
          )}
          {!loading && !error && data?.users?.length === 0 && (
            <div className="p-12 text-center text-gem-sage">
              <Mail className="w-8 h-8 mx-auto mb-3 text-zinc-700" />
              No leads collected yet.
            </div>
          )}
          {!loading && !error && data?.users?.length > 0 && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left px-5 py-3 text-gem-sage font-medium">Name</th>
                  <th className="text-left px-5 py-3 text-gem-sage font-medium">Email</th>
                  <th className="text-left px-5 py-3 text-gem-sage font-medium">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Joined</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.users.map((u, i) => (
                  <tr key={u.id || i} className="border-b border-zinc-800/50 hover:bg-white/10/30 transition-colors" data-testid={`admin-lead-row-${i}`}>
                    <td className="px-5 py-3 text-zinc-200 font-medium">{u.name || <span className="text-gem-mist italic">—</span>}</td>
                    <td className="px-5 py-3 text-zinc-400">{u.email}</td>
                    <td className="px-5 py-3 text-gem-sage">{fmt(u.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
