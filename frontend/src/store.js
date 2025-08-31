import {configureStore} from "@reduxjs/toolkit"
import createVideoPopupShowReducer from "./slice/createVideoPopupShow.js"
import sidebarHandlerReducer from "./slice/sidebarHandler.js";

const store = configureStore({
    reducer: {
        createVideoPopup: createVideoPopupShowReducer,
        sidebarHandler: sidebarHandlerReducer
    }
})

export default store;