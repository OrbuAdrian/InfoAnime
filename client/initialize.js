import { create_searchLabel, create_searchInput, create_fileInput, create_searchWindow } from "./search_window/searchWindow.js"; 
import { run_slideAnimation, run_transformCardsAnimation, create_displayWindow, create_displayTypeSettings, create_cardDetail} from "./display_window/displayWindow.js";

window.traceMoeData, window.anilistData;
let apiData = {};
let query;
window.variables = {
    searchType: "ANIME",
    searchID: null,
    searchTerm: null,
    sortType: null
};
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

    exWindow = create_displayWindow();
    searchWindow = create_searchWindow();
    
    searchLabel = create_searchLabel((callback) => {
        if (callback) {
            fileInput.click();
        }
    });
    fileInput = create_fileInput((files) => {
        if (files && files.length > 0) {
            inputFiles = files;
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

    if (searchWindow.classList.contains("cardSelected") && exWindow.classList.contains("cardSelected")) {
        requestAnimationFrame(() => {
            searchWindow.classList.toggle("cardSelected");
            exWindow.classList.toggle("cardSelected");
        });
        run_slideAnimation();
        run_transformCardsAnimation();
    }else {
        run_slideAnimation();
        run_transformCardsAnimation();
    }
    

};

async function loadSecondaryPage() {
    console.log("Loading secondary page");

    console.log(exWindow);
    exWindow.innerHTML = '';


    let cardDetail = create_cardDetail(window.appSettings.activeQueryType, apiData[window.appSettings.selectedCardID]);
    
    
    const type = window.appSettings.activeQueryType;
    window.appSettings.activeQueryType = null;
    let cardsTypeSettings = create_displayTypeSettings(searchInput, (wasClicked) => {
        if (!wasClicked) {
            window.appSettings.activeQueryType = type;
            loadMainPage();
        }
    });
    
    exWindow.appendChild(cardsTypeSettings);
    exWindow.appendChild(cardDetail);
    
    container.appendChild(exWindow);
    document.body.appendChild(container);

    requestAnimationFrame(() => {
        searchWindow.classList.toggle("cardSelected");
        exWindow.classList.toggle("cardSelected");
    
        const onTransitionEnd = (event) => {
            if (event.target === searchWindow) {
                searchWindow.removeEventListener('transitionend', onTransitionEnd);
                searchWindow.innerHTML = '';
            }
        };
    
        searchWindow.addEventListener('transitionend', onTransitionEnd);
    });
}

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
    let apiAnilistData = {};

    const cardLines = [];

    let cardsTypeSettings = create_displayTypeSettings(searchInput, (wasClicked) => {
        if (wasClicked) {

            loadMainPage();
        }
    });

    let cardsWindow = document.createElement("div");
    cardsWindow.className = "examplesColumn";
    

    if (window.traceMoeBool) {
        
        window.traceMoeData = await searchTraceMoe(inputFiles);

        let filteredAnime = filterResultsByAnime(window.traceMoeData);
        window.traceMoeData = filterResultsBySimilarity(filteredAnime);

        await Promise.all(window.traceMoeData.result.map(async (element, index) => {
            try {
 
                const image = await downloadImageToBuffer(element.image);


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
                
                exCard.dataset.id = cardCounter;
                exCard.dataset.anilistID = apiData[cardCounter].id;
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

        
        if (!window.isCharacterData) {
            
            window.anilistIDs = await searchAnilist("ID", window.variables);
            window.anilistIDS = window.anilistIDs.data.Page.media.filter(media => !media.isAdult)

            window.anilistIDs.data.Page.media.forEach((element, index) => {
                apiData[index] = {};

                apiData[index] = {
                    id: element.id,
                    img: element.coverImage.large,
                    title: {
                        english: element.title.english
                    }
                };
                
            });

        } else {
            window.anilistIDs = await searchAnilist("CHARACTER_ID", window.variables);

            window.anilistIDs.data.Page.characters.forEach((character, index) => {
                apiData[index] = {
                  id: character.id,
                  img: character.image.large
                };
                
              });
            
 
        }

        //console.table(apiData);
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
    
                exCard.dataset.id = (j + i);
                exCard.dataset.anilistID = apiData[j + i].id;

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

    let cards = cardsWindow.querySelectorAll('.responseCard');
    cards.forEach((card) => {
        card.addEventListener('click', async () => {

            window.appSettings.selectedCardID = card.dataset.anilistID;
            window.variables.searchID = card.dataset.anilistID;
            console.log("Card id selected is: " + card.dataset.anilistID);

            if (!window.isCharacterData) {
                window.anilistData = await searchAnilist("SERIES", window.variables);
                apiData[window.variables.searchID] = window.anilistData.data.Media;
            } else {
                window.anilistData = await searchAnilist("CHARACTER", window.variables);
                apiData[window.variables.searchID] = window.anilistData.data.Character;
            }
            
            loadSecondaryPage();
        });
    }); 
    

    exWindow.appendChild(cardsTypeSettings);
    exWindow.appendChild(cardsWindow);
    container.appendChild(exWindow);

}
