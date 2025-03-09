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


app.get('/uploadImage', async (req, res) => {
    const imageUrl = req.query.url;

    if(!imageUrl){
        return res.status(400).send('No image URL provided');
    }


    try {
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

        const buffer = Buffer.from(response.data, 'binary');
        res.set('Content-Type', response.headers['content-type']);

        res.send(buffer);

    } catch (error) {
        console.error("Error proxying image:", error);
        res.status(500).send("Error proxying image");
    }
});


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});


