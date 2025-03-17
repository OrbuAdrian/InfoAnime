import { create_searchLabel, create_searchInput, create_fileInput, create_searchWindow } from "./search_window/searchWindow.js"; 
import { run_slideAnimation, run_transformCardsAnimation, create_displayWindow, create_displayTypeSettings} from "./display_window/displayWindow.js";

window.traceMoeData, window.anilistData;
let apiData = {};
let query;
window.variables;
let container
window.isCharacterData = false;

window.anilistBool = true;
window.traceMoeBool = false;
let searchWindow, fileInput, searchInput, searchLabel, exWindow, apiDataLength, img;

window.appSettings = {
    activeQueryType: "ANIME" // Default query type
};

let inputFiles;


document.addEventListener('DOMContentLoaded', async () => {
     
    container = document.createElement("div");
    container.className = "container";

    searchWindow = create_searchWindow();
    exWindow = create_displayWindow();
    
    searchLabel = create_searchLabel((callback) => {
        if (callback) {
            fileInput.click();
        }
    });
    fileInput = create_fileInput((files) => {
        if (files && files.length > 0) {
            inputFiles = files;
            window.appSettings.activeQueryType = null;
            loadMainPage();
        }
    });
    searchInput = create_searchInput((callback) => {
        if (callback) {
            loadMainPage();
        }
    });

    loadMainPage();
});

async function loadMainPage() {

    container.innerHTML = '';
    exWindow.innerHTML = '';


    loadSearchWindow();
    await loadPreviewWindow();
    
    document.body.appendChild(container);

    run_slideAnimation();
    run_transformCardsAnimation();
};

function loadSearchWindow(){

    let screen = document.createElement("div");

    screen.appendChild(searchInput);
    screen.appendChild(fileInput);
    screen.appendChild(searchLabel);

    searchWindow.appendChild(screen);
    container.appendChild(searchWindow);
    
}

async function loadPreviewWindow(){
    apiData = {};

    const cardLines = [];

    let cardsTypeSettings = create_displayTypeSettings(searchInput, (wasClicked) => {
        if (wasClicked) {
            console.log("Was clicked");

            loadMainPage();
        }
    });

    let cardsWindow = document.createElement("div");
    cardsWindow.className = "examplesColumn";
    

    console.log("Trace moe bool is ", window.traceMoeBool);
    console.log("Anilist bool is ", window.anilistBool);

    if (window.traceMoeBool) {
        
        window.traceMoeData = await searchTraceMoe(inputFiles);

        let filteredAnime = filterResultsByAnime(window.traceMoeData);
        window.traceMoeData = filterResultsBySimilarity(filteredAnime);

        await Promise.all(window.traceMoeData.result.map(async (element, index) => {
            try {
                // Use imageUrlToArrayBuffer instead of downloadImageToBuffer
                const image = await downloadImageToBuffer(element.image);
                console.log(image);

                apiData[index] = {
                    id: element.anilist,
                    img: image,
                    similarity: element.similarity,
                    episode: element.episode,
                    from: element.from,
                    to: element.to
                };
                
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
            
            
            for (let j = 0; j < i + 1; j++) { 
                let exCard = document.createElement("div"); 
                exCard.className = "responseCard";
                

                let image = apiData[cardCounter].img; 
                exCard.style.backgroundImage = `url(${image})`;
                
                exCard.dataset.id = apiData[cardCounter].id;
                exCard.dataset.similarity = apiData[cardCounter].similarity;
                exCard.dataset.episode = apiData[cardCounter].episode;
                exCard.dataset.from = apiData[cardCounter].from;
                exCard.dataset.to = apiData[cardCounter].to;
                
                
                cardLine.appendChild(exCard);
                cardCounter++; 
            }
            
            cardLines.push(cardLine);
        }

        
    } else if (window.anilistBool) {

        window.anilistData = await searchAnilist(null, window.variables);
        
        if (!window.isCharacterData) {
            
            window.anilistData = window.anilistData.data.Page.media.filter(media => !media.isAdult);
            console.log(window.anilistData);
            window.anilistData.forEach((element, index) => {
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
                    link: element.siteUrl
                };
            
            });
        } else {
            
            window.anilistData.data.Page.characters.forEach((element, index) => {
                apiData[index] = {};

                apiData[index] = {
                    id: element.id,
                    name: element.name.full,
                    img: element.image.large
                };
            
            });
 
        }


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
        cardsWindow.appendChild(cardLines[k]);
    }
    

    exWindow.appendChild(cardsTypeSettings);
    exWindow.appendChild(cardsWindow);
    container.appendChild(exWindow);

}
