"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Eye, Save } from "lucide-react";
import { db, storage } from "@/lib/config";
import { doc, getDoc, updateDoc } from "firebase/firestore/lite";
import { useSession } from "@/hooks/use-session";
import notify from "@/hooks/notificationService";
import { Data } from "@/app/site/[...slug]/page";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { FileUploader } from "@/components/file-upload";

export default function SitePage() {
  const [translations, setTranslations] = useState<Data | null>(null);
  const { session, isLoading } = useSession();

  useEffect(() => {
    async function fetchData() {
      if (isLoading || !session?.userId) return;

      try {
        const docRef = doc(db, "university", session.userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setTranslations({
            id: docSnap.id,
            login: data.login || "",
            departments: data.departments || [],
            shortName: data.shortName || "",
            universityName: data.universityName || "",
            heroImg: data.heroImg || "",
            heroTitle: data.heroTitle || "",
            heroDescription: data.heroDescription || "",
            aboutImg: data.aboutImg || "",
            aboutTitle: data.aboutTitle || "",
            aboutDescription: data.aboutDescription || "",
            ctaTitle: data.ctaTitle || "",
            ctaDescription: data.ctaDescription || "",
          });
        } else {
          console.error("Document not found");
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    }

    fetchData();
  }, [session, isLoading]);

  const handleChange = (key: keyof Omit<Data, "id">, value: any) => {
    setTranslations((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleDeleteDepartment = async (index: number) => {
    if (!translations?.id) return notify("ID not found");

    try {
      const newDepts = [...(translations.departments || [])];
      newDepts.splice(index, 1);
      handleChange("departments", newDepts);

      const docRef = doc(db, "university", translations.id);
      await updateDoc(docRef, { departments: newDepts });

      notify("Department deleted and saved");
    } catch (e) {
      console.error(e);
      notify("Error deleting department");
    }
  };

  const handleSave = async () => {
    if (!translations?.id) return notify("ID not found");

    try {
      const docRef = doc(db, "university", translations.id);

      const updatedData = {
        shortName: translations.shortName,
        universityName: translations.universityName,
        heroImg: translations.heroImg,
        heroTitle: translations.heroTitle,
        heroDescription: translations.heroDescription,
        aboutImg: translations.aboutImg,
        aboutTitle: translations.aboutTitle,
        aboutDescription: translations.aboutDescription,
        ctaTitle: translations.ctaTitle,
        ctaDescription: translations.ctaDescription,
        departments: translations.departments,
      };

      await updateDoc(docRef, updatedData);
      notify("Saved successfully!");
    } catch (error) {
      console.error("Save error:", error);
      notify("Error saving");
    }
  };

  const handleFileChange = async (
    field: keyof Omit<Data, "id">,
    file: File
  ) => {
    try {
      const storageRef = ref(
        storage,
        `applications/${field}/${Date.now()}_${file.name}`
      );
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      handleChange(field, downloadURL);
      notify("File uploaded successfully");
    } catch (err) {
      console.error(`Upload error [${field}]`, err);
      notify("Error uploading file");
    }
  };

  if (isLoading || !translations) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Site Configuration
          </h1>
          <p className="text-muted-foreground">
            Configure the content of your university admission page
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/site/${translations.login}`}>
            <Button variant="outline" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              View Site
            </Button>
          </Link>
          <Button
            onClick={handleSave}
            className="bg-red-600 hover:bg-red-700 flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
          <TabsTrigger value="general">General Settings</TabsTrigger>
          <TabsTrigger value="sections">Sections</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Set up your university’s main information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="shortName">Short Name</Label>
                <Input
                  id="shortName"
                  value={translations.shortName}
                  onChange={(e) => handleChange("shortName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="universityName">Full Name</Label>
                <Input
                  id="universityName"
                  value={translations.universityName}
                  onChange={(e) =>
                    handleChange("universityName", e.target.value)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sections" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>
                Top part of the homepage content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FileUploader
                label="Image"
                field="heroImg"
                value={translations.heroImg}
                onChange={(field, file) => {
                  void handleFileChange(field as any, file);
                }}
              />
              <div className="space-y-2">
                <Label htmlFor="heroTitle">Title</Label>
                <Input
                  id="heroTitle"
                  value={translations.heroTitle}
                  onChange={(e) => handleChange("heroTitle", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heroDescription">Description</Label>
                <Textarea
                  id="heroDescription"
                  rows={3}
                  value={translations.heroDescription}
                  onChange={(e) =>
                    handleChange("heroDescription", e.target.value)
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>About Us</CardTitle>
              <CardDescription>Block with university info</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FileUploader
                label="Image"
                field="aboutImg"
                value={translations.aboutImg}
                onChange={(field, file) => {
                  void handleFileChange(field as any, file);
                }}
              />
              <div className="space-y-2">
                <Label htmlFor="aboutTitle">Title</Label>
                <Input
                  id="aboutTitle"
                  value={translations.aboutTitle}
                  onChange={(e) => handleChange("aboutTitle", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="aboutDescription">Description</Label>
                <Textarea
                  id="aboutDescription"
                  rows={4}
                  value={translations.aboutDescription}
                  onChange={(e) =>
                    handleChange("aboutDescription", e.target.value)
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Call to Action</CardTitle>
              <CardDescription>
                Customize the final encouragement block for applicants
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ctaTitle">Title</Label>
                <Input
                  id="ctaTitle"
                  value={translations.ctaTitle}
                  onChange={(e) => handleChange("ctaTitle", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ctaDescription">Description</Label>
                <Textarea
                  id="ctaDescription"
                  rows={3}
                  value={translations.ctaDescription}
                  onChange={(e) =>
                    handleChange("ctaDescription", e.target.value)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Departments</CardTitle>
              <CardDescription>
                Add departments your university offers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(translations?.departments || []).map((dept, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-md space-y-4 relative bg-muted/50"
                >
                  <div className="flex gap-4">
                    <div className="w-1/3 space-y-1">
                      <Label>ID</Label>
                      <Input
                        value={dept.id}
                        onChange={(e) => {
                          const newDepts = [
                            ...(translations?.departments || []),
                          ];
                          newDepts[index].id = e.target.value;
                          handleChange("departments", newDepts);
                        }}
                      />
                    </div>
                    <div className="w-2/3 space-y-1">
                      <Label>Name</Label>
                      <Input
                        value={dept.name}
                        onChange={(e) => {
                          const newDepts = [
                            ...(translations?.departments || []),
                          ];
                          newDepts[index].name = e.target.value;
                          handleChange("departments", newDepts);
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label>Description</Label>
                    <Textarea
                      rows={3}
                      value={dept.description}
                      onChange={(e) => {
                        const newDepts = [...(translations?.departments || [])];
                        newDepts[index].description = e.target.value;
                        handleChange("departments", newDepts);
                      }}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteDepartment(index)}
                    >
                      Delete
                    </Button>
                    <Button
                      size="sm"
                      onClick={async () => {
                        if (!translations?.id) return notify("ID not found");
                        try {
                          const docRef = doc(db, "university", translations.id);
                          const updatedDepartments = [
                            ...translations.departments,
                          ];
                          await updateDoc(docRef, {
                            departments: updatedDepartments,
                          });
                          notify("Department saved");
                        } catch (e) {
                          console.error(e);
                          notify("Error saving department");
                        }
                      }}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                onClick={() => {
                  const newDepts = [
                    ...(translations?.departments || []),
                    { id: "", name: "", description: "" },
                  ];
                  handleChange("departments", newDepts);
                }}
              >
                + Add Department
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
