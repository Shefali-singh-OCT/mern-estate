import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: null,
  currentUser: null,
};

const todosSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    initialStart(state) {
      state.currentUser = null;
      state.error = null;
      state.loading = false;
    },
    defaultsetting(state) {
      state.error = null;
      state.loading = false;
    },
    singInStart(state) {
      state.error = null;
      state.loading = true;
    },
    signInSuccess(state, action) {
      state.loading = false;
      state.error = null;
      state.currentUser = action.payload;
    },
    signInFailure(state, action) {
      (state.loading = false), (state.error = action.payload);
    },
    updateUserStart(state) {
      state.loading = true;
    },
    updateUserSuccess(state, action) {
      (state.currentUser = action.payload),
        (state.loading = false),
        (state.error = null);
    },
    updateUserFailure(state, action) {
      (state.loading = false), (state.error = action.payload);
    },
    deleteUserStart(state) {
      state.loading = true;
    },
    deleteUserSuccess(state) {
      (state.currentUser = null), (state.loading = false), (state.error = null);
    },
    deleteUserFailure(state, action) {
      (state.loading = false), (state.error = action.payload);
    },
    signoutUserStart(state) {
      state.loading = true;
    },
    signoutUserSuccess(state) {
      (state.currentUser = null), (state.loading = false), (state.error = null);
    },
    signoutUserFailure(state, action) {
      (state.loading = false), (state.error = action.payload);
    },
  },
});

export const {
  signInFailure,
  signInSuccess,
  singInStart,
  updateUserStart,
  updateUserFailure,
  updateUserSuccess,
  deleteUserFailure,
  defaultsetting,
  deleteUserStart,
  deleteUserSuccess,
  signoutUserFailure,
  signoutUserStart,
  signoutUserSuccess,
  initialStart,
} = todosSlice.actions;
export default todosSlice.reducer;
