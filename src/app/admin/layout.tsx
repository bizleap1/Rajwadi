import React from "react";
import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/auth";
import AdminNav from "./AdminNav";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const reqHeaders = await headers();
  const pathname = reqHeaders.get("x-invoke-path") || "";

  const admin = await requireAdminSession(reqHeaders);

  if (!admin) {
    redirect("/?auth=signin&denied=admin");
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#171717] font-sans flex flex-col selection:bg-[#6D1A2A] selection:text-white">
      <header className="bg-white border-b border-[#EBD9C8] sticky top-0 z-40 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 sm:h-18">
              {/* Brand Logo & Portal Tag */}
              <div className="flex items-center gap-4 sm:gap-6">
                <Link href="/admin/products" className="flex items-center gap-3">
                  <Image
                    src="/logo without bg.png"
                    alt="Rajwadi"
                    width={110}
                    height={38}
                    className="h-8 sm:h-9 w-auto object-contain brightness-90"
                    priority
                  />
                  <div className="hidden sm:flex flex-col border-l border-[#EBD9C8] pl-3 py-0.5">
                    <span className="text-[9px] uppercase tracking-[0.25em] text-[#855D25] font-semibold">
                      ATELIER OWNER
                    </span>
                    <span className="text-[11px] font-serif text-[#171717] italic">
                      Admin Control
                    </span>
                  </div>
                </Link>
              </div>

              {/* Navigation Links & Action Buttons */}
              <AdminNav user={admin.user} />
            </div>
          </div>
        </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-[#EBD9C8] py-4 text-center text-xs text-[#8A796B]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Rajwadi Luxury Poshaks — Owner Administration</span>
          <span className="text-[11px] text-[#A09285]">
            Authenticated as {admin.user.email} (ADMIN)
          </span>
        </div>
      </footer>
    </div>
  );
}
