export const fetchImageModels = async () => {
  const apiUrl = `${import.meta.env.VITE_OPEN_AI_BASE}/v1/models`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const imageModels = data.data.filter((model) => model.max_images && model.id);
    return imageModels;
  } catch (error) {
    console.error("Error fetching image models:", error);
  }
};

export const generateImage = async (model, prompt, quantity, token) => {
  const apiUrl = `${import.meta.env.VITE_OPEN_AI_BASE}/v1/images/generations`;

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: model,
      prompt: prompt,
      n: quantity,
      token: token,
    }),
  });

  return response;
};
