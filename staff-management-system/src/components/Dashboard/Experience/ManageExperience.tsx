"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio";
import { toast } from "sonner";
import { ArrowRight, Plus } from "lucide-react";

export const ManageExperience = () => {
  const router = useRouter();
  const { data: session }: any = useSession();

  const [loading, setLoading] = useState(true);
  const [savingTeach, setSavingTeach] = useState(false);
  const [savingRes, setSavingRes] = useState(false);
  const [savingFi, setSavingFi] = useState(false);
  const [userProfile, setUserProfile] = useState<{ sname?: string; uname?: string }>({});

  const [teachData, setTeachData] = useState({
    teaching_ug: "",
    teaching_pg: "",
    teaching_mphil: "",
    teaching_phd: "",
  });

  const [resData, setResData] = useState({
    research_ug: "",
    research_pg: "",
    research_mphil: "",
    research_phd: "",
  });

  const [fiData, setFiData] = useState({
    field_industrial: "field",
    name_of_organisation: "",
    desgination: "",
    duration_From: "",
    duration_to: "",
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/staff/teaching_exp").then((r) => r.json()),
      fetch("/api/staff/research_exp").then((r) => r.json()),
      fetch("/api/staff/fi_exp").then((r) => r.json()),
    ])
      .then(([tRes, rRes, fRes]) => {
        if (tRes.user) setUserProfile(tRes.user);
        if (tRes.data) setTeachData((prev) => ({ ...prev, ...tRes.data }));
        if (rRes.data) setResData((prev) => ({ ...prev, ...rRes.data }));
        if (fRes.data) setFiData((prev) => ({ ...prev, ...fRes.data }));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleTeachSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingTeach(true);
    try {
      const res = await fetch("/api/staff/teaching_exp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(teachData),
      });
      if (res.ok) toast.success("Teaching Experience saved successfully!");
    } catch {
      toast.error("Failed to save teaching experience");
    } finally {
      setSavingTeach(false);
    }
  };

  const handleResSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingRes(true);
    try {
      const res = await fetch("/api/staff/research_exp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resData),
      });
      if (res.ok) toast.success("Research Experience saved successfully!");
    } catch {
      toast.error("Failed to save research experience");
    } finally {
      setSavingRes(false);
    }
  };

  const handleFiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingFi(true);
    try {
      const res = await fetch("/api/staff/fi_exp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fiData),
      });
      if (res.ok) toast.success("Field/Industrial Experience saved successfully!");
    } catch {
      toast.error("Failed to save field experience");
    } finally {
      setSavingFi(false);
    }
  };

  if (loading) return <div className="p-8 text-foreground font-medium">Loading Experience...</div>;

  return (
    <div className="space-y-6">
      <div className="text-muted-foreground text-sm font-medium">
        welcome : <span className="font-bold text-foreground">{userProfile.sname || userProfile.uname || session?.user?.name || "Staff"}</span>
      </div>

      <Card className="bg-card text-card-foreground border-border shadow-sm">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
            Teaching / Research / Field / Industrial Experience
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-8 pt-4">
          {/* Section 1: Teaching Experience */}
          <form onSubmit={handleTeachSubmit} className="space-y-4 pb-6 border-b border-border">
            <h3 className="text-base font-bold text-foreground">Teaching Experience</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs uppercase text-muted-foreground mb-1 font-semibold">UG</label>
                <Input
                  value={teachData.teaching_ug}
                  onChange={(e) => setTeachData({ ...teachData, teaching_ug: e.target.value })}
                  placeholder="e.g. 16 years"
                />
              </div>
              <div>
                <label className="block text-xs uppercase text-muted-foreground mb-1 font-semibold">PG</label>
                <Input
                  value={teachData.teaching_pg}
                  onChange={(e) => setTeachData({ ...teachData, teaching_pg: e.target.value })}
                  placeholder="e.g. 10 years"
                />
              </div>
              <div>
                <label className="block text-xs uppercase text-muted-foreground mb-1 font-semibold">M.Phil.</label>
                <Input
                  value={teachData.teaching_mphil}
                  onChange={(e) => setTeachData({ ...teachData, teaching_mphil: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs uppercase text-muted-foreground mb-1 font-semibold">Ph.D.</label>
                <Input
                  value={teachData.teaching_phd}
                  onChange={(e) => setTeachData({ ...teachData, teaching_phd: e.target.value })}
                />
              </div>
            </div>
            <Button type="submit" disabled={savingTeach} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus size={16} className="mr-1" />
              {savingTeach ? "Saving..." : "Update Teaching"}
            </Button>
          </form>

          {/* Section 2: Research Experience */}
          <form onSubmit={handleResSubmit} className="space-y-4 pb-6 border-b border-border">
            <h3 className="text-base font-bold text-foreground">Research Experience</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs uppercase text-muted-foreground mb-1 font-semibold">UG</label>
                <Input
                  value={resData.research_ug}
                  onChange={(e) => setResData({ ...resData, research_ug: e.target.value })}
                  placeholder="e.g. 16 years"
                />
              </div>
              <div>
                <label className="block text-xs uppercase text-muted-foreground mb-1 font-semibold">PG</label>
                <Input
                  value={resData.research_pg}
                  onChange={(e) => setResData({ ...resData, research_pg: e.target.value })}
                  placeholder="e.g. 10 years"
                />
              </div>
              <div>
                <label className="block text-xs uppercase text-muted-foreground mb-1 font-semibold">M.Phil.</label>
                <Input
                  value={resData.research_mphil}
                  onChange={(e) => setResData({ ...resData, research_mphil: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs uppercase text-muted-foreground mb-1 font-semibold">Ph.D.</label>
                <Input
                  value={resData.research_phd}
                  onChange={(e) => setResData({ ...resData, research_phd: e.target.value })}
                />
              </div>
            </div>
            <Button type="submit" disabled={savingRes} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus size={16} className="mr-1" />
              {savingRes ? "Saving..." : "Update Research"}
            </Button>
          </form>

          {/* Section 3: Field / Industrial Experience */}
          <form onSubmit={handleFiSubmit} className="space-y-4">
            <h3 className="text-base font-bold text-foreground">Field / Industrial Experience</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs uppercase text-muted-foreground mb-1 font-semibold">Select Type</label>
                <RadioGroup
                  value={fiData.field_industrial}
                  onValueChange={(val) => setFiData({ ...fiData, field_industrial: val })}
                  className="flex items-center gap-4 mt-2"
                >
                  {["field", "industrial"].map((opt) => (
                    <div key={opt} className="flex items-center space-x-1.5">
                      <RadioGroupItem value={opt} id={`fi-${opt}`} />
                      <label htmlFor={`fi-${opt}`} className="text-xs uppercase cursor-pointer text-foreground font-medium">
                        {opt}
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <label className="block text-xs uppercase text-muted-foreground mb-1 font-semibold">
                  Name Of The Sector/Organization
                </label>
                <Input
                  value={fiData.name_of_organisation}
                  onChange={(e) => setFiData({ ...fiData, name_of_organisation: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-muted-foreground mb-1 font-semibold">Designation</label>
                <Input
                  value={fiData.desgination}
                  onChange={(e) => setFiData({ ...fiData, desgination: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase text-muted-foreground mb-1 font-semibold">Duration From</label>
                <Input
                  value={fiData.duration_From}
                  onChange={(e) => setFiData({ ...fiData, duration_From: e.target.value })}
                  placeholder="e.g. June 2008"
                />
              </div>
              <div>
                <label className="block text-xs uppercase text-muted-foreground mb-1 font-semibold">To</label>
                <Input
                  value={fiData.duration_to}
                  onChange={(e) => setFiData({ ...fiData, duration_to: e.target.value })}
                  placeholder="e.g. May 2014"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" disabled={savingFi} className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus size={16} className="mr-1" />
                {savingFi ? "Saving..." : "Update Experience"}
              </Button>

              <Button
                type="button"
                onClick={() => router.push("/dashboard/course")}
                className="ml-auto bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Next <ArrowRight size={16} className="ml-1" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
