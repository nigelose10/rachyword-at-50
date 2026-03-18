import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out", error);
    throw error;
  }
};

export const submitRSVP = async (uid: string, name: string, email: string, city: string, plusOne: boolean) => {
  try {
    // Check if user already RSVP'd
    const q = query(collection(db, 'rsvps'), where('uid', '==', uid));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      throw new Error("You have already submitted an RSVP.");
    }

    const docRef = await addDoc(collection(db, 'rsvps'), {
      uid,
      name,
      email,
      city,
      status: 'Pending',
      plusOne,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error submitting RSVP", error);
    throw error;
  }
};
