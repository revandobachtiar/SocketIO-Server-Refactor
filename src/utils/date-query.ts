import { z } from "zod";


export const dateQuery = z.object({
    year: z.number().int().min(1970).max(2100),
    month: z.number().int().min(1).max(12),
    day: z.number().int().min(1).max(31),
    hour: z.number().int().min(0).max(23).optional(),
    minute: z.number().int().min(0).max(59).optional(),
    second: z.number().int().min(0).max(59).optional(),
}).refine((val) => {
    const date = new Date(
        val.year,
        val.month - 1,
        val.day,
        val.hour ?? 0,
        val.minute ?? 0,
        val.second ?? 0
    );
    return (
        date.getFullYear() === val.year &&
        date.getMonth() === val.month - 1 &&
        date.getDate() === val.day
    );
}, {
    message: "Date is not valid",
});