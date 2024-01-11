import {configureStore} from '@reduxjs/toolkit';
import {gameApiSlice} from './gameApiSlice';


export default configureStore({
    reducer: {
        gameApi: gameApiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(gameApiSlice.middleware),
});