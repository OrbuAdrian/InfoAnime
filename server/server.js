const express = require('express');
const cors = require("cors");

const app = express();
app.use(express.json());

app.use(cors({
    origin: "*",  // Allow all origins for debugging
    methods: ["GET", "POST", "OPTIONS"], // Explicitly allow these methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
}));

app.options('*', cors());

const PORT = 3000;


app.get('/uploadImage', async (req, res) => {
    const imageUrl = req.query.url;

    if(!imageUrl){
        return res.status(400).send('No image URL provided');
    }


    try {
        const response = await fetch(imageUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        return arrayBuffer; // Return the ArrayBuffer directly
      } catch (error) {
        console.error("Error fetching image:", error);
        return null;
    }
});


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});


