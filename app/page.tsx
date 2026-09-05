import { auth } from "../auth";
import { prisma } from "../lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const session = await auth();
  if (!session?.user?.id) {
    return (
      <div className="card">
        <h1>HoferApp</h1>
        <p className="muted">Client, session, payment and revenue management.</p>
        <a className="btn" href="/api/auth/signin">Sign in with Google</a>
      </div>
    );
  }

  const userId = session.user.id;
  const start = new Date(); start.setHours(0,0,0,0);
  const end = new Date(start); end.setDate(end.getDate()+1);

  const [today, month, clients, unpaid] = await Promise.all([
    prisma.sessionRecord.aggregate({ where:{userId,startAt:{gte:start,lt:end}}, _sum:{revenueCents:true}, _count:true }),
    prisma.sessionRecord.aggregate({ where:{userId,startAt:{gte:new Date(new Date().getFullYear(),new Date().getMonth(),1)}}, _sum:{revenueCents:true} }),
    prisma.client.count({where:{userId,status:"ACTIVE"}}),
    prisma.sessionRecord.aggregate({where:{userId,paymentStatus:"UNPAID"},_sum:{revenueCents:true}})
  ]);

  return <main>
    <div className="grid">
      <div className="card"><div className="muted">Revenue today</div><div className="big">${((today._sum.revenueCents||0)/100).toFixed(2)}</div><div className="muted">{today._count} sessions</div></div>
      <div className="card"><div className="muted">Revenue this month</div><div className="big">${((month._sum.revenueCents||0)/100).toFixed(2)}</div></div>
      <div className="card"><div className="muted">Active clients</div><div className="big">{clients}</div></div>
      <div className="card"><div className="muted">Outstanding revenue</div><div className="big">${((unpaid._sum.revenueCents||0)/100).toFixed(2)}</div></div>
    </div>
    <div className="card" style={{marginTop:16}}>
      <h2>Google Calendar</h2>
      <p className="muted">Import existing calendar events using the format: <b>Robin 20min 50$</b></p>
      <Link className="btn" href="/api/calendar/sync">Sync Calendar</Link>
    </div>
  </main>;
}