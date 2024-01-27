import React, { useState, useEffect } from "react";
import "./App.css";
import { DisplayImages } from "./Images";
import ImageDownloader from "./ImagesDownload";

function App() {
  const [requestErrorMessage, setRequestErrorMessage] = useState(null);
  const [requestError, setRequestError] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [placeholder, setPlaceholder] = useState("Search Bears with Paint Brushes the Starry Night, painted by Vincent Van Gogh...");
  const [quantity, setQuantity] = useState(5);
  const [model, setModel] = useState("sdxl");
  const [maxQuantity, setMaxQuantity] = useState(5);

  const [imageModels, setImageModels] = useState([]);

  useEffect(() => {
    const fetchImageModels = async () => {
      const apiUrl = `${import.meta.env.VITE_OPEN_AI_BASE}/v1/models`;
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const imageModels = data.data.filter((model) => model.max_images);
        setImageModels(imageModels);
      } catch (error) {
        console.error("Error fetching image models:", error);
      }
    };

    fetchImageModels();
  }, []);

  const generateImage = async () => {
    setRequestError(false);
    setPlaceholder(`Search ${prompt}...`);
    setPrompt(prompt);
    setLoading(true);

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
        }),
      });

      if (!response.ok) {
        setRequestError(true);
        const errorMessage = await response.json();
        setRequestErrorMessage(await errorMessage.error.message);
      }

      const data = await response.json();

      setLoading(false);

      const existingLinks = JSON.parse(localStorage.getItem("imageLinks")) || [];

      const newLinks = data.data.map((image) => image.url);
      const allLinks = [...newLinks, ...existingLinks];

      localStorage.setItem("imageLinks", JSON.stringify(allLinks));
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleModelSelect = (e) => {
    const selectedModelId = e.target.value;
    const selectedModel = imageModels.find((model) => model.id === selectedModelId);
    setModel(selectedModelId);

    if (selectedModel) {
      setMaxQuantity(selectedModel.max_images);
    }
    setQuantity(Math.min(quantity, maxQuantity));
  };

  return (
    <div className="app-main">
      {loading ? (
        <>
          <h2>Generating your unique images... Sit tight!</h2>
          <div className="lds-ripple">
            <div></div>
            <div></div>
          </div>
          <br />
          <DisplayImages />
        </>
      ) : (
        <>
          {requestError ? <div className="alert">{requestErrorMessage}</div> : null}

          <h2>Generate Images using Different AI Models</h2>
          <div className="select-container">
            <select value={model} onChange={handleModelSelect}>
              {imageModels.map((imageModel) => (
                <option key={imageModel.id} value={imageModel.id}>
                  {imageModel.id}
                </option>
              ))}
            </select>

            <ImageDownloader />
          </div>

          <textarea
            className="app-input"
            placeholder={placeholder}
            onChange={(e) => setPrompt(e.target.value)}
            rows="10"
            cols="40"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                document.getElementById("generate").click();
              }
            }}
          />
          <label htmlFor="quantity">Number of Images:</label>
          <input id="quantity" type="range" min="1" max={maxQuantity} value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} />
          <span>{quantity}</span>

          <br />
          <button onClick={generateImage} id="generate">
            Generate Images
          </button>
          <DisplayImages />
        </>
      )}
    </div>
  );
}

export default App;
