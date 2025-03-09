async function searchMoe(files){

    console.log("searchMoe called");
    if (!files.length) return; 

    const file = files[0]; 
    const formData = new FormData();
    formData.append("image", file); 

    let proxyServer = new XMLHttpRequest();
    let xhr = new XMLHttpRequest();

    xhr.open("POST", "https://api.trace.moe/search", true);
    xhr.send(formData);
    
    xhr.onloadstart = function() {
        console.log("searchMoe called");
    }

    imageList = [];
    xhr.onload = async function () {
        if (xhr.status === 200 && xhr.readyState === 4) {
            try {
                const parsedResult = JSON.parse(xhr.responseText);
                console.log(JSON.stringify(parsedResult, null, 2));

                if (parsedResult?.result?.length > 0) {

                    parsedResult.result.map(async (item, index) => {
                        console.log(item.image);
                        imageList.push(item.image);
                    
                    });

                } else {
                    console.log("No results found.");
                }
            } catch (error) {
                console.error("Error parsing JSON:", error);
            }
        } else {
            console.error("Request failed with status:", xhr.status);
        }
    };


    xhr.onloadend = function() {
        console.log("searchMoe finished");

        console.table(imageList);
        appendImages(imageList);
    }


    xhr.onerror = function () {
        console.log(xhr.status);
        console.log(xhr.statusText);
    };

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

async function appendImages(imageUrls) {
    console.log("Image appending initiating...");
    const cards = document.querySelectorAll('.exampleCard');

    if (imageUrls.length > cards.length) {
        console.log("More images then cards.");

        for (let i = 0; i < imageUrls.length; i++) {
            const card = cards[i];
            const imageUrl = imageUrls[i];
    
            try {
                const dataUrl = await downloadImageToBuffer(imageUrl); 

                card.style.backgroundImage = `url(${dataUrl})`; 
    
            } catch (error) {
                console.error(`Error processing image ${i}:`, error);
            }
        }

    }else if (imageUrls.length < cards.length) {
        console.log("More cards then images.");
        return 0;
    }

}