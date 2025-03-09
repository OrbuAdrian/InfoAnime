const express = require('express');
const cors = require("cors");
const path = require('path');
const fs = require('fs');
const axios = require('axios');

const app = express();
app.use(express.json());

app.use(cors({
    origin: "*",  // Allow all origins for debugging
    methods: ["GET", "POST", "OPTIONS"], // Explicitly allow these methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
}));

app.options('*', cors());

const PORT = 3000;
const UPLOAD_DIR = path.join(__dirname, 'uploads');
const LOGS_DIR = path.join(__dirname, 'logs');



app.get('/uploadImage', async (req, res) => {
    console.log("uploadImage called");

    const imageUrl = req.query.url;

    console.log("imageUrl:", imageUrl);

    if(!imageUrl){
        return res.status(400).send('No image URL provided');
    }


    try {
        // Download the image using axios
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

        // Create a Buffer from the image data
        const buffer = Buffer.from(response.data, 'binary');

        // Set the Content-Type header
        res.set('Content-Type', response.headers['content-type']);

        // Send the Buffer as the response
        res.send(buffer);

    } catch (error) {
        console.error("Error proxying image:", error);
        res.status(500).send("Error proxying image");
    }
});

app.get("/logs", async (req, res) => {
    const text = req.query.txt || "No data received"; // Default if txt is missing
    console.log("Received:", text);

    res.json({ message: text }); // Send a JSON response
});

app.use("/uploads", express.static(UPLOAD_DIR));

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});


