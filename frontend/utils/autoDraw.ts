const AUTO_URL =
  import.meta.env.VITE_AUTO_BACKEND_URL || '/api/auto';

export async function fetchAutoDraw(fd: FormData): Promise<HTMLImageElement> {
  const rsp = await fetch(AUTO_URL, { method: 'POST', body: fd });
  if (!rsp.ok) throw new Error(await rsp.text());

  const blob = await rsp.blob();
  const img = new Image();
  img.src = URL.createObjectURL(blob);
  await new Promise(r => (img.onload = r));
  return img;
} 