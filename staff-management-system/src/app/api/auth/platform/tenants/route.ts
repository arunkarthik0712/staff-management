import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { activateTenant } from "@/lib/user-store";

export async function GET(req: NextRequest) {
  const session: any = await getServerSession();
  
  if (!session?.user?.scope || session.user.scope !== "platform") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ message: "Platform endpoint - implement tenant listing here" });
}

export async function PATCH(req: NextRequest) {
  try {
    const session: any = await getServerSession();
    
    if (!session?.user?.scope || session.user.scope !== "platform") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { slug, action } = await req.json();

    if (!slug || !action) {
      return NextResponse.json({ message: "Slug and action are required" }, { status: 400 });
    }

    if (action === "activate") {
      await activateTenant(slug);
      return NextResponse.json({ message: "Tenant activated successfully" });
    }

    return NextResponse.json({ message: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Tenant activation error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
