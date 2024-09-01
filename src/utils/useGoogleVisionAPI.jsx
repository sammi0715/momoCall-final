import { useState } from "react";

const useGoogleVisionAPI = () => {
  const [labels, setLabels] = useState("");
  const [error, setError] = useState("");
  const handleAnalyzeImage = async (imageUrl) => {
    const apiKey = import.meta.env.VITE_GOOGLE_CLOUD_API_KEY; // 請替換為你的 API 金鑰
    const endpoint = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

    const requestBody = {
      requests: [
        {
          image: {
            source: {
              imageUri: imageUrl,
            },
          },
          features: [
            {
              type: "LABEL_DETECTION",
              maxResults: 40,
            },
          ],
        },
      ],
    };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const labels = data.responses[0].labelAnnotations;
      setLabels(labels.map((label) => label.description).toString());
    } catch (err) {
      setError("Failed to analyze image");
      console.error(err);
    }
  };
  return { labels, error, handleAnalyzeImage };
};
export default useGoogleVisionAPI;
