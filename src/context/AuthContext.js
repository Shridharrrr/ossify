import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  GithubAuthProvider
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Create or update user document in Firestore
        await createUserDocument(user);
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Create user document in Firestore
  const createUserDocument = async (user) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        const { displayName, email, photoURL, uid } = user;
        
        // Extract additional info based on provider
        let githubUsername = null;
        let providerData = user.providerData[0];
        
        if (providerData?.providerId === 'github.com') {
          // Extract GitHub username from profile URL or email
          githubUsername = providerData.uid || email?.split('@')[0];
        }

        await setDoc(userRef, {
          uid,
          displayName,
          email,
          photoURL,
          githubUsername,
          provider: providerData?.providerId || 'unknown',
          createdAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
          preferences: {
            languages: [],
            topics: [],
            experienceLevel: 'beginner'
          },
          savedRepositories: [],
          collections: []
        });
      } else {
        // Update last login time
        await setDoc(userRef, {
          lastLoginAt: serverTimestamp()
        }, { merge: true });
      }
    } catch (error) {
      console.error('Error creating user document:', error);
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
      
      const result = await signInWithPopup(auth, provider);
      return { success: true, user: result.user };
    } catch (error) {
      console.error('Google sign in error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Sign in with GitHub
  const signInWithGitHub = async () => {
    try {
      setLoading(true);
      const provider = new GithubAuthProvider();
      provider.addScope('read:user');
      
      const result = await signInWithPopup(auth, provider);
      
      // Get GitHub username from credential
      const credential = GithubAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      
      // You can use this token to fetch additional GitHub data if needed
      // Store the token securely if you plan to make GitHub API calls on behalf of the user
      
      return { success: true, user: result.user, githubToken: token };
    } catch (error) {
      console.error('GitHub sign in error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    signInWithGitHub,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};