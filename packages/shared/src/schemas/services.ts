import { z } from "zod";

export const serviceSchema = z.object({
  id: z.uuid(),
  orgId: z.uuid(),
  name: z.string().min(1).max(100),
  durationMinutes: z.number().int().min(5).max(480),
  priceCents: z.number().int().min(0),
  bufferBeforeMinutes: z.number().int().min(0).max(0),
  bufferAfterMinutes: z.number().int().min(0).max(0),
  createdAt: z.coerce.date(),
});

// What client sends
export const createServiceSchema = serviceSchema.omit({
  id: true,
  orgId: true,
  createdAt: true,
});

// When updating all the fields are optional
export const updatingServiceSchema = createServiceSchema.partial();

// Types inferred from shemas
export type Service = z.infer<typeof serviceSchema>;
export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updatingServiceSchema>;
