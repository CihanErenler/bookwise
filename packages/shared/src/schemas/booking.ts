import { z } from "zod";

export const bookingStatusSchema = z.enum([
  "confirmed",
  "calceled",
  "completed",
]);

export const createPublicBookingSchema = z.object({
  serviceId: z.uuid(),
  staffId: z.uuid().optional(),
  startAt: z.iso.datetime(),
  customer: z.object({
    name: z.string().min(1).max(100),
    email: z.email(),
    phone: z.string().min(5).max(30).optional(),
  }),
});

export const slotsQuerySchema = z.object({
  serviceId: z.uuid(),
  staffId: z.uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export type BookingStatus = z.infer<typeof bookingStatusSchema>;
export type CreatePublicBookingInput = z.infer<
  typeof createPublicBookingSchema
>;
export type SlotQuery = z.infer<typeof slotsQuerySchema>;
