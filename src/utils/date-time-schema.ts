import { z } from "zod";

export const dateTimeSchema = z.string().refine((value) => {
    const regex =
        /^(\d{2})\/(\d{2})\/(\d{4})\s(\d{2}):(\d{2}):(\d{2})$/;

    const match = value.match(regex);

    if (!match) return false;

    const [, dd, mm, yyyy, hh, min, ss] = match;

    const date = new Date(
        Number(yyyy),
        Number(mm) - 1,
        Number(dd),
        Number(hh),
        Number(min),
        Number(ss)
    );

    return (
        date.getFullYear() === Number(yyyy) &&
        date.getMonth() === Number(mm) - 1 &&
        date.getDate() === Number(dd) &&
        date.getHours() === Number(hh) &&
        date.getMinutes() === Number(min) &&
        date.getSeconds() === Number(ss)
    );
}, {
    message: "Datetime must be dd/MM/yyyy HH:mm:ss"
});