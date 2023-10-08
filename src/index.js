import css from "./style.css";
import { onLoadScreen } from "./apps/onLoadScreen";

import { displayContent } from "./apps/displayContent";
import { showModals } from "./apps/showModals";
import { displayContentTimeFiltered } from "./displayContentTimeFiltered";

// Sidebar events
displayContent.addSidebarEvents();

// Back button events
displayContent.backBtnEvents();

// Add button event
showModals.addButtonEvent();

// On Load display events
onLoadScreen.addOnLoadEvents();

// Display today previews as default item display
displayContentTimeFiltered.displayTimeFiltered('today');




