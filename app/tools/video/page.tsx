interface ToolCard {
  id: string;
  name: string;
  nameUr: string;
  icon: string;
  href: string;
  color: string;
  description: string;
  isFree: boolean;
}

export const categories: ToolCard[] = [
  {
    id: "cinematic",
    name: "Cinematic Studio",
    nameUr: "سنیماٹک اسٹوڈیو",
    icon: "🎬",
    href: "/tools/cinematic",
    color: "#667eea",
    description: "Turn stories into cinematic scenes",
    isFree: true,
  },
  {
    id: "image",
    name: "AI Image Generator",
    nameUr: "اے آئی امیج جنریٹر",
    icon: "🎨",
    href: "/tools/image",
    color: "#10b981",
    description: "Generate images from text",
    isFree: true,
  },
  {
    id: "video",
    name: "Video Creator",
    nameUr: "ویڈیو کری ایٹر",
    icon: "🎥",
    href: "/tools/video",
    color: "#ef4444",
    description: "Turn images into videos",
    isFree: true,
  },
  {
    id: "voice",
    name: "Voice Studio",
    nameUr: "وائس اسٹوڈیو",
    icon: "🎤",
    href: "/tools/voice",
    color: "#8b5cf6",
    description: "Text to natural speech",
    isFree: true,
  },
  {
    id: "background",
    name: "Background Remover",
    nameUr: "بیک گراؤنڈ ہٹائیں",
    icon: "🖼️",
    href: "/tools/background",
    color: "#06b6d4",
    description: "Remove or change backgrounds",
    isFree: true,
  },
  // ... rest of categories
];

export default function VideoToolPage() {
  return (
    <main style={{ padding: "2rem", minHeight: "100vh", background: "#f8fafc" }}>
      <section style={{ maxWidth: 860, margin: "0 auto" }}>
        <h1 style={{ fontSize: "2.25rem", marginBottom: "0.75rem" }}>Video Creator</h1>
        <p style={{ fontSize: "1rem", lineHeight: 1.75, color: "#475569" }}>
          Create videos from images and AI prompts. Select a tool card to begin, or come back soon as more features land.
        </p>
      </section>
    </main>
  );
}
