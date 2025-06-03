"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "@/lib/config";
import { doc, getDoc } from "firebase/firestore/lite";
import { FormData } from "@/app/apply/[...slug]/page";
import Link from "next/link";

export default function ApplicationDetailPage() {
  const params = useParams();
  const id = Array.isArray(params?.slug) ? params.slug[0] : null;

  const [application, setApplication] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchApplication() {
      if (!id || typeof id !== "string") return;

      try {
        const ref = doc(db, "apply", id);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setApplication({ id: snap.id, ...snap.data() } as FormData);
        } else {
          console.warn("Application not found");
        }
      } catch (error) {
        console.error("Error loading application:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchApplication();
  }, [id]);

  if (loading) return <p className="text-muted-foreground">Loading...</p>;

  if (!application)
    return (
      <p className="text-destructive font-medium">
        Application not found or has been deleted
      </p>
    );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Application № {application.id}
          </h1>
          <p className="text-muted-foreground">
            Detailed information about the applicant
          </p>
        </div>
        <Link href="/dashboard/applications">
          <Button variant="outline">Back to list</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Information</CardTitle>
          <CardDescription>Personal and academic details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <strong>Full Name:</strong> {application.lastName}{" "}
            {application.firstName} {application.middleName}
          </div>
          <div>
            <strong>Citizenship:</strong> {application.citizenship || "—"}
          </div>
          <div>
            <strong>Gender:</strong> {application.sex}
          </div>
          <div>
            <strong>Phone:</strong> {application.phone}
          </div>
          <div>
            <strong>Email:</strong> {application.email}
          </div>
          <div>
            <strong>Address:</strong> {application.address}
          </div>
          <div>
            <strong>Faculty:</strong> {application.departmentId || "—"}
          </div>
          <div>
            <strong>Application Type:</strong>{" "}
            {application.applicationType || "—"}
          </div>
          <div>
            <strong>Educational Institution:</strong>{" "}
            {application.educationInstitution || "—"}
          </div>
          <div>
            <strong>Graduation Year:</strong>{" "}
            {application.graduationYear || "—"}
          </div>
          <div>
            <strong>Exam Type:</strong> {application.examType || "—"}
          </div>
          <div>
            <strong>Exam Score:</strong> {application.examScore ?? "—"}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Files</CardTitle>
          <CardDescription>Uploaded documents</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            ["Motivation Letter:", application.motivationLetter],
            ["Passport", application.passportFile],
            ["Medical Certificate", application.medicalCertificateFile],
            ["Photo", application.photoFile],
            ["Vaccination Certificate", application.vaccinationFile],
            ["ENT Certificate", application.entCertificateFile],
            ["Transcript", application.transcriptFile],
            ["Recommendation Letter", application.recommendationLetterFile],
            ["Portfolio", application.portfolioFile],
            ["English Certificate", application.englishCertificateFile],
            ["Awards / Diplomas", application.diplomaAwardsFile],
          ].map(([label, file]) =>
            file ? (
              <div key={label}>
                <strong>{label}</strong>{" "}
                <a
                  href={file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Download
                </a>
              </div>
            ) : null
          )}
        </CardContent>
      </Card>
    </div>
  );
}
