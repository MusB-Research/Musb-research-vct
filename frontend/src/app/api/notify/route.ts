import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

const schema = z.object({
    email: z.string().email().optional(), // optional — admin-only sends don't need a user email
    type: z.enum(["SCREENER_RESULT", "OTP", "ALERT"]),
    studyTitle: z.string().optional(),
    status: z.enum(["eligible", "maybe", "ineligible"]).optional(),
    answers: z.any().optional(),
    participantName: z.string().optional(),
});

// Build nodemailer transporter from env vars
function createTransporter() {
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpEmail = process.env.SMTP_EMAIL;
    const smtpPassword = process.env.SMTP_PASSWORD;
    const smtpPort = parseInt(process.env.SMTP_PORT || "587");

    if (!smtpEmail || !smtpPassword) {
        return null;
    }

    // Gmail uses the 'service' shortcut which is more reliable than manual host/port
    if (smtpHost === "smtp.gmail.com") {
        return nodemailer.createTransport({
            service: "gmail",
            auth: { user: smtpEmail, pass: smtpPassword },
        });
    }

    return nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: { user: smtpEmail, pass: smtpPassword },
    });
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("[NOTIFY] Received request:", JSON.stringify({ ...body, answers: body.answers ? "[present]" : "[missing]" }));

        const parsed = schema.safeParse(body);
        if (!parsed.success) {
            console.error("[NOTIFY] Schema validation failed:", parsed.error.issues);
            return NextResponse.json({ error: "Invalid input", details: parsed.error.issues }, { status: 400 });
        }

        const { email, type, studyTitle, status, answers, participantName } = parsed.data;

        const transporter = createTransporter();
        if (!transporter) {
            console.error("[NOTIFY] SMTP not configured — SMTP_EMAIL or SMTP_PASSWORD missing in env");
            // Still return 200 so the UI doesn't break, but log the issue
            return NextResponse.json({ success: false, message: "Email service not configured" }, { status: 503 });
        }

        const smtpEmail = process.env.SMTP_EMAIL!;
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://musb-research-vct.vercel.app";

        // ── 1. Build participant-facing email ────────────────────────────────
        let userMailHtml = "";
        let userMailSubject = "";

        if (type === "SCREENER_RESULT" && email) {
            if (status === "eligible") {
                userMailSubject = `🎉 You qualify for: ${studyTitle}`;
                userMailHtml = `
                    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; border-radius: 12px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #06b6d4, #0e7490); padding: 32px; text-align: center;">
                            <h1 style="color: white; margin: 0; font-size: 28px;">Great News!</h1>
                            <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0;">MusB Research Clinical Trial Platform</p>
                        </div>
                        <div style="padding: 32px; color: #334155;">
                            <p style="font-size: 16px;">Hello${participantName ? ` ${participantName}` : ""},</p>
                            <p style="font-size: 16px;">Based on your screener responses, you are <strong style="color: #0d9488;">pre-qualified and eligible</strong> to participate in:</p>
                            <div style="background: #f0fdfa; border-left: 4px solid #0d9488; padding: 16px; border-radius: 0 8px 8px 0; margin: 20px 0;">
                                <h2 style="margin: 0; color: #0d9488; font-size: 20px;">${studyTitle}</h2>
                            </div>
                            <p>Our team will be in touch shortly with next steps. You can also log in to your participant portal to view your registration status.</p>
                            <div style="text-align: center; margin: 32px 0;">
                                <a href="${appUrl}/signin" style="background: #06b6d4; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">Access Your Portal →</a>
                            </div>
                            <p style="color: #64748b; font-size: 14px;">Best regards,<br><strong>The MusB Research Team</strong></p>
                        </div>
                        <div style="background: #f1f5f9; padding: 16px; text-align: center; color: #94a3b8; font-size: 12px;">
                            MusB Research · Clinical Trial Platform · <a href="${appUrl}" style="color: #0ea5e9;">musb-research-vct.vercel.app</a>
                        </div>
                    </div>`;
            } else if (status === "maybe") {
                userMailSubject = `📋 Further Review Needed: ${studyTitle}`;
                userMailHtml = `
                    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; border-radius: 12px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 32px; text-align: center;">
                            <h1 style="color: white; margin: 0; font-size: 28px;">Almost There!</h1>
                            <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0;">MusB Research Clinical Trial Platform</p>
                        </div>
                        <div style="padding: 32px; color: #334155;">
                            <p style="font-size: 16px;">Hello${participantName ? ` ${participantName}` : ""},</p>
                            <p style="font-size: 16px;">Thank you for completing the screener for <strong>${studyTitle}</strong>.</p>
                            <p>You meet most of our criteria, but our team needs to review a few additional details before confirming your eligibility.</p>
                            <p style="color: #64748b; font-size: 14px;"><strong>What happens next?</strong> A member of our team will contact you within 2-3 business days to schedule a brief screening call.</p>
                            <p style="color: #64748b; font-size: 14px;">Best regards,<br><strong>The MusB Research Team</strong></p>
                        </div>
                        <div style="background: #f1f5f9; padding: 16px; text-align: center; color: #94a3b8; font-size: 12px;">
                            MusB Research · Clinical Trial Platform
                        </div>
                    </div>`;
            } else if (status === "ineligible") {
                userMailSubject = `Study Eligibility Update: ${studyTitle}`;
                userMailHtml = `
                    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; border-radius: 12px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #64748b, #475569); padding: 32px; text-align: center;">
                            <h1 style="color: white; margin: 0; font-size: 28px;">Thank You</h1>
                            <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0;">MusB Research Clinical Trial Platform</p>
                        </div>
                        <div style="padding: 32px; color: #334155;">
                            <p style="font-size: 16px;">Hello${participantName ? ` ${participantName}` : ""},</p>
                            <p>Thank you for completing the eligibility screener for <strong>${studyTitle}</strong>.</p>
                            <p>Unfortunately, based on the specific criteria for this study, you are not eligible to participate at this time.</p>
                            <p>However, your profile is now saved in our secure database. If any future studies match your profile, we will reach out to you directly.</p>
                            <p style="color: #64748b; font-size: 14px;">Thank you for your interest in advancing medical research.<br><br>Best regards,<br><strong>The MusB Research Team</strong></p>
                        </div>
                        <div style="background: #f1f5f9; padding: 16px; text-align: center; color: #94a3b8; font-size: 12px;">
                            MusB Research · Clinical Trial Platform
                        </div>
                    </div>`;
            }
        }

        // ── 2. Build admin alert email (ALWAYS sent for SCREENER_RESULT) ─────
        let adminSendSuccess = false;
        if (type === "SCREENER_RESULT") {
            const answersHtml = answers
                ? Object.entries(answers as Record<string, any>)
                    .map(([key, value]) => `
                        <tr>
                            <td style="padding: 8px 12px; font-weight: bold; background: #f8fafc; border: 1px solid #e2e8f0; color: #475569; white-space: nowrap;">${key}</td>
                            <td style="padding: 8px 12px; border: 1px solid #e2e8f0; color: #334155;">${Array.isArray(value) ? value.join(", ") : String(value)}</td>
                        </tr>`)
                    .join("")
                : "<tr><td colspan='2' style='padding: 12px; color: #94a3b8;'>No form data captured</td></tr>";

            const statusColor = status === "eligible" ? "#10b981" : status === "maybe" ? "#f59e0b" : "#ef4444";
            const statusLabel = status === "eligible" ? "✅ ELIGIBLE" : status === "maybe" ? "⚠️ MAYBE (Needs Review)" : "❌ INELIGIBLE";

            const adminMailOptions = {
                from: `"MusB Research VCT" <${smtpEmail}>`,
                to: "info@musbresearch.com",
                subject: `[NEW SCREENER] ${statusLabel} — ${studyTitle}`,
                html: `
                    <div style="font-family: 'Segoe UI', sans-serif; max-width: 700px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
                        <div style="background: #0f172a; padding: 24px 32px; display: flex; align-items: center; gap: 12px;">
                            <h1 style="color: white; margin: 0; font-size: 22px;">New Screener Submission</h1>
                            <span style="background: ${statusColor}; color: white; padding: 4px 12px; border-radius: 99px; font-size: 13px; font-weight: bold; margin-left: auto;">${statusLabel}</span>
                        </div>
                        <div style="padding: 24px 32px;">
                            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                                <tr><td style="padding: 8px 12px; font-weight: bold; color: #475569; width: 160px;">Study</td><td style="padding: 8px 12px; color: #0f172a; font-weight: bold;">${studyTitle}</td></tr>
                                <tr style="background: #f8fafc;"><td style="padding: 8px 12px; font-weight: bold; color: #475569;">Result</td><td style="padding: 8px 12px; color: ${statusColor}; font-weight: bold;">${statusLabel}</td></tr>
                                <tr><td style="padding: 8px 12px; font-weight: bold; color: #475569;">Participant Email</td><td style="padding: 8px 12px;"><a href="mailto:${email || "not provided"}" style="color: #0ea5e9;">${email || "Not provided (guest)"}</a></td></tr>
                                ${participantName ? `<tr style="background: #f8fafc;"><td style="padding: 8px 12px; font-weight: bold; color: #475569;">Name</td><td style="padding: 8px 12px;">${participantName}</td></tr>` : ""}
                                <tr><td style="padding: 8px 12px; font-weight: bold; color: #475569;">Submitted At</td><td style="padding: 8px 12px; color: #64748b;">${new Date().toLocaleString("en-GB", { timeZone: "Asia/Kolkata", dateStyle: "full", timeStyle: "short" })} IST</td></tr>
                            </table>

                            <h3 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Full Screener Responses</h3>
                            <table style="width: 100%; border-collapse: collapse;">
                                ${answersHtml}
                            </table>
                        </div>
                        <div style="background: #f8fafc; padding: 16px 32px; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0;">
                            Automated alert from MusB Research VCT Platform · ${appUrl}
                        </div>
                    </div>`,
            };

            try {
                await transporter.sendMail(adminMailOptions);
                console.log("[NOTIFY] ✅ Admin alert sent to info@musbresearch.com");
                adminSendSuccess = true;
            } catch (adminErr) {
                console.error("[NOTIFY] ❌ Failed to send admin alert:", adminErr);
                // Don't throw — still try to send user email
            }
        }

        // ── 3. Send participant email (if email provided + content prepared) ──
        let userSendSuccess = false;
        if (email && userMailHtml && userMailSubject) {
            try {
                await transporter.sendMail({
                    from: `"MusB Research" <${smtpEmail}>`,
                    to: email,
                    subject: userMailSubject,
                    html: userMailHtml,
                });
                console.log(`[NOTIFY] ✅ User email sent to ${email}`);
                userSendSuccess = true;
            } catch (userErr) {
                console.error("[NOTIFY] ❌ Failed to send user email:", userErr);
            }
        }

        return NextResponse.json({
            success: true,
            adminNotified: adminSendSuccess,
            userNotified: userSendSuccess,
            message: "Notification processed",
        });

    } catch (e: any) {
        console.error("[NOTIFY] Unhandled error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
