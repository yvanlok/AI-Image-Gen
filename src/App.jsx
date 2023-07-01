import { useState } from "react";
import "./App.css";

function App() {
	const [prompt, setPrompt] = useState("");
	const [result, setResult] = useState([]);
	const [loading, setLoading] = useState(false);
	const [placeholder, setPlaceholder] = useState(
		"Search Bears with Paint Brushes the Starry Night, painted by Vincent Van Gogh..",
	);
	const [quantity, setQuantity] = useState(3);
	const [imageSize, setImageSize] = useState("1024x1024");

	const generateImage = async () => {
		setPlaceholder(`Search ${prompt}..`);
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
					prompt: prompt,
					n: quantity,
					size: imageSize,
				}),
			});

			const data = await response.json();

			setLoading(false);
			setResult(data.data);
		} catch (error) {
			setLoading(false);
			console.log(error);
		}
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
				</>
			) : (
				<>
					<h2>Generate Images using AI</h2>
					<textarea
						className="app-input"
						placeholder={placeholder}
						onChange={(e) => setPrompt(e.target.value)}
						rows="10"
						cols="40"
					/>
					<label htmlFor="quantity">Number of Images:</label>
					<input
						id="quantity"
						type="range"
						min="1"
						max="10"
						value={quantity}
						onChange={(e) => setQuantity(parseInt(e.target.value))}
					/>
					<span>{quantity}</span>
					{/* 
            <label htmlFor="imageSize">Image Size:</label>
            <div className="select-container">
              <select
                id="imageSize"
                value={imageSize}
                onChange={(e) => setImageSize(e.target.value)}
              >
                <option value="256x256">256x256</option>
                <option value="512x512">512x512</option>
                <option value="1024x1024">1024x1024</option>
              </select>
            </div>
          */}

					<br />
					<button onClick={generateImage}>Generate Images</button>
					{result.length > 0 ? (
						<div className="image-container">
							{result.map((image, index) => (
								<img
									key={index}
									className="result-image"
									src={image.url}
									alt={`result-${index}`}
								/>
							))}
						</div>
					) : (
						<></>
					)}
				</>
			)}
		</div>
	);
}

export default App;
