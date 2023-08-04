import React, { useEffect, useState } from "react";

export function DisplayImages() {
    const [imageLinks, setImageLinks] = useState([]);

    useEffect(() => {
        // Retrieve the image links from local storage
        const links = JSON.parse(localStorage.getItem("imageLinks")) || [];
        setImageLinks(links);
    }, []);

    return (
        <div className="image-container centered-div display-flex">
            {imageLinks.map((link, index) => (
                <img key={index} src={link} alt={`Image-${index}`} className="result-image" />
            ))}
        </div>
    );
}

export default DisplayImages;
