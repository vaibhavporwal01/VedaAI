"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Images, Plus, Search, UsersRound } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { MobileTitle } from "@/components/layout/Topbar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const initialGroups = [
  { id: "g-1", name: "Grade 8 A", students: 42, activeAssignments: 3 },
  { id: "g-2", name: "Computer Science Batch", students: 28, activeAssignments: 1 },
  { id: "g-3", name: "Revision Group", students: 35, activeAssignments: 2 }
];

export default function GroupsPage() {
  const [groups, setGroups] = useState(initialGroups);
  const [name, setName] = useState("");
  const [query, setQuery] = useState("");
  const filtered = groups.filter((group) => group.name.toLowerCase().includes(query.toLowerCase()));

  const addGroup = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) {
      return;
    }

    setGroups((current) => [
      { id: `g-${Date.now()}`, name: name.trim(), students: 0, activeAssignments: 0 },
      ...current
    ]);
    setName("");
  };

  return (
    <AppShell breadcrumb="My Groups" backHref="/">
      <MobileTitle title="My Groups" backHref="/" />
      <section className="mx-auto w-[calc(100vw-32px)] max-w-[373px] pt-6 desktop:w-auto desktop:max-w-[1280px] desktop:pt-9">
        <PageHeader title="My Groups" description="Class groups and assignment activity." icon={Images} />

        <div className="grid gap-4 desktop:grid-cols-[360px_1fr]">
          <form onSubmit={addGroup} className="rounded-[28px] bg-white p-5 shadow-card desktop:p-6">
            <h1 className="text-xl font-bold text-ink">Create Group</h1>
            <label className="mt-5 block">
              <span className="mb-2 block text-sm font-bold text-ink">Group Name</span>
              <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Grade 9 B" />
            </label>
            <Button className="mt-5 w-full" icon={<Plus size={20} />} type="submit">
              Add Group
            </Button>
          </form>

          <div className="rounded-[28px] bg-white p-5 shadow-card desktop:p-6">
            <div className="flex flex-col gap-4 desktop:flex-row desktop:items-center desktop:justify-between">
              <h2 className="text-xl font-bold text-ink">Groups</h2>
              <div className="relative desktop:w-[320px]">
                <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-disabled" size={20} />
                <Input className="pl-12" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search groups" />
              </div>
            </div>

            <div className="mt-5 grid gap-3 desktop:grid-cols-2">
              {filtered.map((group) => (
                <article key={group.id} className="rounded-[22px] bg-soft p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-ink">{group.name}</h3>
                      <p className="mt-1 text-sm text-mutedMcp">{group.students} students</p>
                    </div>
                    <span className="grid size-10 place-items-center rounded-full bg-white text-ink">
                      <UsersRound size={20} />
                    </span>
                  </div>
                  <div className="mt-5 flex items-center gap-2 text-sm font-bold text-mutedMcp">
                    <CheckCircle2 size={18} className="text-success" />
                    {group.activeAssignments} active assignments
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
