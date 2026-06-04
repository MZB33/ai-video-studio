"use client";

interface ComingSoonBlockProps {
  title: string;
  description: string;
  icon?: string;
}

export default function ComingSoonBlock({ title, description, icon = "🚧" }: ComingSoonBlockProps) {
  return (
    <div style={{ 
      background: "rgba(255,255,255,0.95)", 
      backdropFilter: "blur(10px)",
      borderRadius: 24, 
      padding: "3rem", 
      textAlign: "center", 
      boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
      border: "1px solid rgba(255,255,255,0.2)",
    }}>
      <div style={{ fontSize: "5rem", marginBottom: "1rem" }}>{icon}</div>
      <h2 style={{ margin: 0, fontSize: "1.8rem", fontWeight: "bold", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
        Coming Soon
      </h2>
      <p style={{ color: "#555", marginTop: "0.75rem", fontSize: "1rem", maxWidth: "400px", marginLeft: "auto", marginRight: "auto" }}>
        {description}
      </p>
      <div style={{ display: "inline-block", marginTop: "1.5rem", padding: "0.5rem 1rem", background: "rgba(102,126,234,0.1)", borderRadius: "40px", color: "#667eea", fontSize: "0.8rem", fontWeight: "500" }}>
        🚀 Coming Soon
      </div>
    </div>
  );
}