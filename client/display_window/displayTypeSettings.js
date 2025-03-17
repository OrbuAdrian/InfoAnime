export function create_displayTypeSettings(searchInput, callback) {
    let cardsTypeSettings = document.createElement("div");

    cardsTypeSettings.className = "queryTypeSelectorSection";

    if (window.appSettings.activeQueryType !== null) {
        cardsTypeSettings.innerHTML = `
        <div class="queryTypeSelector" id="ANIME">
            <img width="64" height="64" src="https://img.icons8.com/glyph-neue/64/video.png" alt="anime"/>
        </div>
        <div class="queryTypeSelector" id="MANGA">
            <img width="64" height="64" src="https://img.icons8.com/ios-filled/64/book.png" alt="book"/>
        </div>
        <div class="queryTypeSelector" id="CHARACTER">
            <img width="64" height="64" src="https://img.icons8.com/glyph-neue/64/manga.png" alt="character"/>
        </div>
    `; 
    }else {
        cardsTypeSettings.innerHTML = `
        <div class="queryTypeSelector active" id="RETURN">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevrons-left">
                <path d="m11 17-5-5 5-5"/>
                <path d="m18 17-5-5 5-5"/>
            </svg>
        </div>

        `
    }
    

    cardsTypeSettings.querySelectorAll(".queryTypeSelector").forEach((element) => {
        if (element.id === window.appSettings.activeQueryType) {
            element.classList.add("active");
        }

        element.addEventListener("click", async () => {

            if (element.id !== "RETURN") {
                document.querySelectorAll(".queryTypeSelector").forEach((otherElement) => {
                    otherElement.classList.remove("active");
                });
        
                element.classList.add("active");
        
                window.variables = {searchTerm: searchInput.value == "" ? null : searchInput.value, searchType: element.id}
                window.appSettings.activeQueryType = element.id;

                if (element.id === "CHARACTER") {
                    window.isCharacterData = true;
                }else window.isCharacterData = false;

                window.traceMoeBool = false;
                window.anilistBool = true;

                if (callback) {
                    callback(true); 
                }
            } else {

                window.variables = {searchTerm: null, searchType: null};
                window.appSettings.activeQueryType = "ANIME";
                window.isCharacterData = false;

                window.traceMoeBool = false;
                window.anilistBool = true;

                if (callback) {
                    callback(true); 
                }
            }
           
        });
    });

    return cardsTypeSettings;

};