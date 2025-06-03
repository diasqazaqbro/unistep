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
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/use-session";
import { collection, getDocs, query, where } from "firebase/firestore/lite";
import { db } from "@/lib/config";
import notify from "@/hooks/notificationService";

export default function LoginPage() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<{ login?: string; password?: string }>(
    {}
  );

  const router = useRouter();

  const { saveSession } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!login.trim()) newErrors.login = "Please enter your login or email";
    if (!password.trim()) newErrors.password = "Please enter your password";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const universityRef = collection(db, "university");
      const loginQuery = query(universityRef, where("login", "==", login));
      const emailQuery = query(universityRef, where("email", "==", login));

      const [loginSnapshot, emailSnapshot] = await Promise.all([
        getDocs(loginQuery),
        getDocs(emailQuery),
      ]);

      let userDoc = null;

      if (!loginSnapshot.empty) {
        userDoc = loginSnapshot.docs[0];
      } else if (!emailSnapshot.empty) {
        userDoc = emailSnapshot.docs[0];
      }

      if (!userDoc) {
        notify("User not found.");
        return;
      }

      const userData = userDoc.data();
      if (userData.password !== password) {
        notify("Incorrect password.");
        return;
      }

      saveSession(userDoc.id);
      notify("Logged in successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      notify("Login error. Please try again.");
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
          <span className="text-sm font-medium">Back to homepage</span>
        </Link>
      </div>
      <main className="flex-1 flex items-center justify-center py-12">
        <Card className="mx-auto max-w-md w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-red-600">
              Sign In
            </CardTitle>
            <CardDescription className="text-center">
              Access your university dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login">Login or Email</Label>
                <Input
                  id="login"
                  placeholder="Enter login or email"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                />
                {errors.login && (
                  <p className="text-sm text-red-600">{errors.login}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password}</p>
                )}
                <div className="text-right">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-red-600 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={remember}
                  onCheckedChange={(checked) => setRemember(Boolean(checked))}
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </label>
              </div>
              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700"
              >
                Sign In
              </Button>
              <div className="text-center text-sm">
                Don’t have an account?{" "}
                <Link href="/register" className="text-red-600 hover:underline">
                  Register
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
