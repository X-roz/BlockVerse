"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { encryptAdminKey } from '../../crypto/encrypt';

export default function LoginPage() {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      // Get secret from env (exposed via NEXT_PUBLIC_)
      const secret = process.env.NEXT_PUBLIC_ADMIN_ENCRYPTION_SECRET;
      if (!secret) {
        setError("Encryption secret not set");
        return;
      }
      const encrypted = await encryptAdminKey(key, secret);
      const res = await fetch("/api/admin/validate-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          iv: encrypted.iv,
          payload: encrypted.payload,
          tag: encrypted.tag,
        }),
      });
      const data = await res.json();
      if (data.success) {
        document.cookie = `admin_session=${data.token}; path=/;`;
        router.push("/admin/update");
      } else {
        setError(data.error || "Invalid key");
      }
    } catch (err) {
      setError("Encryption failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
        <input
          type="password"
          placeholder="Enter admin key"
          value={key}
          onChange={e => setKey(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-semibold">Login</button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </form>
    </div>
  );
}
