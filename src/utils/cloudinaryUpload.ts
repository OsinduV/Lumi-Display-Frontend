import axios from "axios";

export const uploadToCloudinary = async (
  file: File,
  onProgress: (percent: number) => void,
  resourceType: "image" | "raw" = "image" // ✅ Add this
): Promise<string> => {
  const url = `https://api.cloudinary.com/v1_1/dnaoklsf5/${resourceType}/upload`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "lumi_display_244");

  const res = await axios.post(url, formData, {
    onUploadProgress: (e) => {
      const percent = e.total ? Math.round((e.loaded * 100) / e.total) : 0;
      onProgress(percent);
    },
  });

  return res.data.secure_url;
};
