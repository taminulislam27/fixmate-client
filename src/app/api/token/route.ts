import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Not signed in" }, { status: 401 });

  const secret = process.env.JWT_SECRET;
  if (!secret) return NextResponse.json({ message: "JWT_SECRET missing" }, { status: 500 });

  const token = await new SignJWT({ email: session.user.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(session.user.id)
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(new TextEncoder().encode(secret));

  return NextResponse.json({ token, expiresIn: 15 * 60 });
}
