import React, { useEffect, useState } from "react";

export function DisplayImages() {
    // Define a state variable to hold the image links
    const [imageLinks, setImageLinks] = useState([]);

    // Use the useEffect hook to perform side effects, in this case, fetching the image links
    useEffect(() => {
        const getValidImageLinks = async () => {
            // Retrieve the image links from local storage
            const links = JSON.parse(localStorage.getItem("imageLinks")) || [];

            // Validate the image URLs by loading them and checking if they result in an error
            const validLinks = await Promise.all(
                links.map((link) => {
                    return new Promise((resolve) => {
                        const img = new Image();
                        img.src = link;

                        // If the image loads successfully, resolve the promise with the link
                        img.onload = () => {
                            resolve(link);
                        };
                        // If there's an error loading the image, resolve the promise with null
                        img.onerror = () => {
                            console.log(`Error loading image: ${link}`);
                            resolve(null);
                        };
                    });
                })
            );

            // Filter out any null values (invalid links)
            const filteredLinks = validLinks.filter(Boolean);

            // Update the state variable with the valid links
            setImageLinks(filteredLinks);
            // Store the valid links back into local storage
            localStorage.setItem("imageLinks", JSON.stringify(filteredLinks));
        };

        // Call the function to get valid image links
        getValidImageLinks();
    }, []); // Empty dependency array ensures this runs once on component mount

    // Render the images if there are any
    return (
        <>
            {imageLinks.length > 0 && <h4>Your gallery:</h4>}
            <div className="image-container centered-div display-flex">
                {imageLinks.map((link, index) => (
                    // Use the link itself as a key instead of the index for better performance
                    // and to avoid potential issues with list reconciliation
                    <img key={link} src={link} alt={`Image-${index}`} className="result-image" />
                ))}
            </div>
        </>
    );
}
