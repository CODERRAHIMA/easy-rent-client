export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();

  formData.append("image", file);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/images/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Image upload failed");
  }

  return result.data.url;
};
