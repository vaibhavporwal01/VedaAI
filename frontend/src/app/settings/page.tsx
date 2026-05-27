"use client";

import { FormEvent, useState } from "react";
import { Check, Settings } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { MobileTitle } from "@/components/layout/Topbar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useProfileStore } from "@/features/profile/store";

export default function SettingsPage() {
  const profile = useProfileStore();
  const setProfile = useProfileStore((state) => state.setProfile);
  const [name, setName] = useState<string>(profile.name);
  const [school, setSchool] = useState<string>(profile.schoolName);
  const [location, setLocation] = useState<string>(profile.schoolLocation);
  const [saved, setSaved] = useState(false);

  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProfile({ name, schoolName: school, schoolLocation: location });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  return (
    <AppShell breadcrumb="Settings" backHref="/">
      <MobileTitle title="Settings" backHref="/" />
      <section className="mx-auto w-[calc(100vw-32px)] max-w-[373px] pt-6 desktop:w-auto desktop:max-w-[1280px] desktop:pt-9">
        <PageHeader title="Settings" description="Profile and school workspace details." icon={Settings} />

        <form onSubmit={save} className="rounded-[28px] bg-white p-5 shadow-card desktop:w-[620px] desktop:p-6">
          <div className="flex items-center gap-4">
            <span className="grid size-16 place-items-center rounded-full bg-[#FFE1D8] text-lg font-black text-ink ring-1 ring-line">
              {profile.initials}
            </span>
            <div>
              <h1 className="text-xl font-bold text-ink">Profile</h1>
              <p className="text-sm font-medium text-mutedMcp">{name}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            <label>
              <span className="mb-2 block text-sm font-bold text-ink">Profile Name</span>
              <Input value={name} onChange={(event) => setName(event.target.value)} />
            </label>
            <label>
              <span className="mb-2 block text-sm font-bold text-ink">School</span>
              <Input value={school} onChange={(event) => setSchool(event.target.value)} />
            </label>
            <label>
              <span className="mb-2 block text-sm font-bold text-ink">Location</span>
              <Input value={location} onChange={(event) => setLocation(event.target.value)} />
            </label>
          </div>

          <Button className="mt-6" icon={saved ? <Check size={20} /> : undefined} type="submit">
            {saved ? "Saved" : "Save Changes"}
          </Button>
        </form>
      </section>
    </AppShell>
  );
}
