import axios from "axios";

// const BASE_URL = "http://localhost:3000/api";

const BASE_URL = "https://pdf-chat-application-be.onrender.com/api";

export const uploadPdf = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(`${BASE_URL}/upload-pdf?file`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading PDF:", error);
    throw error;
  }
};

export const askQuestion = async (question: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/ask`, {
      question,
    });
    return response.data;
  } catch (error) {
    console.error("Error asking question:", error);
    throw error;
  }
};
