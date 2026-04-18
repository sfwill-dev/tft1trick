import { z } from "zod";

export const guideFrontmatterSchema = z.object({
  title: z.string().min(1, "title is required"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must follow the format YYYY-MM-DD"),
});

export type GuideFrontmatter = z.infer<typeof guideFrontmatterSchema>;
