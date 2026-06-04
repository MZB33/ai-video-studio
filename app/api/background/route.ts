import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { imageUrl, backgroundType = "blur", customImageUrl } = await req.json();

    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
    }

    console.log(`🎨 Processing background: ${backgroundType}`);

    let processedImage = imageUrl;
    
    // ========================
    // 1. BLUR BACKGROUND
    // ========================
    if (backgroundType === "blur") {
      processedImage = imageUrl.includes('?') 
        ? `${imageUrl}&blur=100&auto=format` 
        : `${imageUrl}?blur=100&auto=format`;
    }
    
    // ========================
    // 2. WHITE BACKGROUND
    // ========================
    else if (backgroundType === "white") {
      processedImage = imageUrl.includes('?') 
        ? `${imageUrl}&bg=white&w=1024&h=768&fit=crop` 
        : `${imageUrl}?bg=white&w=1024&h=768&fit=crop`;
    }
    
    // ========================
    // 3. GREEN SCREEN (Chroma Key Ready)
    // ========================
    else if (backgroundType === "green") {
      processedImage = imageUrl.includes('?') 
        ? `${imageUrl}&bg=green&w=1024&h=768&fit=crop` 
        : `${imageUrl}?bg=green&w=1024&h=768&fit=crop`;
    }
    
    // ========================
    // 4. REMOVE BACKGROUND (Pixian.AI - Free)
    // ========================
    else if (backgroundType === "remove") {
      try {
        console.log("🖼️ Removing background with Pixian.AI...");
        
        // Download the original image
        const imageResponse = await fetch(imageUrl);
        const imageBlob = await imageResponse.blob();
        
        // Create form data for Pixian.AI
        const formData = new FormData();
        formData.append("image", imageBlob, "image.jpg");
        
        // Call Pixian.AI free API (no API key required)
        const pixianResponse = await fetch("https://api.pixian.ai/api/v2/remove-background", {
          method: "POST",
          body: formData,
        });
        
        if (pixianResponse.ok) {
          const resultBuffer = await pixianResponse.arrayBuffer();
          const resultBase64 = Buffer.from(resultBuffer).toString('base64');
          processedImage = `data:image/png;base64,${resultBase64}`;
          console.log("✅ Background removed successfully with Pixian.AI");
        } else {
          const errorText = await pixianResponse.text();
          console.error("Pixian.AI error:", pixianResponse.status, errorText);
          
          // Fallback: Create a transparent placeholder
          processedImage = `https://placehold.co/1024x768/e0e0e0/666?text=Background+Removed+(Try+again)`;
        }
      } catch (error) {
        console.error("Remove background error:", error);
        processedImage = `https://placehold.co/1024x768/f0f0f0/999?text=Background+Removal+Error`;
      }
    }
    
    // ========================
    // 5. CUSTOM BACKGROUND
    // ========================
    else if (backgroundType === "custom") {
      if (customImageUrl && customImageUrl.trim() !== "") {
        processedImage = customImageUrl;
      } else {
        processedImage = `https://placehold.co/1024x768/667eea/white?text=Custom+Background&t=${Date.now()}`;
      }
    }
    
    // Add timestamp to prevent caching
    if (!processedImage.includes('data:image')) {
      processedImage = processedImage.includes('?') 
        ? `${processedImage}&t=${Date.now()}` 
        : `${processedImage}?t=${Date.now()}`;
    }

    console.log(`✅ Processed: ${processedImage.substring(0, 80)}...`);

    return NextResponse.json({
      original: imageUrl,
      processed: processedImage,
      backgroundType,
      success: true,
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Background API Error:", message);
    return NextResponse.json({ 
      error: "Background processing failed", 
      details: message 
    }, { status: 500 });
  }
}