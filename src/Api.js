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
  const apiUrl = `${import.meta.env.VITE_OPEN_AI_BASE}/images/generations`;
  const openaiApiKey = import.meta.env.VITE_OPEN_AI_KEY;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: model,
        prompt: prompt,
        n: quantity,
        token: token,
      }),
    });

    if (!response.ok) {
      const errorMessage = await response.json();
      return { error: errorMessage };
    }

    const data = await response.json();
    return { data: data.data };
  } catch (error) {
    console.log(error);
  }
};
