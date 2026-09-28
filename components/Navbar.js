import { cookies } from "next/headers";
import { jwtVerify } from "jose";

import UserMenu from "./UserMenu";

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

export default async function Navbar() {
  const user = await getUser();

  return (
    <header className="navbar">

      <div className="navbar-left">
        <span className="navbar-title">
          Sistem Pengelolaan Sampah
        </span>
      </div>

      <div className="navbar-right">
        {user && (
          <UserMenu nama={user.nama} />
        )}
      </div>

    </header>
  );
}