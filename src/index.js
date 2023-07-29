import css from "./style.css";

import { displayContent } from "./apps/displayContent";
import { showModals } from "./apps/showModals";


// Sidebar events
displayContent.addSidebarEvents();

// Back button events
displayContent.backBtnEvents();

// Add button event
showModals.addButtonEvent();



