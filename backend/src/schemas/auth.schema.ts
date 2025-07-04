import { z as zod } from "zod";
export const RegisterSchema = zod.object({
  username: zod
    .string({ required_error: "Username is required." })
    .min(3, { message: "Username must be at least 3 characters long." })
    .max(50, { message: "Username must not exceed 50 characters." })
    .trim(),

  fullName: zod
    .string({ required_error: "Full name is required." })
    .min(3, { message: "Full name must be at least 3 characters long." })
    .max(50, { message: "Full name must not exceed 50 characters." })
    .trim(),

  email: zod
    .string({ required_error: "Email is required." })
    .email({ message: "Please provide a valid email address." })
    .trim(),

  avatar: zod.string({ required_error: "Avatar is required." }).trim(),
  coverImage: zod.string().trim().optional(),
  password: zod
    .string({ required_error: "Password is required." })
    .min(6, { message: "Password must be at least 6 characters long." })
    .regex(/[A-Z]/, "Password must have at least one uppercase letter.")
    .regex(/[0-9]/, "Password must include at least one number.")
    .regex(
      /[^A-Za-z0-9\s]/,
      "Password must include at least one special character."
    )
    .trim(),
});

export type RegisterUserType = zod.infer<typeof RegisterSchema>;

export const LoginSchema = zod
  .object({
    identifier: zod
      .string()
      .min(1, { message: "email or username is required." })
      .trim(),

    password: zod
      .string()
      .min(1, { message: "Password is required." })
      .min(6, { message: "Password must be at least 6 characters long." })
      .regex(/[A-Z]/, "Password must have an uppercase letter.")
      .regex(/[0-9]/, "Password must include a number.")
      .regex(/[^A-Za-z0-9\s]/, "Password must include a special character.")
      .trim(),
  })
  .refine(
    (data: { password: string; identifier: string }) => {
      const isEmail = data.identifier.includes("@");
      if (isEmail) {
        return zod.string().email().trim().safeParse(data.identifier).success;
      }

      return data.identifier.length >= 3;
    },
    {
      message: "identifier must either be a valid Email or username.",
      path: ["identifier"],
    }
  );

export type LoginUserType = zod.infer<typeof LoginSchema>;

export const ChangePasswordSchema = zod.object({
  currentPassword: zod
    .string({ required_error: "Current password is required." })
    .min(6, { message: "Current password must be at least 6 characters long." })
    .regex(/[A-Z]/, "Current password must have at least one uppercase letter.")
    .regex(/[0-9]/, "Current password must include at least one number.")
    .regex(
      /[^A-Za-z0-9\s]/,
      "Current password must include at least one special character."
    )
    .trim(),

  newPassword: zod
    .string({ required_error: "New password is required." })
    .min(6, { message: "New password must be at least 6 characters long." })
    .regex(/[A-Z]/, "New password must have at least one uppercase letter.")
    .regex(/[0-9]/, "New password must include at least one number.")
    .regex(
      /[^A-Za-z0-9\s]/,
      "New password must include at least one special character."
    )
    .trim(),
});

export const UpdateUserImagesSchema = zod
  .object({
    avatar: zod.string({ required_error: "Avatar is required." }).optional(),
    coverImage: zod
      .string({ required_error: "CoverImage is required." })
      .optional(),
  })
  .refine(
    (data: { avatar?: string; coverImage?: string }) => {
      return !!(data.avatar || data.coverImage);
    },
    {
      message: "Avatar or coverImage is required.",
      path: ["avatar", "coverImage"],
    }
  );

export const updateCoverImageSchema = zod.object({
  coverImage: zod.string({ required_error: "CoverImage is required." }),
});

// export const LoginSchema = zod
//   .object({
//     email: zod
//       .string()
//       .email({ message: "Please provide a valid email address." })
//       .trim()
//       .optional(),
//     username: zod
//       .string()
//       .min(3, { message: "Username must be at least 3 characters long." })
//       .max(50, { message: "Username must not exceed 50 characters." })
//       .trim()
//       .optional(),

//     password: zod
//       .string()
//       .min(1, { message: "Password is required." })
//       .min(6, { message: "Password must be at least 6 characters long." })
//       .regex(/[A-Z]/, "Password must have an uppercase letter.")
//       .regex(/[0-9]/, "Password must include a number.")
//       .regex(/[^A-Za-z0-9\s]/, "Password must include a special character.")
//       .trim(),
//   })
//   .refine((data) => data.email || data.password, {
//     message: "Either email or username is required",
//     path: ["email", "username"],
//   });
