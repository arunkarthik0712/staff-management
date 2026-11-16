import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connection";
import {
  UserModel,
  AcademicDetailModel,
  CourseCertificateModel,
  WorkExperienceModel,
  TeachingExperienceModel,
  ResearchExperienceModel,
  FiExperienceModel,
  ResearchPhdModel,
  ConferenceWorkshopModel,
  ResearchPaperPresentedModel,
  PublicationInJournalModel,
  PublicationInBookModel,
  BooksPublishedModel,
  ConferenceOrganizedModel,
  ResearchProjectModel,
  AwardsReceivedModel,
  ResourcePersonModel,
} from "@/models";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json({ message: "user_id is required" }, { status: 400 });
    }

    await connectToDatabase();

    // Query user by ObjectId or legacy user_id
    let user;
    if (userId.match(/^[0-9a-fA-F]{24}$/)) {
      user = await UserModel.findById(userId).lean();
    } else {
      user = await UserModel.findOne({ user_id: parseInt(userId, 10) }).lean();
    }

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const uid = user._id;

    // Parallel fetch of all report sections matching PHP report.php
    const [
      academicDetails,
      phdDetails,
      courseCertificates,
      workExperience,
      teachingExp,
      researchExp,
      fiExp,
      confWorkshops,
      papersPresented,
      journals,
      booksArticles,
      booksPublished,
      confOrganized,
      researchProjects,
      awards,
      resourcePersons,
    ] = await Promise.all([
      AcademicDetailModel.find({ user_id: uid }).sort({ year_of_passing: -1 }).lean(),
      ResearchPhdModel.find({ user_id: uid }).lean(),
      CourseCertificateModel.find({ user_id: uid }).lean(),
      WorkExperienceModel.find({ user_id: uid }).lean(),
      TeachingExperienceModel.find({ user_id: uid }).lean(),
      ResearchExperienceModel.find({ user_id: uid }).lean(),
      FiExperienceModel.find({ user_id: uid }).lean(),
      ConferenceWorkshopModel.find({ user_id: uid }).sort({ date_from: -1, date_to: -1 }).lean(),
      ResearchPaperPresentedModel.find({ user_id: uid }).sort({ date_from: -1, date_to: -1 }).lean(),
      PublicationInJournalModel.find({ user_id: uid }).sort({ date_of_publish: -1 }).lean(),
      PublicationInBookModel.find({ user_id: uid }).sort({ month_and_year: -1 }).lean(),
      BooksPublishedModel.find({ user_id: uid }).sort({ month_and_year_of_publication: -1 }).lean(),
      ConferenceOrganizedModel.find({ user_id: uid }).sort({ date_from: -1, date_to: -1 }).lean(),
      ResearchProjectModel.find({ user_id: uid }).sort({ date_from: -1, date_to: -1 }).lean(),
      AwardsReceivedModel.find({ user_id: uid }).sort({ month_and_year: -1 }).lean(),
      ResourcePersonModel.find({ user_id: uid }).sort({ date_of_event: -1 }).lean(),
    ]);

    // Build PDF document matching DomPDF styling
    const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });

    let y = 40;

    // Header styling
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(139, 0, 0); // darkred
    doc.text(user.sname || user.uname || "Staff Name", 40, y);
    y += 18;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(51, 51, 51);
    doc.text(`${user.designation || "Faculty"},`, 40, y);
    y += 14;
    doc.text(`Department Of ${user.department || "Computer Applications"},`, 40, y);
    y += 14;
    doc.text("Bishop Heber College,", 40, y);
    y += 14;
    doc.text("Tiruchirappalli - 17.", 40, y);
    y += 14;

    doc.text(`Email : ${user.email || ""}`, 40, y);
    y += 14;
    doc.text(`Phone : ${user.mobile_number || ""}`, 40, y);
    y += 18;

    doc.setDrawColor(200, 200, 200);
    doc.line(40, y, 555, y);
    y += 20;

    // Helper for table sections
    function addSectionHeader(title: string) {
      if (y > 740) {
        doc.addPage();
        y = 40;
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(51, 51, 51);
      doc.text(title, 40, y);
      y += 10;
    }

    // 1. Qualifications
    if (academicDetails.length > 0) {
      addSectionHeader("Qualification");
      autoTable(doc, {
        startY: y,
        margin: { left: 40, right: 40 },
        head: [["Degree", "Branch", "University", "Year"]],
        body: academicDetails.map((a: any) => [
          a.degree_name || a.degree || "",
          a.branch || "",
          a.university_institution || "",
          a.year_of_passing || "",
        ]),
        styles: { fontSize: 9 },
        headStyles: { fillColor: [242, 242, 242], textColor: 0 },
      });
      y = (doc as any).lastAutoTable.finalY + 18;
    }

    // 2. PhD Details
    if (phdDetails.length > 0) {
      addSectionHeader("Ph.D. Details");
      autoTable(doc, {
        startY: y,
        margin: { left: 40, right: 40 },
        head: [["Title of Thesis", "Area of Specialization", "Research Supervisor", "Research Centre", "Year of Award"]],
        body: phdDetails.map((p: any) => [
          p.title_of_thesis || "",
          p.area_of_specialization || "",
          p.research_supervisor || "",
          p.research_center || "",
          p.month_year_reward || "",
        ]),
        styles: { fontSize: 8 },
        headStyles: { fillColor: [242, 242, 242], textColor: 0 },
      });
      y = (doc as any).lastAutoTable.finalY + 18;
    }

    // 3. Additional Qualification (Course/Certificates)
    if (courseCertificates.length > 0) {
      addSectionHeader("Additional Qualification");
      autoTable(doc, {
        startY: y,
        margin: { left: 40, right: 40 },
        head: [["Name of course", "Place of study", "Date", "Duration"]],
        body: courseCertificates.map((c: any) => [
          c.course_name || "",
          c.place_of_study || "",
          c.month_and_year_of_completion || "",
          c.duration || "",
        ]),
        styles: { fontSize: 9 },
        headStyles: { fillColor: [242, 242, 242], textColor: 0 },
      });
      y = (doc as any).lastAutoTable.finalY + 18;
    }

    // 4. Work Experience
    if (workExperience.length > 0) {
      addSectionHeader("Work Experience");
      autoTable(doc, {
        startY: y,
        margin: { left: 40, right: 40 },
        head: [["Name of institution", "Address of institution", "Designation", "From", "To"]],
        body: workExperience.map((w: any) => [
          w.institution_name || "",
          w.address_of_institution || "",
          w.designation || "",
          w.period_of_service_from || "",
          w.period_of_service_to || "",
        ]),
        styles: { fontSize: 9 },
        headStyles: { fillColor: [242, 242, 242], textColor: 0 },
      });
      y = (doc as any).lastAutoTable.finalY + 18;
    }

    // 5. Teaching Experience
    if (teachingExp.length > 0) {
      addSectionHeader("Teaching Experience");
      autoTable(doc, {
        startY: y,
        margin: { left: 40, right: 40 },
        head: [["U.G", "P.G", "M.Phil", "Ph.D"]],
        body: teachingExp.map((t: any) => [
          t.teaching_ug || "",
          t.teaching_pg || "",
          t.teaching_mphil || "",
          t.teaching_phd || "",
        ]),
        styles: { fontSize: 9 },
        headStyles: { fillColor: [242, 242, 242], textColor: 0 },
      });
      y = (doc as any).lastAutoTable.finalY + 18;
    }

    // 6. Research Experience
    if (researchExp.length > 0) {
      addSectionHeader("Research Experience");
      autoTable(doc, {
        startY: y,
        margin: { left: 40, right: 40 },
        head: [["U.G", "P.G", "M.Phil", "Ph.D"]],
        body: researchExp.map((r: any) => [
          r.research_ug || "",
          r.research_pg || "",
          r.research_mphil || "",
          r.research_phd || "",
        ]),
        styles: { fontSize: 9 },
        headStyles: { fillColor: [242, 242, 242], textColor: 0 },
      });
      y = (doc as any).lastAutoTable.finalY + 18;
    }

    // 7. Field Experience
    if (fiExp.length > 0) {
      addSectionHeader("Field Experience");
      autoTable(doc, {
        startY: y,
        margin: { left: 40, right: 40 },
        head: [["Type", "Name of the sector", "Designation", "From", "To"]],
        body: fiExp.map((f: any) => [
          f.field_industrial || "",
          f.name_of_organisation || "",
          f.desgination || "",
          f.duration_From || "",
          f.duration_to || "",
        ]),
        styles: { fontSize: 9 },
        headStyles: { fillColor: [242, 242, 242], textColor: 0 },
      });
      y = (doc as any).lastAutoTable.finalY + 18;
    }

    // 8. Table of Contents / Summary counts matching PHP
    addSectionHeader("Table of contents");
    const summaryRows = [
      ["1", "Conferences / Workshops / Seminars Attended", String(confWorkshops.length)],
      ["2", "Research Papers Presented", String(papersPresented.length)],
      ["3", "Publication in Journals", String(journals.length)],
      ["4", "Publication in Books", String(booksArticles.length)],
      ["5", "Books Published / Edited", String(booksPublished.length)],
      ["6", "Conferences / Workshops / Seminars Organized", String(confOrganized.length)],
      ["7", "Research Projects", String(researchProjects.length)],
      ["8", "Resource Person", String(resourcePersons.length)],
      ["9", "Awards Recieved", String(awards.length)],
    ];
    autoTable(doc, {
      startY: y,
      margin: { left: 40, right: 40 },
      head: [["#", "Section", "Total Records"]],
      body: summaryRows,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [242, 242, 242], textColor: 0 },
    });
    y = (doc as any).lastAutoTable.finalY + 20;

    // Detailed Narratives:
    function addNarrativeSection(title: string, items: any[], formatter: (item: any, idx: number) => string) {
      if (items.length === 0) return;
      addSectionHeader(title);
      items.forEach((item, idx) => {
        const text = formatter(item, idx + 1);
        const splitText = doc.splitTextToSize(text, 500);
        if (y + splitText.length * 12 > 780) {
          doc.addPage();
          y = 40;
        }
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text(splitText, 45, y);
        y += splitText.length * 12 + 6;
      });
      y += 10;
    }

    addNarrativeSection(
      "Conferences / Workshops / Seminars Attended",
      confWorkshops,
      (c, i) => `${i}. ${c.level ? c.level + " level " : ""}${c.conf_workshop_type ? c.conf_workshop_type + " on " : ""} "${c.conf_workshop_name || ""}" ${c.sponsored_by ? "sponsored by " + c.sponsored_by : ""} ${c.organized_by ? "organized by " + c.organized_by : ""} ${c.place ? "at " + c.place : ""} ${c.date_from ? "during " + c.date_from : ""}${c.date_to ? " to " + c.date_to : ""}`
    );

    addNarrativeSection(
      "Research Papers Presented",
      papersPresented,
      (p, i) => `${i}. "${p.title_of_paper || ""}" in the ${p.conference_level ? p.conference_level + " conference on " : ""}${p.name_of_conf || ""} ${p.sponsored_by ? "sponsored by " + p.sponsored_by + "," : ""} ${p.organized_by ? "organized by " + p.organized_by : ""} ${p.place ? "at " + p.place : ""} ${p.date_from ? "during " + p.date_from : ""}${p.date_to ? " to " + p.date_to : ""}`
    );

    addNarrativeSection(
      "Publication in Journals",
      journals,
      (j, i) => `${i}. "${j.title_of_article || ""}" published in the ${j.level ? j.level + " journal of " : ""}${j.journal_name || ""} ${j.type ? "(" + j.type + ")" : ""} ${j.volume ? "vol. " + j.volume + "," : ""} ${j.issue_no ? "issue No. " + j.issue_no + "," : ""} ${j.date_of_publish || ""} ${j.issn ? "ISSN " + j.issn + "." : ""} ${j.impact_factor ? "impact factor " + j.impact_factor + "," : ""} ${j.scopus_index ? "Scopus index " + j.scopus_index + "," : ""} ${j.h_index ? "h-index " + j.h_index + "," : ""} ${j.citation_index ? "citation index " + j.citation_index : ""}`
    );

    addNarrativeSection(
      "Publication in Books",
      booksArticles,
      (b, i) => `${i}. "${b.title_of_article || ""}". ${b.book_name || ""}. ${b.place_of_publication ? b.place_of_publication + ":" : ""} ${b.publishers_name ? b.publishers_name + "," : ""} ${b.month_and_year || ""} ${b.volume ? "vol. " + b.volume + "," : ""} ${b.issue_no ? "issue No. " + b.issue_no + "," : ""} ${b.isbn ? "ISBN " + b.isbn + "." : ""}`
    );

    addNarrativeSection(
      "Books Published / Edited",
      booksPublished,
      (b, i) => `${i}. ${user.sname || user.uname}. "${b.title_of_book || ""}". ${b.place_of_publication ? b.place_of_publication + ":" : ""} ${b.published_name ? b.published_name + "," : ""} ${b.month_and_year_of_publication || ""} ${b.isbn ? "ISBN " + b.isbn + "." : ""}`
    );

    addNarrativeSection(
      "Conferences / Workshops / Seminars Organized",
      confOrganized,
      (o, i) => `${i}. ${o.level ? o.level + " level " : ""}${o.conf_workshop_seminar_type ? o.conf_workshop_seminar_type + " Entitled " : ""} "${o.title || ""}" ${o.place ? "at " + o.place : ""} ${o.sponsors_name ? "sponsored by " + o.sponsors_name : ""} ${o.date_from ? "during " + o.date_from : ""}${o.date_to ? " to " + o.date_to : ""}`
    );

    addNarrativeSection(
      "Research Projects",
      researchProjects,
      (r, i) => `${i}. ${r.project_type ? r.project_type + " Project Entitled " : ""} "${r.title_of_project || ""}" ${r.sponsoring_agency ? "sponsored by " + r.sponsoring_agency : ""} ${r.date_from ? "during " + r.date_from : ""}${r.date_to ? " to " + r.date_to : ""} ${r.status ? "[ " + r.status + " ]" : ""}`
    );

    addNarrativeSection(
      "Resource Person",
      resourcePersons,
      (p, i) => `${i}. ${p.level ? p.level + " level " : ""}${p.type ? p.type + " on " : ""} "${p.topic || ""}" ${p.place ? "at " + p.place : ""} ${p.date_of_event ? ", " + p.date_of_event : ""}`
    );

    if (awards.length > 0) {
      addSectionHeader("Awards Recieved");
      autoTable(doc, {
        startY: y,
        margin: { left: 40, right: 40 },
        head: [["Award Name", "Presented By", "Year", "Level", "Instituted by", "Amount"]],
        body: awards.map((a: any) => [
          a.award_name || "",
          a.presented_by || "",
          a.month_and_year || "",
          a.level || "",
          a.instituted_by || "",
          a.amount_received || "NIL",
        ]),
        styles: { fontSize: 8 },
        headStyles: { fillColor: [242, 242, 242], textColor: 0 },
      });
      y = (doc as any).lastAutoTable.finalY + 18;
    }

    const pdfBytes = doc.output("arraybuffer");
    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${user.uname || "staff"}_report.pdf"`,
      },
    });
  } catch (error: any) {
    console.error("PDF generation error:", error);
    return NextResponse.json({
      message: error?.message || "PDF generation failed",
      stack: error?.stack,
    }, { status: 500 });
  }
}
