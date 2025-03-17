
export function create_searchInput(callback) {

    let searchInput = document.createElement("input");

    searchInput.type = "text";
    searchInput.id = "search";
    searchInput.placeholder = "Search for anime";

    searchInput.addEventListener("keyup", async (event) => {
        if (event.key === "Enter") {

            window.variables = { searchTerm: searchInput.value, searchType: window.appSettings.activeQueryType };
            window.traceMoeBool = false;
            window.anilistBool = true;


            if (callback){
                
                callback(true);
            }
        }
    });

    return searchInput;
}