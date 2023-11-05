import React, { useState } from "react";
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
  const [imageSize, setImageSize] = useState("1024x1024");
  const [model, setModel] = useState("sdxl");
  const [maxQuantity, setMaxQuantity] = useState(5);

  const generateImage = async () => {
    setRequestError(false);
    setImageSize(imageSize);
    setPlaceholder(`Search ${prompt}...`);
    setPrompt(prompt);
    setLoading(true);

    const apiUrl = import.meta.env.VITE_Open_AI_Url;
    const openaiApiKey = import.meta.env.VITE_Open_AI_Key;
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
          size: imageSize,
        }),
      });

      if (!response.ok) {
        setRequestError(true);
        setRequestErrorMessage(await response.text());
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
    setModel(e.target.value);
    const modelMaxImages = {
      "kandinsky-2.2": 10,
      "kandinsky-2": 10,
      sdxl: 5,
      "stable-diffusion-2.1": 10,
      "stable-diffusion-1.5": 10,
      "deepfloyd-if": 4,
      "material-diffusion": 8,
      "dall-e": 10,
      dalle3: 10,
    };
    setQuantity(Math.min(quantity, modelMaxImages[e.target.value]));
    setMaxQuantity(modelMaxImages[e.target.value]);
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
              <option value="kandinsky-2.2">Kandinsky 2.2</option>
              <option value="kandinsky-2">Kandinsky 2</option>
              <option value="sdxl">SDXL</option>
              <option value="stable-diffusion-2.1">Stable Diffusion 2.1</option>
              <option value="stable-diffusion-1.5">Stable Diffusion 1.5</option>
              <option value="deepfloyd-if">Deepfloyd IF</option>
              <option value="material-diffusion">Material Diffusion</option>
              <option value="dall-e">DALL-E</option>
              <option value="dalle3">DALL-E 3</option>
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
