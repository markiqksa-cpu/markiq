// app/api/ai/image/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { platform, clientName, clientData, campaignGoal, campaignName, userImage } = body;

    // ===== بناء الـ prompt بناءً على بيانات العميل الحقيقية =====
    
    const sectorPrompts: Record<string, string> = {
      restaurants: "appetizing food photography, restaurant ambiance, delicious meal presentation, warm lighting, Saudi cuisine elements",
      salons: "beauty salon atmosphere, elegant hair styling, grooming products, luxury spa feel, modern beauty space",
      clinics: "clean medical environment, professional healthcare, modern clinic interior, trust and care atmosphere",
      retail: "attractive product display, modern retail store, shopping experience, well-organized shelves",
      ecommerce: "product showcase on clean background, online shopping visual, modern packaging",
      education: "learning environment, students engaged, educational materials, modern classroom",
      real_estate: "modern Saudi architecture, luxury property interior, elegant living space, premium real estate",
      other: "professional business environment, modern Saudi commercial space",
    };

    const goalPrompts: Record<string, string> = {
      "زيادة الطلبات عبر التوصيل": "delivery service visual, food being delivered, happy customer receiving order, delivery bag",
      "بناء الوعي بالبراند": "brand identity visual, logo placement, brand colors, professional brand showcase",
      "استقطاب عملاء جدد": "welcoming new customers, grand opening feel, special offer visual, attractive entrance",
      "تحسين التقييمات": "satisfied happy customers, five star rating visual, positive reviews atmosphere, smiling faces",
      "ترويج منتج جديد": "new product launch, spotlight on product, excitement and novelty, fresh reveal",
      "زيادة المتابعين": "engaging social media content, viral worthy visual, trendy aesthetic, eye-catching composition",
    };

    const platformStyles: Record<string, string> = {
      instagram: "Instagram-perfect square composition, vibrant saturated colors, lifestyle photography style, visually stunning",
      snapchat: "vertical dynamic composition, youthful energetic mood, bold colors, trendy Gen-Z aesthetic",
      tiktok: "vertical video thumbnail style, dynamic composition, trending visual style, bold and eye-catching",
      google: "clean horizontal banner, professional business look, clear subject, minimal clutter, trustworthy feel",
      facebook: "horizontal social media post, engaging community feel, warm and inviting, shareable content",
      twitter: "horizontal clean design, bold statement visual, professional yet engaging",
      youtube: "thumbnail-ready horizontal, bold composition, high contrast, click-worthy visual",
      maps: "professional storefront exterior, welcoming business entrance, clear signage area, daytime lighting",
    };

    const sector = String(clientData?.sector || "other");
    const goal = String(campaignGoal || "");
    
    const sectorContext = sectorPrompts[sector] || sectorPrompts.other;
    const goalContext = goalPrompts[goal] || "professional marketing visual";
    const platformStyle = platformStyles[platform] || "professional marketing image";

    // معلومات العميل
    const city = String(clientData?.city || "الرياض");
    const neighborhood = String(clientData?.neighborhood || "");
    const targetAge = String(clientData?.targetAge || "25-34");
    const targetGender = String(clientData?.targetGender || "all");
    
    const audienceContext = targetGender === "male" ? "featuring Saudi men" 
      : targetGender === "female" ? "featuring Saudi women" 
      : "featuring Saudi people";

    const imagePrompt = `Professional Saudi Arabian marketing photograph for "${clientName}" business.

Scene: ${sectorContext}
Campaign goal: ${goalContext}
Visual style: ${platformStyle}
Location feel: Modern ${city} Saudi Arabia setting
Audience: ${audienceContext}, age ${targetAge}

Requirements:
- High-end commercial photography quality
- Authentic Saudi Arabian aesthetic and culture
- No text, logos, or watermarks in image
- Professional lighting, sharp focus
- Colors that work for ${platform} advertising
- Emotionally resonant and aspirational
- Campaign name inspiration: "${campaignName}"

Create a stunning, culturally authentic marketing image that would genuinely appeal to Saudi consumers.`;

    // إذا كان هناك صورة من العميل — نستخدم Image Edit
    if (userImage) {
      const editPrompt = `Enhance and professionally retouch this business image for ${clientName}.
Improve: lighting, colors, composition, professional appeal.
Style: ${platformStyle}, ${sectorContext}
Keep the original subject but make it advertising-ready for Saudi market.
No text additions.`;

      const response = await fetch("https://api.openai.com/v1/images/edits", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: (() => {
          const formData = new FormData();
          // تحويل base64 إلى blob
          const base64Data = userImage.replace(/^data:image\/\w+;base64,/, "");
          const binaryStr = Buffer.from(base64Data, "base64");
          const blob = new Blob([binaryStr], { type: "image/png" });
          formData.append("image", blob, "image.png");
          formData.append("prompt", editPrompt);
          formData.append("model", "gpt-image-1");
          formData.append("n", "1");
          formData.append("size", "1024x1024");
          return formData;
        })(),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `API error: ${response.status}`);
      }

      const data = await response.json();
      const imageData = data.data[0]?.b64_json;
      const imageUrl = imageData ? `data:image/png;base64,${imageData}` : null;
      return NextResponse.json({ imageUrl, mode: "edit" });
    }

    // توليد صورة جديدة
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt: imagePrompt,
        n: 1,
        size: platform === "instagram" ? "1024x1024" :
              platform === "snapchat" || platform === "tiktok" ? "1024x1536" :
              "1536x1024",
        quality: "medium",
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || `API error: ${response.status}`);
    }

    const data = await response.json();
    const imageData = data.data[0]?.b64_json;
    const imageUrl = imageData ? `data:image/png;base64,${imageData}` : null;

    return NextResponse.json({ imageUrl, mode: "generate" });

  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "فشل في توليد الصورة" 
    }, { status: 500 });
  }
}
