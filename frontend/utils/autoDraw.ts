const AUTO_URL =
  import.meta.env.VITE_AUTO_BACKEND_URL || '/api/auto';

export async function fetchAutoDraw(fd: FormData): Promise<string> {
  console.log('[AutoDraw] Using endpoint:', AUTO_URL);
  
  try {
    const rsp = await fetch(AUTO_URL, { method: 'POST', body: fd });
    console.log('[AutoDraw] Response status:', rsp.status, rsp.statusText);
    console.log('[AutoDraw] Response headers:', Object.fromEntries([...rsp.headers.entries()]));
    
    if (!rsp.ok) {
      const errorText = await rsp.text();
      console.error('[AutoDraw] Error response:', errorText);
      throw new Error(errorText);
    }

    const contentType = rsp.headers.get('content-type');
    console.log('[AutoDraw] Response content-type:', contentType);

    // Try different approaches based on content type
    if (contentType?.includes('application/json')) {
      // If we got JSON, it might contain an image URL
      const jsonData = await rsp.json();
      console.log('[AutoDraw] Received JSON data:', jsonData);
      
      // Check if the JSON contains a URL field
      if (jsonData.url) {
        console.log('[AutoDraw] Found URL in JSON response:', jsonData.url);
        return jsonData.url;
      } else if (jsonData.image) {
        console.log('[AutoDraw] Found image data in JSON response');
        return jsonData.image;
      } else {
        console.error('[AutoDraw] JSON response does not contain image data');
        throw new Error('JSON response does not contain image data');
      }
    } else {
      // Handle as binary data (image)
      const blob = await rsp.blob();
      console.log('[AutoDraw] Blob received:', blob.type, 'size:', blob.size);
      
      if (blob.size === 0) {
        console.error('[AutoDraw] Empty blob received');
        throw new Error('Empty image data received from server');
      }
      
      // Safety check the blob type
      if (!blob.type.startsWith('image/')) {
        console.warn('[AutoDraw] Blob is not an image type:', blob.type);
        // Continue anyway as the server might have set the wrong content type
      }
      
      const objectUrl = URL.createObjectURL(blob);
      console.log('[AutoDraw] Created object URL:', objectUrl);
      
      // Test the image URL
      const testImg = new Image();
      testImg.onload = () => console.log('[AutoDraw] Test image loaded successfully! Dimensions:', testImg.width, 'x', testImg.height);
      testImg.onerror = (e) => console.error('[AutoDraw] Test image failed to load:', e);
      testImg.src = objectUrl;
      
      return objectUrl;
    }
  } catch (error) {
    console.error('[AutoDraw] Fetch error:', error);
    throw error;
  }
} 