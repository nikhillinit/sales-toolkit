// shared/captures.ts
import { z } from "zod";
import { SegmentCodeSchema } from "./segments";

export const CaptureSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  // The three fields that mirror the manual's .capture-strip exactly:
  buyerWords: z.string().default(""),
  nextAction: z.string().default(""),
  followUpDate: z.string().datetime().nullable(),
  // App-only context, auto-populated:
  manualPageId: z.string().regex(/^p\d{2}$/).nullable(),
  toolSlug: z.string().nullable(),
  segment: SegmentCodeSchema.nullable(),
  // Scanner output at capture time:
  claimHits: z.array(z.object({
    code: z.string(),
    matched: z.string(),
    severity: z.enum(["block", "warn"]),
  })).default([]),
});

export type Capture = z.infer<typeof CaptureSchema>;

// formDraft is a partial of Capture — autosaved as the rep types.
export const FormDraftSchema = CaptureSchema.partial().extend({
  id: z.string().uuid(),
});
export type FormDraft = z.infer<typeof FormDraftSchema>;
