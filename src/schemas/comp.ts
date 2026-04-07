import { z } from "zod";

export const compFrontmatterSchema = z.object({
  patch: z.string().regex(/^\d+\.\d+$/, "patch must follow the format major.minor (e.g. 16.8)"),
  set: z.number().int().positive(),
  publishedAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "publishedAt must follow the format YYYY-MM-DD"),
  title: z.string().min(1),
});

export type CompFrontmatter = z.infer<typeof compFrontmatterSchema>;
