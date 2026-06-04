// // // store/index.ts
// // import { configureStore } from "@reduxjs/toolkit";
// // import authReducer from "@/src/state/authSlice";

// // export const store = configureStore({
// //   reducer: {
// //     auth: authReducer.reducer,
// //   },
// // });

// // export type RootState = ReturnType<typeof store.getState>;
// // export type AppDispatch = typeof store.dispatch;

// import { configureStore } from "@reduxjs/toolkit";
// import { persistStore, persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage'; // localStorage
// import authReducer from "@/src/state/authSlice";

// const persistConfig = {
//   key: 'root',
//   storage,
//   whitelist: ['auth'] // only persist auth slice
// };

// const persistedReducer = persistReducer(persistConfig, authReducer.reducer);

// export const store = configureStore({
//   reducer: {
//     auth: persistedReducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
//       },
//     }),
// });

// export const persistor = persistStore(store);
// export type RootState = ReturnType<typeof store.getState>;

import { configureStore } from "@reduxjs/toolkit"
import { persistStore, persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"
import { combineReducers } from "@reduxjs/toolkit"
import authSlice from "./authSlice"

// Create a safe storage wrapper for SSR
const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null)
    },
    setItem(_key: string, value: any) {
      return Promise.resolve(value)
    },
    removeItem(_key: string) {
      return Promise.resolve()
    },
  }
}

// Use safe storage that works in both client and server
const safeStorage = typeof window !== "undefined" ? storage : createNoopStorage()

const authPersistConfig = {
  key: "auth",
  storage: safeStorage,
  blacklist: ["loading"],
}

export const store = configureStore({
  reducer: {
    auth: persistReducer(authPersistConfig, authSlice.reducer),
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/REGISTER",
          "persist/PURGE",
          "persist/FLUSH",
          "persist/PAUSE",
        ],
      },
    }),
})

export const persistor = persistStore(store)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

