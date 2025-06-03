"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore/lite";
import { db } from "@/lib/config";
import notify from "@/hooks/notificationService";
import { useSession } from "@/hooks/use-session";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    universityName: "",
    shortName: "",
    login: "",
    email: "",
    password: "",
    aboutTitle: "Not specified",
    aboutDescription: "Not specified",
    ctaTitle: "Not specified",
    ctaDescription: "Not specified",
    heroTitle: "Not specified",
    heroDescription: "Not specified",
    departments: [],
  });

  const { saveSession } = useSession();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const universityRef = collection(db, "university");

      const loginQuery = query(
        universityRef,
        where("login", "==", formData.login)
      );
      const loginSnapshot = await getDocs(loginQuery);
      if (!formData.login || loginSnapshot.size > 0) {
        notify("This login already exists or is empty. Please choose another.");
        return;
      }

      const emailQuery = query(
        universityRef,
        where("email", "==", formData.email)
      );
      const emailSnapshot = await getDocs(emailQuery);
      if (!formData.email || emailSnapshot.size > 0) {
        notify("This email is already registered or empty.");
        return;
      }

      if (formData.password.length < 8) {
        notify("Password must be at least 8 characters long.");
        return;
      }

      const docRef = await addDoc(universityRef, formData);
      saveSession(docRef.id);
      router.push("/dashboard");
      notify("Registration successful!");
    } catch (error) {
      console.error(error);
      notify("Something went wrong during registration.");
    }
  };

  return (
    <div>
      <div className="container flex h-16 items-center">
        <Link
          href="/"
          className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>
      </div>
      <main className="flex-1 flex items-center justify-center py-12">
        <Card className="mx-auto max-w-md w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-red-600">
              University Registration
            </CardTitle>
            <CardDescription className="text-center">
              Create an account for your university on UniStep
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="universityName">Full University Name</Label>
                <Input
                  id="universityName"
                  placeholder="e.g. Kazakh National University"
                  value={formData.universityName}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shortName">Short Name</Label>
                <Input
                  id="shortName"
                  placeholder="e.g. KazNU"
                  value={formData.shortName}
                  onChange={handleChange}
                />
                <p className="text-xs text-gray-500">
                  Will be used in the link: unistep.kz/
                  <span className="font-medium">name</span>
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="login">Login (for URL)</Label>
                <Input
                  id="login"
                  placeholder="Unique login identifier"
                  value={formData.login}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@university.edu"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <p className="text-xs text-gray-500">
                  Password must be at least 8 characters long, including letters
                  and numbers
                </p>
              </div>

              <Button
                onClick={handleSubmit}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                Register
              </Button>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-red-600 hover:underline">
                  Sign in
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
