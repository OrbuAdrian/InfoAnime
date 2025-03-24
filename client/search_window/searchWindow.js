import {create_searchLabel} from "./searchLabel.js";
import { create_searchInput } from "./searchInput.js";
import { create_fileInput } from "./fileInput.js";

export function create_searchWindow(){
    let searchWindow = document.createElement("div");
    searchWindow.className = "searchColumn";

    return searchWindow;
}

export {create_searchLabel, create_searchInput, create_fileInput};