import { create_fileInput } from "./fileInput.js";

export function create_searchLabel(callback) {
    let searchLabel = document.createElement("label");
    let fileInput = create_fileInput();

    if (!fileInput) {
        console.error("fileInput is undefined in create_searchLabel");
        //return document.createElement("label"); // Return minimal element to avoid further errors
    }

    searchLabel.for = "searchBar";
    searchLabel.className = "searchBar";
    searchLabel.innerHTML = "Choose an image";
    searchLabel.addEventListener("click", () => {

        if (callback){
            
            callback(true);
        }
    });

    return searchLabel;
};