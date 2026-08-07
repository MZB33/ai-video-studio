"use client";

import { CSSProperties } from "react";

interface CategoryCardProps {
  name: string;
  nameUr: string;
  icon: string;
  description: string;
  color: string;
  isFree: boolean;
  planLabel?: string;
  planDetail?: string;
  thumbnail?: string;
  onClick?: () => void;
}

const cardStyle: CSSProperties = {
  background: "rgba(255,255,255,0.94)",
  borderRadius: 24,
  padding: "1rem",
  cursor: "pointer",
  boxShadow: "0 20px 50px rgba(15, 23, 42, 0.08)",
  transition: "transform 180ms ease, box-shadow 180ms ease",
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
};

export default function CategoryCard({ name, nameUr, icon, description, color, isFree, planLabel, planDetail, thumbnail, onClick }: CategoryCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={cardStyle}
      onMouseEnter={(event) => {
        const target = event.currentTarget as HTMLButtonElement;
        target.style.transform = "translateY(-3px)";
        target.style.boxShadow = "0 24px 60px rgba(15, 23, 42, 0.16)";
      }}
      onMouseLeave={(event) => {
        const target = event.currentTarget as HTMLButtonElement;
        target.style.transform = "none";
        target.style.boxShadow = "0 20px 50px rgba(15, 23, 42, 0.08)";
      }}
    >
      {thumbnail && (
        <img
          src={thumbnail}
          alt={name}
          style={{
            width: "100%",
            height: 140,
            objectFit: "cover",
            borderRadius: 18,
            marginBottom: 12,
          }}
        />
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 22 }}>{icon}</span>
        <div style={{ flex: 1, textAlign: "left" }}>
          <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#111" }}>{name}</div>
          <div style={{ fontSize: "0.78rem", color: "#666", marginTop: 4 }}>{nameUr}</div>
        </div>
      </div>
      <p style={{ margin: 0, color: "#4b5563", fontSize: "0.85rem", lineHeight: 1.6 }}>{description}</p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
        <div style={{ textAlign: "left" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: color, fontWeight: 700 }}>{planLabel || (isFree ? "Free" : "Pro")}</span>
          {planDetail ? <div style={{ fontSize: "0.72rem", color: "#9ca3af", marginTop: 4 }}>{planDetail}</div> : null}
        </div>
        <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>Open</span>
      </div>
    </button>
  );
}
