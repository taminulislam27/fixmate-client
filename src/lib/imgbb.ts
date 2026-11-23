/** Uploads an image file to ImgBB and returns the hosted URL. */
export async function uploadToImgBB(file: File): Promise<string> {
  const key = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!key) throw new Error("ImgBB key is not configured");
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file");
  if (file.size > 5 * 1024 * 1024) throw new Error("Image must be under 5 MB");

  const form = new FormData();
  form.append("image", file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, { method: "POST", body: form });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.data?.url) throw new Error("Image upload failed, try again");
  return data.data.url as string;
}
