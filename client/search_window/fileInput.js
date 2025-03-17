import { run_slideAnimation, run_transformCardsAnimation } from "../display_window/displayWindow.js";

export function create_fileInput(callback) {

    let fileInput = document.createElement("input");

    fileInput.type = "file";
    fileInput.id = "searchBar";
    fileInput.accept = "image/*";
    fileInput.placeholder = "Upload an image";

    fileInput.addEventListener("change", async (event) => {

        window.traceMoeBool = true;
        window.anilistBool = false;

        if (callback && event.target.files && event.target.files.length > 0) {
            callback(event.target.files); // Pass the files to the callback
        }
    });

    return fileInput;
}