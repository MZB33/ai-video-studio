"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";

type VideoType = "educational" | "entertainment" | "tutorial" | "review" | "storytelling" | "vlog";
type Tone = "professional" | "casual" | "funny" | "inspirational" | "dramatic";

export default function YouTubeScriptPage() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [videoType, setVideoType] = useState<VideoType>("educational");
  const [duration, setDuration] = useState(5);
  const [tone, setTone] = useState<Tone>("professional");
  const [includeIntro, setIncludeIntro] = useState(true);
  const [includeOutro, setIncludeOutro] = useState(true);
  const [script, setScript] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const videoTypes = [
    { id: "educational", label: "📚 Educational", icon: "📚" },
    { id: "entertainment", label: "🎭 Entertainment", icon: "🎭" },
    { id: "tutorial", label: "🎯 Tutorial", icon: "🎯" },
    { id: "review", label: "⭐ Review", icon: "⭐" },
    { id: "storytelling", label: "📖 Storytelling", icon: "📖" },
    { id: "vlog", label: "🎥 Vlog", icon: "🎥" },
  ];

  const tones = [
    { id: "professional", label: "💼 Professional", color: "#3b82f6" },
    { id: "casual", label: "😊 Casual", color: "#10b981" },
    { id: "funny", label: "😂 Funny", color: "#f59e0b" },
    { id: "inspirational", label: "✨ Inspirational", color: "#8b5cf6" },
    { id: "dramatic", label: "🎬 Dramatic", color: "#ef4444" },
  ];

  const generateScript = () => {
    if (!topic.trim()) {
      setError("Please enter a video topic");
      return;
    }

    setLoading(true);
    setError("");
    setScript("");

    // Simulate AI script generation (in production, use actual AI API)
    setTimeout(() => {
      const intro = includeIntro ? `[INTRO - ${duration} SECONDS]\n👋 Hey everyone! Welcome back to the channel. Today we're talking about ${topic}. ${tone === "casual" ? "Super excited to dive into this!" : tone === "funny" ? "And trust me, it's going to be hilarious!" : "This is something you don't want to miss."}\n\n` : "";
      
      let mainContent = "";
      const numSegments = Math.ceil(duration / 2);
      
      if (videoType === "educational") {
        for (let i = 1; i <= numSegments; i++) {
          mainContent += `[SEGMENT ${i} - ${Math.floor(duration / numSegments)} SECONDS]\n📌 Point ${i}: ${topic} - Key insight number ${i}\n🔍 Let me explain this in detail...\n💡 Pro tip: ${i === 1 ? "Start with the basics first." : "This connects directly to what we discussed earlier."}\n\n`;
        }
      } else if (videoType === "tutorial") {
        for (let i = 1; i <= numSegments; i++) {
          mainContent += `[STEP ${i} - ${Math.floor(duration / numSegments)} SECONDS]\n⚙️ Step ${i}: ${i === 1 ? "Getting started with " + topic : "Next, we need to " + (i === 2 ? "configure the settings" : "finalize the setup")}\n🖥️ [Screen recording showing this step]\n✅ ${i === numSegments ? "Now everything is set up correctly!" : "Make sure you complete this step before moving on."}\n\n`;
        }
      } else if (videoType === "review") {
        mainContent = `[PRODUCT OVERVIEW - ${Math.floor(duration * 0.3)} SECONDS]\n📦 Let me show you what's inside the box...\n\n[FEATURES - ${Math.floor(duration * 0.4)} SECONDS]\n✨ Feature 1: This is amazing because...\n✨ Feature 2: What really stands out is...\n✨ Feature 3: I was surprised by...\n\n[PROS & CONS - ${Math.floor(duration * 0.2)} SECONDS]\n✅ Pros:\n• Reason 1\n• Reason 2\n\n❌ Cons:\n• Reason 1\n\n[VERDICT - ${Math.floor(duration * 0.1)} SECONDS]\n🏆 Final verdict: ${tone === "professional" ? "Highly recommended for..." : "You absolutely need this!"}\n`;
      } else {
        for (let i = 1; i <= numSegments; i++) {
          mainContent += `[PART ${i} - ${Math.floor(duration / numSegments)} SECONDS]\n📖 ${i === 1 ? "Let me start by telling you about..." : i === numSegments ? "Here's how it all comes together..." : "But wait, there's more to this story..."}\n💬 ${tone === "funny" ? "And you won't believe what happened next!" : tone === "inspirational" ? "This is where everything changed." : "This is the moment everything clicked."}\n\n`;
        }
      }
      
      const outro = includeOutro ? `[OUTRO - 15 SECONDS]\n🎬 And that's a wrap! Thanks for watching!\n👍 Like this video if you found it helpful\n💬 Comment below: What's your take on ${topic}?\n🔔 Subscribe for more ${videoType} content\n\n📌 Summary: ${topic} is something everyone should know about. ${tone === "inspirational" ? "Remember, small steps lead to big changes." : tone === "funny" ? "And if nothing else, at least you got a good laugh!" : "Stay tuned for the next video!"}\n` : "";
      
      const fullScript = intro + mainContent + outro;
      setScript(fullScript);
      setSuccessMsg("✨ YouTube script generated successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
      setLoading(false);
    }, 2000);
  };

  const copyScript = () => {
    navigator.clipboard.writeText(script);
    setSuccessMsg("📋 Script copied to clipboard!");
    setTimeout(() => setSuccessMsg(""), 2000);
  };

  const downloadScript = () => {
    const blob = new Blob([script], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `youtube-script-${topic.replace(/\s/g, "-")}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setSuccessMsg("💾 Script downloaded!");
    setTimeout(() => setSuccessMsg(""), 2000);
  };

  const loadExample = () => {
    setTopic("How to start a successful YouTube channel");
    setVideoType("educational");
    setDuration(8);
    setTone("inspirational");
    setIncludeIntro(true);
    setIncludeOutro(true);
  };

  const clearAll = () => {
    setTopic("");
    setScript("");
    setError("");
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "1rem 1rem 80px 1rem" }}>
      <div style={{ marginBottom: "1.5rem", paddingTop: "1rem" }}>
        <button onClick={() => router.back()} style={{ background: "rgba(255,255,255,0.2)", border: "none", padding: "8px 16px", borderRadius: 40, color: "white", cursor: "pointer", marginBottom: "1rem" }}>← Back</button>
        <h1 style={{ color: "white", margin: 0, fontSize: "1.8rem" }}>📺 YouTube Script Generator</h1>
        <p style={{ color: "rgba(255,255,255,0.8)", marginTop: "0.25rem" }}>Create engaging video scripts in minutes</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "1.5rem", marginBottom: "1.5rem" }}>
        {/* Left Panel - Controls */}
        <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: 24, padding: "1.5rem" }}>
          <label style={{ fontWeight: 600, marginBottom: "0.5rem", display: "block" }}>🎯 Video Topic</label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., How to edit videos like a pro, Top 10 productivity apps, My journey as a creator..."
            rows={3}
            style={{ width: "100%", padding: "0.75rem", borderRadius: 16, border: "1px solid #e0e0e0", marginBottom: "1rem", resize: "vertical" }}
          />

          <label style={{ fontWeight: 600, marginBottom: "0.5rem", display: "block" }}>📹 Video Type</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
            {videoTypes.map((vt) => (
              <button
                key={vt.id}
                onClick={() => setVideoType(vt.id as VideoType)}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: 40,
                  background: videoType === vt.id ? "#667eea" : "#f0f0f0",
                  color: videoType === vt.id ? "white" : "#333",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                }}
              >
                {vt.icon} {vt.label}
              </button>
            ))}
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ fontWeight: 600, marginBottom: "0.5rem", display: "block" }}>⏱️ Duration: {duration} minutes</label>
            <input
              type="range"
              min="1"
              max="20"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              style={{ width: "100%" }}
            />
          </div>

          <label style={{ fontWeight: 600, marginBottom: "0.5rem", display: "block" }}>🎭 Tone</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
            {tones.map((t) => (
              <button
                key={t.id}
                onClick={() => setTone(t.id as Tone)}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: 40,
                  background: tone === t.id ? t.color : "#f0f0f0",
                  color: tone === t.id ? "white" : "#333",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <input type="checkbox" checked={includeIntro} onChange={(e) => setIncludeIntro(e.target.checked)} />
              Include Intro
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <input type="checkbox" checked={includeOutro} onChange={(e) => setIncludeOutro(e.target.checked)} />
              Include Outro
            </label>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
            <button onClick={loadExample} style={{ flex: 1, padding: "0.5rem", background: "#8b5cf6", color: "white", border: "none", borderRadius: 40, cursor: "pointer" }}>
              📖 Example
            </button>
            <button onClick={clearAll} style={{ flex: 1, padding: "0.5rem", background: "#ef4444", color: "white", border: "none", borderRadius: 40, cursor: "pointer" }}>
              🗑️ Clear
            </button>
          </div>

          <button
            onClick={generateScript}
            disabled={loading || !topic}
            style={{
              width: "100%",
              padding: "0.875rem",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              borderRadius: 40,
              fontSize: "1rem",
              fontWeight: 600,
              cursor: loading || !topic ? "not-allowed" : "pointer",
              opacity: loading || !topic ? 0.6 : 1,
            }}
          >
            {loading ? "⏳ Generating Script..." : "✨ Generate YouTube Script"}
          </button>
        </div>

        {/* Right Panel - Script Output */}
        <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: 24, padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
            <h3 style={{ margin: 0, fontSize: "1rem" }}>📝 Generated Script</h3>
            {script && (
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button onClick={copyScript} style={{ padding: "0.25rem 0.75rem", background: "#3b82f6", color: "white", border: "none", borderRadius: 20, fontSize: "0.7rem", cursor: "pointer" }}>📋 Copy</button>
                <button onClick={downloadScript} style={{ padding: "0.25rem 0.75rem", background: "#10b981", color: "white", border: "none", borderRadius: 20, fontSize: "0.7rem", cursor: "pointer" }}>💾 Download</button>
              </div>
            )}
          </div>
          
          {!script && !loading && (
            <div style={{ 
              background: "#f5f5f5", 
              borderRadius: 16, 
              padding: "3rem", 
              textAlign: "center",
              border: "2px dashed #ccc",
            }}>
              <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>📺</div>
              <p>Enter your video topic and generate a script</p>
            </div>
          )}
          
          {loading && (
            <div style={{ 
              background: "#f5f5f5", 
              borderRadius: 16, 
              padding: "3rem", 
              textAlign: "center",
            }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem", animation: "spin 1s linear infinite" }}>⏳</div>
              <p>AI is writing your script...</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}
          
          {script && (
            <div style={{ 
              background: "#f5f5f5", 
              borderRadius: 16, 
              padding: "1rem",
              maxHeight: 500,
              overflowY: "auto",
            }}>
              <pre style={{ whiteSpace: "pre-wrap", fontFamily: "monospace", fontSize: "0.75rem", margin: 0, lineHeight: 1.6 }}>
                {script}
              </pre>
            </div>
          )}
        </div>
      </div>

      {error && <div style={{ marginTop: "1rem", padding: "0.75rem", background: "rgba(239,68,68,0.1)", borderRadius: 12, color: "#ef4444", textAlign: "center" }}>❌ {error}</div>}
      {successMsg && <div style={{ marginTop: "1rem", padding: "0.75rem", background: "rgba(34,197,94,0.1)", borderRadius: 12, color: "#22c55e", textAlign: "center" }}>✅ {successMsg}</div>}

      <BottomNav active="tools" onNavigate={(href) => router.push(href)} />
    </div>
  );
}