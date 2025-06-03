"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormData } from "@/app/apply/[...slug]/page";
import { collection, getDocs } from "firebase/firestore/lite";
import { db, storage } from "@/lib/config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import notify from "@/hooks/notificationService";
import { FileUploader } from "./file-upload";

interface ApplicationFormProps {
  currentStep: number;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  formData: FormData;
  slugLogin: string;
  applicationType: "bachelor" | "master";
}

export default function ApplicationForm({
  currentStep,
  applicationType,
  setFormData,
  formData,
  slugLogin,
}: ApplicationFormProps) {
  const handleChange = <K extends keyof FormData>(
    key: K,
    value: FormData[K]
  ) => {
    setFormData((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleFileChange = async (field: keyof FormData, file: File) => {
    try {
      const storageRef = ref(
        storage,
        `applications/${field}/${Date.now()}_${file.name}`
      );
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      handleChange(field as keyof FormData, downloadURL);
      notify("File uploaded successfully");
    } catch (err) {
      console.error(`File upload error [${field}]`, err);
      notify("An error occurred while uploading the file");
    }
  };

  const [departments, setDepartments] = useState<
    { id: string; name: string; description?: string }[]
  >([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const snapshot = await getDocs(collection(db, "university"));
        const list: any[] = [];

        snapshot.forEach((doc) => {
          const data = doc.data();
          const login = data.login;
          if (Array.isArray(data.departments) && login === slugLogin) {
            data.departments.forEach((dept: any) =>
              list.push({ ...dept, id: dept.id.toString() })
            );
          }
        });

        setDepartments(list);
      } catch (e) {
        console.error("Error loading departments:", e);
      }
    };

    fetchDepartments();
  }, [slugLogin]);

  if (currentStep === 1) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold">Step 1: Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="middleName">Middle Name (if any)</Label>
            <Input
              id="middleName"
              value={formData.middleName}
              onChange={(e) => handleChange("middleName", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sex">Gender</Label>
          <Select
            value={formData.sex}
            onValueChange={(value) => handleChange("sex", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="citizenship">Citizenship</Label>
          <Select
            value={formData.citizenship}
            onValueChange={(value) => handleChange("citizenship", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select citizenship" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kz">Kazakhstan</SelectItem>
              <SelectItem value="ru">Russia</SelectItem>
              <SelectItem value="kg">Kyrgyzstan</SelectItem>
              <SelectItem value="uz">Uzbekistan</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="phone">Contact Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Residential Address</Label>
          <Textarea
            id="address"
            value={formData.address}
            onChange={(e) => handleChange("address", e.target.value)}
          />
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-semibold text-lg">Select Field of Study</h3>
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select
              value={formData.departmentId?.toString() || ""}
              onValueChange={(value) => handleChange("departmentId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((department) => (
                  <SelectItem key={department.id} value={department.id}>
                    {department.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Education
  if (currentStep === 2) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold">Step 2: Education Documents</h2>
        <p className="text-gray-600">Upload your education documents</p>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="educationType">Type of Education Document</Label>
            <Select
              value={formData.educationType}
              onValueChange={(value) => handleChange("educationType", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                {applicationType === "bachelor" ? (
                  <>
                    <SelectItem value="attestat">
                      High School Certificate
                    </SelectItem>
                    <SelectItem value="diploma">College Diploma</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="bachelor">
                      Bachelor&apos;s Diploma
                    </SelectItem>
                    <SelectItem value="specialist">
                      Specialist Diploma
                    </SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="graduationYear">Year of Graduation</Label>
            <Select
              value={formData.graduationYear}
              onValueChange={(value) => handleChange("graduationYear", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select graduation year" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="educationInstitution">
              Educational Institution
            </Label>
            <Input
              id="educationInstitution"
              value={formData.educationInstitution}
              onChange={(e) =>
                handleChange("educationInstitution", e.target.value)
              }
              placeholder="Enter the name of your institution"
            />
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Exam Results
  if (currentStep === 3) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold">Step 3: Exam Results</h2>
        <p className="text-gray-600">Provide your exam results</p>

        <div className="space-y-6">
          <div className="space-y-4">
            <Label>
              {applicationType === "bachelor"
                ? "ENT / EGE / SAT / ACT"
                : "Entrance Exams"}
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="examType">Exam Type</Label>
                <Select
                  value={formData.examType}
                  onValueChange={(value) => handleChange("examType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select exam type" />
                  </SelectTrigger>
                  <SelectContent>
                    {applicationType === "bachelor" ? (
                      <>
                        <SelectItem value="ent">ENT</SelectItem>
                        <SelectItem value="ege">EGE</SelectItem>
                        <SelectItem value="sat">SAT</SelectItem>
                        <SelectItem value="act">ACT</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="ct">CT</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="examScore">Score</Label>
                <Input
                  id="examScore"
                  type="number"
                  value={formData.examScore ?? ""}
                  onChange={(e) =>
                    handleChange("examScore", Number(e.target.value))
                  }
                  placeholder="Enter your score"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 4: Additional Documents
  if (currentStep === 4) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold">Step 4: Additional Documents</h2>
        <p className="text-gray-600">Upload the required documents</p>

        <div className="space-y-6">
          <FileUploader
            label="Passport / National ID"
            field="passportFile"
            value={formData.passportFile}
            onChange={(field, file) => {
              void handleFileChange(field as keyof FormData, file);
            }}
          />
          <FileUploader
            label="Medical Certificate (Form 086/U)"
            field="medicalCertificateFile"
            value={formData.medicalCertificateFile}
            onChange={(field, file) => {
              void handleFileChange(field as keyof FormData, file);
            }}
          />
          <FileUploader
            label="Photo 3x4"
            field="photoFile"
            value={formData.photoFile}
            onChange={(field, file) => {
              void handleFileChange(field as keyof FormData, file);
            }}
          />
          <FileUploader
            label="Vaccination Certificate"
            field="vaccinationFile"
            value={formData.vaccinationFile}
            onChange={(field, file) => {
              void handleFileChange(field as keyof FormData, file);
            }}
          />
        </div>
      </div>
    );
  }

  // Step 5: Additional Requirements
  if (currentStep === 5) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold">Step 5: Additional Requirements</h2>
        <p className="text-gray-600">
          Provide additional information for your application
        </p>

        <div className="space-y-6">
          <FileUploader
            label="Motivation Letter"
            field="motivationLetter"
            value={formData.motivationLetter}
            onChange={(field, file) => {
              void handleFileChange(field as keyof FormData, file);
            }}
          />

          <div className="flex items-start space-x-2 pt-4">
            <input
              type="checkbox"
              id="agreement"
              checked={formData.agreementAccepted}
              onChange={(e) =>
                handleChange("agreementAccepted", e.target.checked)
              }
              className="mt-1"
            />
            <label htmlFor="agreement" className="text-sm text-gray-600">
              I confirm that all the information provided by me is accurate. I
              agree to the processing of my personal data in accordance with the
              university&apos;s privacy policy.
            </label>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
