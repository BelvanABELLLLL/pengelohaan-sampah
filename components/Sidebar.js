import Link from "next/link";

const menuItems = [
  {
    href: "/dashboard",
    icon: "🏠",
    label: "Dashboard",
  },
  {
    href: "/pengguna",
    icon: "👤",
    label: "Pengguna",
    adminOnly: true,
  },
  {
    href: "/jenis",
    icon: "🗑️",
    label: "Jenis Sampah",
    adminOnly: true,
  },
  {
  href: "/metode",
  icon: "♻️",
  label: "Metode Pengolahan",
  adminOnly: true,
  },
  {
    href: "/wilayah",
    icon: "📍",
    label: "Wilayah",
    adminOnly: true,
  },
  {
    href: "/laporan",
    icon: "📋",
    label: "Laporan",
  },
  {
  href: "/transaksi",
  icon: "💰",
  label: "Transaksi",
  },
  {
    href: "/foto",
    icon: "📷",
    label: "Foto Sampah",
  },
];

export default function Sidebar({ role }) {
  const filteredMenu = menuItems.filter((item) => {
    if (item.adminOnly && role !== "admin") {
      return false;
    }

    return true;
  });

  return (
    <aside className="sidebar">

      <div className="sidebar-header">
        <div className="sidebar-logo">
          🗑️
        </div>

        <div>
          <h2>Dirty Deeds</h2>
          <span>Pengelolaan Sampah</span>
        </div>
      </div>

      <div className="sidebar-section-title">
        MENU UTAMA
      </div>

      <nav className="sidebar-menu">
        {filteredMenu.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="sidebar-link"
          >
            <span className="sidebar-icon">
              {item.icon}
            </span>

            <span>
              {item.label}
            </span>
          </Link>
        ))}
      </nav>

    </aside>
  );
}