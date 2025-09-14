"use client"
import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  GithubAuthProvider
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/firebase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null); // Add userData state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Create or update user document in Firestore
        const userDoc = await createUserDocument(user);
        setUser(user);
        setUserData(userDoc); // Set user data
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Create user document in Firestore and return the data
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

        const userData = {
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
            experienceLevel: 'beginner',
            notifications: {
              recommendations: true,
              goodFirstIssues: false
            }
          },
          savedRepositories: [],
          collections: []
        };
        
        await setDoc(userRef, userData);
        return userData;
      } else {
        // Update last login time
        await updateDoc(userRef, {
          lastLoginAt: serverTimestamp()
        });
        
        // Return the existing user data
        return userSnap.data();
      }
    } catch (error) {
      console.error('Error creating user document:', error);
      return null;
    }
  };

  // Update user preferences
  const updateUserPreferences = async (preferences) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        preferences: preferences
      });
      
      // Update local state
      setUserData(prev => ({
        ...prev,
        preferences: preferences
      }));
      
      return { success: true };
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
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
      setUserData(null);
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    userData, // Add userData to context value
    loading,
    signInWithGoogle,
    signInWithGitHub,
    logout,
    updateUserPreferences, // Add the new function
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};