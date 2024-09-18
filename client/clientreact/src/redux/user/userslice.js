import { createSlice } from "@reduxjs/toolkit";

const initialState= {
  loading: false,
  error: null,
  currentUser: null
}

const todosSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    singInStart(state) {
        state.error = null;
        state.loading = true
    },
    signInSuccess(state, action) {
      state.loading = false;
      state.error = null;
      state.currentUser = action.payload
    },
    signInFailure (state,action){
        state.loading = false,
        state.error = action.payload
    }
  },
});

export const { signInFailure,signInSuccess,singInStart } = todosSlice.actions;
export default todosSlice.reducer;