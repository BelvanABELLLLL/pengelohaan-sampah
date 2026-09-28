import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";

export default async function AdminPage() {
  const user = await getUser();

  if (!user) {
    redirect("/");
  }

  if (user.role !== "admin") {
    redirect("/user");
  }

  return (
    <main>
      <h1>Dashboard Admin</h1>
      <p>Selamat datang, {user.nama}!</p>
      <p>Anda login sebagai Admin.</p>
    </main>
  );
}