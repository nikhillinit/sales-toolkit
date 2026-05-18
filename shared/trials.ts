// shared/trials.ts
import { z } from "zod";
import { SegmentCodeSchema, segmentByCode } from "./segments";
import { ExitReasonSchema } from "./objections";

export const TrialStatus = z.enum([
  "draft",
  "paused-awaiting-review",   // healthcare gate
  "active",
  "completed",
  "exited",                   // ended via Honest Out
]);

export const TrialSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  accountName: z.string().min(1),
  segment: SegmentCodeSchema,
  evidencePackConfirmed: z.boolean().default(false),
  trialSize: z.number().int().positive(),
  championName: z.string().nullable(),
  status: TrialStatus,
  exitReason: ExitReasonSchema.nullable(),
  notes: z.string().default(""),
}).superRefine((trial, ctx) => {
  // Healthcare gate: trial cannot leave draft without evidence pack
  const seg = segmentByCode(trial.segment);
  if (
    seg.requiresEvidencePack &&
    !trial.evidencePackConfirmed &&
    trial.status !== "draft" &&
    trial.status !== "paused-awaiting-review"
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["evidencePackConfirmed"],
      message:
        "Healthcare accounts require evidence-pack-confirmed before trial activation.",
    });
  }
  // Exit reason required iff exited
  if (trial.status === "exited" && trial.exitReason === null) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["exitReason"],
      message: "Exit reason required when status is exited.",
    });
  }
});

export type Trial = z.infer<typeof TrialSchema>;
