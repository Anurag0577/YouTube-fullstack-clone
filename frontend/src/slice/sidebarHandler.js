import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: true
};
const sidebarHandlerSlice = createSlice({
    name: "sidebarHandler",
    initialState,
    reducers: {
        showSidebar: (state) => {
            state.value = true
        },
        hideSidebar: (state) => {
            state.value = false;
        }
    }
})


export const {showSidebar, hideSidebar} = sidebarHandlerSlice.actions;
export default sidebarHandlerSlice.reducer;