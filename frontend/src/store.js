import {configureStore} from "@reduxjs/toolkit"
import createVideoPopupShowReducer from "./slice/createVideoPopupShow.js"

const store = configureStore({
    reducer: {
        createVideoPopup: createVideoPopupShowReducer
    }
})

export default store;