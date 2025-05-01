const AUTO_URL =
  import.meta.env.VITE_AUTO_BACKEND_URL || '/api/auto';

export async function fetchAutoDraw(fd: FormData): Promise<string> {
  const rsp = await fetch(AUTO_URL, { method: 'POST', body: fd });
  if (!rsp.ok) throw new Error(await rsp.text());

  const blob = await rsp.blob();
  return URL.createObjectURL(blob);
} 