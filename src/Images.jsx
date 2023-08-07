import React, { useEffect, useState } from "react";

export function DisplayImages() {
    const [imageLinks, setImageLinks] = useState([]);

    useEffect(() => {
        const getValidImageLinks = async () => {
            // Retrieve the image links from local storage
            const links = JSON.parse(localStorage.getItem("imageLinks")) || [];

            const validLinks = [];
            for (const link of links) {
                try {
                    const response = await fetch(link);
                    if (response.status !== 404) {
                        validLinks.push(link);
                    }
                } catch (error) {
                    console.log(`Error checking image status: ${error}`);
                }
            }

            setImageLinks(validLinks);
            localStorage.setItem("imageLinks", JSON.stringify(validLinks));
        };

        getValidImageLinks();
    }, []);

    return (
        <>
            {imageLinks.length > 0 && <h4>Your gallery:</h4>}
            <div className="image-container centered-div display-flex">
                {imageLinks.map((link, index) => (
                    <img key={index} src={link} alt={`Image-${index}`} className="result-image" />
                ))}
            </div>
        </>
    );
}
