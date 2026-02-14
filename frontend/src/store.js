import {configureStore} from "@reduxjs/toolkit"
import createVideoPopupShowReducer from "./slice/createVideoPopupShow.js"
import sidebarHandlerReducer from "./slice/sidebarHandler.js";
import userSliceReducer from "./slice/authSlice.js"

const store = configureStore({
    reducer: {
        createVideoPopup: createVideoPopupShowReducer,
        sidebarHandler: sidebarHandlerReducer,
        userInfo: userSliceReducer
    },
})

export default store;