"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle,
  Shield,
  BarChart3,
  Layout,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/use-session";

export default function HomePage() {
  const { isLoggedIn } = useSession();

  return (
    <div>
      <header className="top-0 z-50 w-full border-b bg-white px-16">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-red-600">UniStep</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link
              href="#how-it-works"
              className="text-sm font-medium hover:text-red-600 transition-colors"
            >
              How it works
            </Link>
            <Link
              href="#features"
              className="text-sm font-medium hover:text-red-600 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium hover:text-red-600 transition-colors"
            >
              Testimonials
            </Link>
          </nav>
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button className="bg-red-600 hover:bg-red-700">
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-medium hover:text-red-600 transition-colors"
              >
                Login
              </Link>
              <Link href="/register">
                <Button className="bg-red-600 hover:bg-red-700">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 rounded-3xl bg-gradient-to-b from-white to-red-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-red-600">
                  Create an online admissions office for your university
                </h1>
                <p className="max-w-[600px] text-gray-700 md:text-xl">
                  Receive applications, manage your site, and enroll students —
                  all in one place.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/register">
                    <Button className="bg-red-600 hover:bg-red-700 w-full sm:w-auto">
                      Register a University
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto border-red-600 text-red-600 hover:bg-red-50"
                    >
                      Login
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative h-[300px] lg:h-[400px] rounded-xl overflow-hidden">
                <Image
                  src="/hero.jpg"
                  alt="UniStep Platform"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="w-full py-12 md:py-24 rounded-3xl bg-white"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-red-600">
                  How it works
                </h2>
                <p className="max-w-[700px] text-gray-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Four simple steps to launch your online admissions office
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
              <div className="flex flex-col items-center space-y-2 border border-red-100 rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                  <span className="font-bold text-xl">➀</span>
                </div>
                <h3 className="text-xl font-bold text-center">
                  Register your university
                </h3>
                <p className="text-sm text-center text-gray-600">
                  Create an account for your university on the platform
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border border-red-100 rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                  <span className="font-bold text-xl">➁</span>
                </div>
                <h3 className="text-xl font-bold text-center">
                  Customize your site & CRM
                </h3>
                <p className="text-sm text-center text-gray-600">
                  Adjust the look and functionality of your page
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border border-red-100 rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                  <span className="font-bold text-xl">➂</span>
                </div>
                <h3 className="text-xl font-bold text-center">
                  Share your link
                </h3>
                <p className="text-sm text-center text-gray-600">
                  Share unistep.kz/your-name with prospective students
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border border-red-100 rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                  <span className="font-bold text-xl">➃</span>
                </div>
                <h3 className="text-xl font-bold text-center">
                  Manage applications
                </h3>
                <p className="text-sm text-center text-gray-600">
                  Organize submissions, analyze data, and make decisions
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="w-full py-12 md:py-24 rounded-3xl bg-red-50"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-red-600">
                  Features
                </h2>
                <p className="max-w-[700px] text-gray-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Everything you need for efficient admissions management
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <div className="flex items-start space-x-4">
                <Layout className="h-10 w-10 text-red-600 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold">Admissions landing site</h3>
                  <p className="text-gray-600 mt-2">
                    Ready-to-use site template you can customize for your
                    university
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <CheckCircle className="h-10 w-10 text-red-600 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold">CRM Panel</h3>
                  <p className="text-gray-600 mt-2">
                    Convenient system for managing applications and
                    communication
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Layout className="h-10 w-10 text-red-600 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold">Section templates</h3>
                  <p className="text-gray-600 mt-2">
                    Pre-designed blocks for quickly building an informative site
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Shield className="h-10 w-10 text-red-600 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold">Security & protection</h3>
                  <p className="text-gray-600 mt-2">
                    Reliable data protection and compliance with safety
                    standards
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <BarChart3 className="h-10 w-10 text-red-600 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold">Application analytics</h3>
                  <p className="text-gray-600 mt-2">
                    Visualized data and statistics for informed decision-making
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section className="w-full py-12 md:py-24 rounded-3xl bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-red-600">
                  Template Demo
                </h2>
                <p className="max-w-[700px] text-gray-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  See how your university admission page can look
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-5xl mt-12 border border-gray-200 rounded-xl overflow-hidden shadow-lg">
              <div className="aspect-video relative">
                <Image
                  src="/demo.png"
                  alt="UniStep Template Demo"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="flex justify-center mt-8">
              <Link href="/register">
                <Button className="bg-red-600 hover:bg-red-700">
                  Try for Free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section
          id="testimonials"
          className="w-full mb-16 rounded-3xl py-12 md:py-24 bg-red-50"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-red-600">
                  University Testimonials
                </h2>
                <p className="max-w-[700px] text-gray-700 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  What our clients say about UniStep
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <p className="text-gray-700 italic">
                  &quot;UniStep significantly simplified our application process. We
                  can now focus on selecting the best candidates instead of
                  handling administrative tasks.&quot;
                </p>
                <div className="mt-4 flex items-center">
                  <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold">
                    IITU
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold">IITU</h4>
                    <p className="text-sm text-gray-600">Admissions Office</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <p className="text-gray-700 italic">
                  &quot;Application analytics helps us better plan our recruitment
                  strategy. We see which programs are popular and can respond
                  quickly.&quot;
                </p>
                <div className="mt-4 flex items-center">
                  <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold">
                    NZ
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold">NARXOZ University</h4>
                    <p className="text-sm text-gray-600">Rector</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
