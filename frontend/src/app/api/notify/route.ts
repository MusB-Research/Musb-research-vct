import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const schema = z.object({
    email: z.string().email(),
    type: z.enum(["SCREENER_RESULT", "OTP", "ALERT"]),
    studyTitle: z.string().optional(),
    status: z.enum(["eligible", "maybe", "ineligible"]).optional(),
    answers: z.any().optional(), // Softened to avoid validation issues with complex data
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("NOTIFY API REACHED with body:", body); // DEBUG
        const parsed = schema.safeParse(body);

        if (!parsed.success) {
            console.error("SCHEMA VALIDATION FAILED:", parsed.error.issues); // DEBUG
            return NextResponse.json({ error: "Invalid input", details: parsed.error.issues }, { status: 400 });
        }

        const { email, type, studyTitle, status, answers } = parsed.data;
        console.log(`PREPARING EMAIL to: ${email}, type: ${type}, status: ${status}`); // DEBUG

        const fromEmail = "onboarding@resend.dev"; // Default Resend address unless domain verified
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
                        <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/signin" style="background-color: #06b6d4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Login to Start</a>
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
        } else if (type === "OTP") {
            // Basic OTP structure if needed
            subject = "Your Verification Code";
            html = `<p>Your code is: <strong>${answers?.code || "N/A"}</strong></p>`;
        }

        try {
            // 1. Send user notification
            const userMail = await resend.emails.send({
                from: "MusB Research <onboarding@resend.dev>",
                to: email,
                subject: subject,
                html: html,
            });

            console.log("User email result:", userMail);

            // 2. Admin notification (Screener Alert)
            if (type === "SCREENER_RESULT" && answers) {
                const answersHtml = Object.entries(answers)
                    .map(([key, value]) => `<li><strong>${key}:</strong> ${Array.isArray(value) ? value.join(", ") : value}</li>`)
                    .join("");

                const adminEmail = "barenyaprasadmishra1@gmail.com";

                const adminMail = await resend.emails.send({
                    from: "MusB System <onboarding@resend.dev>",
                    to: [adminEmail, "info@musbresearch.com"],
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
                });
                console.log("Admin email result:", adminMail);
            }

            return NextResponse.json({ success: true, message: "Emails dispatched via Resend" });
        } catch (error: any) {
            console.error("Resend delivery failed:", error);
            return NextResponse.json({ error: "Email delivery failed", details: error.message }, { status: 500 });
        }

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
