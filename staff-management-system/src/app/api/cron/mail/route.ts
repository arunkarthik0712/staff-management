import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connection";
import { UserModel, ReminderLogModel } from "@/models";
import nodemailer from "nodemailer";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const users = await UserModel.find({}).lean();
    const results: string[] = [];

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const now = Date.now();
    const fifteenDaysMs = 15 * 24 * 60 * 60 * 1000;

    for (const u of users) {
      const lastUpdate = u.last_profile_update ? new Date(u.last_profile_update).getTime() : 0;
      const daysSinceUpdate = (now - lastUpdate) / (1000 * 60 * 60 * 24);

      if (daysSinceUpdate >= 15) {
        // Check if reminder was sent within last 15 days
        const fifteenDaysAgo = new Date(now - fifteenDaysMs);
        const recentReminder = await ReminderLogModel.findOne({
          user_id: u._id,
          reminder_sent_at: { $gte: fifteenDaysAgo },
        });

        if (!recentReminder) {
          try {
            await transporter.sendMail({
              from: `"BHC" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
              to: u.email,
              subject: "Profile Update Reminder",
              html: `Hey ${u.uname || u.sname},<br/><br/>Just a friendly reminder to update your profile on <a href="${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5005"}/login">Staff Management System</a>. Keeping your information current helps you connect with the right people and stay informed about the latest developments on the platform.`,
            });

            await ReminderLogModel.create({
              user_id: u._id,
              legacy_user_id: u.user_id,
              reminder_sent_at: new Date(),
            });

            results.push(`Reminder sent to ${u.email}`);
          } catch (mailErr: any) {
            results.push(`Failed to send email to ${u.email}: ${mailErr.message}`);
          }
        } else {
          results.push(`Email already sent to ${u.email} within the last 15 days`);
        }
      } else {
        results.push(`No reminder needed for ${u.email} (updated ${Math.floor(daysSinceUpdate)} days ago)`);
      }
    }

    return NextResponse.json({ success: true, log: results });
  } catch (error: any) {
    console.error("Cron mail error:", error);
    return NextResponse.json({ message: error.message || "Cron error" }, { status: 500 });
  }
}
