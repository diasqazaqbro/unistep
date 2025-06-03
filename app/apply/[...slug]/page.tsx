"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import ApplicationForm from "@/components/application-form";
import { db } from "@/lib/config";
import { addDoc, collection } from "firebase/firestore/lite";
import { useParams } from "next/navigation";
import notify from "@/hooks/notificationService";
import dayjs from "dayjs";

export interface FormData {
  id?: string;
  firstName: string;
  passportFile: string;
  createdAt?: string;
  lastName: string;
  middleName: string;
  sex: string;
  citizenship: string;
  phone: string;
  email: string;
  address: string;
  departmentId: string | null;
  educationType?: string;
  educationInstitution?: string;
  graduationYear?: string;
  examType?: string;
  examScore?: number;
  motivationLetter?: string;
  medicalCertificateFile?: string;
  photoFile?: string;
  vaccinationFile?: string;
  entCertificateFile?: string;
  transcriptFile?: string;
  recommendationLetterFile?: string;
  portfolioFile?: string;
  englishCertificateFile?: string;
  diplomaAwardsFile?: string;
  agreementAccepted?: boolean;
  university?: string;
  applicationType?: string;
}

export default function ApplyPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [applicationType, setApplicationType] = useState<
    "bachelor" | "master" | null
  >(null);
  const totalSteps = 5;

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    middleName: "",
    sex: "",
    citizenship: "",
    phone: "",
    email: "",
    address: "",
    departmentId: null,
    educationType: "",
    educationInstitution: "",
    graduationYear: "",
    examType: "",
    examScore: undefined,
    motivationLetter: "",
    passportFile: "",
    medicalCertificateFile: "",
    photoFile: "",
    vaccinationFile: "",
    applicationType: "",
    agreementAccepted: false,
    createdAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
  });

  const params = useParams();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : null;

  const validateStep = (): boolean => {
    switch (currentStep) {
      case 1:
        return (
          !!formData.firstName &&
          !!formData.lastName &&
          !!formData.citizenship &&
          !!formData.phone &&
          !!formData.email &&
          !!formData.address &&
          !!formData.departmentId
        );
      case 2:
        return (
          !!formData.educationType &&
          !!formData.educationInstitution &&
          !!formData.graduationYear
        );
      case 3:
        return !!formData.examType && !!formData.examScore;
      case 4:
        return (
          !!formData.passportFile &&
          !!formData.medicalCertificateFile &&
          !!formData.photoFile &&
          !!formData.vaccinationFile
        );
      case 5:
        return !!formData.agreementAccepted;
      default:
        return true;
    }
  };

  const handleNext = async () => {
    if (!validateStep()) {
      notify("Please complete all required fields on this step.");
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    } else {
      try {
        const newsCollection = collection(db, "apply");
        await addDoc(newsCollection, {
          ...formData,
          university: slug,
        });

        setIsSubmitted(true);
        window.scrollTo(0, 0);
      } catch (error) {
        console.error("Error creating document: ", error);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const selectApplicationType = (type: "bachelor" | "master") => {
    setApplicationType(type);
    setCurrentStep(1);
    window.scrollTo(0, 0);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-4xl mx-auto p-8 md:p-12">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Application submitted successfully!
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Thank you for your interest in our university. We have received
              your application and will contact you shortly.
            </p>
            <p className="text-gray-600 mb-8">
              Your application number:{" "}
              <span className="font-bold">
                APP-{Math.floor(100000 + Math.random() * 900000)}
              </span>
            </p>
            <Link href={`/site/${slug}`}>
              <Button className="bg-red-600 hover:bg-red-700">
                Return to Home
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  if (currentStep === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Choose your application type
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Please select the program you want to apply for
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card
              className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                applicationType === "bachelor" ? "ring-2 ring-red-600" : ""
              }`}
              onClick={() => {
                selectApplicationType("bachelor");
                setCurrentStep(1);
              }}
            >
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <GraduationCap className="h-8 w-8 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">
                  Bachelor&apos;s Program
                </h2>
                <p className="text-gray-600 mb-4">
                  Undergraduate program leading to a Bachelor&apos;s degree (4
                  years of study)
                </p>
                <Button className="bg-red-600 hover:bg-red-700 mt-2">
                  Choose Bachelor&apos;s
                </Button>
              </div>
            </Card>

            <Card
              className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                applicationType === "master" ? "ring-2 ring-red-600" : ""
              }`}
              onClick={() => {
                selectApplicationType("master");
                setCurrentStep(1);
              }}
            >
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="h-8 w-8 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">
                  Master&apos;s Program
                </h2>
                <p className="text-gray-600 mb-4">
                  Postgraduate program leading to a Master&apos;s degree (1-2
                  years of study)
                </p>
                <Button className="bg-red-600 hover:bg-red-700 mt-2">
                  Choose Master&apos;s
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
            Application Form –{" "}
            {applicationType === "bachelor" ? "Bachelor's" : "Master's"}
          </h1>

          {/* Progress Bar */}
          <div className="relative pt-8">
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
              <div
                style={{ width: `${((currentStep - 1) / totalSteps) * 100}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-600 transition-all duration-500"
              ></div>
            </div>
            <div className="flex justify-between">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div key={index} className="text-center relative">
                  <div
                    className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center border-2 ${
                      index + 1 <= currentStep - 1
                        ? "border-red-600 bg-red-600 text-white"
                        : "border-gray-300 bg-white text-gray-500"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="text-xs mt-2 text-gray-600">
                    {index === 0 && "Personal Info"}
                    {index === 1 && "Education"}
                    {index === 2 && "Exams"}
                    {index === 3 && "Documents"}
                    {index === 4 && "Additional"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Card className="p-6 md:p-8 mb-8">
          <ApplicationForm
            slugLogin={slug || ""}
            formData={formData}
            setFormData={setFormData}
            currentStep={currentStep}
            applicationType={applicationType as "bachelor" | "master"}
          />

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              className="flex items-center"
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button
              onClick={handleNext}
              className="bg-red-600 hover:bg-red-700 flex items-center"
            >
              {currentStep === totalSteps ? "Submit Application" : "Next"}
              {currentStep !== totalSteps && (
                <ChevronRight className="ml-2 h-4 w-4" />
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
