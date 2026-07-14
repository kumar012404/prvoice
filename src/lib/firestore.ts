"use client";

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { UserProfile, SocialLink, Analytics } from "./types";

// ─── Profile ────────────────────────────────────────────────────────────────

export async function getProfile(uid: string): Promise<UserProfile | null> {
  try {
    const snap = await getDoc(doc(db, "users", uid));
    if (!snap.exists()) return null;
    return snap.data() as UserProfile;
  } catch {
    return null;
  }
}

export async function saveProfile(uid: string, data: Partial<UserProfile>) {
  try {
    await setDoc(doc(db, "users", uid), { ...data, uid }, { merge: true });
  } catch (e) {
    console.error("saveProfile error", e);
  }
}

// ─── Social Links ────────────────────────────────────────────────────────────

export async function getSocialLinks(uid: string): Promise<SocialLink[]> {
  try {
    const snap = await getDocs(collection(db, "users", uid, "links"));
    return snap.docs.map((d) => d.data() as SocialLink);
  } catch {
    return [];
  }
}

export async function saveSocialLink(uid: string, link: SocialLink) {
  try {
    await setDoc(doc(db, "users", uid, "links", link.platform), link);
  } catch (e) {
    console.error("saveSocialLink error", e);
  }
}

// ─── Analytics ───────────────────────────────────────────────────────────────

export async function getAnalytics(uid: string): Promise<Analytics | null> {
  try {
    const snap = await getDoc(doc(db, "analytics", uid));
    if (!snap.exists()) return null;
    return snap.data() as Analytics;
  } catch {
    return null;
  }
}

export async function incrementProfileViews(uid: string) {
  try {
    await setDoc(
      doc(db, "analytics", uid),
      { profileViews: increment(1), totalClicks: 0, mostClicked: "" },
      { merge: true }
    );
  } catch {
    // silently fail
  }
}

export async function incrementLinkClick(uid: string, platform: string) {
  try {
    const ref = doc(db, "analytics", uid);
    await setDoc(
      ref,
      { totalClicks: increment(1), mostClicked: platform, profileViews: 0 },
      { merge: true }
    );
    // Also increment on link doc
    await setDoc(
      doc(db, "users", uid, "links", platform),
      { clicks: increment(1) },
      { merge: true }
    );
  } catch {
    // silently fail
  }
}

export async function initAnalytics(uid: string) {
  try {
    await setDoc(
      doc(db, "analytics", uid),
      { profileViews: 0, totalClicks: 0, mostClicked: "" },
      { merge: true }
    );
  } catch {
    // silently fail
  }
}
