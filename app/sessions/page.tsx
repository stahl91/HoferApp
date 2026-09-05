import { auth } from "../../auth";
import { prisma } from "../../lib/prisma";

export default async function Sessions() {
  const session = await auth();

  if (!session?.user?.id) {
    return <a className="btn" href="/api/auth/signin">Sign in with Google</a>;
  }

  const rows = await prisma.sessionRecord.findMany({
    where: { userId: session.user.id },
    include: { client: true },
    orderBy: { startAt: "desc" },
    take: 100,
  });

  return (
    <div className="card">
      <h1>Sessions</h1>

      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Client</th>
            <th>Minutes</th>
            <th>Revenue</th>
            <th>Status</th>
            <th>Payment</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{r.startAt.toLocaleString()}</td>
              <td>{r.client?.name || r.title}</td>
              <td>{r.minutes}</td>
              <td>${(r.revenueCents / 100).toFixed(2)}</td>

              <td>
                {r.paymentStatus === "PAID" ? (
                  <span>PAID</span>
                ) : (
                  <span>UNPAID</span>
                )}
              </td>

              <td>
                {r.paymentStatus === "UNPAID" ? (
                  <form
                    action={`/api/sessions/${r.id}/paid`}
                    method="POST"
                  >
                    <button type="submit" className="btn">
                      Mark Paid
                    </button>
                  </form>
                ) : (
                  <span className="muted">Paid</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
