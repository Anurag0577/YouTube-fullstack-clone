import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

// create a async thunk for fetching a channel information
const fetchChannelInfo = createAsyncThunk(
    'ChannelInfo', // Action Type Prefix - Think of it as a Tracking Number for a package. Redux needs a unique ID to know exactly which process is happening across the entire application

    async (thunkAPI) => {
        try {
            const userDetails = JSON.parse(localStorage.getItem('user'))
            const channelId = userDetails.channel._id;
            // fetching the channel info from the DB
            const channelInfo = await api.get(`/channel/${channelId}`);
            return channelInfo?.data?.data; // retruning channel details object
        } catch (err) {
            console.log('Getting error while fetching channel info:', err)            
            return thunkAPI.rejectWithValue(err);
        }
    }
)

const channelSlice = createSlice({
    name: 'fetchChannelInfo',
    initialState: {
        data : null,
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {

        // The builder is just a tool Redux Toolkit provides to make the code readable and type-safe. Instead of writing a giant, messy switch statement, you use the addCase method.

        builder.addCase(fetchChannelInfo.fulfilled, (state, action) => {
            state.data = action.payload; // This is the channelInfo.data.data you returned
            state.loading = false;
        }),
        builder.addCase(fetchChannelInfo.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(fetchChannelInfo.rejected, (state, action) => {
            state.error = action.payload; // This is the channelInfo.data.data you returned
            state.loading = false;
        })
    }
})

export {fetchChannelInfo};
export default channelSlice.reducer;