import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: false
};

const createVideoPopupShow = createSlice({
    name: 'createVideoPopup',
    initialState,
    reducers: { // <-- FIXED: should be 'reducers'
        show: (state) => {
            state.value = true;
        },
        hide: (state) => {
            state.value = false;
        }
    }
});

export const { show, hide } = createVideoPopupShow.actions; // <-- FIXED: should be 'actions'
export default createVideoPopupShow.reducer;