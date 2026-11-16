import mongoose, { Schema, Document, Model } from "mongoose";

// 1. User
export interface IUser extends Document {
  user_id?: number; // legacy ID support
  sname: string; // display name e.g. Dr.J.James Manoharan
  uname: string; // username
  password: string; // hashed password
  designation: string;
  department: string;
  mobile_number: string;
  email: string;
  last_profile_update?: Date | null;
  resetToken?: string | null;
  resetTokenExpiry?: Date | null;
  scope?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    user_id: { type: Number, index: true },
    sname: { type: String, default: "" },
    uname: { type: String, required: true },
    password: { type: String, required: true },
    designation: { type: String, default: "" },
    department: { type: String, default: "Computer Applications" },
    mobile_number: { type: String, default: "" },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    last_profile_update: { type: Date, default: null },
    resetToken: { type: String, default: null },
    resetTokenExpiry: { type: Date, default: null },
    scope: { type: String, default: "staff" },
  },
  { timestamps: true }
);

export const UserModel: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema, "users");

// 2. Personal Details (1:1 with User)
export interface IPersonalDetails extends Document {
  user_id: mongoose.Types.ObjectId | string;
  legacy_user_id?: number;
  mobile_number?: string;
  date_of_birth?: string | null;
  area_of_specialization?: string;
  father_or_husband_name?: string;
  email?: string;
  address_for_communication?: string;
  permanent_address?: string;
  nationality?: string;
  religion?: string;
  community?: string;
  languages_known?: string;
  marital_status?: string;
  additional_responsibilities?: string;
  physically_challenged?: string;
  hobbies?: string;
}

const PersonalDetailsSchema = new Schema<IPersonalDetails>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    legacy_user_id: { type: Number },
    mobile_number: { type: String, default: "" },
    date_of_birth: { type: String, default: null },
    area_of_specialization: { type: String, default: "" },
    father_or_husband_name: { type: String, default: "" },
    email: { type: String, default: "" },
    address_for_communication: { type: String, default: "" },
    permanent_address: { type: String, default: "" },
    nationality: { type: String, default: "" },
    religion: { type: String, default: "" },
    community: { type: String, default: "" },
    languages_known: { type: String, default: "" },
    marital_status: { type: String, default: "" },
    additional_responsibilities: { type: String, default: "" },
    physically_challenged: { type: String, default: "No" },
    hobbies: { type: String, default: "" },
  },
  { timestamps: true }
);

export const PersonalDetailsModel: Model<IPersonalDetails> =
  mongoose.models.PersonalDetails ||
  mongoose.model<IPersonalDetails>("PersonalDetails", PersonalDetailsSchema, "personal_details");

// 3. Academic Details (1:N)
export interface IAcademicDetail extends Document {
  user_id: mongoose.Types.ObjectId | string;
  legacy_user_id?: number;
  degree: string;
  degree_name: string;
  branch: string;
  university_institution: string;
  year_of_passing?: string | number;
  percentage_cgpa?: string | number;
  class?: string;
  rank?: string;
}

const AcademicDetailSchema = new Schema<IAcademicDetail>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    legacy_user_id: { type: Number },
    degree: { type: String, required: true },
    degree_name: { type: String, required: true },
    branch: { type: String, default: "" },
    university_institution: { type: String, default: "" },
    year_of_passing: { type: Schema.Types.Mixed, default: "" },
    percentage_cgpa: { type: Schema.Types.Mixed, default: "" },
    class: { type: String, default: "" },
    rank: { type: String, default: "" },
  },
  { timestamps: true }
);

export const AcademicDetailModel: Model<IAcademicDetail> =
  mongoose.models.AcademicDetail ||
  mongoose.model<IAcademicDetail>("AcademicDetail", AcademicDetailSchema, "academic_details");

// 4. Course / Certificate Details (1:N)
export interface ICourseCertificate extends Document {
  user_id: mongoose.Types.ObjectId | string;
  legacy_user_id?: number;
  course_name: string;
  place_of_study?: string;
  month_and_year_of_completion?: string;
  duration?: string;
}

const CourseCertificateSchema = new Schema<ICourseCertificate>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    legacy_user_id: { type: Number },
    course_name: { type: String, required: true },
    place_of_study: { type: String, default: "" },
    month_and_year_of_completion: { type: String, default: "" },
    duration: { type: String, default: "" },
  },
  { timestamps: true }
);

export const CourseCertificateModel: Model<ICourseCertificate> =
  mongoose.models.CourseCertificate ||
  mongoose.model<ICourseCertificate>("CourseCertificate", CourseCertificateSchema, "course_certificates");

// 5. Work Experience (1:N)
export interface IWorkExperience extends Document {
  user_id: mongoose.Types.ObjectId | string;
  legacy_user_id?: number;
  institution_name: string;
  designation: string;
  address_of_institution?: string;
  pay_band_basic_pay?: string;
  period_of_service_from?: string;
  period_of_service_to?: string;
}

const WorkExperienceSchema = new Schema<IWorkExperience>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    legacy_user_id: { type: Number },
    institution_name: { type: String, required: true },
    designation: { type: String, required: true },
    address_of_institution: { type: String, default: "" },
    pay_band_basic_pay: { type: String, default: "" },
    period_of_service_from: { type: String, default: "" },
    period_of_service_to: { type: String, default: "" },
  },
  { timestamps: true }
);

export const WorkExperienceModel: Model<IWorkExperience> =
  mongoose.models.WorkExperience ||
  mongoose.model<IWorkExperience>("WorkExperience", WorkExperienceSchema, "work_experience");

// 6. Teaching Experience (1:1 with user)
export interface ITeachingExperience extends Document {
  user_id: mongoose.Types.ObjectId | string;
  legacy_user_id?: number;
  teaching_ug?: string;
  teaching_pg?: string;
  teaching_mphil?: string;
  teaching_phd?: string;
}

const TeachingExperienceSchema = new Schema<ITeachingExperience>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    legacy_user_id: { type: Number },
    teaching_ug: { type: String, default: "" },
    teaching_pg: { type: String, default: "" },
    teaching_mphil: { type: String, default: "" },
    teaching_phd: { type: String, default: "" },
  },
  { timestamps: true }
);

export const TeachingExperienceModel: Model<ITeachingExperience> =
  mongoose.models.TeachingExperience ||
  mongoose.model<ITeachingExperience>("TeachingExperience", TeachingExperienceSchema, "teaching_experience");

// 7. Research Experience (1:1 with user)
export interface IResearchExperience extends Document {
  user_id: mongoose.Types.ObjectId | string;
  legacy_user_id?: number;
  research_ug?: string;
  research_pg?: string;
  research_mphil?: string;
  research_phd?: string;
}

const ResearchExperienceSchema = new Schema<IResearchExperience>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    legacy_user_id: { type: Number },
    research_ug: { type: String, default: "" },
    research_pg: { type: String, default: "" },
    research_mphil: { type: String, default: "" },
    research_phd: { type: String, default: "" },
  },
  { timestamps: true }
);

export const ResearchExperienceModel: Model<IResearchExperience> =
  mongoose.models.ResearchExperience ||
  mongoose.model<IResearchExperience>("ResearchExperience", ResearchExperienceSchema, "research_experience");

// 8. Field / Industrial Experience (1:1 with user)
export interface IFiExperience extends Document {
  user_id: mongoose.Types.ObjectId | string;
  legacy_user_id?: number;
  field_industrial?: string; // "field" | "industrial"
  name_of_organisation?: string;
  desgination?: string;
  duration_From?: string;
  duration_to?: string;
}

const FiExperienceSchema = new Schema<IFiExperience>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    legacy_user_id: { type: Number },
    field_industrial: { type: String, default: "field" },
    name_of_organisation: { type: String, default: "" },
    desgination: { type: String, default: "" },
    duration_From: { type: String, default: "" },
    duration_to: { type: String, default: "" },
  },
  { timestamps: true }
);

export const FiExperienceModel: Model<IFiExperience> =
  mongoose.models.FiExperience ||
  mongoose.model<IFiExperience>("FiExperience", FiExperienceSchema, "fi_experience");

// 9. Research PhD (1:1 with user)
export interface IResearchPhd extends Document {
  user_id: mongoose.Types.ObjectId | string;
  legacy_user_id?: number;
  obtained_phd?: string; // "YES" | "NO" | "Pursuing"
  title_of_thesis?: string;
  area_of_specialization?: string;
  research_supervisor?: string;
  research_center?: string;
  month_year_reward?: string;
}

const ResearchPhdSchema = new Schema<IResearchPhd>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    legacy_user_id: { type: Number },
    obtained_phd: { type: String, default: "NO" },
    title_of_thesis: { type: String, default: "" },
    area_of_specialization: { type: String, default: "" },
    research_supervisor: { type: String, default: "" },
    research_center: { type: String, default: "" },
    month_year_reward: { type: String, default: "" },
  },
  { timestamps: true }
);

export const ResearchPhdModel: Model<IResearchPhd> =
  mongoose.models.ResearchPhd ||
  mongoose.model<IResearchPhd>("ResearchPhd", ResearchPhdSchema, "research_phd");

// 10. Research Fellow (1:1 with user)
export interface IResearchFellow extends Document {
  user_id: mongoose.Types.ObjectId | string;
  legacy_user_id?: number;
  obtained_post_doctoral?: string; // "Yes" | "No" | "Not Applicable"
  name_of_fellowship?: string;
  host_institution?: string;
  duration_from?: string | null;
  duration_to?: string;
}

const ResearchFellowSchema = new Schema<IResearchFellow>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    legacy_user_id: { type: Number },
    obtained_post_doctoral: { type: String, default: "Not Applicable" },
    name_of_fellowship: { type: String, default: "" },
    host_institution: { type: String, default: "" },
    duration_from: { type: String, default: null },
    duration_to: { type: String, default: "" },
  },
  { timestamps: true }
);

export const ResearchFellowModel: Model<IResearchFellow> =
  mongoose.models.ResearchFellow ||
  mongoose.model<IResearchFellow>("ResearchFellow", ResearchFellowSchema, "research_fellow");

// 11. Research M.Phil Guide (1:1 with user)
export interface IResearchMphilGuide extends Document {
  user_id: mongoose.Types.ObjectId | string;
  legacy_user_id?: number;
  mphil_guide_name: string;
  mphil_part_full_time?: string; // "PT" | "FT"
  mphil_scholar_name?: string;
  mphil_board_area_of_research?: string;
  mphil_title_of_dissertation?: string;
  mphil_status?: string;
}

const ResearchMphilGuideSchema = new Schema<IResearchMphilGuide>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    legacy_user_id: { type: Number },
    mphil_guide_name: { type: String, default: "" },
    mphil_part_full_time: { type: String, default: "FT" },
    mphil_scholar_name: { type: String, default: "" },
    mphil_board_area_of_research: { type: String, default: "" },
    mphil_title_of_dissertation: { type: String, default: "" },
    mphil_status: { type: String, default: "" },
  },
  { timestamps: true }
);

export const ResearchMphilGuideModel: Model<IResearchMphilGuide> =
  mongoose.models.ResearchMphilGuide ||
  mongoose.model<IResearchMphilGuide>("ResearchMphilGuide", ResearchMphilGuideSchema, "research_mphil_guide");

// 12. Research PhD Guide (1:1 with user)
export interface IResearchPhdGuide extends Document {
  user_id: mongoose.Types.ObjectId | string;
  legacy_user_id?: number;
  phd_guide_name: string;
  phd_part_full_time?: string; // "PT" | "FT"
  phd_scholar_name?: string;
  phd_board_area_of_research?: string;
  phd_title_of_dissertation?: string;
  phd_status?: string;
}

const ResearchPhdGuideSchema = new Schema<IResearchPhdGuide>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    legacy_user_id: { type: Number },
    phd_guide_name: { type: String, default: "" },
    phd_part_full_time: { type: String, default: "FT" },
    phd_scholar_name: { type: String, default: "" },
    phd_board_area_of_research: { type: String, default: "" },
    phd_title_of_dissertation: { type: String, default: "" },
    phd_status: { type: String, default: "" },
  },
  { timestamps: true }
);

export const ResearchPhdGuideModel: Model<IResearchPhdGuide> =
  mongoose.models.ResearchPhdGuide ||
  mongoose.model<IResearchPhdGuide>("ResearchPhdGuide", ResearchPhdGuideSchema, "research_phd_guide");

// 13. Conference / Workshop Attended (1:N)
export interface IConferenceWorkshop extends Document {
  user_id: mongoose.Types.ObjectId | string;
  legacy_user_id?: number;
  conf_workshop_type: string; // "Conference" | "Workshop" | "Seminar" | "FDP"
  conf_workshop_name: string;
  sponsored_by?: string;
  organized_by?: string;
  place?: string;
  level?: string; // "international" | "national" | "state" | "regional" | "college"
  date_from?: string | null;
  date_to?: string | null;
}

const ConferenceWorkshopSchema = new Schema<IConferenceWorkshop>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    legacy_user_id: { type: Number },
    conf_workshop_type: { type: String, required: true },
    conf_workshop_name: { type: String, required: true },
    sponsored_by: { type: String, default: "" },
    organized_by: { type: String, default: "" },
    place: { type: String, default: "" },
    level: { type: String, default: "college" },
    date_from: { type: String, default: null },
    date_to: { type: String, default: null },
  },
  { timestamps: true }
);

export const ConferenceWorkshopModel: Model<IConferenceWorkshop> =
  mongoose.models.ConferenceWorkshop ||
  mongoose.model<IConferenceWorkshop>("ConferenceWorkshop", ConferenceWorkshopSchema, "conference_workshop");

// 14. Conferences Organized (1:N)
export interface IConferenceOrganized extends Document {
  user_id: mongoose.Types.ObjectId | string;
  legacy_user_id?: number;
  conf_workshop_seminar_type: string;
  level?: string;
  title: string;
  place?: string;
  sponsors_name?: string;
  date_from?: string | null;
  date_to?: string | null;
}

const ConferenceOrganizedSchema = new Schema<IConferenceOrganized>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    legacy_user_id: { type: Number },
    conf_workshop_seminar_type: { type: String, required: true },
    level: { type: String, default: "college" },
    title: { type: String, required: true },
    place: { type: String, default: "" },
    sponsors_name: { type: String, default: "" },
    date_from: { type: String, default: null },
    date_to: { type: String, default: null },
  },
  { timestamps: true }
);

export const ConferenceOrganizedModel: Model<IConferenceOrganized> =
  mongoose.models.ConferenceOrganized ||
  mongoose.model<IConferenceOrganized>("ConferenceOrganized", ConferenceOrganizedSchema, "conferences_workshops_seminars_organized");

// 15. Research Paper Presented (1:N)
export interface IResearchPaperPresented extends Document {
  user_id: mongoose.Types.ObjectId | string;
  legacy_user_id?: number;
  title_of_paper: string;
  name_of_conf?: string;
  sponsored_by?: string;
  organized_by?: string;
  place?: string;
  conference_level?: string;
  date_from?: string | null;
  date_to?: string | null;
}

const ResearchPaperPresentedSchema = new Schema<IResearchPaperPresented>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    legacy_user_id: { type: Number },
    title_of_paper: { type: String, required: true },
    name_of_conf: { type: String, default: "" },
    sponsored_by: { type: String, default: "" },
    organized_by: { type: String, default: "" },
    place: { type: String, default: "" },
    conference_level: { type: String, default: "college" },
    date_from: { type: String, default: null },
    date_to: { type: String, default: null },
  },
  { timestamps: true }
);

export const ResearchPaperPresentedModel: Model<IResearchPaperPresented> =
  mongoose.models.ResearchPaperPresented ||
  mongoose.model<IResearchPaperPresented>("ResearchPaperPresented", ResearchPaperPresentedSchema, "research_paper_presented");

// 16. Journal Publication (1:N)
export interface IPublicationInJournal extends Document {
  user_id: mongoose.Types.ObjectId | string;
  legacy_user_id?: number;
  title_of_article: string;
  with_or_without_issn?: string;
  journal_name?: string;
  level?: string;
  author?: string;
  type?: string;
  impact_factor?: string;
  citation_index?: string;
  h_index?: string;
  scopus_index?: string;
  issn?: string;
  volume?: string;
  issue_no?: string;
  page_numbers?: string;
  date_of_publish?: string;
}

const PublicationInJournalSchema = new Schema<IPublicationInJournal>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    legacy_user_id: { type: Number },
    title_of_article: { type: String, required: true },
    with_or_without_issn: { type: String, default: "withISSN" },
    journal_name: { type: String, default: "" },
    level: { type: String, default: "college" },
    author: { type: String, default: "Author" },
    type: { type: String, default: "" },
    impact_factor: { type: String, default: "" },
    citation_index: { type: String, default: "" },
    h_index: { type: String, default: "" },
    scopus_index: { type: String, default: "" },
    issn: { type: String, default: "" },
    volume: { type: String, default: "" },
    issue_no: { type: String, default: "" },
    page_numbers: { type: String, default: "" },
    date_of_publish: { type: String, default: "" },
  },
  { timestamps: true }
);

export const PublicationInJournalModel: Model<IPublicationInJournal> =
  mongoose.models.PublicationInJournal ||
  mongoose.model<IPublicationInJournal>("PublicationInJournal", PublicationInJournalSchema, "publication_in_journal");

// 17. Book Publication (articles in books) (1:N)
export interface IPublicationInBook extends Document {
  user_id: mongoose.Types.ObjectId | string;
  legacy_user_id?: number;
  title_of_article: string;
  with_or_without_isbn?: string;
  book_name?: string;
  level_of_book?: string;
  author?: string;
  publishers_name?: string;
  place_of_publication?: string;
  isbn?: string;
  volume?: string;
  issue_no?: string;
  page_no?: string;
  month_and_year?: string;
}

const PublicationInBookSchema = new Schema<IPublicationInBook>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    legacy_user_id: { type: Number },
    title_of_article: { type: String, required: true },
    with_or_without_isbn: { type: String, default: "withoutISBN" },
    book_name: { type: String, default: "" },
    level_of_book: { type: String, default: "college" },
    author: { type: String, default: "Author" },
    publishers_name: { type: String, default: "" },
    place_of_publication: { type: String, default: "" },
    isbn: { type: String, default: "" },
    volume: { type: String, default: "" },
    issue_no: { type: String, default: "" },
    page_no: { type: String, default: "" },
    month_and_year: { type: String, default: "" },
  },
  { timestamps: true }
);

export const PublicationInBookModel: Model<IPublicationInBook> =
  mongoose.models.PublicationInBook ||
  mongoose.model<IPublicationInBook>("PublicationInBook", PublicationInBookSchema, "publication_in_book");

// 18. Books Published / Edited (authored whole books) (1:N)
export interface IBooksPublished extends Document {
  user_id: mongoose.Types.ObjectId | string;
  legacy_user_id?: number;
  with_or_without_isbn?: string;
  title_of_book: string;
  level_of_book?: string;
  author?: string;
  published_name?: string;
  edition?: string;
  ch_in_edited_book?: string;
  isbn?: string;
  place_of_publication?: string;
  month_and_year_of_publication?: string;
}

const BooksPublishedSchema = new Schema<IBooksPublished>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    legacy_user_id: { type: Number },
    with_or_without_isbn: { type: String, default: "withoutISBN" },
    title_of_book: { type: String, required: true },
    level_of_book: { type: String, default: "college" },
    author: { type: String, default: "Author" },
    published_name: { type: String, default: "" },
    edition: { type: String, default: "" },
    ch_in_edited_book: { type: String, default: "" },
    isbn: { type: String, default: "" },
    place_of_publication: { type: String, default: "" },
    month_and_year_of_publication: { type: String, default: "" },
  },
  { timestamps: true }
);

export const BooksPublishedModel: Model<IBooksPublished> =
  mongoose.models.BooksPublished ||
  mongoose.model<IBooksPublished>("BooksPublished", BooksPublishedSchema, "books_published");

// 19. Research Projects (1:N)
export interface IResearchProject extends Document {
  user_id: mongoose.Types.ObjectId | string;
  legacy_user_id?: number;
  title_of_project: string;
  sponsoring_agency?: string;
  duration?: string;
  amount?: string;
  project_type?: string; // "Minor" | "Major"
  status?: string; // "ongoing" | "completed"
  date_from?: string;
  date_to?: string;
}

const ResearchProjectSchema = new Schema<IResearchProject>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    legacy_user_id: { type: Number },
    title_of_project: { type: String, required: true },
    sponsoring_agency: { type: String, default: "" },
    duration: { type: String, default: "" },
    amount: { type: String, default: "" },
    project_type: { type: String, default: "Minor" },
    status: { type: String, default: "ongoing" },
    date_from: { type: String, default: "" },
    date_to: { type: String, default: "" },
  },
  { timestamps: true }
);

export const ResearchProjectModel: Model<IResearchProject> =
  mongoose.models.ResearchProject ||
  mongoose.model<IResearchProject>("ResearchProject", ResearchProjectSchema, "research_project");

// 20. Awards Received (1:N)
export interface IAwardsReceived extends Document {
  user_id: mongoose.Types.ObjectId | string;
  legacy_user_id?: number;
  award_name: string;
  level?: string;
  instituted_by?: string;
  presented_by?: string;
  amount_received?: string;
  month_and_year?: string;
}

const AwardsReceivedSchema = new Schema<IAwardsReceived>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    legacy_user_id: { type: Number },
    award_name: { type: String, required: true },
    level: { type: String, default: "college" },
    instituted_by: { type: String, default: "" },
    presented_by: { type: String, default: "" },
    amount_received: { type: String, default: "" },
    month_and_year: { type: String, default: "" },
  },
  { timestamps: true }
);

export const AwardsReceivedModel: Model<IAwardsReceived> =
  mongoose.models.AwardsReceived ||
  mongoose.model<IAwardsReceived>("AwardsReceived", AwardsReceivedSchema, "awards_received");

// 21. Resource Person (1:N)
export interface IResourcePerson extends Document {
  user_id: mongoose.Types.ObjectId | string;
  legacy_user_id?: number;
  topic: string;
  level?: string;
  type?: string;
  place?: string;
  date_of_event?: string | null;
}

const ResourcePersonSchema = new Schema<IResourcePerson>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    legacy_user_id: { type: Number },
    topic: { type: String, required: true },
    level: { type: String, default: "college" },
    type: { type: String, default: "Seminar" },
    place: { type: String, default: "" },
    date_of_event: { type: String, default: null },
  },
  { timestamps: true }
);

export const ResourcePersonModel: Model<IResourcePerson> =
  mongoose.models.ResourcePerson ||
  mongoose.model<IResourcePerson>("ResourcePerson", ResourcePersonSchema, "resource_person");

// 22. Additional Info (1:1 with user)
export interface IAdditionalInfo extends Document {
  user_id: mongoose.Types.ObjectId | string;
  legacy_user_id?: number;
  additional_info: string;
}

const AdditionalInfoSchema = new Schema<IAdditionalInfo>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    legacy_user_id: { type: Number },
    additional_info: { type: String, default: "" },
  },
  { timestamps: true }
);

export const AdditionalInfoModel: Model<IAdditionalInfo> =
  mongoose.models.AdditionalInfo ||
  mongoose.model<IAdditionalInfo>("AdditionalInfo", AdditionalInfoSchema, "additional");

// 23. Reminder Logs (for mail.php cron tracking)
export interface IReminderLog extends Document {
  user_id: mongoose.Types.ObjectId | string;
  legacy_user_id?: number;
  reminder_sent_at: Date;
}

const ReminderLogSchema = new Schema<IReminderLog>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    legacy_user_id: { type: Number },
    reminder_sent_at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const ReminderLogModel: Model<IReminderLog> =
  mongoose.models.ReminderLog ||
  mongoose.model<IReminderLog>("ReminderLog", ReminderLogSchema, "reminder_logs");

// 24. Extension Activities (1:N)
export interface IExtensionActivity extends Document {
  user_id: mongoose.Types.ObjectId | string;
  legacy_user_id?: number;
  position_designation?: string;
  period_tenure?: string;
  till_date?: string;
  program_title: string;
  target_group?: string;
  place?: string;
  amount_spent?: string;
  date_from?: string | null;
  date_to?: string | null;
}

const ExtensionActivitySchema = new Schema<IExtensionActivity>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    legacy_user_id: { type: Number },
    position_designation: { type: String, default: "" },
    period_tenure: { type: String, default: "" },
    till_date: { type: String, default: "" },
    program_title: { type: String, required: true },
    target_group: { type: String, default: "" },
    place: { type: String, default: "" },
    amount_spent: { type: String, default: "" },
    date_from: { type: String, default: null },
    date_to: { type: String, default: null },
  },
  { timestamps: true }
);

export const ExtensionActivityModel: Model<IExtensionActivity> =
  mongoose.models.ExtensionActivity ||
  mongoose.model<IExtensionActivity>("ExtensionActivity", ExtensionActivitySchema, "extension_activities");
