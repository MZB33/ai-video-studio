import { NextResponse } from "next/server";

// ========================
// COMPLETE IMAGE DATABASE FOR ALL TYPES
// ========================

const imageDatabase = {
  // 1. Cinematic Style
  cinematic: [
    "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1024&h=768",
    "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=1024&h=768",
    "https://images.unsplash.com/photo-1532798369041-bbe116b1aaf8?w=1024&h=768",
  ],
  
  // 2. Portrait Style
  portrait: [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1024&h=768",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1024&h=768",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=768",
    "https://images.unsplash.com/photo-1491349174775-aaafddd81942?w=1024&h=768",
  ],
  
  // 3. Landscape / Nature
  landscape: [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1024&h=768",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1024&h=768",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1024&h=768",
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1024&h=768",
  ],
  
  // 4. Urban / City
  urban: [
    "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1024&h=768",
    "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1024&h=768",
    "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1024&h=768",
    "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1024&h=768",
  ],
  
  // 5. Fantasy
  fantasy: [
    "https://images.unsplash.com/photo-1500964757637-c85e8a162366?w=1024&h=768",
    "https://images.unsplash.com/photo-1515405295579-ba7b45403062?w=1024&h=768",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1024&h=768",
  ],
  
  // 6. Sci-Fi
  scifi: [
    "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=1024&h=768",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1024&h=768",
    "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1024&h=768",
  ],
  
  // 7. Abstract
  abstract: [
    "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1024&h=768",
    "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=1024&h=768",
    "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=1024&h=768",
  ],
  
  // 8. Anime/Animation (using stylized photos)
  anime: [
    "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1024&h=768",
    "https://images.unsplash.com/photo-1585937421616-70a00f50645b?w=1024&h=768",
    "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1024&h=768",
  ],
  
  // 9. Realistic
  realistic: [
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1024&h=768",
    "https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?w=1024&h=768",
    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1024&h=768",
  ],
  
  // 10. Historical
  historical: [
    "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=1024&h=768",
    "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1024&h=768",
    "https://images.unsplash.com/photo-1503174971373-b1f69850bded?w=1024&h=768",
  ],
  
  // 11. Horror/Dark
  horror: [
    "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=1024&h=768",
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1024&h=768",
    "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=1024&h=768",
  ],
  
  // 12. Romantic
  romantic: [
    "https://images.unsplash.com/photo-1516589091380-5d8e87c6999b?w=1024&h=768",
    "https://images.unsplash.com/photo-1518621736915-f3b1c41fd216?w=1024&h=768",
    "https://images.unsplash.com/photo-1508974239320-0a029497e820?w=1024&h=768",
  ],
  
  // 13. Action
  action: [
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1024&h=768",
    "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=1024&h=768",
    "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=1024&h=768",
  ],
  
  // 14. Minimalist
  minimalist: [
    "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1024&h=768",
    "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=1024&h=768",
    "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=1024&h=768",
  ],
  
  // Special Characters
  woodcutter: [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1024&h=768",
    "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=1024&h=768",
  ],
  goddess: [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1024&h=768",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=768",
  ],
  river: [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1024&h=768",
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1024&h=768",
  ],
};

// Detect image type from prompt
function detectImageType(prompt: string): string {
  const lower = prompt.toLowerCase();
  
  if (lower.includes("cinematic") || lower.includes("movie") || lower.includes("film")) return "cinematic";
  if (lower.includes("portrait") || lower.includes("face") || lower.includes("person")) return "portrait";
  if (lower.includes("landscape") || lower.includes("nature") || lower.includes("mountain") || lower.includes("forest")) return "landscape";
  if (lower.includes("city") || lower.includes("urban") || lower.includes("street") || lower.includes("building")) return "urban";
  if (lower.includes("fantasy") || lower.includes("magic") || lower.includes("dragon") || lower.includes("castle")) return "fantasy";
  if (lower.includes("sci-fi") || lower.includes("futuristic") || lower.includes("space") || lower.includes("robot")) return "scifi";
  if (lower.includes("abstract") || lower.includes("art") || lower.includes("colorful")) return "abstract";
  if (lower.includes("anime") || lower.includes("animation") || lower.includes("cartoon")) return "anime";
  if (lower.includes("realistic") || lower.includes("real") || lower.includes("photo")) return "realistic";
  if (lower.includes("historical") || lower.includes("ancient") || lower.includes("medieval") || lower.includes("old")) return "historical";
  if (lower.includes("horror") || lower.includes("dark") || lower.includes("spooky") || lower.includes("scary")) return "horror";
  if (lower.includes("romantic") || lower.includes("love") || lower.includes("couple")) return "romantic";
  if (lower.includes("action") || lower.includes("battle") || lower.includes("fight")) return "action";
  if (lower.includes("minimalist") || lower.includes("simple") || lower.includes("clean")) return "minimalist";
  
  // Special characters
  if (lower.includes("woodcutter")) return "woodcutter";
  if (lower.includes("goddess")) return "goddess";
  if (lower.includes("river")) return "river";
  
  return "cinematic"; // default
}

export async function POST(req: Request) {
  try {
    const { prompt, style, quality, provider = "mock" } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Clean the prompt
    let cleanPrompt = prompt;
    cleanPrompt = cleanPrompt.replace(/Prompt \d+:/gi, "");
    cleanPrompt = cleanPrompt.split("—")[0];
    cleanPrompt = cleanPrompt.trim();

    // Detect image type
    const imageType = detectImageType(cleanPrompt);
    const images = imageDatabase[imageType as keyof typeof imageDatabase] || imageDatabase.cinematic;
    const randomIndex = Math.floor(Math.random() * images.length);
    const imageUrl = `${images[randomIndex]}?t=${Date.now()}&type=${imageType}`;

    console.log(`🎨 Image type: ${imageType}, URL: ${imageUrl.substring(0, 80)}`);

    return NextResponse.json({ 
      image: imageUrl,
      type: imageType,
      provider: "mock"
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("API Error:", message);
    return NextResponse.json({ 
      image: `https://picsum.photos/seed/${Date.now()}/1024/768`,
      type: "fallback"
    });
  }
}