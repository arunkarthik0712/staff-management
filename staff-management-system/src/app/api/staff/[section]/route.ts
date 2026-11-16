import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectToDatabase } from "@/lib/db/connection";
import {
  UserModel,
  PersonalDetailsModel,
  AcademicDetailModel,
  CourseCertificateModel,
  WorkExperienceModel,
  TeachingExperienceModel,
  ResearchExperienceModel,
  FiExperienceModel,
  ResearchPhdModel,
  ResearchFellowModel,
  ResearchMphilGuideModel,
  ResearchPhdGuideModel,
  ConferenceWorkshopModel,
  ConferenceOrganizedModel,
  ResearchPaperPresentedModel,
  PublicationInJournalModel,
  PublicationInBookModel,
  BooksPublishedModel,
  ResearchProjectModel,
  AwardsReceivedModel,
  ResourcePersonModel,
  ExtensionActivityModel,
  AdditionalInfoModel,
} from "@/models";

// Map section names to models and cardinality
const modelMap: Record<string, { model: any; isOneToOne?: boolean }> = {
  personal: { model: PersonalDetailsModel, isOneToOne: true },
  academic: { model: AcademicDetailModel, isOneToOne: false },
  course: { model: CourseCertificateModel, isOneToOne: false },
  work: { model: WorkExperienceModel, isOneToOne: false },
  teaching_exp: { model: TeachingExperienceModel, isOneToOne: true },
  research_exp: { model: ResearchExperienceModel, isOneToOne: true },
  fi_exp: { model: FiExperienceModel, isOneToOne: true },
  research_phd: { model: ResearchPhdModel, isOneToOne: true },
  research_fellow: { model: ResearchFellowModel, isOneToOne: true },
  mphil_guide: { model: ResearchMphilGuideModel, isOneToOne: true },
  phd_guide: { model: ResearchPhdGuideModel, isOneToOne: true },
  conference: { model: ConferenceWorkshopModel, isOneToOne: false },
  conference_organized: { model: ConferenceOrganizedModel, isOneToOne: false },
  paper: { model: ResearchPaperPresentedModel, isOneToOne: false },
  journal: { model: PublicationInJournalModel, isOneToOne: false },
  published_book_article: { model: PublicationInBookModel, isOneToOne: false },
  book: { model: BooksPublishedModel, isOneToOne: false },
  research_project: { model: ResearchProjectModel, isOneToOne: false },
  award: { model: AwardsReceivedModel, isOneToOne: false },
  resource_person: { model: ResourcePersonModel, isOneToOne: false },
  extension: { model: ExtensionActivityModel, isOneToOne: false },
  additional: { model: AdditionalInfoModel, isOneToOne: true },
};

async function getAuthenticatedUser() {
  const session: any = await getServerSession();
  if (!session?.user?.email) return null;
  await connectToDatabase();
  const user = await UserModel.findOne({ email: session.user.email.toLowerCase() });
  return user;
}

// GET: /api/staff/[section]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  try {
    const { section } = await params;
    const config = modelMap[section];
    if (!config) {
      return NextResponse.json({ message: "Invalid section" }, { status: 400 });
    }

    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const pageIndex = Number(searchParams.get("pageIndex") ?? "0");
    const pageSize = Number(searchParams.get("pageSize") ?? "10");
    const sortingRaw = searchParams.get("sorting");
    const filtersRaw = searchParams.get("filters");

    if (config.isOneToOne) {
      const data = await config.model.findOne({ user_id: user._id }).lean();
      return NextResponse.json({
        data: data || null,
        rows: data ? [data] : [],
        rowCount: data ? 1 : 0,
        user,
      });
    } else {
      let query: any = { user_id: user._id };

      if (filtersRaw) {
        try {
          const filters = JSON.parse(filtersRaw) as Record<string, string>;
          if (filters.search?.trim()) {
            const regex = new RegExp(filters.search.trim(), "i");
            // Search across string fields in query
            const sampleDoc = await config.model.findOne({ user_id: user._id }).lean();
            if (sampleDoc) {
              const stringKeys = Object.keys(sampleDoc).filter(
                (k) => typeof (sampleDoc as any)[k] === "string" && !k.startsWith("_")
              );
              if (stringKeys.length > 0) {
                query.$or = stringKeys.map((k) => ({ [k]: regex }));
              }
            }
          }
        } catch (e) {
          console.error("Filter parse error:", e);
        }
      }

      let sortOptions: Record<string, 1 | -1> = { createdAt: -1 };
      if (sortingRaw) {
        try {
          const sorting = JSON.parse(sortingRaw) as Array<{ id: string; desc: boolean }>;
          if (sorting.length > 0 && sorting[0].id) {
            sortOptions = { [sorting[0].id]: sorting[0].desc ? -1 : 1 };
          }
        } catch (e) {
          console.error("Sorting parse error:", e);
        }
      }

      const totalCount = await config.model.countDocuments(query);
      const rows = await config.model
        .find(query)
        .sort(sortOptions)
        .skip(pageIndex * pageSize)
        .limit(pageSize)
        .lean();

      return NextResponse.json({
        data: rows,
        rows,
        rowCount: totalCount,
        user,
      });
    }
  } catch (error: any) {
    console.error("GET error in /api/staff:", error);
    return NextResponse.json({ message: error.message || "Server error" }, { status: 500 });
  }
}

// POST: Add new entry or create/update one-to-one
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  try {
    const { section } = await params;
    const config = modelMap[section];
    if (!config) {
      return NextResponse.json({ message: "Invalid section" }, { status: 400 });
    }

    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    let result;
    if (config.isOneToOne) {
      result = await config.model.findOneAndUpdate(
        { user_id: user._id },
        { ...body, user_id: user._id },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    } else {
      result = await config.model.create({
        ...body,
        user_id: user._id,
      });
    }

    // Update user's last_profile_update timestamp (preserving PHP business logic)
    await UserModel.findByIdAndUpdate(user._id, { last_profile_update: new Date() });

    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error: any) {
    console.error("POST error in /api/staff:", error);
    return NextResponse.json({ message: error.message || "Server error" }, { status: 500 });
  }
}

// PUT: Update an existing item (by ?id=...) or 1:1 item
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  try {
    const { section } = await params;
    const config = modelMap[section];
    if (!config) {
      return NextResponse.json({ message: "Invalid section" }, { status: 400 });
    }

    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const id = req.nextUrl.searchParams.get("id");

    let result;
    if (config.isOneToOne) {
      result = await config.model.findOneAndUpdate(
        { user_id: user._id },
        { ...body, user_id: user._id },
        { upsert: true, new: true }
      );
    } else {
      if (!id) {
        return NextResponse.json({ message: "Missing item id" }, { status: 400 });
      }
      result = await config.model.findOneAndUpdate(
        { _id: id, user_id: user._id },
        body,
        { new: true }
      );
    }

    await UserModel.findByIdAndUpdate(user._id, { last_profile_update: new Date() });
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error("PUT error in /api/staff:", error);
    return NextResponse.json({ message: error.message || "Server error" }, { status: 500 });
  }
}

// DELETE: Delete an item (by ?id=... or JSON body { id })
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  try {
    const { section } = await params;
    const config = modelMap[section];
    if (!config) {
      return NextResponse.json({ message: "Invalid section" }, { status: 400 });
    }

    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let id = req.nextUrl.searchParams.get("id");
    if (!id) {
      try {
        const body = await req.json();
        if (body?.id) id = body.id;
      } catch {
        // Body was empty or not JSON, fallback to query param
      }
    }

    if (!id && !config.isOneToOne) {
      return NextResponse.json({ message: "Missing item id" }, { status: 400 });
    }

    if (config.isOneToOne) {
      await config.model.findOneAndDelete({ user_id: user._id });
    } else {
      await config.model.findOneAndDelete({ _id: id, user_id: user._id });
    }

    await UserModel.findByIdAndUpdate(user._id, { last_profile_update: new Date() });
    return NextResponse.json({ success: true, message: "Record deleted successfully" });
  } catch (error: any) {
    console.error("DELETE error in /api/staff:", error);
    return NextResponse.json({ message: error.message || "Server error" }, { status: 500 });
  }
}
