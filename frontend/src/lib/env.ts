import { z } from "zod";

// Skip validation during the Next.js build phase.
// Vercel injects env vars at RUNTIME, not build time for server-side secrets.
// This prevents the build from failing when secrets aren't baked into the build image.
const isBuildPhase =
    process.env.NEXT_PHASE === "phase-production-build" ||
    process.env.BUILDING === "true" ||
    process.env.NODE_ENV === "production" && !process.env.DATABASE_URL ||
    !!process.env.NEXT_IS_EXPORT_WORKER;

const envSchema = z.object({
    DATABASE_URL: z.string().url(),
    NEXTAUTH_SECRET: z.string().min(32, "NEXTAUTH_SECRET must be at least 32 characters"),
    NEXTAUTH_URL: z.string().url(),
    NEXT_PUBLIC_API_URL: z.string().url(),
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: z.string().min(1),
    RECAPTCHA_SECRET_KEY: z.string().min(1),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
});

// During build, use a lenient schema so it never throws
const buildTimeSchema = z.object({
    DATABASE_URL: z.string().optional().default(""),
    NEXTAUTH_SECRET: z.string().optional().default("build-time-placeholder-do-not-use-in-production"),
    NEXTAUTH_URL: z.string().optional().default("http://localhost:3000"),
    NEXT_PUBLIC_API_URL: z.string().optional().default("http://localhost:8000"),
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: z.string().optional().default(""),
    RECAPTCHA_SECRET_KEY: z.string().optional().default(""),
    GOOGLE_CLIENT_ID: z.string().optional().default(""),
    GOOGLE_CLIENT_SECRET: z.string().optional().default(""),
});

const rawEnv = {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
    RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
};

let env: z.infer<typeof envSchema>;

if (isBuildPhase) {
    // During build: parse leniently, just provide defaults
    console.log("⚙️  Build phase detected — skipping strict env validation.");
    env = buildTimeSchema.parse(rawEnv) as z.infer<typeof envSchema>;
} else {
    // At runtime: enforce strictly
    const _env = envSchema.safeParse(rawEnv);
    if (!_env.success) {
        const missingKeys = Object.keys(_env.error.format()).filter(k => k !== "_errors");

        if (process.env.NODE_ENV === "production") {
            console.error("⚠️  PRODUCTION WARNING: Missing or invalid environment variables:", missingKeys.join(", "));
            console.error("The app may crash or misbehave. Please set these in your hosting provider settings.");
            // Fallback to buildTimeSchema in production to keep the shell alive
            env = buildTimeSchema.parse(rawEnv) as z.infer<typeof envSchema>;
        } else {
            console.error("❌ Missing environment variables:", missingKeys.join(", "));
            throw new Error(
                `Server cannot start. Missing environment variables: ${missingKeys.join(", ")}`
            );
        }
    } else {
        env = _env.data;
    }
}

export { env };
