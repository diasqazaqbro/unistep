"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
} from "firebase/firestore/lite";
import { db } from "@/lib/config";
import { Bar, Doughnut, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { FormData } from "@/app/apply/[...slug]/page";
import { useSession } from "@/hooks/use-session";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function DashboardPage() {
  const [applications, setApplications] = useState<FormData[]>([]);

  const { session, isLoading } = useSession();

  useEffect(() => {
    async function fetchApplications() {
      if (isLoading || !session?.userId) return;

      const docRef = doc(db, "university", session.userId);
      const docSnap = await getDoc(docRef);

      const q = query(collection(db, "apply"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FormData[];
      const docData = docSnap.data();
      const login = docData?.login;

      const filteredData = data.filter((doc) => doc.university === login);

      setApplications(filteredData);
    }

    fetchApplications();
  }, [isLoading, session?.userId]);

  const facultyStats = applications.reduce((acc, app) => {
    const key = app.departmentId || "Unspecified";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const genderStats = applications.reduce((acc, app) => {
    const key = app.sex || "Unspecified";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const citizenshipStats = applications.reduce((acc, app) => {
    const key = app.citizenship || "Unspecified";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your university&apos;s dashboard
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/site">
            <Button variant="outline">Edit Site</Button>
          </Link>
          <Link href="/dashboard/applications">
            <Button className="bg-red-600 hover:bg-red-700">
              View Applications
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-2">Applications by Faculty</h2>
          <Bar
            data={{
              labels: Object.keys(facultyStats),
              datasets: [
                {
                  label: "Number of Applications",
                  data: Object.values(facultyStats),
                  backgroundColor: "#ef4444",
                },
              ],
            }}
          />
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-2">Gender</h2>
          <Pie
            data={{
              labels: Object.keys(genderStats),
              datasets: [
                {
                  data: Object.values(genderStats),
                  backgroundColor: ["#10b981", "#3b82f6", "#f59e0b", "#6b7280"],
                },
              ],
            }}
          />
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-2">Applicants&apos; Citizenship</h2>
          <Doughnut
            data={{
              labels: Object.keys(citizenshipStats),
              datasets: [
                {
                  data: Object.values(citizenshipStats),
                  backgroundColor: ["#6366f1", "#f87171", "#34d399", "#fbbf24"],
                },
              ],
            }}
          />
        </div>
      </div>
    </div>
  );
}
