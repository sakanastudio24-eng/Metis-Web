import { z } from "zod";

const webEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_API_BASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_METIS_EXTENSION_ID: z.string().min(1).optional(),
  NEXT_PUBLIC_METIS_EXTENSION_DEV_IDS: z.string().min(1).optional(),
});

export type WebEnv = z.infer<typeof webEnvSchema>;

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
    webEnvSchema,
    {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
      NEXT_PUBLIC_METIS_EXTENSION_ID: process.env.NEXT_PUBLIC_METIS_EXTENSION_ID,
      NEXT_PUBLIC_METIS_EXTENSION_DEV_IDS: process.env.NEXT_PUBLIC_METIS_EXTENSION_DEV_IDS,
    },
    "Web env",
  );
}
