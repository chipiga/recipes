import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { auth, db } from "@/firebase";
import { fetchFavoritesFromFirebase, setFavorites } from "./favoritesSlice";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export const startAuthListener = createAsyncThunk("auth/listen", async (_, { dispatch }) => {
  onAuthStateChanged(auth, async (u) => {
    if (u) {
      const ref = doc(db, "users", u.uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        await setDoc(ref, { email: u.email, role: "user" });
        dispatch(setUser({ uid: u.uid, email: u.email, role: "user" }));
      } else {
        dispatch(setUser({ uid: u.uid, email: u.email, role: snap.data()?.role || "user" }));
      }
      // Sync favorites from Firebase after login
      dispatch(fetchFavoritesFromFirebase(u.uid));
    } else {
      dispatch(setUser(null));
      // Optionally clear favorites on logout
      // dispatch(setFavorites([]));
    }
  });
});

export const loginWithGoogle = createAsyncThunk("auth/google", async (_, { dispatch }) => {
  const provider = new GoogleAuthProvider();
  const res = await signInWithPopup(auth, provider);
  const userDoc = doc(db, "users", res.user.uid);
  const snapshot = await getDoc(userDoc);

  if (!snapshot.exists()) {
    await setDoc(userDoc, { email: res.user.email, role: "user" });
  }

  return { uid: res.user.uid, email: res.user.email, role: snapshot.data()?.role || "user" };
});

export const loginWithEmail = createAsyncThunk("auth/email", async ({ email, password }, { dispatch }) => {
  const res = await signInWithEmailAndPassword(auth, email, password);
  const userDoc = doc(db, "users", res.user.uid);
  const snapshot = await getDoc(userDoc);
  return { uid: res.user.uid, email: res.user.email, role: snapshot.data()?.role || "user" };
});

export const registerWithEmail = createAsyncThunk("auth/register", async ({ email, password }, { dispatch }) => {
  const res = await createUserWithEmailAndPassword(auth, email, password);
  const userDoc = doc(db, "users", res.user.uid);
  await setDoc(userDoc, { email: res.user.email, role: "user" });
  return { uid: res.user.uid, email: res.user.email, role: "user" };
});

export const logout = createAsyncThunk("auth/logout", async () => {
  await signOut(auth);
});

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null },
  reducers: {
    setUser(state, action) {
      state.user = action.payload; // or null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(registerWithEmail.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      });
  },
});
export const { setUser } = authSlice.actions;
export default authSlice.reducer;