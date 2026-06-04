"use client";

interface NavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
}

const navItems: NavItem[] = [
  { id: "home", label: "Home", icon: "🏠", href: "/" },
  { id: "tools", label: "AI Tools", icon: "✨", href: "/ai-tools" },
  { id: "workspace", label: "My Work", icon: "📁", href: "/workspace" },
  { id: "profile", label: "Profile", icon: "👤", href: "/profile" },
];

interface BottomNavProps {
  active: string;
  onNavigate: (href: string) => void;
}

export default function BottomNav({ active, onNavigate }: BottomNavProps) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(0,0,0,0.05)",
        padding: "12px 24px",
        display: "flex",
        justifyContent: "space-around",
        zIndex: 100,
      }}
    >
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => { setTimeout(() => onNavigate(item.href), 0); }}
          style={{
            background: "transparent",
            border: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "4px",
            cursor: "pointer",
            opacity: active === item.id ? 1 : 0.5,
            transition: "opacity 0.2s",
          }}
        >
          <span style={{ fontSize: "1.2rem" }}>{item.icon}</span>
          <span style={{ fontSize: "0.7rem", color: "#333" }}>{item.label}</span>
        </button>
      ))}
    </div>
  );
}