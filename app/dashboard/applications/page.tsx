"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Link from "next/link";
import {
  collection,
  getDoc,
  doc,
  getDocs,
  query,
} from "firebase/firestore/lite";
import { db } from "@/lib/config";
import { useEffect, useState } from "react";
import { FormData } from "@/app/apply/[...slug]/page";
import { useSession } from "@/hooks/use-session";
import dayjs from "dayjs";

export default function ApplicationsPage() {
  const [data, setData] = useState<FormData[]>();

  const { session, isLoading } = useSession();

  useEffect(() => {
    async function fetchData() {
      if (isLoading || !session?.userId) return;

      try {
        const docRef = doc(db, "university", session.userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const login = data.login;

          try {
            const newsCollection = collection(db, "apply");
            const q = query(newsCollection);
            const querySnapshot = await getDocs(q);

            const docs = querySnapshot.docs.map((doc) => {
              const data = doc.data();
              return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt || "",
              };
            }) as FormData[];
            const filteredDocs = docs
              .filter((doc) => doc.university === login)
              .sort(
                (a, b) =>
                  dayjs(b.createdAt ?? "1970-01-01").valueOf() -
                  dayjs(a.createdAt ?? "1970-01-01").valueOf()
              );

            setData(filteredDocs);
          } catch (error) {
            console.error("Error fetching applications:", error);
          }
        } else {
          console.error("University document not found");
        }
      } catch (error) {
        console.error("Error loading university data:", error);
      }
    }

    fetchData();
  }, [session, isLoading]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Applications</h1>
          <p className="text-muted-foreground">
            Manage incoming student applications
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Applications List</CardTitle>
          <CardDescription>
            Total found: {data?.length} applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Citizenship</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>
                    {item.lastName} {item.firstName} {item.middleName}
                  </TableCell>
                  <TableCell>{item.citizenship || "—"}</TableCell>
                  <TableCell>{item.departmentId || "—"}</TableCell>
                  <TableCell>{item.sex || "—"}</TableCell>

                  <TableCell className="text-right">
                    <Link href={`/dashboard/applications/${item.id}`}>
                      <Button
                        variant="link"
                        className="text-red-600 p-0 h-auto"
                      >
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
