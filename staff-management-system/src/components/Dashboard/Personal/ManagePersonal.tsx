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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ArrowRight, Save } from "lucide-react";

export const ManagePersonal = () => {
  const router = useRouter();
  const { data: session }: any = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sameAsComm, setSameAsComm] = useState(false);

  const [formData, setFormData] = useState({
    mobile_number: "",
    date_of_birth: "",
    area_of_specialization: "",
    father_or_husband_name: "",
    email: "",
    address_for_communication: "",
    permanent_address: "",
    nationality: "Indian",
    religion: "Hindu",
    community: "BC",
    languages_known: "",
    marital_status: "married",
    additional_responsibilities: "",
    physically_challenged: "No",
    hobbies: "",
  });

  const [userProfile, setUserProfile] = useState<{
    sname?: string;
    uname?: string;
    designation?: string;
    department?: string;
  }>({});

  useEffect(() => {
    fetch("/api/staff/personal")
      .then((res) => res.json())
      .then((res) => {
        if (res.user) {
          setUserProfile(res.user);
        }
        if (res.data) {
          setFormData((prev) => ({
            ...prev,
            ...res.data,
            date_of_birth: res.data.date_of_birth ? res.data.date_of_birth.substring(0, 10) : "",
          }));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (sameAsComm && name === "address_for_communication") {
        updated.permanent_address = value;
      }
      return updated;
    });
  };

  const handleSameAsCommChange = (checked: boolean) => {
    setSameAsComm(checked);
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        permanent_address: prev.address_for_communication,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/staff/personal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Personal details saved successfully!");
      } else {
        toast.error("Failed to save personal details");
      }
    } catch (err: any) {
      toast.error(err.message || "Error saving details");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-foreground font-medium">Loading personal details...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Top Banner with Staff Greeting matching PHP screenshot 3 */}
      <div className="text-muted-foreground text-sm font-medium">
        Name: <span className="font-bold text-foreground">{userProfile.sname || userProfile.uname || session?.user?.name || "Staff"}</span> &nbsp;|&nbsp;
        Designation: <span className="font-bold text-foreground">{userProfile.designation || "Associate Professor"}</span> &nbsp;|&nbsp;
        Department: <span className="font-bold text-foreground">{userProfile.department || "Computer Applications"}</span>
      </div>

      <Card className="bg-card text-card-foreground border-border shadow-sm">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">Personal Details</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
                  *Mobile Number
                </label>
                <Input
                  type="text"
                  value={formData.mobile_number}
                  onChange={(e) => handleChange("mobile_number", e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
                  *Date of Birth
                </label>
                <Input
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => handleChange("date_of_birth", e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
                  *Area of Specialization
                </label>
                <Input
                  type="text"
                  value={formData.area_of_specialization}
                  onChange={(e) => handleChange("area_of_specialization", e.target.value)}
                  required
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
                  *Name of Father/Husband
                </label>
                <Input
                  type="text"
                  value={formData.father_or_husband_name}
                  onChange={(e) => handleChange("father_or_husband_name", e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
                  *Email
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
                  *Languages Known
                </label>
                <Input
                  type="text"
                  value={formData.languages_known}
                  onChange={(e) => handleChange("languages_known", e.target.value)}
                  required
                  placeholder="English, Tamil, etc."
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
                  *Address for Communication
                </label>
                <Textarea
                  rows={3}
                  value={formData.address_for_communication}
                  onChange={(e) => handleChange("address_for_communication", e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    *Permanent Address
                  </label>
                  <div className="flex items-center space-x-1.5">
                    <Checkbox
                      id="sameAsComm"
                      checked={sameAsComm}
                      onCheckedChange={(checked) => handleSameAsCommChange(Boolean(checked))}
                    />
                    <label htmlFor="sameAsComm" className="text-xs text-foreground font-medium cursor-pointer">
                      Same as Communication Add
                    </label>
                  </div>
                </div>
                <Textarea
                  rows={3}
                  value={formData.permanent_address}
                  onChange={(e) => handleChange("permanent_address", e.target.value)}
                  required
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
                  Nationality
                </label>
                <Input
                  type="text"
                  value={formData.nationality}
                  onChange={(e) => handleChange("nationality", e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
                  Religion
                </label>
                <Select
                  value={formData.religion}
                  onValueChange={(val) => handleChange("religion", val)}
                  options={[
                    { label: "Hindu", value: "Hindu" },
                    { label: "Christian", value: "Christian" },
                    { label: "Muslim", value: "Muslim" },
                    { label: "Other", value: "Other" },
                  ]}
                  placeholder="Select Religion"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
                  Marital Status
                </label>
                <RadioGroup
                  value={formData.marital_status}
                  onValueChange={(val) => handleChange("marital_status", val)}
                  className="flex items-center gap-4 mt-2"
                >
                  {["married", "single", "Divorced"].map((s) => (
                    <div key={s} className="flex items-center space-x-1.5">
                      <RadioGroupItem value={s} id={`marital-${s}`} />
                      <label htmlFor={`marital-${s}`} className="text-xs capitalize cursor-pointer text-foreground font-medium">
                        {s}
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
                  *Community
                </label>
                <RadioGroup
                  value={formData.community}
                  onValueChange={(val) => handleChange("community", val)}
                  className="flex flex-wrap items-center gap-3 mt-2"
                >
                  {["SC", "ST", "MBC/DNC", "BC", "OTHERS"].map((c) => (
                    <div key={c} className="flex items-center space-x-1.5">
                      <RadioGroupItem value={c} id={`comm-${c}`} />
                      <label htmlFor={`comm-${c}`} className="text-xs cursor-pointer text-foreground font-medium">
                        {c}
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
                  Physically Challenged
                </label>
                <RadioGroup
                  value={formData.physically_challenged}
                  onValueChange={(val) => handleChange("physically_challenged", val)}
                  className="flex items-center gap-4 mt-2"
                >
                  {["Yes", "No"].map((p) => (
                    <div key={p} className="flex items-center space-x-1.5">
                      <RadioGroupItem value={p} id={`pc-${p}`} />
                      <label htmlFor={`pc-${p}`} className="text-xs cursor-pointer text-foreground font-medium">
                        {p}
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
                  Hobbies
                </label>
                <Input
                  type="text"
                  value={formData.hobbies}
                  onChange={(e) => handleChange("hobbies", e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
                *Additional Responsibilities
              </label>
              <Textarea
                rows={2}
                value={formData.additional_responsibilities}
                onChange={(e) => handleChange("additional_responsibilities", e.target.value)}
                required
                className="w-full"
              />
            </div>

            {/* Buttons: Update/Save and Next (navigating to academic parity) */}
            <div className="flex items-center gap-3 pt-4 border-t border-border">
              <Button
                type="submit"
                disabled={saving}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
              >
                <Save size={16} className="mr-1" />
                {saving ? "Saving..." : "Save Details"}
              </Button>
              <Button
                type="button"
                onClick={() => router.push("/dashboard/academic")}
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
