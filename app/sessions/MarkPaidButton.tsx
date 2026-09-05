"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MarkPaidButton({
  sessionId,
}: {
  sessionId: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function markPaid() {
    setLoading(true);

    const response = await fetch(`/api/sessions/${sessionId}/paid`, {
      method: "POST",
    });

    if (response.ok) {
      router.refresh();
    } else {
      alert("Could not mark session as paid.");
      setLoading(false);
    }
  }

  return (
    <button
      className="btn"
      onClick={markPaid}
      disabled={loading}
    >
      {loading ? "Saving..." : "Mark Paid"}
    </button>
  );
}
