import React, { useState, ChangeEvent } from 'react';

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [downloadLink, setDownloadLink] = useState<string | null>(null);

  // Handle file input change
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFile(selectedFile);

    if (selectedFile) {
      // Generate preview for images
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
      }

      // Generate a link for both image and PDF files
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
      setDownloadLink(objectUrl);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />

      {preview && (
        <div>
          <h3>File Preview:</h3>

          {/* Show image preview if it's an image file */}
          {file && file.type.startsWith('image/') && (
            <img src={preview} alt="file preview" style={{ width: '300px' }} />
          )}

          {/* Show PDF preview if it's a PDF file */}
          {file && file.type === 'application/pdf' && (
            <embed src={preview} width="600px" height="500px" type="application/pdf" />
          )}

          {/* Download button to download the file */}
          {downloadLink && (
            <a href={downloadLink} download={file?.name} className="button is-primary">
              Download {file?.name}
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;