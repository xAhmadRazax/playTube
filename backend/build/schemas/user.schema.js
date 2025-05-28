import { z as zod } from "zod";
export const UserSchema = zod.object({
    username: zod
        .string({ message: "Username is required." })
        .min(3, { message: "Username must be at least 3 characters long." })
        .max(50, {
        message: "Username must not exceed 50 characters.",
    }),
    fullName: zod
        .string({ message: "fullName is required." })
        .min(3, { message: "Full name must be at least 3 characters long." })
        .max(50, {
        message: "Full name must not exceed 50 characters.",
    }),
    email: zod
        .string({ message: "Email is required." })
        .email({ message: "Please provide a valid email address." }),
    avatar: zod.string({ message: "Avatar is required." }),
    password: zod
        .string({ message: "Password is required" })
        .min(6, {
        message: "Password must be at least 6 characters long.",
    })
        .regex(/[A-Z]/, "Must have uppercase letter.")
        .regex(/[0-9]/, "Must have number.")
        .regex(/[^A-Za-z0-9\s]/, "Must have special character (no spaces)."),
});
