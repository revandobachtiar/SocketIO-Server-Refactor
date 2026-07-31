import { z } from "zod";

export const sensorPayloadSchema = z.object({
    ambien_temperature: z
        .number(),

    humidity: z
        .number(),

    cpu_temperature: z
        .number()
    ,

    voltage: z
        .number(),

    current: z
        .number(),

    power_cons: z
        .number(),

    frequency: z
        .number(),

    power_factor: z
        .number(),

    energy: z
        .number()
});

export type SensorPayload = z.infer<typeof sensorPayloadSchema>;