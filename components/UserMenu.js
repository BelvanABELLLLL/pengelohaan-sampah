"use client";

import { useRouter } from "next/navigation";

export default function UserMenu({ nama }) {
  const router = useRouter();

  async function handleLogout() {
    try {
      await fetch("/api/logout", {
        method: "POST",
      });

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  return (
    <div className="user-menu">
      <span className="user-name">
        👤 {nama}
      </span>

      <button
        type="button"
        onClick={handleLogout}
        className="logout-button"
      >
        Logout
      </button>
    </div>
  );
}