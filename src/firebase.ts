import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
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

export const db = getFirestore(app);

export interface RSVPData {
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
    // Check for duplicate by email
    const q = query(collection(db, 'rsvps'), where('email', '==', data.email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      throw new Error("This email has already been used to RSVP.");
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
