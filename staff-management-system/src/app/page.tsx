import { connectToDatabase } from "@/lib/db/connection";
import { UserModel } from "@/models";
import FacultyCard from "@/components/FacultyCard";
import HomeNav from "@/components/HomeNav";

// Static faculty list matching the exact 12 faculties in PHP index.html
const defaultFaculty = [
  {
    name: "Dr.James Manoharan. J",
    designation: "Assoc. Prof. & Head(BCA)",
    img: "https://bhc.edu.in/ca/staff/james.jpg",
    userId: 1,
  },
  {
    name: "Dr.M.Kasthuri",
    designation: "Associate Professor",
    img: "https://bhc.edu.in/ca/staff/kasturi.jpg",
    userId: 4,
  },
  {
    name: "Ms.Olivia Capitola. J",
    designation: "Assistant Professor",
    img: "https://bhc.edu.in/ca/staff/olivia.jpg",
    userId: 5,
  },
  {
    name: "Mr.Paul Davidson. G",
    designation: "Assistant Professor",
    img: "https://bhc.edu.in/ca/staff/paul.jpg",
    userId: 6,
  },
  {
    name: "Dr.K.Mohan Kumar",
    designation: "Associate Professor",
    img: "https://bhc.edu.in/ca/staff/mohankumar.jpg",
    userId: 7,
  },
  {
    name: "Dr.M.Lovelin Ponn Felciah",
    designation: "Assistant Professor",
    img: "https://bhc.edu.in/ca/staff/lovelin.jpg",
    userId: 8,
  },
  {
    name: "Dr.B.Arputhamary",
    designation: "Associate Professor",
    img: "https://bhc.edu.in/ca/staff/arputhamary.jpg",
    userId: 9,
  },
  {
    name: "Mrs.P.Inbarani",
    designation: "Assistant Professor",
    img: "https://bhc.edu.in/ca/staff/inbarani.jpg",
    userId: 10,
  },
  {
    name: "Dr.A.Florence Deepa",
    designation: "Associate Professor",
    img: "https://bhc.edu.in/ca/staff/florence.jpg",
    userId: 11,
  },
  {
    name: "Dr.R.Thamarai Selvi",
    designation: "Associate Professor",
    img: "https://bhc.edu.in/ca/staff/thamaraiselvi.jpg",
    userId: 12,
  },
  {
    name: "Dr.A.Hepzibah Christinal",
    designation: "Associate Professor",
    img: "https://bhc.edu.in/ca/staff/hepzibah.jpg",
    userId: 13,
  },
  {
    name: "Dr.M.Jayakumar",
    designation: "Associate Professor",
    img: "https://bhc.edu.in/ca/staff/jayakumar.jpg",
    userId: 14,
  },
];

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let dbUsers: any[] = [];
  try {
    await connectToDatabase();
    dbUsers = await UserModel.find({}).lean();
  } catch (e) {
    // fallback
  }

  // Combine static faculty profiles with actual DB registered users
  const facultyList = defaultFaculty.map((f) => {
    const matchedUser = dbUsers.find(
      (u) =>
        u.user_id === f.userId ||
        u.sname?.toLowerCase().includes(f.name.toLowerCase().split(".")[0])
    );
    return {
      ...f,
      targetUserId: matchedUser ? String(matchedUser._id) : String(f.userId),
    };
  });

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#1e5799] via-[#2989d8] to-[#207cca] text-white flex flex-col font-sans">
      {/* Responsive Navigation with Drawer */}
      <HomeNav />

      {/* Main Content Area */}
      <div className="flex flex-1 pt-16">
        <main className="flex-1 md:ml-64 p-4 sm:p-6 md:p-8 lg:p-10 max-w-7xl mx-auto w-full">
          <header className="mb-8 md:mb-12 text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-wide mb-3 drop-shadow-sm">
              Faculty - Self-Financed
            </h1>
            <div className="h-0.5 bg-white/30 max-w-xl mx-auto" />
          </header>

          {/* Windows 10 Reveal Highlight Cards Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {facultyList.map((faculty, idx) => (
              <FacultyCard
                key={idx}
                name={faculty.name}
                designation={faculty.designation}
                img={faculty.img}
                targetUserId={faculty.targetUserId}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
