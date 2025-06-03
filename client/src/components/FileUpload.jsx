import React, { useState } from 'react';

const FileUpload = ({ onFileUpload }) => {
    const [file, setFile] = useState(null);

    const handleChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (file && onFileUpload) {
            onFileUpload(file);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="file" onChange={handleChange} />
            <button type="submit" disabled={!file}>
                Upload
            </button>
        </form>
    );
};

export default FileUpload;
