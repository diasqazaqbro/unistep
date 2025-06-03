// English version of the university home page

"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Header from "@/components/header";
import { useEffect, useState } from "react";
import { db } from "@/lib/config";
import { collection, getDocs, query, where } from "firebase/firestore/lite";
import { useParams } from "next/navigation";

export interface Data {
  id: string;
  login: string;
  heroImg: string;
  heroTitle: string;
  heroDescription: string;
  aboutImg: string;
  aboutTitle: string;
  aboutDescription: string;
  shortName: string;
  universityName: string;
  ctaTitle: string;
  ctaDescription: string;
  departments: { id: string; name: string; description: string }[];
}

export default function Home() {
  const [data, setData] = useState<Data>();
  const params = useParams();
  const slug = params?.slug;

  useEffect(() => {
    async function fetchData() {
      if (!slug || !Array.isArray(slug)) return;

      try {
        const universityRef = collection(db, "university");
        const q = query(universityRef, where("login", "==", slug[0]));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          const docData = doc.data() as Omit<Data, "id">;
          setData({
            ...docData,
            id: doc.id,
          });
        } else {
          console.warn("University not found");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [slug]);

  if (!slug || !Array.isArray(slug)) return <div>No data</div>;

  const fallbackData: Data = {
    id: "",
    login: "",
    heroImg: "",
    heroTitle: "",
    heroDescription: "",
    aboutTitle: "",
    aboutImg: "",
    aboutDescription: "",
    shortName: "",
    universityName: "",
    ctaTitle: "",
    ctaDescription: "",
    departments: [],
  };

  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header data={data ?? fallbackData} />

      {/* Hero Section */}
      <section className="relative w-full h-[80vh] flex items-center justify-center bg-gradient-to-r from-red-600 to-red-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src={
              data?.heroImg
                ? data.heroImg
                : "/placeholder.svg?height=1080&width=1920"
            }
            alt="University campus"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="container mx-auto px-4 z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {data?.heroTitle}
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            {data?.heroDescription}
          </p>
          <Link href={`/apply/${data?.login}`}>
            <Button
              size="lg"
              className="bg-white text-red-600 hover:bg-gray-100 text-lg px-8 py-6"
            >
              Apply Now <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-800">
            {data?.aboutTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg text-gray-700 mb-6">
                {data?.aboutDescription}
              </p>
            </div>
            <div className="relative h-80 md:h-96 rounded-lg overflow-hidden shadow-xl">
              <Image
                src={
                  data?.aboutImg
                    ? data.aboutImg
                    : "/placeholder.svg?height=1080&width=1920"
                }
                alt="University building"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-800">
            Academic Programs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(data?.departments || []).map((program, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <h3 className="text-xl font-bold mb-3 text-gray-800">
                  {program.name}
                </h3>
                <p className="text-gray-600 mb-4">{program.description}</p>
                <Link
                  href={`/apply/${data?.login}`}
                  className="text-red-600 font-medium hover:text-red-700 flex items-center"
                >
                  Apply <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-16 bg-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {data?.ctaTitle}
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {data?.ctaDescription}
          </p>
          <Link href={`/apply/${data?.login}`}>
            <Button
              size="lg"
              className="bg-white text-red-600 hover:bg-gray-100 text-lg px-8 py-6"
            >
              Submit Application Now <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
