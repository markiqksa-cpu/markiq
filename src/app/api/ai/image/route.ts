// app/api/ai/image/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, platform, clientName, style } = body;

    if (!prompt) {
      return NextResponse.json({ error: "البرومبت مطلوب" }, { status: 400 });
    }

    // بناء برومبت احترافي مناسب للمنصة
    const platformSpecs: Record<string, string> = {
      instagram: "square format 1:1, vibrant colors, high contrast, Instagram-ready",
      snapchat: "vertical format 9:16, youthful energetic style, bold colors",
      tiktok: "vertical format 9:16, dynamic trendy style, eye-catching",
      google: "horizontal banner format, clean professional, white background",
      facebook: "horizontal format 16:9, engaging professional style",
      twitter: "horizontal format 16:9, clean bold design",
      youtube: "thumbnail format 16:9, bold text overlay space, high contrast",
      maps: "clean location visual, professional storefront style",
    };

    const styleGuide = platformSpecs[platform] || "professional marketing image";

    const imagePrompt = `Professional marketing image for ${clientName} - ${prompt}. 
Style: ${style || "modern Saudi Arabian market aesthetic"}, ${styleGuide}.
High quality, commercial photography style, no text overlays, 
suitable for ${platform} social media advertising.
Clean, professional, visually appealing for Saudi Arabian audience.`;

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: imagePrompt,
        n: 1,
        size: platform === "instagram" ? "1024x1024" : 
              platform === "snapchat" || platform === "tiktok" ? "1024x1792" : 
              "1792x1024",
        quality: "standard",
        style: "natural",
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || `DALL-E API error: ${response.status}`);
    }

    const data = await response.json();
    const imageUrl = data.data[0]?.url;
    const revisedPrompt = data.data[0]?.revised_prompt;

    return NextResponse.json({ 
      imageUrl,
      revisedPrompt,
    });

  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "فشل في توليد الصورة" 
    }, { status: 500 });
  }
}
