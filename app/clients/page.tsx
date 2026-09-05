import { auth } from "../../auth";
import { prisma } from "../../lib/prisma";
import Link from "next/link";

export default async function Clients() {
  const session = await auth();
  if (!session?.user?.id) return <a className="btn" href="/api/auth/signin">Sign in with Google</a>;
  const clients = await prisma.client.findMany({where:{userId:session.user.id},orderBy:{name:"asc"}});
  return <div className="card">
    <div className="top"><h1>Clients</h1><Link className="btn" href="/clients/new">+ New client</Link></div>
    <table className="table"><thead><tr><th>Name</th><th>Status</th><th>Email</th></tr></thead><tbody>
      {clients.map(c=><tr key={c.id}><td>{c.name}</td><td><span className="pill">{c.status}</span></td><td>{c.email||"—"}</td></tr>)}
    </tbody></table>
  </div>;
}