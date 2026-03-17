export async function uploadImageToImgBB(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);
  
  // Note: For security in production, the API key should ideally be used on the server side.
  // However, for client-side uploads directly to ImgBB, it's often exposed or accessed via an API route.
  // In Next.js, NEXT_PUBLIC_ is needed if accessed directly from client side.
  // To avoid exposing it publicly, let's use an API route, or if we must use it directly:
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY || "010b89befbc371919aa2729d6c7003ab"; 
  
  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    
    if (data.success) {
      return data.data.url;
    } else {
      throw new Error(data.error?.message || 'Failed to upload image');
    }
  } catch (error) {
    console.error("Error uploading image to ImgBB:", error);
    throw error;
  }
}
