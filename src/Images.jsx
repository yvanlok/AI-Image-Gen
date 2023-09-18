import React, { useEffect, useState } from "react";

export function DisplayImages() {
  const [imageLinks, setImageLinks] = useState([]);

  useEffect(() => {
    const getValidImageLinks = async () => {
      const links = JSON.parse(localStorage.getItem("imageLinks")) || [];

      const validLinks = await Promise.all(
        links.map((link) => {
          return new Promise((resolve) => {
            const img = new Image();
            img.src = link;

            img.onload = async () => {
              resolve(link);
            };

            img.onerror = () => {
              console.log(`Error loading image: ${link}`);
              resolve(null);
            };
          });
        })
      );

      const filteredLinks = validLinks.filter(Boolean);

      setImageLinks(filteredLinks);
      localStorage.setItem("imageLinks", JSON.stringify(filteredLinks));
    };

    getValidImageLinks();
  }, []);

  return (
    <>
      {imageLinks.length > 0 && <h4>Your gallery:</h4>}
      <div className="image-container centered-div display-flex">
        {imageLinks.map((link, index) => (
          <img key={link} src={link} alt={`Image-${index}`} className="result-image" />
        ))}
      </div>
    </>
  );
}
