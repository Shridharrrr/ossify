'use client';

import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export function useSavedRepos() {
  const [user, setUser] = useState(null);
  const [savedRepos, setSavedRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Watch auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) fetchSavedRepos(u.uid);
    });
    return () => unsub();
  }, []);

  // Fetch repos from Firestore
  const fetchSavedRepos = async (uid) => {
    setLoading(true);
    const q = query(collection(db, "savedRepos"), where("uid", "==", uid));
    const querySnap = await getDocs(q);
    const repos = querySnap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setSavedRepos(repos);
    setLoading(false);
  };

  // Save repo
  const saveRepo = async (repo) => {
    if (!user) return alert("Please log in to save repos.");
    // Prevent duplicates
    const exists = savedRepos.find((r) => r.repoId === repo.id);
    if (exists) return;

    await addDoc(collection(db, "savedRepos"), {
      uid: user.uid,
      repoId: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      stars: repo.stars,
      html_url: repo.html_url,
      description: repo.description,
      difficulty_level : repo.difficulty_level,
      language: repo.language,
      savedAt: new Date(),
    });

    fetchSavedRepos(user.uid);
  };

  // Remove repo
  const removeRepo = async (docId) => {
    await deleteDoc(doc(db, "savedRepos", docId));
    if (user) fetchSavedRepos(user.uid);
  };

  const isSaved = (repoId) => {
  return savedRepos.some((r) => r.repoId === repoId);
  };

  return { user, savedRepos, loading, saveRepo, removeRepo, isSaved };
}
