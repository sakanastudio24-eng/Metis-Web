import { NextResponse } from "next/server";

export function GET(request: Request) {
  return NextResponse.redirect(new URL("/sign-in?message=Use%20a%20magic%20link%20instead.", request.url));
}
