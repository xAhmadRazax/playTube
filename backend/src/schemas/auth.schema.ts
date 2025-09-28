import { error } from "console";
import { z as zod } from "zod";
export const RegisterSchema = zod.object({
  username: zod
    .string({
      error: (iss) =>
        iss.input === undefined
          ? "username is required."
          : "Please provide a valid username",
    })
    .min(3, { error: "Username must be at least 3 characters long." })
    .max(50, { error: "Username must not exceed 50 characters." })
    .trim(),

  // fullName: zod
  //   // .string({ required_error: "Full name is required." })
  //   .string({
  //     error: (iss) =>
  //       iss.input === undefined
  //         ? "fullName is required."
  //         : "Please provide a valid fullName",
  //   })
  //   .min(3, { error: "Full name must be at least 3 characters long." })
  //   .max(50, { error: "Full name must not exceed 50 characters." })
  //   .trim(),

  email: zod.email({
    error: (iss) =>
      iss.input === undefined
        ? "Email is required."
        : "Please provide a valid email address",
  }),
  dateOfBirth: zod.iso.date({
    error: (iss) =>
      iss.input === undefined
        ? "Date of birth is required."
        : "Please provide a valid date of birth.",
  }),
  // avatar: zod.string({ required_error: "Avatar is required." }).trim(),
  avatar: zod.string({ error: "Avatar is required." }).trim().optional(),
  coverImage: zod.string().trim().optional(),
  gender: zod.enum(["male", "female", "others"], {
    error: (iss) =>
      iss.input === undefined
        ? "gender is required."
        : "Please provide a valid gender.",
  }),
  password: zod
    .string({
      error: (iss) =>
        iss.input === undefined
          ? "password is required."
          : "Please provide a valid password",
    })
    .min(6, { error: "Password must be at least 6 characters long." })
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
      .string({
        error: (iss) =>
          iss.input === undefined
            ? "identifier is required."
            : "Please provide a valid identifier",
      })
      .trim(),

    password: zod
      .string({
        error: (iss) =>
          iss.input === undefined
            ? "password is required."
            : "Please provide a valid password",
      })
      .min(6, { error: "Password must be at least 6 characters long." })
      .regex(/[A-Z]/, "Password must have an uppercase letter.")
      .regex(/[0-9]/, "Password must include a number.")
      .regex(/[^A-Za-z0-9\s]/, "Password must include a special character.")
      .trim(),
  })
  .refine(
    (data: { password: string; identifier: string }) => {
      const isEmail = data.identifier.includes("@");
      if (isEmail) {
        return zod.email().trim().safeParse(data.identifier).success;
      }

      return data.identifier.length >= 3;
    },
    {
      error: "identifier must either be a valid Email or username.",
      path: ["identifier"],
    }
  );

export type LoginUserType = zod.infer<typeof LoginSchema>;

export const ChangePasswordSchema = zod.object({
  currentPassword: zod
    // .string({ required_error: "Current password is required." })
    .string({
      error: (iss) =>
        iss.input === undefined
          ? "Current Password is required."
          : "Please provide a valid Current Password",
    })
    .min(6, { error: "Current password must be at least 6 characters long." })
    .regex(/[A-Z]/, "Current password must have at least one uppercase letter.")
    .regex(/[0-9]/, "Current password must include at least one number.")
    .regex(
      /[^A-Za-z0-9\s]/,
      "Current password must include at least one special character."
    )
    .trim(),

  newPassword: zod
    // .string({ required_error: "New password is required." })
    .string({
      error: (iss) =>
        iss.input === undefined
          ? "New Password is required."
          : "Please provide a valid New Password",
    })
    .min(6, { error: "New password must be at least 6 characters long." })
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
    // avatar: zod.string({ required_error: "Avatar is required." }).optional(),
    avatar: zod.string({ error: "Avatar is required." }).optional(),
    coverImage: zod
      // .string({ required_error: "CoverImage is required." })
      .string({ error: "CoverImage is required." })
      .optional(),
  })
  .refine(
    (data: { avatar?: string; coverImage?: string }) => {
      return !!(data.avatar || data.coverImage);
    },
    {
      error: "Avatar or coverImage is required.",
      path: ["avatar", "coverImage"],
    }
  );

export const updateCoverImageSchema = zod.object({
  // coverImage: zod.string({ required_error: "CoverImage is required." }),
  coverImage: zod.string({ error: "CoverImage is required." }),
});
