import React, { useState } from "react";
import axios from "axios";

function Sidebar({
  chatHistory,
  startNewChat,
  selectChat,
  activeChatId,
  handlePdfProcessed,
}) {
  const [uploadMessage, setUploadMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(""); // 'success', 'error', or ''

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    setUploadMessage(""); // Clear previous message
    setUploadStatus(""); // Clear previous status

    if (!selectedFile) {
      // No file selected, or selection was cancelled
      // setUploadMessage('Please select a PDF file.'); // Optionally uncomment if immediate feedback for cancellation is desired
      return;
    }

    setIsUploading(true);
    setUploadMessage("Uploading PDF...");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/upload-pdf",
        formData
      );

      console.log(response, "RESPONDE FRONT EDN");

      if (response.status === 200) {
        setUploadMessage(
          `PDF processed: ${response.data.message}, Text Length: ${response.data.textLength}, Chunks: ${response.data.chunkCount}`
        );
        setUploadStatus("success");
        if (handlePdfProcessed) {
          handlePdfProcessed();
        }
      } else {
        // This case might not be hit often if server uses standard HTTP error codes for errors
        setUploadMessage(
          `Error processing PDF: Server responded with status ${response.status}. Please try again.`
        );
        setUploadStatus("error");
      }
    } catch (error) {
      console.error("Error uploading PDF:", error);
      if (error.response) {
        // Server responded with a status code that falls out of the range of 2xx
        setUploadMessage(
          `Server error: ${error.response.status}. ${
            error.response.data?.message || "Please try again."
          }`
        );
        setUploadStatus("error");
      } else if (error.request) {
        setUploadMessage(
          "Network error. Please check your connection and try again."
        );
        setUploadStatus("error");
      } else {
        setUploadMessage(
          "Error processing PDF. Please check the file or try again."
        );
        setUploadStatus("error");
      }
    } finally {
      setIsUploading(false);
      // Clear the file input only after processing is complete (success or error)
      // This allows the user to see the selected file name while uploading
      // event.target.value = null; // Moved this to be conditional or based on UX preference
      if (event.target) {
        event.target.value = null; // Clear file input so the same file can be re-uploaded if needed
      }
    }
  };

  return (
    <div className="sidebar-content">
      <label htmlFor="file-upload" className="custom-file-upload">
        Upload PDF
      </label>
      <input
        id="file-upload" // Ensure id matches label's htmlFor
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        disabled={isUploading}
      />
      {isUploading && <p className="upload-feedback">Uploading...</p>}{" "}
      {/* Basic uploading message */}
      {/* This div will contain the feedback message and apply classes based on CSS structure .upload-feedback .success or .upload-feedback .error */}
      {uploadMessage && !isUploading && (
        <div className="upload-feedback">
          <p className={uploadStatus}>{uploadMessage}</p>
        </div>
      )}
      <button onClick={startNewChat} className="new-chat-button">
        New Chat
      </button>
      <h2>Chat History</h2>
      {chatHistory.length === 0 && <p>No chats yet.</p>}
      <ul>
        {chatHistory.map((chat) => (
          <li
            key={chat.id}
            onClick={() => selectChat(chat.id)}
            className={chat.id === activeChatId ? "active-chat-item" : ""}
          >
            {chat.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
