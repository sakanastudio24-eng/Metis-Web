import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  NEXT_PUBLIC_WARD_STUDIO_URL: z.string().url(),
  NEXT_PUBLIC_METIS_API_BASE_URL: z.string().url(),
});

const serverEnvSchema = publicEnvSchema.extend({
  AUTH_SECRET: z.string().min(1),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  EMAIL_AUTH_FROM: z.string().min(1),
  EMAIL_AUTH_SERVER: z.string().min(1),
});

export type WebEnv = z.infer<typeof publicEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;

function parseEnv<T>(schema: z.ZodSchema<T>, values: Record<string, string | undefined>, label: string): T {
  const result = schema.safeParse(values);

  if (result.success) {
    return result.data;
  }

  const message = result.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ");
  throw new Error(`${label} validation failed. ${message}`);
}

export function getWebEnv(): WebEnv {
  return parseEnv(
    publicEnvSchema,
    {
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
      NEXT_PUBLIC_WARD_STUDIO_URL: process.env.NEXT_PUBLIC_WARD_STUDIO_URL,
      NEXT_PUBLIC_METIS_API_BASE_URL: process.env.NEXT_PUBLIC_METIS_API_BASE_URL,
    },
    "Web env",
  );
}

export function getServerEnv(): ServerEnv {
  return parseEnv(
    serverEnvSchema,
    {
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
      NEXT_PUBLIC_WARD_STUDIO_URL: process.env.NEXT_PUBLIC_WARD_STUDIO_URL,
      NEXT_PUBLIC_METIS_API_BASE_URL: process.env.NEXT_PUBLIC_METIS_API_BASE_URL,
      AUTH_SECRET: process.env.AUTH_SECRET,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
      EMAIL_AUTH_FROM: process.env.EMAIL_AUTH_FROM,
      EMAIL_AUTH_SERVER: process.env.EMAIL_AUTH_SERVER,
    },
    "Server env",
  );
}
