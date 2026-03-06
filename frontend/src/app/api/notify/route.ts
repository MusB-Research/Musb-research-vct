import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { Resend } from "resend";
import { z } from "zod";
import { env } from "@/lib/env";

const schema = z.object({
    email: z.string().email(),
    type: z.enum(["SCREENER_RESULT", "OTP", "ALERT"]),
    studyTitle: z.string().optional(),
    status: z.enum(["eligible", "maybe", "ineligible"]).optional(),
    answers: z.any().optional(),
});

export async function POST(req: Request) {
    let diagnostics: any = {
        resendAttempted: false,
        smtpAttempted: false,
        resendKeyFound: !!env.RESEND_API_KEY,
        smtpConfigFound: !!(env.SMTP_EMAIL && env.SMTP_PASSWORD)
    };
    let lastError: string | null = null;

    try {
        const body = await req.json();
        const parsed = schema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid input", details: parsed.error.issues }, { status: 400 });
        }

        const { email, type, studyTitle, status, answers } = parsed.data;

        // Content preparation
        let subject = "";
        let html = "";

        if (type === "SCREENER_RESULT") {
            if (status === "eligible") {
                subject = `You are Eligible for: ${studyTitle}`;
                html = `
                    <div style="font-family: sans-serif; padding: 20px; color: #333;">
                        <h2>Great News!</h2>
                        <p>Based on your recent screener submission, you are <strong>pre-qualified</strong> and eligible to participate in the <strong>${studyTitle}</strong> study.</p>
                        <p>You can now log in to the portal and start your participation process.</p>
                        <br/>
                        <a href="${env.NEXT_PUBLIC_APP_URL}/signin" style="background-color: #06b6d4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Login to Start</a>
                        <br/><br/>
                        <p>Best regards,<br/>The MusB Research Team</p>
                    </div>
                `;
            } else if (status === "maybe") {
                subject = `Further Information Needed for: ${studyTitle}`;
                html = `
                    <div style="font-family: sans-serif; padding: 20px; color: #333;">
                        <h2>Update on your Eligibility</h2>
                        <p>Based on your recent screener submission for the <strong>${studyTitle}</strong> study, you meet most of the criteria, but we need to clarify a few details.</p>
                        <p>Our team will contact you soon, or you can log in to your portal to proactively schedule a screening call.</p>
                        <br/>
                        <p>Best regards,<br/>The MusB Research Team</p>
                    </div>
                `;
            } else if (status === "ineligible") {
                subject = `Study Eligibility Update: ${studyTitle}`;
                html = `
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

        // --- DELIVERY LOGIC ---

        // Priority 1: RESEND
        if (env.RESEND_API_KEY) {
            diagnostics.resendAttempted = true;
            try {
                const resend = new Resend(env.RESEND_API_KEY);

                const resResend = await resend.emails.send({
                    from: 'MusB Research <onboarding@resend.dev>',
                    to: email,
                    subject: subject || "Update from MusB Research",
                    html: html
                });

                if (resResend.error) {
                    throw new Error(resResend.error.message);
                }

                if (type === "SCREENER_RESULT" && answers) {
                    const answersHtml = Object.entries(answers)
                        .map(([key, value]) => `<li><strong>${key}:</strong> ${Array.isArray(value) ? value.join(", ") : value}</li>`)
                        .join("");

                    await resend.emails.send({
                        from: 'MusB Research System <onboarding@resend.dev>',
                        to: ['info@musbresearch.com', 'barenyaprasadmishra1@gmail.com'],
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
                            </div>
                        `
                    });
                }
                return NextResponse.json({ success: true, via: "resend", diagnostics });
            } catch (resendError: any) {
                console.error("Resend failed:", resendError);
                lastError = `Resend: ${resendError.message}`;
                diagnostics.resendError = resendError.message;
                // FALL THROUGH TO SMTP
            }
        }

        // Priority 2: SMTP
        if (env.SMTP_EMAIL && env.SMTP_PASSWORD) {
            diagnostics.smtpAttempted = true;
            try {
                const transporter = nodemailer.createTransport({
                    host: env.SMTP_HOST || "smtp.gmail.com",
                    port: parseInt(env.SMTP_PORT || "587"),
                    auth: { user: env.SMTP_EMAIL, pass: env.SMTP_PASSWORD }
                });

                await transporter.sendMail({
                    from: `"MusB Research" <${env.SMTP_EMAIL}>`,
                    to: email,
                    subject: subject || "Update from MusB Research",
                    html: html
                });

                return NextResponse.json({ success: true, via: "smtp", diagnostics });
            } catch (smtpError: any) {
                console.error("SMTP failed:", smtpError);
                lastError = (lastError ? lastError + " | " : "") + `SMTP: ${smtpError.message}`;
                diagnostics.smtpError = smtpError.message;
            }
        }

        return NextResponse.json({
            error: "Email delivery failed",
            details: lastError,
            diagnostics
        }, { status: 500 });

    } catch (e: any) {
        console.error("Notify API Error:", e);
        return NextResponse.json({ error: e.message, diagnostics }, { status: 500 });
    }
}
