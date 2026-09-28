import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET
);

async function getUser() {
  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(
      token,
      secret
    );

    return payload;
  } catch {
    return null;
  }
}

export default async function DashboardLayout({
  children,
}) {
  const user = await getUser();

  if (!user) {
    redirect("/");
  }

  return (
    <>
      <Navbar />

      <div className="layout">
        <Sidebar role={user.role} />

        <main className="content">
          {children}
        </main>
      </div>
    </>
  );
}