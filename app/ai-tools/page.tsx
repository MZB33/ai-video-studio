"use client";

import { useRouter } from "next/navigation";
import { allCategories, type Category } from "@/lib/categories";
import CategoryCard from "@/components/ui/CategoryCard";
import BottomNav from "@/components/ui/BottomNav";

export default function AIToolsPage() {
  const router = useRouter();
  const aiTools = allCategories.filter((c: Category) =>
    ["cinematic", "image", "video", "voice", "background"].includes(c.id)
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "1rem 1rem 80px 1rem",
      }}
    >
      <div style={{ marginBottom: "1.5rem", paddingTop: "1rem" }}>
        <button
          onClick={() => router.back()}
          style={{
            background: "rgba(255,255,255,0.2)",
            border: "none",
            padding: "8px 16px",
            borderRadius: 40,
            color: "white",
            cursor: "pointer",
          }}
        >
          ← Back
        </button>
        <h1 style={{ color: "white", margin: "1rem 0 0 0" }}>AI Tools</h1>
        <p style={{ color: "rgba(255,255,255,0.8)" }}>Powered by artificial intelligence</p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: "1rem",
        }}
      >
        {aiTools.map((tool) => (
          <CategoryCard
            key={tool.id}
            name={tool.nameEn}
            nameUr={tool.name}
            icon={tool.icon}
            color={tool.color}
            description={tool.description}
            isFree={tool.tools.some((item) => item.status === "free")}
            onClick={() => router.push(`/tools/${tool.id}`)}
          />
        ))}
      </div>

      <BottomNav active="tools" onNavigate={(href) => router.push(href)} />
    </div>
  );
}