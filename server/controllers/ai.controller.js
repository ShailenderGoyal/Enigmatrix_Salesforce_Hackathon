import axios from "axios";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";


export async function handleSummary(req, res) {
    try{
        const {text}=req.body;
        console.log(`${process.env.AI_SERVER}/summarize`);
        
          const response = await axios.post(`${process.env.AI_SERVER}/summarize`, {
  "text": text,
  "max_length": 150,
  "min_length": 20
});
    // console.log(response);
    // console.log("response data");
    console.log(response.data);
    res.status(200).json({message:"result fetched successfully",result:response.data});
    
    }
    catch (error) {
      res.status(error.status || 500).json({ message: 'Server error',err:error });
    }

};

export const handleAiResponse = async (req, res) => {
  try {
    // console.log("Ai called");
    
    const { prompt } = req.body; 
    
    if (!prompt) {
      return res.status(400).json({ error: "No  text provided" });
    }

    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // console.log("Sending prompt to Gemini...");

    const result = await model.generateContent(prompt);
    const responseText = result.response.text(); 

    // console.log("Gemini Response:", responseText);
    // console.log("Gemini Response Received");

    return res.status(200).json({ans:responseText});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
};