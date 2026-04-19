import { NextResponse } from "next/server";

export function GET(request: Request) {
  return NextResponse.redirect(new URL("/sign-in?message=Use%20the%20email%20link%20to%20finish%20access.", request.url));
}
