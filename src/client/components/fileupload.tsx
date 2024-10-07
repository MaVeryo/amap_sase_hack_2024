import React, { useState, ChangeEvent } from 'react';
import FileUploadIcon from '@mui/icons-material/FileUpload'; // Icon for uploading
import CloseIcon from '@mui/icons-material/Close'; // Icon for removing the file
import DownloadIcon from '@mui/icons-material/Download'; // Icon for downloading the file
import { IconButton } from '@mui/material'; // Material UI button for icon

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [downloadLink, setDownloadLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle file input change, restricted to PDFs
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;

    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      const objectUrl = URL.createObjectURL(selectedFile);
      setDownloadLink(objectUrl);
      setError(null); // Clear any previous error
    } else {
      setError('Please upload a PDF file only.');
      setFile(null);
      setDownloadLink(null);
    }
  };

  // Handle file removal
  const removeFile = () => {
    setFile(null);
    setDownloadLink(null);
    setError(null);
    (document.getElementById('fileInput') as HTMLInputElement).value = ''; // Reset file input
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {/* Hidden file input restricted to PDF files */}
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        id="fileInput"
        style={{ display: 'none' }}
      />

      {/* Conditionally show the "Choose File" icon or "Remove File" icon */}
      <IconButton
        onClick={() => {
          if (file) {
            removeFile(); // If a file is selected, remove it
          } else {
            document.getElementById('fileInput')?.click(); // Otherwise, open file chooser
          }
        }}
        sx={{ color: 'white', marginRight: "15px", alignSelf: "center" }}
      >
        {file ? <CloseIcon /> : <FileUploadIcon />}
      </IconButton>

      {/* Show the file name if a file is uploaded */}
      {file && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginLeft: '10px', color: 'white' }}>{file.name}</span>

          {/* Download icon next to the file name */}
          <IconButton
            onClick={() => {
              if (downloadLink) {
                window.open(downloadLink); // Open the download link in a new tab
              }
            }}
            sx={{ color: 'white', marginLeft: '10px' }}
          >
            <DownloadIcon />
          </IconButton>
        </div>
      )}

      {/* Error message for invalid file types */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default FileUpload;