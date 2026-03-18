import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAJ9YZdRrFzuvY7FwDDu6QKgQ98B2hikjw",
  authDomain: "dra50-2ee45.firebaseapp.com",
  projectId: "dra50-2ee45",
  storageBucket: "dra50-2ee45.firebasestorage.app",
  messagingSenderId: "185718528780",
  appId: "1:185718528780:web:dd28396ca9868c9de44729",
  measurementId: "G-LYMDHB9PQ0",
};

const app = initializeApp(firebaseConfig);

isSupported().then((supported) => {
  if (supported) getAnalytics(app);
});

export const auth = getAuth(app);
export const db = getFirestore(app);

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

export interface RSVPData {
  uid: string;
  title: string;
  surname: string;
  firstname: string;
  telephone: string;
  email: string;
  attendingThanksgiving: boolean;
  attendingBirthday: boolean;
  guestCategory: string;
  comments: string;
}

export const submitRSVP = async (data: RSVPData) => {
  try {
    const q = query(collection(db, 'rsvps'), where('uid', '==', data.uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      throw new Error("You have already submitted an RSVP.");
    }

    const docRef = await addDoc(collection(db, 'rsvps'), {
      ...data,
      status: 'Pending',
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error submitting RSVP", error);
    throw error;
  }
};
