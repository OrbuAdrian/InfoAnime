async function appendImages(results) {
    
    const maxResults = 10; // Set the maximum number of results to display
    const nrOfResults = Math.min(results.result.length, maxResults);

    const responseWindow = document.querySelector('.examplesColumn');
    const parentHeight = responseWindow.offsetHeight;
    responseWindow.innerHTML = '';

    
    let cardCounter = 0;


    if (nrOfResults >= 6) {
        
        for (let i = 0; i < 3; i++) {
            const exCardHeight = parentHeight / 3;
            const cardLine = document.createElement('div');
            cardLine.classList.add('exampleCardLine');
            cardLine.style.height = `${exCardHeight}px`;
            cardLine.style.animation = 'none';
            
            
            
            for (let j = 0; j < i + 1; j++) {
                const exampleCard = document.createElement('div');
                exampleCard.classList.add('responseCard');
                exampleCard.dataset.anilist = results.result[cardCounter].anilist;

                dataUrl = await downloadImageToBuffer(results.result[cardCounter].image);
                exampleCard.style.backgroundImage = `url(${dataUrl})`; 
                

                startPosition = (j * exCardHeight);
                cardLine.style.top = `${startPosition}px`;
                
                cardCounter++;
                cardLine.appendChild(exampleCard);
            }

            responseWindow.appendChild(cardLine);
        }
    } 
    else if (nrOfResults >= 3){
        for (let i = 0; i < 2; i++) {
            const exCardHeight = parentHeight / 2;
            const cardLine = document.createElement('div');
            cardLine.classList.add('exampleCardLine');
            cardLine.style.height = `${exCardHeight}px`;
            cardLine.style.animation = 'none';
            
            
            
            for (let j = 0; j < i + 1; j++) {
                const exampleCard = document.createElement('div');
                exampleCard.classList.add('responseCard');

                dataUrl = await downloadImageToBuffer(results.result[cardCounter].image);
                exampleCard.style.backgroundImage = `url(${dataUrl})`; 
                

                startPosition = (j * exCardHeight);
                cardLine.style.top = `${startPosition}px`;
                
                cardCounter++;
                cardLine.appendChild(exampleCard);
            }

            responseWindow.appendChild(cardLine);
        }
    }
}

function filterResultsByAnime(results) {
    console.log("filterResultsByAnime called");

    // Group results by anilist ID and keep only the highest similarity for each anime
    const bestMatchByAnime = {};
    
    // First pass: find the best match for each anime
    results.result.forEach(item => {
        if (!bestMatchByAnime[item.anilist]) {
            bestMatchByAnime[item.anilist] = item;
        }
    });
    
    results.result = Object.values(bestMatchByAnime);
    
    console.log("Filtered to best match per anime:", results.result.length, "results");
    return results;
}

function filterResultsBySimilarity(results, threshold = 0.85, minResults = 6) {
    console.log("filterResultsBySimilarity called with threshold:", threshold);
    
    // Sort all results by similarity (highest first) before filtering
    results.result.sort((a, b) => b.similarity - a.similarity);
    
    // First try with the provided threshold
    let filtered = results.result.filter(item => item.similarity >= threshold);
    
    // If we have fewer than minResults, take the top minResults regardless of threshold
    if (filtered.length < minResults && results.result.length >= minResults) {
        console.log(`Less than ${minResults} results after threshold filtering. Taking top ${minResults} results.`);
        filtered = results.result.slice(0, minResults);
    }
    
    results.result = filtered;
    console.log("Final filtered results:", results.result.length);
    return results;
}


async function downloadImageToBuffer(imageUrl) {
    console.log("downloadImageToBuffer called");


    try {
        const response = await fetch(`http://localhost:3000/uploadImage?url=${encodeURIComponent(imageUrl)}`);
        if (!response.ok) throw new Error("Failed to fetch image");

        const blob = await response.blob();

        // Convert the Blob to a data URL
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = e => resolve(e.srcElement.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });

    }
    catch (error) { 
        console.error("Error fetching image:", error);
        return null;
    }
 
}