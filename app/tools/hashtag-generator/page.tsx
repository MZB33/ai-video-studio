"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";

type Platform = "instagram" | "tiktok" | "twitter" | "linkedin" | "facebook" | "youtube";
type Category = "business" | "travel" | "food" | "fashion" | "tech" | "fitness" | "art" | "music" | "photography" | "education";

export default function HashtagGeneratorPage() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [category, setCategory] = useState<Category>("business");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [hashtagCount, setHashtagCount] = useState(15);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeEmojis, setIncludeEmojis] = useState(false);

  const platforms = [
    { id: "instagram", label: "📷 Instagram", color: "#e4405f" },
    { id: "tiktok", label: "🎵 TikTok", color: "#000000" },
    { id: "twitter", label: "🐦 Twitter", color: "#1da1f2" },
    { id: "linkedin", label: "💼 LinkedIn", color: "#0077b5" },
    { id: "facebook", label: "📘 Facebook", color: "#1877f2" },
    { id: "youtube", label: "📺 YouTube", color: "#ff0000" },
  ];

  const categories = [
    { id: "business", label: "💼 Business", icon: "💼" },
    { id: "travel", label: "✈️ Travel", icon: "✈️" },
    { id: "food", label: "🍔 Food", icon: "🍔" },
    { id: "fashion", label: "👗 Fashion", icon: "👗" },
    { id: "tech", label: "💻 Tech", icon: "💻" },
    { id: "fitness", label: "💪 Fitness", icon: "💪" },
    { id: "art", label: "🎨 Art", icon: "🎨" },
    { id: "music", label: "🎵 Music", icon: "🎵" },
    { id: "photography", label: "📸 Photography", icon: "📸" },
    { id: "education", label: "📚 Education", icon: "📚" },
  ];

  const hashtagDatabase: Record<Category, Record<Platform, string[]>> = {
    business: {
      instagram: ["#business", "#entrepreneur", "#success", "#marketing", "#branding", "#startup", "#motivation", "#leadership", "#smallbusiness", "#goals"],
      tiktok: ["#business", "#entrepreneur", "#businesstips", "#smallbusinesscheck", "#startup", "#motivation"],
      twitter: ["#business", "#entrepreneur", "#marketing", "#startup", "#leadership", "#smallbiz"],
      linkedin: ["#business", "#leadership", "#marketing", "#innovation", "#entrepreneurship", "#career"],
      facebook: ["#business", "#entrepreneur", "#smallbusiness", "#marketing", "#success"],
      youtube: ["#business", "#entrepreneur", "#marketing", "#startup", "#motivation"],
    },
    travel: {
      instagram: ["#travel", "#wanderlust", "#adventure", "#nature", "#travelphotography", "#explore", "#vacation", "#beach", "#mountains", "#sunset"],
      tiktok: ["#travel", "#travelhacks", "#wanderlust", "#adventuretime", "#traveltips", "#explore"],
      twitter: ["#travel", "#wanderlust", "#adventure", "#travelgram", "#explore", "#vacation"],
      linkedin: ["#travel", "#businesstravel", "#tourism", "#hospitality", "#travelindustry"],
      facebook: ["#travel", "#wanderlust", "#vacation", "#adventure", "#travelgram"],
      youtube: ["#travel", "#travelvlog", "#wanderlust", "#adventure", "#explore"],
    },
    food: {
      instagram: ["#food", "#foodporn", "#instafood", "#foodie", "#yummy", "#delicious", "#homemade", "#cooking", "#recipe", "#foodphotography"],
      tiktok: ["#food", "#foodtiktok", "#recipe", "#cooking", "#yummy", "#foodlover", "#foodie"],
      twitter: ["#food", "#foodie", "#recipe", "#cooking", "#yummy", "#foodporn"],
      linkedin: ["#foodindustry", "#restaurant", "#culinary", "#foodbusiness", "#hospitality"],
      facebook: ["#food", "#recipe", "#cooking", "#foodie", "#homemade", "#delicious"],
      youtube: ["#food", "#recipe", "#cooking", "#foodie", "#homemade", "#foodreview"],
    },
    fashion: {
      instagram: ["#fashion", "#style", "#outfit", "#fashionista", "#ootd", "#streetstyle", "#luxury", "#designer", "#trendy", "#styleinspo"],
      tiktok: ["#fashion", "#style", "#outfitinspo", "#fashiontiktok", "#ootd", "#streetstyle"],
      twitter: ["#fashion", "#style", "#ootd", "#fashionweek", "#streetstyle", "#luxury"],
      linkedin: ["#fashionindustry", "#retail", "#fashiondesign", "#style", "#apparel"],
      facebook: ["#fashion", "#style", "#outfit", "#fashionista", "#ootd", "#streetstyle"],
      youtube: ["#fashion", "#style", "#outfitideas", "#fashionhaul", "#lookbook", "#ootd"],
    },
    tech: {
      instagram: ["#technology", "#tech", "#innovation", "#coding", "#programming", "#developer", "#ai", "#gadgets", "#future", "#digital"],
      tiktok: ["#tech", "#technology", "#coding", "#programming", "#developer", "#ai", "#gadgets"],
      twitter: ["#tech", "#technology", "#coding", "#programming", "#developer", "#ai", "#webdev"],
      linkedin: ["#technology", "#tech", "#innovation", "#coding", "#developer", "#ai", "#digitaltransformation"],
      facebook: ["#technology", "#tech", "#innovation", "#coding", "#gadgets", "#digital"],
      youtube: ["#tech", "#technology", "#gadgets", "#coding", "#programming", "#techtips"],
    },
    fitness: {
      instagram: ["#fitness", "#workout", "#gym", "#fitnessmotivation", "#health", "#training", "#bodybuilding", "#cardio", "#yoga", "#fitfam"],
      tiktok: ["#fitness", "#workout", "#gym", "#fitnessmotivation", "#homeworkout", "#fitnesstips"],
      twitter: ["#fitness", "#workout", "#gym", "#fitnessmotivation", "#health", "#training"],
      linkedin: ["#fitnessindustry", "#wellness", "#healthcare", "#fitnessbusiness", "#corporatewellness"],
      facebook: ["#fitness", "#workout", "#gym", "#fitnessmotivation", "#health", "#training"],
      youtube: ["#fitness", "#workout", "#gym", "#homeworkout", "#fitnessmotivation", "#fitnesstips"],
    },
    art: {
      instagram: ["#art", "#artist", "#drawing", "#painting", "#illustration", "#digitalart", "#sketch", "#artwork", "#creative", "#artistsoninstagram"],
      tiktok: ["#art", "#artist", "#drawing", "#painting", "#digitalart", "#arttiktok", "#sketch"],
      twitter: ["#art", "#artist", "#drawing", "#painting", "#illustration", "#digitalart"],
      linkedin: ["#art", "#creative", "#design", "#illustration", "#visualarts", "#artbusiness"],
      facebook: ["#art", "#artist", "#drawing", "#painting", "#artwork", "#creative"],
      youtube: ["#art", "#artist", "#drawing", "#painting", "#digitalart", "#arttutorial"],
    },
    music: {
      instagram: ["#music", "#musician", "#singer", "#songwriter", "#rapper", "#producer", "#guitar", "#piano", "#newmusic", "#musicproducer"],
      tiktok: ["#music", "#musician", "#singer", "#songwriter", "#musicproduction", "#newmusic", "#originalmusic"],
      twitter: ["#music", "#musician", "#singer", "#songwriter", "#newmusic", "#musicindustry"],
      linkedin: ["#musicindustry", "#musicbusiness", "#artist", "#producer", "#musicmarketing"],
      facebook: ["#music", "#musician", "#singer", "#songwriter", "#newmusic", "#musicvideo"],
      youtube: ["#music", "#musician", "#singer", "#songwriter", "#musicvideo", "#newmusic"],
    },
    photography: {
      instagram: ["#photography", "#photographer", "#photo", "#photooftheday", "#naturephotography", "#portrait", "#landscape", "#streetphotography", "#canon", "#nikon"],
      tiktok: ["#photography", "#photographer", "#phototips", "#photography101", "#photoediting", "#camera"],
      twitter: ["#photography", "#photographer", "#photo", "#photooftheday", "#nature", "#portrait"],
      linkedin: ["#photography", "#photographer", "#photographybusiness", "#visualcontent", "#creative"],
      facebook: ["#photography", "#photographer", "#photo", "#photooftheday", "#nature", "#portrait"],
      youtube: ["#photography", "#photographer", "#phototips", "#cameratips", "#photoediting", "#photography101"],
    },
    education: {
      instagram: ["#education", "#learning", "#study", "#student", "#school", "#teacher", "#onlinelearning", "#knowledge", "#motivation", "#success"],
      tiktok: ["#education", "#learning", "#study", "#student", "#teacher", "#studytips", "#edutok"],
      twitter: ["#education", "#learning", "#edchat", "#edtech", "#student", "#teacher"],
      linkedin: ["#education", "#learning", "#edtech", "#training", "#careerdevelopment", "#onlinelearning"],
      facebook: ["#education", "#learning", "#study", "#student", "#teacher", "#onlinelearning"],
      youtube: ["#education", "#learning", "#studytips", "#educational", "#onlinelearning", "#edutainment"],
    },
  };

  const generateHashtags = () => {
    if (!keyword.trim() && !category) {
      setError("Please enter a keyword or select a category");
      return;
    }

    setLoading(true);
    setError("");
    setHashtags([]);

    setTimeout(() => {
      let tags: string[] = [];
      
      const categoryTags = hashtagDatabase[category]?.[platform] || [];
      tags.push(...categoryTags);
      
      if (keyword.trim()) {
        const cleanKeyword = keyword.trim().toLowerCase().replace(/\s+/g, "");
        tags.push(`#${cleanKeyword}`);
        tags.push(`#${cleanKeyword}life`);
        tags.push(`#${cleanKeyword}goals`);
      }
      
      if (includeNumbers) {
        tags.push(`#trending`, `#viral`, `#2026`);
      }
      
      if (includeEmojis) {
        tags.push(`#🔥`, `#🚀`, `#💯`);
      }
      
      tags = [...new Map(tags.map(tag => [tag.toLowerCase(), tag])).values()];
      tags = tags.slice(0, hashtagCount);
      
      setHashtags(tags);
      setSuccessMsg(`✨ ${tags.length} hashtags generated!`);
      setTimeout(() => setSuccessMsg(""), 3000);
      setLoading(false);
    }, 800);
  };

  const copyHashtags = () => {
    const text = hashtags.join(" ");
    navigator.clipboard.writeText(text);
    setSuccessMsg("📋 Hashtags copied!");
    setTimeout(() => setSuccessMsg(""), 2000);
  };

  const copyHashtagsLineByLine = () => {
    const text = hashtags.join("\n");
    navigator.clipboard.writeText(text);
    setSuccessMsg("📋 Hashtags copied (one per line)!");
    setTimeout(() => setSuccessMsg(""), 2000);
  };

  const clearAll = () => {
    setKeyword("");
    setHashtags([]);
    setError("");
  };

  const loadExample = () => {
    setKeyword("digitalmarketing");
    setCategory("business");
    setPlatform("instagram");
    setHashtagCount(15);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "1rem 1rem 80px 1rem" }}>
      <div style={{ marginBottom: "1.5rem", paddingTop: "1rem" }}>
        <button onClick={() => router.back()} style={{ background: "rgba(255,255,255,0.2)", border: "none", padding: "8px 16px", borderRadius: 40, color: "white", cursor: "pointer", marginBottom: "1rem" }}>← Back</button>
        <h1 style={{ color: "white", margin: 0, fontSize: "1.8rem" }}>#️⃣ Hashtag Generator</h1>
        <p style={{ color: "rgba(255,255,255,0.8)", marginTop: "0.25rem" }}>Generate trending hashtags for social media</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "1.5rem", marginBottom: "1.5rem" }}>
        {/* Left Panel */}
        <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: 24, padding: "1.5rem" }}>
          <label style={{ fontWeight: 600, marginBottom: "0.5rem", display: "block" }}>🔑 Keyword</label>
          <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="e.g., digitalmarketing, fashion, travel..." style={{ width: "100%", padding: "0.75rem", borderRadius: 16, border: "1px solid #e0e0e0", marginBottom: "1rem" }} />

          <label style={{ fontWeight: 600, marginBottom: "0.5rem", display: "block" }}>📱 Platform</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
            {platforms.map((p) => (
              <button key={p.id} onClick={() => setPlatform(p.id as Platform)} style={{ padding: "0.5rem 1rem", borderRadius: 40, background: platform === p.id ? p.color : "#f0f0f0", color: platform === p.id ? "white" : "#333", border: "none", cursor: "pointer", fontSize: "0.8rem" }}>
                {p.label}
              </button>
            ))}
          </div>

          <label style={{ fontWeight: 600, marginBottom: "0.5rem", display: "block" }}>📂 Category</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
            {categories.map((c) => (
              <button key={c.id} onClick={() => setCategory(c.id as Category)} style={{ padding: "0.5rem 0.75rem", borderRadius: 40, background: category === c.id ? "#667eea" : "#f0f0f0", color: category === c.id ? "white" : "#333", border: "none", cursor: "pointer", fontSize: "0.7rem" }}>
                {c.label}
              </button>
            ))}
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ fontWeight: 600, marginBottom: "0.5rem", display: "block" }}>🔢 Number of Hashtags: {hashtagCount}</label>
            <input type="range" min="5" max="30" value={hashtagCount} onChange={(e) => setHashtagCount(Number(e.target.value))} style={{ width: "100%" }} />
          </div>

          <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><input type="checkbox" checked={includeNumbers} onChange={(e) => setIncludeNumbers(e.target.checked)} /> Include Numbers</label>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><input type="checkbox" checked={includeEmojis} onChange={(e) => setIncludeEmojis(e.target.checked)} /> Include Emojis</label>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
            <button onClick={loadExample} style={{ flex: 1, padding: "0.5rem", background: "#8b5cf6", color: "white", border: "none", borderRadius: 40, cursor: "pointer" }}>📖 Example</button>
            <button onClick={clearAll} style={{ flex: 1, padding: "0.5rem", background: "#ef4444", color: "white", border: "none", borderRadius: 40, cursor: "pointer" }}>🗑️ Clear</button>
          </div>

          <button onClick={generateHashtags} disabled={loading} style={{ width: "100%", padding: "0.875rem", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white", border: "none", borderRadius: 40, fontSize: "1rem", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }}>
            {loading ? "⏳ Generating..." : "✨ Generate Hashtags"}
          </button>
        </div>

        {/* Right Panel */}
        <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: 24, padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
            <h3 style={{ margin: 0, fontSize: "1rem" }}>#️⃣ Generated Hashtags</h3>
            {hashtags.length > 0 && (
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button onClick={copyHashtags} style={{ padding: "0.25rem 0.75rem", background: "#3b82f6", color: "white", border: "none", borderRadius: 20, fontSize: "0.7rem", cursor: "pointer" }}>📋 Copy (Space)</button>
                <button onClick={copyHashtagsLineByLine} style={{ padding: "0.25rem 0.75rem", background: "#10b981", color: "white", border: "none", borderRadius: 20, fontSize: "0.7rem", cursor: "pointer" }}>📋 Copy (Line)</button>
              </div>
            )}
          </div>
          
          {!hashtags.length && !loading && (
            <div style={{ background: "#f5f5f5", borderRadius: 16, padding: "3rem", textAlign: "center", border: "2px dashed #ccc" }}>
              <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>#️⃣</div>
              <p>Enter a keyword and generate hashtags</p>
            </div>
          )}
          
          {loading && (
            <div style={{ background: "#f5f5f5", borderRadius: 16, padding: "3rem", textAlign: "center" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem", animation: "spin 1s linear infinite" }}>⏳</div>
              <p>Generating hashtags...</p>
            </div>
          )}
          
          {hashtags.length > 0 && (
            <div style={{ background: "#f5f5f5", borderRadius: 16, padding: "1rem", maxHeight: 400, overflowY: "auto" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {hashtags.map((tag, idx) => (
                  <span key={idx} style={{ background: "#667eea", color: "white", padding: "6px 12px", borderRadius: 30, fontSize: "0.75rem", cursor: "pointer" }} onClick={() => { navigator.clipboard.writeText(tag); setSuccessMsg(`📋 ${tag} copied!`); setTimeout(() => setSuccessMsg(""), 1000); }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {hashtags.length > 0 && (
            <div style={{ marginTop: "1rem", textAlign: "center" }}>
              <p style={{ fontSize: "0.7rem", color: "#999" }}>💡 Click on any hashtag to copy it individually</p>
            </div>
          )}
        </div>
      </div>

      {error && <div style={{ marginTop: "1rem", padding: "0.75rem", background: "rgba(239,68,68,0.1)", borderRadius: 12, color: "#ef4444", textAlign: "center" }}>❌ {error}</div>}
      {successMsg && <div style={{ marginTop: "1rem", padding: "0.75rem", background: "rgba(34,197,94,0.1)", borderRadius: 12, color: "#22c55e", textAlign: "center" }}>✅ {successMsg}</div>}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <BottomNav active="tools" onNavigate={(href) => router.push(href)} />
    </div>
  );
}