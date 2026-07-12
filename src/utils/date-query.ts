import { z } from "zod";

export const dateQuery = z.object({
    year: z.number().int().min(1970).max(2100),
    month: z.number().int().min(1).max(12).optional(),
    week: z.number().int().min(1).max(53).optional(),
    day: z.number().int().min(1).max(31).optional(),
    hour: z.number().int().min(0).max(23).optional(),
    minute: z.number().int().min(0).max(59).optional(),
    second: z.number().int().min(0).max(59).optional(),
}).refine((val) => {
    if (val.day === undefined || val.month === undefined) return true;

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
    message: "Invalid date",
});