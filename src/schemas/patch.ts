import { z } from "zod";

export const patchFrontmatterSchema = z.object({
  patch: z
    .string()
    .regex(
      /^\d+\.\d+[a-z]?$/,
      "patch must follow the format major.minor with optional suffix letter (e.g. 17.1 or 17.1b)",
    ),
  set: z.number().int().positive(),
  updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "updatedAt must follow the format YYYY-MM-DD"),
});

export type PatchFrontmatter = z.infer<typeof patchFrontmatterSchema>;
