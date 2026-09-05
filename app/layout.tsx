import "./globals.css";
import { auth } from "../auth";
import Link from "next/link";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return (
    <html lang="en">
      <body>
        <div className="wrap">
          <div className="top">
            <div className="brand">HoferApp</div>
            {session?.user && <div className="muted">{session.user.email}</div>}
          </div>
          {session?.user && (
            <div className="nav">
              <Link href="/">Dashboard</Link>
              <Link href="/clients">Clients</Link>
              <Link href="/sessions">Sessions</Link>
              <Link href="/payments">Payments</Link>
            </div>
          )}
          {children}
        </div>
      </body>
    </html>
  );
}