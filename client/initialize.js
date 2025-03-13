
let traceMoeData, anilistData;
apiData = {};
let query, variables;
let container

let anilistFunc, traceMoeFunc;

document.addEventListener('DOMContentLoaded', async () => {
     
    container = document.createElement("div");
    container.className = "container";

    searchWindow = document.createElement("div");
    searchWindow.className = "searchColumn";
    
    loadSearchWindow();
    await loadPreviewWindow();

    document.body.appendChild(container);

    runSlideAnimation();
    transformCards();
});

function loadSearchWindow(){

    let searchInput = document.createElement("input");
    let fileInput = document.createElement("input");
    let searchLabel = document.createElement("label");

    searchInput.type = "text";
    searchInput.id = "search";
    searchInput.placeholder = "Search for anime";


    searchInput.addEventListener("keyup", async (event) => {
        if (event.key === "Enter") {

            exWindow = document.querySelector(".examplesColumn");
            container.removeChild(exWindow);

            console.log(searchInput.value);
            variables = { searchTerm: searchInput.value, searchType: "ANIME" };

            anilistFunc = true;
            traceMoeFunc = false;

            await loadPreviewWindow();

            document.body.appendChild(container);

            runSlideAnimation();
            transformCards();
        }
    });


    
    fileInput.type = "file";
    fileInput.id = "searchBar";
    fileInput.accept = "image/*";
    fileInput.placeholder = "Upload an image";


    fileInput.addEventListener("change", async (files) => {
        exWindow = document.querySelector(".examplesColumn");
        container.removeChild(exWindow);

        traceMoeFunc = true;
        anilistFunc = false;

        traceMoeData = await searchMoe(files.target.files);
        await loadPreviewWindow();

        document.body.appendChild(container);

        runSlideAnimation();
        transformCards();
    });
    
    searchLabel.for = "searchBar";
    searchLabel.className = "searchBar";
    searchLabel.innerHTML = "Choose an image";
    searchLabel.addEventListener("click", () => {
        fileInput.click();
    });

    searchWindow.appendChild(searchInput);
    searchWindow.appendChild(fileInput);
    searchWindow.appendChild(searchLabel);

    container.appendChild(searchWindow);

}

async function loadPreviewWindow(){
    apiData = {};

    exWindow = document.createElement("div");
    exWindow.className = "examplesColumn";

    const cardLines = [];

    if (traceMoeFunc) {

        filteredAnime = filterResultsByAnime(traceMoeData);
        traceMoeData = filterResultsBySimilarity(filteredAnime);

        await Promise.all(traceMoeData.result.map(async (element, index) => {
            try {
                // Use imageUrlToArrayBuffer instead of downloadImageToBuffer
                const image = await downloadImageToBuffer(element.image);
                
                apiData[index] = {
                    id: element.anilist,
                    img: image,
                    similarity: element.similarity,
                    episode: element.episode,
                    from: element.from,
                    to: element.to
                };
                
                console.log(apiData[index]);
            } catch (error) {
                console.error(`Error processing image ${index}:`, error);
            }
        }));

        let cardCounter = 0;
    

        for (let i = 0; i < 3; i++) {

            let cardLine = document.createElement("div");
            
            cardLine.className = "cardLine";
            cardLine.style.animation = 'none';  
            cardLine.style.top = `${i * 33.33}%`;
            
            exWindow.appendChild(cardLine);
            
            for (let j = 0; j < i + 1; j++) { 
                let exCard = document.createElement("div"); 
                exCard.className = "responseCard";


                img = apiData[cardCounter].img; 
                exCard.style.backgroundImage = `url(${img})`;

                exCard.dataset.id = apiData[cardCounter].id;
                exCard.dataset.similarity = apiData[cardCounter].similarity;
                exCard.dataset.episode = apiData[cardCounter].episode;
                exCard.dataset.from = apiData[cardCounter].from;
                exCard.dataset.to = apiData[cardCounter].to;


                cardLine.appendChild(exCard);
                cardCounter++; 
              }

        }

        
    } else if (anilistFunc || !traceMoeFunc) {

        anilistData = await searchAnilist(null, variables);


        anilistData.data.Page.media.forEach((element, index) => {
            apiData[index] = {};

            apiData[index] = {
                id: element.id,
                title: {
                    english: element.title.english,
                    romaji: element.title.romaji,
                    native: element.title.native,
                },
                img: element.coverImage.large,
                avgScore: element.averageScore,
                popularity: element.popularity,
            };
        });


        console.log(apiData);

        apiDataLength = Object.keys(apiData).length

        let step = 1;
        let i = 0;


        while (i < apiDataLength) { 
            let cardLine = document.createElement("div");
            cardLine.className = "cardLine";
            
    
            for (let j = 0; j < step; j++){
    
                if (i + j >= apiDataLength) {
                    break;
                }
    
                let exCard = document.createElement("div");
                exCard.className = "responseCard";
    
                img = apiData[j + i].img;
                exCard.style.backgroundImage = `url(${img})`;
                
                cardLine.appendChild(exCard);
            }
    
            cardLines.push(cardLine);
            i += step;
            step = (step % 3) + 1;

        }


        
    }
    
    for (let k = cardLines.length - 1; k >= 0; k--) {

        exWindow.appendChild(cardLines[k]);
    }
    
    container.appendChild(exWindow);

}

async function imageUrlToArrayBuffer(imageUrl) {
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
  }