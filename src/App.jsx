import React, { useState } from "react";
import "./App.css";
import { DisplayImages } from "./Images";

function App() {
  // State variables to manage various aspects of the app
  const [requestErrorMessage, setRequestErrorMessage] = useState(null);
  const [requestError, setRequestError] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [placeholder, setPlaceholder] = useState(
    "Search Bears with Paint Brushes the Starry Night, painted by Vincent Van Gogh..."
  );
  const [quantity, setQuantity] = useState(3);
  const [imageSize, setImageSize] = useState("1024x1024");
  const [model, setModel] = useState("kandinsky-2.2"); // Default model
  const [maxQuantity, setMaxQuantity] = useState(10);

  // Function to generate images using AI
  // Function to generate images using AI
  const generateImage = async () => {
    setRequestError(false); // Reset rate limit status
    setImageSize(imageSize); // Update image size state
    setPlaceholder(`Search ${prompt}...`); // Update placeholder text
    setPrompt(prompt); // Update prompt state
    setLoading(true); // Start loading state

    // Fetch API URL and API Key from environment variables
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
        try {
          setRequestErrorMessage(await JSON.parse(response.text()).detail);
        } catch (e) {
          setRequestErrorMessage(await response.text());
        }
      }

      // Parse response data
      const data = await response.json();

      setLoading(false); // End loading state

      // Retrieve existing links from local storage
      const existingLinks =
        JSON.parse(localStorage.getItem("imageLinks")) || [];

      // Extract new links from the data and append to existing links
      const newLinks = data.data.map((image) => image.url);
      const allLinks = [...newLinks, ...existingLinks];

      // Save the updated links to local storage
      localStorage.setItem("imageLinks", JSON.stringify(allLinks));
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  // Function to handle model selection
  const handleModelSelect = (e) => {
    setModel(e.target.value);
    // Update max image quantity based on selected model
    const modelMaxImages = {
      "kandinsky-2.2": 10,
      "kandinsky-2": 10,
      sdxl: 5,
      "stable-diffusion-2.1": 10,
      "stable-diffusion-1.5": 10,
      "deepfloyd-if": 4,
      "material-diffusion": 8,
    };
    setQuantity(Math.min(quantity, modelMaxImages[e.target.value])); // Limit quantity to model's max images
    setMaxQuantity(modelMaxImages[e.target.value]); // Limit quantity to model's max images
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
          {requestError ? (
            <div className="alert">{requestErrorMessage}</div>
          ) : null}

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
            </select>
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
          <input
            id="quantity"
            type="range"
            min="1"
            max={maxQuantity}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
          />
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
