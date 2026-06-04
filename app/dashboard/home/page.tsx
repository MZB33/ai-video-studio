"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { allCategories, type Category } from "@/lib/categories";
import CategoryCard from "@/components/ui/CategoryCard";
import BottomNav from "@/components/ui/BottomNav";

export default function HomePage() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState("home");

  const handleNavigate = (href: string) => {
    if (href === "/") {
      setActiveNav("home");
    } else if (href === "/ai-tools") {
      setActiveNav("tools");
      router.push("/ai-tools");
    } else {
      router.push(href);
    }
  };

  const handleCategoryClick = (href: string) => {
    router.push(href);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "1rem 1rem 80px 1rem",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "2rem", paddingTop: "1rem" }}>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            color: "white",
            margin: 0,
          }}
        >
          AI Ecosystem
        </h1>
        <p
          style={{
            fontSize: "0.8rem",
            color: "rgba(255,255,255,0.8)",
            marginTop: "0.5rem",
          }}
        >
          Everything you need, one platform
        </p>
      </div>

      {/* Welcome Section */}
      <div
        style={{
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(10px)",
          borderRadius: 32,
          padding: "1.5rem",
          marginBottom: "2rem",
          textAlign: "center",
        }}
      >
        <span style={{ fontSize: "3rem" }}>🎬</span>
        <h2 style={{ color: "white", margin: "0.5rem 0 0 0", fontSize: "1.2rem" }}>
          Welcome to AI Studio
        </h2>
        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.8rem", marginTop: "0.5rem" }}>
          Transform your ideas into reality with AI
        </p>
      </div>

      {/* Categories Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: "1rem",
        }}
      >
        {allCategories.map((category: Category) => (
          <CategoryCard
            key={category.id}
            name={category.nameEn}
            nameUr={category.name}
            icon={category.icon}
            color={category.color}
            description={category.description}
            isFree={category.tools.some((item) => item.status === "free")}
            onClick={() => handleCategoryClick(`/tools/${category.id}`)}
          />
        ))}
      </div>

      {/* Bottom Navigation */}
      <BottomNav active={activeNav} onNavigate={handleNavigate} />
    </div>
  );
}