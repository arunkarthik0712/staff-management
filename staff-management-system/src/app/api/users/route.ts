import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connection";
import { UserModel } from "@/models";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const pageIndex = Number(searchParams.get("pageIndex") ?? "0");
    const pageSize = Number(searchParams.get("pageSize") ?? "10");
    const sortingRaw = searchParams.get("sorting");
    const filtersRaw = searchParams.get("filters");

    const query: any = {};

    if (filtersRaw) {
      try {
        const filters = JSON.parse(filtersRaw) as Record<string, string>;
        if (filters.search?.trim()) {
          const searchRegex = new RegExp(filters.search.trim(), "i");
          query.$or = [
            { uname: searchRegex },
            { sname: searchRegex },
            { email: searchRegex },
            { designation: searchRegex },
            { department: searchRegex },
          ];
        }
      } catch {
        // ignore parse error
      }
    }

    let sort: any = { user_id: 1 };
    if (sortingRaw) {
      try {
        const sorting = JSON.parse(sortingRaw) as Array<{ id: string; desc: boolean }>;
        if (sorting.length > 0 && sorting[0].id) {
          sort = { [sorting[0].id]: sorting[0].desc ? -1 : 1 };
        }
      } catch {
        // ignore parse error
      }
    }

    const [rows, total] = await Promise.all([
      UserModel.find(query)
        .select("-password")
        .sort(sort)
        .skip(pageIndex * pageSize)
        .limit(pageSize)
        .lean(),
      UserModel.countDocuments(query),
    ]);

    const pageCount = Math.ceil(total / pageSize);

    return NextResponse.json({
      rows,
      pageCount,
      rowCount: total,
    });
  } catch (err: any) {
    return NextResponse.json(
      { message: "Failed to fetch users", error: err.message },
      { status: 500 }
    );
  }
}
