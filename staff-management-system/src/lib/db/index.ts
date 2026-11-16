export function getAuthDbProvider() {
  return "mongodb";
}

export async function getMySqlPool() {
  return null;
}

export async function getPostgresPool() {
  return null;
}

let mongooseLib: any = null;
let mongoUserModel: any = null;

export async function getMongoUserModel() {
  if (!mongooseLib) {
    try {
      mongooseLib = (await import("mongoose")).default;
    } catch (e) {
      return null;
    }
  }

  if (mongooseLib.connection.readyState === 0) {
    const mongoUrl = process.env.MONGODB_URI || process.env.MONGODB_URL || "mongodb://localhost:27017/staff-management";
    const dbName = process.env.MONGODB_DB || "staff-management";
    await mongooseLib.connect(mongoUrl, { dbName });
  }

  if (!mongoUserModel) {
    const userSchema = new mongooseLib.Schema(
      {
        email: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        password: { type: String, required: true },
        resetToken: { type: String, default: null },
        resetTokenExpiry: { type: Date, default: null },
        scope: { type: String, default: "staff" },
        tenantId: { type: String, default: null },
        tenantSlug: { type: String, default: null },
      },
      { timestamps: true }
    );

    mongoUserModel =
      mongooseLib.models.User || mongooseLib.model("User", userSchema, "users");
  }

  return mongoUserModel;
}

export async function getSupabaseAdmin() {
  return null;
}

export async function getPrismaClient() {
  return null;
}
