"use client";

interface CategoryCardProps {
  name: string;
  nameUr: string;
  icon: string;
  color: string;
  description: string;
  isFree: boolean;
  onClick: () => void;
}

export default function CategoryCard({
  name,
  nameUr,
  icon,
  color,
  description,
  isFree,
  onClick,
}: CategoryCardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(10px)",
        borderRadius: 24,
        padding: "1.25rem",
        cursor: "pointer",
        transition: "all 0.3s ease",
        border: "1px solid rgba(255,255,255,0.2)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)";
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          background: `${color}20`,
          borderRadius: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1rem",
        }}
      >
        <span style={{ fontSize: "1.5rem" }}>{icon}</span>
      </div>
      <h3 style={{ fontSize: "1rem", fontWeight: 600, margin: 0, color: "#1a1a2e" }}>
        {name}
      </h3>
      <p style={{ fontSize: "0.7rem", color: "#666", margin: "4px 0" }}>{nameUr}</p>
      <p style={{ fontSize: "0.7rem", color: "#999", margin: "8px 0 0 0" }}>
        {description}
      </p>
      {isFree && (
        <span
          style={{
            display: "inline-block",
            fontSize: "0.6rem",
            background: "#10b981",
            color: "white",
            padding: "2px 8px",
            borderRadius: 12,
            marginTop: "8px",
          }}
        >
          Free
        </span>
      )}
    </div>
  );
}