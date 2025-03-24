import { run_slideAnimation } from "./slideAnimation.js";
import { run_transformCardsAnimation } from "./transformAnimation.js";
import { create_displayTypeSettings } from "./displayTypeSettings.js";
import { create_cardDetail } from "./cardDetail.js";

export function create_displayWindow(){
    let exWindow = document.createElement("div");
    exWindow.className = "displayWindow";

    return exWindow;
}

export {run_slideAnimation, run_transformCardsAnimation, create_displayTypeSettings, create_cardDetail};