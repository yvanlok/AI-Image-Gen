import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import { DisplayImages } from "./DisplayImages.jsx";
import ImageDownloader from "./ImagesDownload";
import { getIdToken } from "./Utils.js";
import { fetchImageModels, generateImage } from "./Api.js";

function App() {
  const [requestErrorMessage, setRequestErrorMessage] = useState(null);
  const [requestError, setRequestError] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [placeholder, setPlaceholder] = useState("Generate: Bears with Paint Brushes the Starry Night, painted by Vincent Van Gogh...");
  const [quantity, setQuantity] = useState(5);
  const [model, setModel] = useState("sdxl");
  const [maxQuantity, setMaxQuantity] = useState(5);
  const [imageModels, setImageModels] = useState([]);

  useEffect(() => {
    const fetchModels = async () => {
      const models = await fetchImageModels();
      setImageModels(models);
    };

    fetchModels();
  }, []);

  const handleGenerateImage = useCallback(async () => {
    setRequestError(false);
    setPlaceholder(`Generate: ${prompt}...`);
    setPrompt(prompt);
    setLoading(true);

    const token = await getIdToken();

    const response = await generateImage(model, prompt, quantity, token);

    if (!response.ok) {
      setRequestError(true);
      setRequestErrorMessage(response.statusText);
    } else {
      const existingLinks = JSON.parse(localStorage.getItem("imageLinks")) || [];
      const newLinks = response.json().data.map((image) => image.url.split("?")[0]);
      const allLinks = [...newLinks, ...existingLinks];
      localStorage.setItem("imageLinks", JSON.stringify(allLinks));
    }

    setLoading(false);
  }, [model, prompt, quantity]);

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

          <h2>Simple AI Image Generator</h2>
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
          <button onClick={handleGenerateImage} id="generate">
            Generate Images
          </button>
          <DisplayImages />
        </>
      )}
    </div>
  );
}

export default App;
