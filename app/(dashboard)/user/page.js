import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";

export default async function UserPage() {
  const user = await getUser();

  if (!user) {
    redirect("/");
  }

  if (user.role !== "user") {
    redirect("/admin");
  }

  return (
    <main>
      <h1>Dashboard User</h1>
      <p>Selamat datang, {user.nama}!</p>
      <p>Anda login sebagai User.</p>
    </main>
  );
}