import { useState } from "react";
import "./App.css";
import { DisplayImages } from "./Images";

function App() {
    const [rateLimitedMessage, setRateLimitedMessage] = useState(null);
    const [rateLimited, setrateLimited] = useState(false);
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [placeholder, setPlaceholder] = useState(
        "Search Bears with Paint Brushes the Starry Night, painted by Vincent Van Gogh..."
    );
    const [quantity, setQuantity] = useState(3);
    const [imageSize, setImageSize] = useState("1024x1024");

    const generateImage = async () => {
        setrateLimited(false);
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
                    model: "kandinsky",
                    prompt: prompt,
                    n: quantity,
                    size: imageSize,
                }),
            });
            if (response.status === 429) {
                setrateLimited(true);
                setRateLimitedMessage(await response.text());
            }
            var data;
            try {
                data = await response.json();
            } catch (error) {
                throw new Error("Something went wrong. Please try again later.");
            }

            setLoading(false);

            // Retrieve existing links from local storage
            const existingLinks = JSON.parse(localStorage.getItem("imageLinks")) || [];

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
                    {rateLimited ? <div class="alert">{rateLimitedMessage}</div> : null}

                    <h2>Generate Images using AI</h2>
                    <textarea
                        className="app-input"
                        placeholder={placeholder}
                        onChange={(e) => setPrompt(e.target.value)}
                        rows="10"
                        cols="40"
                        autoFocus
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault(); // Prevent a line break from being added to the textarea
                                document.getElementById("generate").click(); // Trigger a click event on the button
                            }
                        }}
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
