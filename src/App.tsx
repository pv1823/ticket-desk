import { useEffect, useState } from "react";

type Ticket = { id: number; title: string; status: string; priority: string };

const banners: Record<string, { label: string; bg: string; fg: string }> = {
  local: { label: "LOCAL", bg: "#1e66f5", fg: "#fff" },
  preview: { label: "PREVIEW — not live", bg: "#f9d71c", fg: "#000" },
  production: { label: "PRODUCTION", bg: "#2e9e4f", fg: "#fff" },
};

export default function App() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [env, setEnv] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const qs = new URLSearchParams();
    if (status) qs.set("status", status);
    if (priority) qs.set("priority", priority);
    const query = qs.toString();
    fetch(`/api/tickets${query ? `?${query}` : ""}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => { setTickets(data.tickets); setEnv(data.env); })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [status, priority]);

  const banner = banners[env] ?? { label: env, bg: "#888", fg: "#fff" };

  return (
    <>
      {env && (
        <div
          style={{
            width: "100%",
            padding: 8,
            boxSizing: "border-box",
            textAlign: "center",
            fontWeight: "bold",
            fontFamily: "sans-serif",
            background: banner.bg,
            color: banner.fg,
          }}
        >
          {banner.label}
        </div>
      )}
    <main style={{ fontFamily: "sans-serif", maxWidth: 600, margin: "40px auto" }}>
      <h1>Ticket Desk{!loading && !error && ` (${tickets.length})`}</h1>
      <p>Environment: <b>{env}</b></p>

      <select value={status} onChange={e => setStatus(e.target.value)}>
        <option value="">All statuses</option>
        <option value="open">Open</option>
        <option value="in_progress">In progress</option>
        <option value="closed">Closed</option>
      </select>

      <select value={priority} onChange={e => setPriority(e.target.value)}>
        <option value="">All priorities</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      {loading && <p>Loading…</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {!loading && !error && (
        <ul>
          {tickets.map(t => (
            <li key={t.id}>{t.title} — {t.status} ({t.priority})</li>
          ))}
        </ul>
      )}
    </main>
    </>
  );
}
