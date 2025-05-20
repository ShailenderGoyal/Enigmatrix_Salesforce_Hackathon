import axios from "axios";
import dotenv from "dotenv";

export async function handleSummary(req, res) {
    try{
        const {text}=req.body;
        console.log(`${process.env.AI_SERVER}/summarize`);
        
          const response = await axios.post(`${process.env.AI_SERVER}/summarize`, {
  "text": text,
  "max_length": 150,
  "min_length": 40
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