import React, { useEffect, useState } from "react";
import { getValidImageLinks } from "./Utils.js";
import { ImageCard } from "./ImageCard";

export function DisplayImages() {
  const [imageLinks, setImageLinks] = useState([]);

  useEffect(() => {
    const fetchValidImageLinks = async () => {
      const links = await getValidImageLinks();
      setImageLinks(links);
    };

    fetchValidImageLinks();
  }, []);

  const handleDelete = (linkToDelete) => {
    const updatedLinks = imageLinks.filter((link) => link !== linkToDelete);
    setImageLinks(updatedLinks);
    localStorage.setItem("imageLinks", JSON.stringify(updatedLinks));
  };

  return (
    <>
      {imageLinks.length > 0 && <h4>Your gallery:</h4>}
      <div className="image-container centered-div display-flex">
        {imageLinks.map((link, index) => (
          <ImageCard key={link} link={link} onDelete={handleDelete} />
        ))}
      </div>
    </>
  );
}
