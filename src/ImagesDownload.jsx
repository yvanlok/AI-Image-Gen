import React from "react";
import JSZip from "jszip";

class ImageDownloader extends React.Component {
  handleDownloadClick = () => {
    const imageLinks = JSON.parse(localStorage.getItem("imageLinks"));

    if (!imageLinks || imageLinks.length === 0) {
      alert("No images to download found!");
      return;
    }

    const zip = new JSZip();

    const promises = imageLinks.map((link, index) => {
      return fetch(link)
        .then((response) => response.blob())
        .then((blob) => {
          zip.file(`image${index + 1}.png`, blob);
        });
    });

    Promise.all(promises)
      .then(() => {
        return zip.generateAsync({ type: "blob" });
      })
      .then((blob) => {
        const a = document.createElement("a");
        const url = URL.createObjectURL(blob);
        a.href = url;
        a.download = "downloaded_images.zip";
        document.body.appendChild(a);

        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch((error) => {
        console.error("Error creating zip file:", error);
      });
  };

  render() {
    return (
      <div>
        <button onClick={this.handleDownloadClick}>Download All as Zip</button>
      </div>
    );
  }
}

export default ImageDownloader;
