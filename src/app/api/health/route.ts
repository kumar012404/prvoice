import { db } from "@/lib/firebase";
import { collection, getDocs, limit, query } from "firebase/firestore";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Attempt to query a dummy collection to verify Firestore connectivity
    const q = query(collection(db, "_health_check"), limit(1));
    await getDocs(q);
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Firebase Health check failed:", error);
    return Response.json({ ok: false }, { status: 500 });
  }
}
