import { auth } from "../../auth";
import { prisma } from "../../lib/prisma";

export default async function Payments() {
  const session = await auth();
  if (!session?.user?.id) return <a className="btn" href="/api/auth/signin">Sign in with Google</a>;
  const rows = await prisma.payment.findMany({where:{userId:session.user.id},include:{client:true},orderBy:{paidAt:"desc"},take:100});
  return <div className="card"><h1>Payments</h1><p className="muted">Payment entry UI will be added next.</p><table className="table"><thead><tr><th>Date</th><th>Client</th><th>Amount</th><th>Method</th></tr></thead><tbody>
  {rows.map(r=><tr key={r.id}><td>{r.paidAt.toLocaleDateString()}</td><td>{r.client.name}</td><td>${(r.amountCents/100).toFixed(2)}</td><td>{r.method}</td></tr>)}
  </tbody></table></div>
}