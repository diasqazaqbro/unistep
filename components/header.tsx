"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { FC, useState } from "react";
import { Data } from "@/app/site/[...slug]/page";

type HeaderProps = {
  data: Data;
};

const Header: FC<HeaderProps> = ({ data }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href={`/site/${data.login}`} className="flex items-center">
            <span className="text-xl font-bold text-red-600">
              {data.shortName}
            </span>
            <span className="ml-2 text-gray-600 hidden sm:inline">
              Admission Office
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href={`/site/${data.login}/#about`}
              className="text-gray-700 hover:text-red-600 transition-colors"
            >
              About University
            </Link>
            <Link
              href={`/site/${data.login}/#programs`}
              className="text-gray-700 hover:text-red-600 transition-colors"
            >
              Programs
            </Link>
            <Link
              href={`/site/${data.login}/#cta`}
              className="text-gray-700 hover:text-red-600 transition-colors"
            >
              Call to Action
            </Link>

            <Link href={`${`/apply/${data?.login}`}`}>
              <Button className="bg-red-600 hover:bg-red-700">Apply Now</Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t py-4">
          <div className="container mx-auto px-4 flex flex-col space-y-4">
            <Link
              href={`/site/${data.login}/#about`}
              className="text-gray-700 hover:text-red-600 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              About University
            </Link>
            <Link
              href={`/site/${data.login}/#programs`}
              className="text-gray-700 hover:text-red-600 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Programs
            </Link>
            <Link
              href={`/site/${data.login}/#cta`}
              className="text-gray-700 hover:text-red-600 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Call to Action
            </Link>

            <Link href="/apply" onClick={() => setIsMenuOpen(false)}>
              <Button className="bg-red-600 hover:bg-red-700 w-full">
                Apply Now
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
