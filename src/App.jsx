import { useState } from "react";
import "./App.css";
import { Banner } from "./728_90";

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

					<br />
					<button onClick={generateImage}>Generate Images</button>
					{result.length > 0 ? (
						<div className="image-container centered-div display-flex">
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
					<br />
					<a href="https://iproyal.com?r=241410" target="_blank">
						<img
							src="https://dashboard.iproyal.com/img/b/728_2.jpg"
							alt="IPRoyal.com"
						/>
					</a>
					<br />
					<a href="https://dashboard.capsolver.com/passport/register?inviteCode=Ecv6Gtrh0ECa">
						<img
							alt="banner"
							src="https://camo.githubusercontent.com/359a6866e8e9700c4cfa18e3bea8055e886772c93bc17618ea67ecfae8ca0d0d/68747470733a2f2f63646e2e646973636f72646170702e636f6d2f6174746163686d656e74732f313130353137323339343635353632353330362f313130353138303130313830323437313537352f32303232313230372d3136303734392e676966"
						/>
					</a>
					<br />
					<Banner />
				</>
			)}
		</div>
	);
}

export default App;
