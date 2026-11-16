import mongoose from "mongoose";

let mongooseLib: typeof mongoose | null = null;
let mongoTenantModel: any = null;

export async function getMongoTenantModel() {
  if (!mongooseLib) {
    mongooseLib = mongoose;
  }

  if (mongooseLib.connection.readyState === 0) {
    const mongoUrl = process.env.MONGODB_URI || process.env.MONGODB_URL || "mongodb://localhost:27017/staff-management";
    const dbName = process.env.MONGODB_DB || "staff-management";
    await mongooseLib.connect(mongoUrl, { dbName });
  }

  if (!mongoTenantModel) {
    const tenantSchema = new mongooseLib.Schema(
      {
        slug: { type: String, required: true, unique: true },
        name: { type: String, default: null },
        active: { type: Boolean, default: false },
      },
      { timestamps: true }
    );

    mongoTenantModel =
      mongooseLib.models.Tenant || mongooseLib.model("Tenant", tenantSchema, "tenants");
  }

  return mongoTenantModel;
}
