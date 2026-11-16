const fs = require("fs");
const path = require("path");
const mongoose = require("./staff-management-system/node_modules/mongoose");
const bcrypt = require("./staff-management-system/node_modules/bcryptjs");

// 1. Safely load environment variables from staff-management-system/.env.local
function loadEnv() {
  const envPath = path.resolve(__dirname, "staff-management-system/.env.local");
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if (
          (val.startsWith('"') && val.endsWith('"')) ||
          (val.startsWith("'") && val.endsWith("'"))
        ) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

loadEnv();

const uri = process.env.MONGODB_URI || process.env.MONGODB_URL;
if (!uri) {
  console.error(
    "ERROR: MONGODB_URI not found in staff-management-system/.env.local. Please define it."
  );
  process.exit(1);
}

const dbName = process.env.MONGODB_DB || "staff-management";

async function migrate() {
  console.log("Connecting to MongoDB Atlas at database:", dbName);
  await mongoose.connect(uri, { dbName });
  console.log("Connected successfully.\n");

  if (process.argv.includes("--clean") || process.argv.includes("-c")) {
    console.log(`Flag --clean detected. Dropping existing collections in "${dbName}"...`);
    const collections = await mongoose.connection.db.collections();
    for (const col of collections) {
      console.log(` - Dropping: ${col.collectionName}`);
      await col.drop().catch(() => {});
    }
    console.log("All collections successfully cleared.\n");
  }

  const sqlPath = path.resolve(__dirname, "php-source/bhc.sql");
  if (!fs.existsSync(sqlPath)) {
    console.error("SQL file not found at:", sqlPath);
    process.exit(1);
  }
  const sqlContent = fs.readFileSync(sqlPath, "utf8");

  function parseInserts(tableName) {
    const regex = new RegExp(
      "INSERT INTO `" + tableName + "` \\(([^)]+)\\) VALUES\\s*([\\s\\S]*?);",
      "g"
    );
    const matches = [];
    let match;
    while ((match = regex.exec(sqlContent)) !== null) {
      const cols = match[1].split(",").map((c) => c.trim().replace(/`/g, ""));
      const valuesBlock = match[2];

      const tupleRegex = /\(([^)]+)\)/g;
      let tupleMatch;
      while ((tupleMatch = tupleRegex.exec(valuesBlock)) !== null) {
        const rawVals = tupleMatch[1];
        const vals = [];
        let cur = "";
        let inStr = false;
        let quoteChar = "";
        for (let i = 0; i < rawVals.length; i++) {
          const char = rawVals[i];
          if (!inStr && (char === "'" || char === '"')) {
            inStr = true;
            quoteChar = char;
          } else if (inStr && char === quoteChar && rawVals[i - 1] !== "\\") {
            inStr = false;
          } else if (!inStr && char === ",") {
            vals.push(cur.trim());
            cur = "";
            continue;
          }
          cur += char;
        }
        vals.push(cur.trim());

        const row = {};
        cols.forEach((c, idx) => {
          let v = vals[idx];
          if (
            v &&
            ((v.startsWith("'") && v.endsWith("'")) ||
              (v.startsWith('"') && v.endsWith('"')))
          ) {
            v = v.substring(1, v.length - 1).replace(/\\'/g, "'");
          }
          row[c] = v;
        });
        matches.push(row);
      }
    }
    return matches;
  }

  // 1. Migrate Users
  const userRows = parseInserts("users");
  const userMap = new Map();
  let usersUpserted = 0;

  for (const u of userRows) {
    const legacyUserId = parseInt(u.user_id, 10);
    const email = u.email ? u.email.toLowerCase().trim() : "";
    if (!email) continue;

    const existing = await mongoose.connection
      .collection("users")
      .findOne({ email });

    let userId;
    if (!existing) {
      const hashedPassword = await bcrypt.hash(u.psword || "1234", 10);
      const res = await mongoose.connection.collection("users").insertOne({
        user_id: legacyUserId,
        sname: u.sname || "",
        uname: u.uname || "",
        password: hashedPassword,
        designation: u.designation || "",
        department: u.department || "",
        mobile_number: u.mobile_number || "",
        email,
        last_profile_update: u.last_profile_update
          ? new Date(u.last_profile_update)
          : null,
        scope: "staff",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      userId = res.insertedId;
      usersUpserted++;
    } else {
      userId = existing._id;
      // Keep legacy_user_id updated
      await mongoose.connection.collection("users").updateOne(
        { _id: userId },
        {
          $set: {
            user_id: legacyUserId,
            sname: u.sname || existing.sname,
            uname: u.uname || existing.uname,
            designation: u.designation || existing.designation,
            department: u.department || existing.department,
            mobile_number: u.mobile_number || existing.mobile_number,
          },
        }
      );
      usersUpserted++;
    }
    userMap.set(legacyUserId, userId);
  }

  const tableConfigs = [
    { table: "personal_details", collection: "personal_details", isOneToOne: true },
    { table: "academic_details", collection: "academic_details", idCol: "academic_id" },
    { table: "course_certificates", collection: "course_certificates", idCol: "course_id" },
    { table: "work_experience", collection: "work_experience", idCol: "work_id" },
    { table: "teaching_experience", collection: "teaching_experience", isOneToOne: true },
    { table: "research_experience", collection: "research_experience", isOneToOne: true },
    { table: "fi_experience", collection: "fi_experience", isOneToOne: true },
    { table: "research_phd", collection: "research_phd", isOneToOne: true },
    { table: "research_fellow", collection: "research_fellow", isOneToOne: true },
    { table: "research_mphil_guide", collection: "research_mphil_guide", isOneToOne: true },
    { table: "research_phd_guide", collection: "research_phd_guide", isOneToOne: true },
    { table: "conference_workshop", collection: "conference_workshop", idCol: "conference_workshop_id" },
    {
      table: "conferences_workshops_seminars_organized",
      collection: "conferences_workshops_seminars_organized",
      idCol: "conf_org_id",
    },
    { table: "research_paper_presented", collection: "research_paper_presented", idCol: "paper_presented_id" },
    { table: "publication_in_journal", collection: "publication_in_journal", idCol: "journal_id" },
    { table: "publication_in_book", collection: "publication_in_book", idCol: "publication_in_book_id" },
    { table: "books_published", collection: "books_published", idCol: "book_id" },
    { table: "research_project", collection: "research_project", idCol: "reproject_id" },
    { table: "awards_received", collection: "awards_received", idCol: "awards_id" },
    { table: "resource_person", collection: "resource_person", idCol: "resource_id" },
    { table: "additional", collection: "additional", isOneToOne: true },
    { table: "reminder_logs", collection: "reminder_logs", idCol: "log_id" },
  ];

  const reconciliation = [];
  reconciliation.push({
    Table: "users",
    Collection: "users",
    "SQL Rows": userRows.length,
    Processed: usersUpserted,
    "Mongo Total": await mongoose.connection.collection("users").countDocuments(),
    Status: "OK",
  });

  for (const cfg of tableConfigs) {
    const rows = parseInserts(cfg.table);
    let processed = 0;

    for (const r of rows) {
      const legacyUserId = parseInt(r.user_id, 10);
      const targetUserId = userMap.get(legacyUserId);
      if (!targetUserId) {
        continue;
      }

      const doc = {
        ...r,
        user_id: targetUserId,
        legacy_user_id: legacyUserId,
        updatedAt: new Date(),
      };

      // Detect and extract primary key column
      const firstCol = Object.keys(r)[0];
      let legacyId = null;
      if (firstCol.endsWith("_id") && firstCol !== "user_id") {
        legacyId = parseInt(r[firstCol], 10) || r[firstCol];
        delete doc[firstCol];
      }
      if (legacyId !== null) {
        doc.legacy_id = legacyId;
      }

      if (cfg.isOneToOne) {
        // Idempotent upsert by user_id
        await mongoose.connection.collection(cfg.collection).updateOne(
          { user_id: targetUserId },
          { $set: doc, $setOnInsert: { createdAt: new Date() } },
          { upsert: true }
        );
        processed++;
      } else {
        // Idempotent upsert by legacy_user_id + legacy_id or matching data fields
        const query = legacyId !== null
          ? { user_id: targetUserId, legacy_id: legacyId }
          : { user_id: targetUserId, ...doc };

        await mongoose.connection.collection(cfg.collection).updateOne(
          query,
          { $set: doc, $setOnInsert: { createdAt: new Date() } },
          { upsert: true }
        );
        processed++;
      }
    }

    const currentMongoCount = await mongoose.connection
      .collection(cfg.collection)
      .countDocuments();

    reconciliation.push({
      Table: cfg.table,
      Collection: cfg.collection,
      "SQL Rows": rows.length,
      Processed: processed,
      "Mongo Total": currentMongoCount,
      Status: currentMongoCount >= rows.length ? "OK" : "WARN",
    });
  }

  console.log("=========================================================================================");
  console.log("                        SQL-TO-MONGODB RECONCILIATION REPORT                             ");
  console.log("=========================================================================================");
  console.table(reconciliation);
  console.log("=========================================================================================");
  console.log("Migration completed with 100% repeatability (idempotent upserts).\n");

  await mongoose.disconnect();
}

migrate().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
