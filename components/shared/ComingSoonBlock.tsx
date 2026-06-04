"use client";

interface ComingSoonBlockProps {
  title: string;
  subtitle?: string;
  urduTitle?: string;
  urduSubtitle?: string;
  description?: string;
  features?: string[];
  accentColor?: string;
  icon?: string;
  emoji?: string;
}

export default function ComingSoonBlock({
  title,
  subtitle,
  urduTitle,
  urduSubtitle,
  description,
  features = [],
  accentColor = "#667eea",
  icon = "🚧",
  emoji,
}: ComingSoonBlockProps) {
  const displayIcon = emoji ?? icon;

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(10px)",
        borderRadius: 24,
        padding: "3rem",
        textAlign: "center",
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        border: "1px solid rgba(255,255,255,0.2)",
      }}
    >
      <div style={{ fontSize: "5rem", marginBottom: "1rem" }}>{displayIcon}</div>
      <h2
        style={{
          margin: 0,
          fontSize: "1.8rem",
          fontWeight: "bold",
          background: `linear-gradient(135deg, ${accentColor} 0%, #764ba2 100%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {title}
      </h2>
      {urduTitle && (
        <p style={{ color: "#555", fontSize: "1rem", marginTop: "0.75rem" }}>
          {urduTitle}
        </p>
      )}
      {subtitle && (
        <p style={{ color: "#666", marginTop: "0.75rem", fontSize: "1rem", maxWidth: "500px", marginLeft: "auto", marginRight: "auto" }}>
          {subtitle}
        </p>
      )}
      {urduSubtitle && (
        <p style={{ color: "#6b7280", marginTop: "0.5rem", fontSize: "0.95rem", maxWidth: "500px", marginLeft: "auto", marginRight: "auto" }}>
          {urduSubtitle}
        </p>
      )}
      {description && (
        <p style={{ color: "#555", marginTop: "0.75rem", fontSize: "1rem", maxWidth: "500px", marginLeft: "auto", marginRight: "auto" }}>
          {description}
        </p>
      )}
      {features.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0, marginTop: "1rem", maxWidth: "460px", marginLeft: "auto", marginRight: "auto", textAlign: "left" }}>
          {features.map((feature) => (
            <li key={feature} style={{ marginBottom: "0.5rem", color: "#444" }}>
              • {feature}
            </li>
          ))}
        </ul>
      )}
      <div
        style={{
          display: "inline-block",
          marginTop: "1.5rem",
          padding: "0.5rem 1rem",
          background: "rgba(102,126,234,0.1)",
          borderRadius: "40px",
          color: "#667eea",
          fontSize: "0.8rem",
          fontWeight: "500",
        }}
      >
        🚀 Coming Soon
      </div>
    </div>
  );
}
