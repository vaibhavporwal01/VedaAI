"use client";

import { create } from "zustand";
import { APP_PROFILE } from "@/lib/constants";

export interface ProfileState {
  name: string;
  initials: string;
  schoolName: string;
  schoolLocation: string;
  setProfile: (profile: Partial<Omit<ProfileState, "setProfile">>) => void;
}

const STORAGE_KEY = "vedaai.profile";

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "VP";
  }

  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function readProfile() {
  if (typeof window === "undefined") {
    return APP_PROFILE;
  }

  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}") as Partial<ProfileState>;
    const name = saved.name?.trim() || APP_PROFILE.name;
    return {
      ...APP_PROFILE,
      ...saved,
      name,
      initials: initialsFromName(name)
    };
  } catch {
    return APP_PROFILE;
  }
}

export const useProfileStore = create<ProfileState>((set) => ({
  ...readProfile(),
  setProfile: (profile) =>
    set((state) => {
      const name = profile.name?.trim() || state.name;
      const next = {
        ...state,
        ...profile,
        name,
        initials: initialsFromName(name)
      };

      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            name: next.name,
            schoolName: next.schoolName,
            schoolLocation: next.schoolLocation
          })
        );
      }

      return next;
    })
}));
