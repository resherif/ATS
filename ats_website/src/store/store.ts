import { configureStore } from "@reduxjs/toolkit";
import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import jobsReducer from './jobSlice';
import CandidatesReducer from './CandidateSlice';
export const store = configureStore({
    reducer: {
        jobs: jobsReducer,
        Candidate:CandidatesReducer,
    },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
