import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { auth, db } from "@/firebase";
import { fetchFavoritesFromFirebase } from "./favoritesSlice";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

/**
 * @typedef {Object} AppUser
 * @property {string} uid
 * @property {string} email
 * @property {('user'|'admin')} role
 */

/**
 * Start Firebase auth state listener and sync user + favorites.
 * Dispatches `setUser` and triggers `fetchFavoritesFromFirebase` on login.
 */
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

/**
 * Sign in with Google via popup.
 * @returns {Promise<AppUser>} The signed in user profile.
 */
export const loginWithGoogle = createAsyncThunk("auth/google", async () => {
  const provider = new GoogleAuthProvider();
  const res = await signInWithPopup(auth, provider);
  const userDoc = doc(db, "users", res.user.uid);
  const snapshot = await getDoc(userDoc);

  if (!snapshot.exists()) {
    await setDoc(userDoc, { email: res.user.email, role: "user" });
  }

  return { uid: res.user.uid, email: res.user.email, role: snapshot.data()?.role || "user" };
});

/**
 * Email/password login.
 * @param {{ email: string, password: string }} params
 * @returns {Promise<AppUser>}
 */
export const loginWithEmail = createAsyncThunk("auth/email", async ({ email, password }) => {
  const res = await signInWithEmailAndPassword(auth, email, password);
  const userDoc = doc(db, "users", res.user.uid);
  const snapshot = await getDoc(userDoc);
  return { uid: res.user.uid, email: res.user.email, role: snapshot.data()?.role || "user" };
});

/**
 * Create a new user with email/password.
 * @param {{ email: string, password: string }} params
 * @returns {Promise<AppUser>}
 */
export const registerWithEmail = createAsyncThunk("auth/register", async ({ email, password }) => {
  const res = await createUserWithEmailAndPassword(auth, email, password);
  const userDoc = doc(db, "users", res.user.uid);
  await setDoc(userDoc, { email: res.user.email, role: "user" });
  return { uid: res.user.uid, email: res.user.email, role: "user" };
});

/**
 * Sign out the current user.
 * @returns {Promise<void>}
 */
export const logout = createAsyncThunk("auth/logout", async () => {
  await signOut(auth);
});

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null },
  reducers: {
    /**
     * Set the current authenticated user or clear with `null`.
     * @param {import('@reduxjs/toolkit').Draft<{user: AppUser|null}>} state
     * @param {{ type: string, payload: AppUser|null }} action
     */
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