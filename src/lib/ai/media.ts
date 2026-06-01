// lib/ai/dalle.ts
// ============================================
// DALL-E 3 API Wrapper — Markiq
// ============================================

export async function generateImage(params: {
  prompt: string;
  size?: "1024x1024" | "1792x1024" | "1024x1792";
  quality?: "standard" | "hd";
  style?: "vivid" | "natural";
}): Promise<{ url: string; revisedPrompt: string }> {
  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt: params.prompt,
      n: 1,
      size: params.size || "1024x1024",
      quality: params.quality || "hd",
      style: params.style || "vivid",
    }),
  });

  if (!response.ok) {
    throw new Error(`DALL-E API error: ${response.status}`);
  }

  const data = await response.json();
  return {
    url: data.data[0].url,
    revisedPrompt: data.data[0].revised_prompt,
  };
}

// Build marketing image prompt from content context
export function buildMarketingPrompt(params: {
  businessName: string;
  sector: string;
  platform: string;
  contentType: string;
  occasion?: string;
  style?: string;
}): string {
  const platformSpecs: Record<string, string> = {
    instagram: "square format 1:1, Instagram-ready",
    snapchat: "vertical format 9:16, Snapchat story",
    tiktok: "vertical format 9:16, TikTok video thumbnail",
    google: "horizontal format 16:9, Google display ad",
  };

  const spec = platformSpecs[params.platform] || "square format";

  return `Professional marketing photo for ${params.businessName} (${params.sector} business).
${params.occasion ? `Theme: ${params.occasion}.` : ""}
Style: Modern, clean, appetizing, vibrant colors, Saudi Arabian aesthetic.
Format: ${spec}.
No text or watermarks.
High quality, commercial photography style.
${params.style || "Bright lighting, minimalist background."}`;
}


// lib/ai/runway.ts
// ============================================
// Runway Gen-2 API Wrapper — Markiq
// ============================================

export async function generateVideo(params: {
  prompt: string;
  duration?: 4 | 8 | 16;
  resolution?: "720p" | "1080p";
  imageUrl?: string; // للـ image-to-video
}): Promise<{ taskId: string }> {
  const endpoint = params.imageUrl
    ? "https://api.runwayml.com/v1/image_to_video"
    : "https://api.runwayml.com/v1/text_to_video";

  const body: Record<string, unknown> = {
    text_prompt: params.prompt,
    seconds: params.duration || 8,
    resolution: params.resolution || "720p",
  };

  if (params.imageUrl) {
    body.init_image = params.imageUrl;
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.RUNWAY_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Runway API error: ${response.status}`);
  }

  const data = await response.json();
  return { taskId: data.task_id || data.id };
}

export async function getVideoStatus(taskId: string): Promise<{
  status: "pending" | "processing" | "completed" | "failed";
  videoUrl?: string;
  progress?: number;
}> {
  const response = await fetch(`https://api.runwayml.com/v1/tasks/${taskId}`, {
    headers: {
      Authorization: `Bearer ${process.env.RUNWAY_API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Runway status error: ${response.status}`);
  }

  const data = await response.json();
  return {
    status: data.status,
    videoUrl: data.output?.[0],
    progress: data.progressRatio ? Math.round(data.progressRatio * 100) : 0,
  };
}
