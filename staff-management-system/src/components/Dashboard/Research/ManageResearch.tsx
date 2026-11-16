"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio";
import { toast } from "sonner";
import { ArrowRight, Save } from "lucide-react";

export const ManageResearch = () => {
  const router = useRouter();
  const { data: session }: any = useSession();

  const [loading, setLoading] = useState(true);
  const [phdSaving, setPhdSaving] = useState(false);
  const [fellowSaving, setFellowSaving] = useState(false);

  const [phdData, setPhdData] = useState({
    obtained_phd: "YES",
    title_of_thesis: "",
    area_of_specialization: "",
    research_supervisor: "",
    research_center: "",
    month_year_reward: "",
  });

  const [fellowData, setFellowData] = useState({
    obtained_post_doctoral: "Not Applicable",
    name_of_fellowship: "",
    host_institution: "",
    duration_from: "",
    duration_to: "",
  });

  const [userProfile, setUserProfile] = useState<{ sname?: string; uname?: string }>({});

  useEffect(() => {
    Promise.all([
      fetch("/api/staff/research_phd").then((r) => r.json()),
      fetch("/api/staff/research_fellow").then((r) => r.json()),
    ])
      .then(([phdRes, fellowRes]) => {
        if (phdRes.user) setUserProfile(phdRes.user);
        if (phdRes.data) setPhdData((prev) => ({ ...prev, ...phdRes.data }));
        if (fellowRes.data) setFellowData((prev) => ({ ...prev, ...fellowRes.data }));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handlePhdSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhdSaving(true);
    try {
      const res = await fetch("/api/staff/research_phd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(phdData),
      });
      if (res.ok) toast.success("Ph.D. details saved successfully!");
      else toast.error("Failed to save Ph.D. details");
    } catch (err: any) {
      toast.error(err.message || "Error saving record");
    } finally {
      setPhdSaving(false);
    }
  };

  const handleFellowSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFellowSaving(true);
    try {
      const res = await fetch("/api/staff/research_fellow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fellowData),
      });
      if (res.ok) toast.success("Post Doctoral Fellowship details saved successfully!");
      else toast.error("Failed to save Fellowship details");
    } catch (err: any) {
      toast.error(err.message || "Error saving record");
    } finally {
      setFellowSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-foreground font-medium">Loading Research Details...</div>;

  return (
    <div className="space-y-6">
      <div className="text-muted-foreground text-sm font-medium">
        welcome : <span className="font-bold text-foreground">{userProfile.sname || userProfile.uname || session?.user?.name || "Staff"}</span>
      </div>

      <Card className="bg-card text-card-foreground border-border shadow-sm">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">Research Details</CardTitle>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Section 1: Ph.D. Details */}
          <form onSubmit={handlePhdSubmit} className="space-y-5 pb-6 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">Ph.D. Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
                  Whether Obtained Ph.D.
                </label>
                <RadioGroup
                  value={phdData.obtained_phd}
                  onValueChange={(val) => setPhdData({ ...phdData, obtained_phd: val })}
                  className="flex items-center gap-3 mt-2"
                >
                  {["YES", "NO", "Pursuing"].map((opt) => (
                    <div key={opt} className="flex items-center space-x-1.5">
                      <RadioGroupItem value={opt} id={`phd-${opt}`} />
                      <label htmlFor={`phd-${opt}`} className="text-xs cursor-pointer text-foreground font-medium">
                        {opt}
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
                  *Title of Thesis
                </label>
                <Input
                  type="text"
                  required
                  value={phdData.title_of_thesis}
                  onChange={(e) => setPhdData({ ...phdData, title_of_thesis: e.target.value })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
                  Area of Specialization
                </label>
                <Input
                  type="text"
                  value={phdData.area_of_specialization}
                  onChange={(e) => setPhdData({ ...phdData, area_of_specialization: e.target.value })}
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
                  Research Supervisor
                </label>
                <Input
                  type="text"
                  value={phdData.research_supervisor}
                  onChange={(e) => setPhdData({ ...phdData, research_supervisor: e.target.value })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
                  Research Center
                </label>
                <Input
                  type="text"
                  value={phdData.research_center}
                  onChange={(e) => setPhdData({ ...phdData, research_center: e.target.value })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
                  Month of Year and Award
                </label>
                <Input
                  type="text"
                  placeholder="e.g. October 2019"
                  value={phdData.month_year_reward}
                  onChange={(e) => setPhdData({ ...phdData, month_year_reward: e.target.value })}
                  className="w-full"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={phdSaving}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
            >
              <Save size={16} className="mr-1" />
              {phdSaving ? "Saving..." : "Update Ph.D."}
            </Button>
          </form>

          {/* Section 2: Post Doctoral Fellowship */}
          <form onSubmit={handleFellowSubmit} className="space-y-5">
            <h3 className="text-lg font-semibold text-foreground">Post Doctoral Fellowship</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
                  Whether Obtained Fellowship?
                </label>
                <RadioGroup
                  value={fellowData.obtained_post_doctoral}
                  onValueChange={(val) => setFellowData({ ...fellowData, obtained_post_doctoral: val })}
                  className="flex items-center gap-3 mt-2"
                >
                  {["Yes", "No", "Not Applicable"].map((opt) => (
                    <div key={opt} className="flex items-center space-x-1.5">
                      <RadioGroupItem value={opt} id={`fellow-${opt}`} />
                      <label htmlFor={`fellow-${opt}`} className="text-xs cursor-pointer text-foreground font-medium">
                        {opt}
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
                  Name Of The Fellowship
                </label>
                <Input
                  type="text"
                  value={fellowData.name_of_fellowship}
                  onChange={(e) => setFellowData({ ...fellowData, name_of_fellowship: e.target.value })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
                  Host Institution
                </label>
                <Input
                  type="text"
                  value={fellowData.host_institution}
                  onChange={(e) => setFellowData({ ...fellowData, host_institution: e.target.value })}
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
                  Duration : From
                </label>
                <Input
                  type="date"
                  value={fellowData.duration_from}
                  onChange={(e) => setFellowData({ ...fellowData, duration_from: e.target.value })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
                  To
                </label>
                <Input
                  type="date"
                  value={fellowData.duration_to}
                  onChange={(e) => setFellowData({ ...fellowData, duration_to: e.target.value })}
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-border">
              <Button
                type="submit"
                disabled={fellowSaving}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
              >
                <Save size={16} className="mr-1" />
                {fellowSaving ? "Saving..." : "Update Fellowship"}
              </Button>

              <Button
                type="button"
                onClick={() => router.push("/dashboard/research_guide")}
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
