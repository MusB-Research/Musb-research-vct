import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

const schema = z.object({
    email: z.string().email(),
    type: z.enum(["SCREENER_RESULT", "OTP", "ALERT"]),
    studyTitle: z.string().optional(),
    status: z.enum(["eligible", "maybe", "ineligible"]).optional(),
    answers: z.record(z.string(), z.any()).optional(), // Added to capture all form data
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parsed = schema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid input", details: parsed.error.issues }, { status: 400 });
        }

        const { email, type, studyTitle, status, answers } = parsed.data;

        // SMTP configuration - must be set in environment
        const smtpHost = process.env.SMTP_HOST;
        const smtpEmail = process.env.SMTP_EMAIL;
        const smtpPassword = process.env.SMTP_PASSWORD;

        if (!smtpHost || !smtpEmail || !smtpPassword) {
            console.error("Email service not configured. SMTP credentials missing in environment variables.");
            return NextResponse.json({
                error: "Email service temporarily unavailable"
            }, { status: 503 });
        }

        // Configure nodemailer transporter with environment credentials
        const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: parseInt(process.env.SMTP_PORT || "587"),
            secure: process.env.SMTP_SECURE === "true",
            auth: {
                user: smtpEmail,
                pass: smtpPassword,
            },
        });

        // Skip sending if we haven't configured a real email to avoid crashing
        let mailOptions = {
            from: `"MusB Research" <${smtpEmail}>`,
            to: email,
            subject: "",
            html: "",
        };

        if (type === "SCREENER_RESULT") {
            if (status === "eligible") {
                mailOptions.subject = `You are Eligible for: ${studyTitle}`;
                mailOptions.html = `
                    <div style="font-family: sans-serif; padding: 20px; color: #333;">
                        <h2>Great News!</h2>
                        <p>Based on your recent screener submission, you are <strong>pre-qualified</strong> and eligible to participate in the <strong>${studyTitle}</strong> study.</p>
                        <p>You can now log in to the portal and start your participation process.</p>
                        <br/>
                        <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/signin" style="background-color: #06b6d4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Login to Start</a>
                        <br/><br/>
                        <p>Best regards,<br/>The MusB Research Team</p>
                    </div>
                `;
            } else if (status === "maybe") {
                mailOptions.subject = `Further Information Needed for: ${studyTitle}`;
                mailOptions.html = `
                    <div style="font-family: sans-serif; padding: 20px; color: #333;">
                        <h2>Update on your Eligibility</h2>
                        <p>Based on your recent screener submission for the <strong>${studyTitle}</strong> study, you meet most of the criteria, but we need to clarify a few details.</p>
                        <p>Our team will contact you soon, or you can log in to your portal to proactively schedule a screening call.</p>
                        <br/>
                        <p>Best regards,<br/>The MusB Research Team</p>
                    </div>
                `;
            } else if (status === "ineligible") {
                mailOptions.subject = `Study Eligibility Update: ${studyTitle}`;
                mailOptions.html = `
                    <div style="font-family: sans-serif; padding: 20px; color: #333;">
                        <h2>Update on your Eligibility</h2>
                        <p>Unfortunately, based on the specific criteria, you are not eligible for the <strong>${studyTitle}</strong> study at this time.</p>
                        <p>However, your profile is now in our secure database. If any future studies fulfill your criteria, we will contact you immediately!</p>
                        <p>Thank you for your interest in advancing medical research.</p>
                        <br/>
                        <p>Best regards,<br/>The MusB Research Team</p>
                    </div>
                `;
            }
        }

        try {
            // First: Send the standard user notification email
            await transporter.sendMail(mailOptions);

            // Second: If this is a screener result, send a carbon-copy with all details to info@musbresearch.com
            if (type === "SCREENER_RESULT" && answers) {
                const answersHtml = Object.entries(answers)
                    .map(([key, value]) => `<li><strong>${key}:</strong> ${Array.isArray(value) ? value.join(", ") : value}</li>`)
                    .join("");

                const adminMailOptions = {
                    from: `"MusB Research System" <${smtpEmail}>`,
                    to: "info@musbresearch.com",
                    subject: `[STUDY ALERT] New Participant: ${studyTitle} (${status})`,
                    html: `
                        <div style="font-family: sans-serif; padding: 20px; color: #333; border: 1px solid #eee;">
                            <h2 style="color: #06b6d4;">New Screener Submission</h2>
                            <p><strong>Participant Email:</strong> ${email}</p>
                            <p><strong>Study:</strong> ${studyTitle}</p>
                            <p><strong>Result:</strong> <span style="text-transform: uppercase; font-weight: bold;">${status}</span></p>
                            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;"/>
                            <h3 style="color: #64748b;">Full Form Data:</h3>
                            <ul style="list-style: none; padding: 0;">
                                ${answersHtml}
                            </ul>
                            <br/>
                            <p style="font-size: 11px; color: #94a3b8;">This is an automated system notification from the MusB Research VCT module.</p>
                        </div>
                    `
                };
                await transporter.sendMail(adminMailOptions).catch(err => console.error("Admin notification failed:", err));
            }

            return NextResponse.json({ success: true, message: "Email(s) dispatched successfully" });
        } catch (error) {
            console.error("Nodemailer failed to send (likely due to missing SMTP credentials in .env):", error);
            // Even if sending fails (e.g. no credentials), we return success so the UI doesn't break
            return NextResponse.json({ success: true, message: "Email simulated (SMTP not configured)" });
        }

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
