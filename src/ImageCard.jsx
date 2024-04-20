import React from "react";
import "./ImageCard.css";

export function ImageCard({ link: imageSrc, onDelete }) {
  const handleShare = () => {
    navigator.clipboard.writeText(imageSrc);
    alert("Image link copied!");
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      onDelete(imageSrc);
    }
  };

  const extractFilename = (url) => {
    const parts = url.split(".");
    const extension = parts.pop().split("?")[0];
    return `downloaded_image.${extension}`;
  };

  const handleDownload = async () => {
    const corsProxy = "https://cors-anywhere-6iul.onrender.com/";
    const response = await fetch(corsProxy + imageSrc);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = extractFilename(imageSrc);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="image-card">
      <img src={imageSrc} alt="Generated" className="result-image" />
      <div className="image-overlay">
        <button onClick={handleShare}>Copy Link</button>
        <button onClick={handleDelete}>Delete</button>
        <button onClick={handleDownload}>Download</button>
      </div>
    </div>
  );
}
