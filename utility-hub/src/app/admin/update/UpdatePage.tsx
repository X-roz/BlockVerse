"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UpdatePage() {
  const [config, setConfig] = useState("");
  const [source, setSource] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");
  const [version, setVersion] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [valid, setValid] = useState(true);
  const router = useRouter();
  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  }

  useEffect(() => {
    fetch("/api/admin/get-config")
      .then(res => res.json())
      .then(data => {
        setConfig(JSON.stringify(data.config, null, 2));
        setSource(data.source);
        setLastUpdated(data.last_updated);
        setVersion(data.version);
        setLogs(data.logs || []);
      });
  }, []);

  function validateJSON() {
    try {
      JSON.parse(config);
      setValid(true);
      setError("");
    } catch (e: any) {
      setValid(false);
      setError(e.message);
    }
  }

  async function saveUpdate() {
    setError("");
    const res = await fetch("/api/admin/update-config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ config }),
    });
    const data = await res.json();
    if (data.success) {
      setLogs(data.logs || []);
      setLastUpdated(data.last_updated);
      setVersion(data.version);
    } else {
      setError(data.error || "Update failed");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow relative">
        <button
          type="button"
          className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700"
          onClick={handleLogout}
        >
          Logout
        </button>
        <h1 className="text-2xl font-bold mb-4">Config Update</h1>
        <div className="mb-2">Storage Source: <span className="font-mono">{source}</span></div>
        <div className="mb-2">Last Updated: <span className="font-mono">{lastUpdated}</span></div>
        <div className="mb-2">Version: <span className="font-mono">{version}</span></div>
        <textarea
          className="w-full h-64 border rounded p-2 font-mono mb-4"
          value={config}
          onChange={e => setConfig(e.target.value)}
        />
        <div className="flex gap-4 mb-4">
          <button type="button" className="bg-yellow-500 text-white px-4 py-2 rounded" onClick={validateJSON}>Validate JSON</button>
          <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded" onClick={saveUpdate} disabled={!valid}>Save & Update</button>
        </div>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <div className="bg-gray-100 p-2 rounded mt-4">
          <h2 className="font-semibold mb-2">Update Logs</h2>
          <ul className="text-xs font-mono">
            {logs.map((log, i) => <li key={i}>{log}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}
