// // store/authSlice.ts
// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// type User = {
//   id: string;
//   fullName: string;
//   email: string;
//   role: string;
// };


// type Profile = {
//   full_name: string;
//   study_year: number;
//   studentId: string;
//   program: string;
//   avatar?: string;
//   bio: string;
//   email: string;
//   userId: string;
// };

// export interface AuthState {
//   user: User | null;
//   profile: Profile | null;
//   token: string | null;
//   loading: boolean;
// }

// const initialState: AuthState = {
//   user: null,
//   profile: null,
//   token: null,
//   loading: false,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     setAuth: (
//       state,
//       action: PayloadAction<{ user: User; profile: Profile; token: string; loading: boolean; }>
//     ) => {
//       state.user = action.payload.user;
//       state.profile = action.payload.profile;
//       state.token = action.payload.token;
//       state.loading = action.payload.loading

//       localStorage.setItem("auth", JSON.stringify(state));
//     },
//     logOut: (state) => {
//       state.user = null;
//       state.profile = null;
//       state.token = null;
//       state.loading = false;

//       localStorage.removeItem("auth");
//     },
//     loadAuthFromStorage:  (state) => {
//       const stored = localStorage.getItem("auth");
//       if (stored) {
//         const parsed = JSON.parse(stored) as AuthState;
//         state.user = parsed.user;
//         state.profile = parsed.profile;
//         state.token = parsed.token;
//         state.loading = false;
//       }
//     },
//   },
// });

// export const { setAuth, logOut, loadAuthFromStorage } = authSlice.actions;
// export default authSlice;

import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

type User = {
  id: string
  fullName: string
  email: string
  role: string
}

type Profile = {
  full_name: string
  study_year: number
  studentId: string
  program: string
  avatar?: string
  bio: string
  email: string
  userId: string
  sex?: string
  dob?: string
  stateOfOrigin?: string
  signature?: string
  nextOfKin?: string
  kinAddress?: string
  kinPhone?: string
  phone?: string
  createdAt?: string
  updatedAt?: string
}

export interface AuthState {
  user: User | null
  profile: Profile | null
  token: string | null
  loading: boolean
  isAuthenticated: boolean
}

const initialState: AuthState = {
  user: null,
  profile: null,
  token: null,
  loading: false,
  isAuthenticated: false,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{
        user: User
        profile?: Profile | null
        token: string
        loading?: boolean
      }>,
    ) => {
      state.user = action.payload.user
      state.profile = action.payload.profile || null
      state.token = action.payload.token
      state.loading = action.payload.loading || false
      state.isAuthenticated = true
    },

    setProfile: (state, action: PayloadAction<Profile>) => {
      state.profile = action.payload
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },

    logOut: (state) => {
      state.user = null
      state.profile = null
      state.token = null
      state.loading = false
      state.isAuthenticated = false
    },
  },
  extraReducers: (builder) => {
    builder.addCase("persist/REHYDRATE", (state, action: any) => {
      state.loading = false
    })
  },
})

export const { setAuth, setProfile, setLoading, logOut } = authSlice.actions
export default authSlice
