"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio";
import { toast } from "sonner";
import { ArrowRight, Save } from "lucide-react";

export const ManageResearchGuide = () => {
  const router = useRouter();
  const { data: session }: any = useSession();

  const [loading, setLoading] = useState(true);
  const [mphilSaving, setMphilSaving] = useState(false);
  const [phdSaving, setPhdSaving] = useState(false);

  const [mphilData, setMphilData] = useState({
    mphil_guide_name: "",
    mphil_part_full_time: "FT",
    mphil_scholar_name: "",
    mphil_board_area_of_research: "",
    mphil_title_of_dissertation: "",
    mphil_status: "Pursuing",
  });

  const [phdData, setPhdData] = useState({
    phd_guide_name: "",
    phd_part_full_time: "FT",
    phd_scholar_name: "",
    phd_board_area_of_research: "",
    phd_title_of_dissertation: "",
    phd_status: "Pursuing",
  });

  const [userProfile, setUserProfile] = useState<{ sname?: string; uname?: string }>({});

  useEffect(() => {
    Promise.all([
      fetch("/api/staff/mphil_guide").then((r) => r.json()),
      fetch("/api/staff/phd_guide").then((r) => r.json()),
    ])
      .then(([mphilRes, phdRes]) => {
        if (mphilRes.user) {
          setUserProfile(mphilRes.user);
          const staffName = mphilRes.user.sname || mphilRes.user.uname || "";
          setMphilData((p) => ({ ...p, mphil_guide_name: staffName }));
          setPhdData((p) => ({ ...p, phd_guide_name: staffName }));
        }
        if (mphilRes.data) setMphilData((prev) => ({ ...prev, ...mphilRes.data }));
        if (phdRes.data) setPhdData((prev) => ({ ...prev, ...phdRes.data }));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleMphilSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMphilSaving(true);
    try {
      const res = await fetch("/api/staff/mphil_guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mphilData),
      });
      if (res.ok) toast.success("M.Phil. guidance saved successfully!");
      else toast.error("Failed to save M.Phil. guidance");
    } catch (err: any) {
      toast.error(err.message || "Error saving record");
    } finally {
      setMphilSaving(false);
    }
  };

  const handlePhdSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhdSaving(true);
    try {
      const res = await fetch("/api/staff/phd_guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(phdData),
      });
      if (res.ok) toast.success("Ph.D. guidance saved successfully!");
      else toast.error("Failed to save Ph.D. guidance");
    } catch (err: any) {
      toast.error(err.message || "Error saving record");
    } finally {
      setPhdSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-foreground font-medium">Loading Research Guided...</div>;

  return (
    <div className="space-y-6">
      <div className="text-muted-foreground text-sm font-medium">
        welcome : <span className="font-bold text-foreground">{userProfile.sname || userProfile.uname || session?.user?.name || "Staff"}</span>
      </div>

      <Card className="bg-card text-card-foreground border-border shadow-sm">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">Research Guided</CardTitle>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Section 1: M.Phil Guidance */}
          <form onSubmit={handleMphilSubmit} className="space-y-5 pb-6 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">M.Phil. Guidance</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
                  Guide name:
                </label>
                <Input
                  type="text"
                  readOnly
                  value={mphilData.mphil_guide_name}
                  className="w-full bg-muted border-input text-muted-foreground cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
                  Part Time / Full Time
                </label>
                <RadioGroup
                  value={mphilData.mphil_part_full_time}
                  onValueChange={(val) => setMphilData({ ...mphilData, mphil_part_full_time: val })}
                  className="flex items-center gap-4 mt-2"
                >
                  {["PT", "FT"].map((opt) => (
                    <div key={opt} className="flex items-center space-x-1.5">
                      <RadioGroupItem value={opt} id={`mphil-${opt}`} />
                      <label htmlFor={`mphil-${opt}`} className="text-xs cursor-pointer text-foreground font-medium">
                        {opt}
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
                  *Name Of Scholar:
                </label>
                <Input
                  type="text"
                  required
                  value={mphilData.mphil_scholar_name}
                  onChange={(e) => setMphilData({ ...mphilData, mphil_scholar_name: e.target.value })}
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
                  *Board Area of Research:
                </label>
                <Textarea
                  rows={2}
                  required
                  value={mphilData.mphil_board_area_of_research}
                  onChange={(e) => setMphilData({ ...mphilData, mphil_board_area_of_research: e.target.value })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
                  Title of Dissertation:
                </label>
                <Textarea
                  rows={2}
                  value={mphilData.mphil_title_of_dissertation}
                  onChange={(e) => setMphilData({ ...mphilData, mphil_title_of_dissertation: e.target.value })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
                  Status:
                </label>
                <Select
                  value={mphilData.mphil_status}
                  onValueChange={(val) => setMphilData({ ...mphilData, mphil_status: val })}
                  options={[
                    { label: "Completed", value: "Completed" },
                    { label: "Pursuing", value: "Pursuing" },
                    { label: "Dropped", value: "Dropped" },
                  ]}
                  placeholder="Select Status"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={mphilSaving}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
            >
              <Save size={16} className="mr-1" />
              {mphilSaving ? "Saving..." : "Update M.Phil."}
            </Button>
          </form>

          {/* Section 2: Ph.D. Guidance */}
          <form onSubmit={handlePhdSubmit} className="space-y-5">
            <h3 className="text-lg font-semibold text-foreground">Ph.D. Guidance</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
                  Guide name:
                </label>
                <Input
                  type="text"
                  readOnly
                  value={phdData.phd_guide_name}
                  className="w-full bg-muted border-input text-muted-foreground cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
                  Part Time / Full Time
                </label>
                <RadioGroup
                  value={phdData.phd_part_full_time}
                  onValueChange={(val) => setPhdData({ ...phdData, phd_part_full_time: val })}
                  className="flex items-center gap-4 mt-2"
                >
                  {["PT", "FT"].map((opt) => (
                    <div key={opt} className="flex items-center space-x-1.5">
                      <RadioGroupItem value={opt} id={`phd-guide-${opt}`} />
                      <label htmlFor={`phd-guide-${opt}`} className="text-xs cursor-pointer text-foreground font-medium">
                        {opt}
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
                  *Name Of Scholar:
                </label>
                <Input
                  type="text"
                  required
                  value={phdData.phd_scholar_name}
                  onChange={(e) => setPhdData({ ...phdData, phd_scholar_name: e.target.value })}
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
                  *Board Area of Research:
                </label>
                <Textarea
                  rows={2}
                  required
                  value={phdData.phd_board_area_of_research}
                  onChange={(e) => setPhdData({ ...phdData, phd_board_area_of_research: e.target.value })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
                  Title of Dissertation:
                </label>
                <Textarea
                  rows={2}
                  value={phdData.phd_title_of_dissertation}
                  onChange={(e) => setPhdData({ ...phdData, phd_title_of_dissertation: e.target.value })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
                  Status:
                </label>
                <Select
                  value={phdData.phd_status}
                  onValueChange={(val) => setPhdData({ ...phdData, phd_status: val })}
                  options={[
                    { label: "Completed", value: "Completed" },
                    { label: "Pursuing", value: "Pursuing" },
                    { label: "Dropped", value: "Dropped" },
                  ]}
                  placeholder="Select Status"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-border">
              <Button
                type="submit"
                disabled={phdSaving}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
              >
                <Save size={16} className="mr-1" />
                {phdSaving ? "Saving..." : "Update Ph.D."}
              </Button>

              <Button
                type="button"
                onClick={() => router.push("/dashboard/conference")}
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
