"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus } from "lucide-react";

export const ManageAdditional = () => {
  const { data: session }: any = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userProfile, setUserProfile] = useState<{ sname?: string; uname?: string }>({});
  const [additionalInfo, setAdditionalInfo] = useState("");

  useEffect(() => {
    fetch("/api/staff/additional")
      .then((r) => r.json())
      .then((res) => {
        if (res.user) setUserProfile(res.user);
        if (res.data?.additional_info) setAdditionalInfo(res.data.additional_info);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/staff/additional", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ additional_info: additionalInfo }),
      });
      if (res.ok) {
        toast.success("Additional information saved successfully!");
      } else {
        throw new Error("Failed to save");
      }
    } catch {
      toast.error("Failed to save additional information");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-foreground font-medium">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="text-muted-foreground text-sm font-medium">
        welcome : <span className="font-bold text-foreground">{userProfile.sname || userProfile.uname || session?.user?.name || "Staff"}</span>
      </div>

      <Card className="bg-card text-card-foreground border-border shadow-sm">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
            Any Additional Information, Specify
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Textarea
                rows={6}
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                placeholder="Specify any additional achievements, roles, responsibilities or contributions..."
                className="w-full text-sm"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" disabled={saving} className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium">
                <Plus size={16} className="mr-1" />
                {saving ? "Saving..." : "Save Additional Information"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
