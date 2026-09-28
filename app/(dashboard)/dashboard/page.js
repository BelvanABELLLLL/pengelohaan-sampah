import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await getUser();

  if (!user) {
    redirect("/");
  }

  if (user.role === "admin") {
    redirect("/admin");
  }

  redirect("/user");
}