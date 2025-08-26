import { z } from "zod"
const currentYear = new Date().getFullYear()
const nidSchema = z
  .string()
  .length(16, { message: "Must be exactly 16 characters long" })
  .regex(/^[123]/, {
    message:
      "First digit must be 1 (Rwandan citizen), 2 (refugee), or 3 (foreigner)",
  })
  .regex(/^[123]\d{4}[78]/, {
    message: "Gender identifier must be 8 (male) or 7 (female)",
  })
  .refine(
    (value) => {
      const birthYear = parseInt(value.slice(1, 5), 10)
      return birthYear <= currentYear
    },
    { message: "Birth year must not be greater than the current year" }
  )

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

const passwordSchema = z
  .string()
  .regex(
    passwordRegex,
    "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character"
  )
// schema for validating email address
export const emailSchema = z.object({
  email: z
    .string({
      message: "Email must be a string",
    })
    .email({ message: "Must be avalid email address " }),
})
export const loginSchema = z.object({
  email: z
    .string({
      message: "Email must be a string",
    })
    .email({ message: "Must be avalid email address " }),
  password: z.string({}).min(1, { message: "Password is required " }),
})

export const createAccountSchema = z.object({
  email: z
    .string({
      message: "Email must be a string",
    })
    .email({ message: "Must be avalid email address " }),
  NID: nidSchema,
  firstname: z
    .string({
      message: "firstname must be a string ",
    })
    .min(2, { message: "First name must be atleast two characters long " }),
  lastname: z
    .string({
      message: "Lastname must be a string ",
    })
    .min(2, { message: "Lastname must be atleast two characters long " }),

  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, {
    message: "Format the phone number correctly, must start with country code",
  }),
  role: z.number({ message: "Invalid role type" }),
})

export const updateAccountSchema = z.object({
  _id: z.string({ message: "Invalid user ID" }),
  email: z
    .string({
      message: "Email must be a string",
    })
    .email({ message: "Must be avalid email address " }),

  firstname: z
    .string({
      message: "firstname must be a string ",
    })
    .min(2, { message: "First name must be atleast two characters long " }),
  lastname: z
    .string({
      message: "Lastname must be a string ",
    })
    .min(2, { message: "Lastname must be atleast two characters long " }),

  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, {
    message: "Format the phone number correctly, must start with country code",
  }),
  role: z.number({ message: "Invalid role type" }).optional(),
  NID: nidSchema,
})
export const passwordResetSchema = z
  .object({
    currentPassword: z.string({
      message: "current Password is required and must be a string",
    }),
    newPassword: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New password and confirm password must match",
    path: ["confirmPassword"],
  })

export const forgotPasswordResetSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New password and confirm password must match",
    path: ["confirmPassword"],
  })

// export const addVehicleShcema = z
//   .object({
//     model: z.string({
//       message: "Vehicle model must be a string ",
//     }),
//     owner: z.string({
//       message: "Vehicle owner must be a string ",
//     }),
//     plateNumber: z.string({
//       message: "License plate number must be a string  ",
//     }),
//     isTemporary: z.number({ message: "Invalid access type" }),

//     accessStart: z.string().refine((val) => !isNaN(new Date(val).getTime()), {
//       message: "Access start must be a valid date and time",
//     }),
//     accessEnd: z.string().refine((val) => !isNaN(new Date(val).getTime()), {
//       message: "Access end must be a valid date and time",
//     }),
//   })
//   .refine((data) => new Date(data.accessStart) >= new Date(), {
//     message: "Access start must not be in the past",
//     path: ["accessStart"],
//   })
//   .refine((data) => new Date(data.accessEnd) > new Date(data.accessStart), {
//     message: "Access end must be later than access start",
//     path: ["accessEnd"],
//   })

export const addVehicleShcema = z.object({
  model: z
    .string({
      message: "Vehicle model must be a string",
    })
    .min(1, { message: "Vehicle model is required" }),

  firstname: z
    .string({
      message: "Firstname must be a string ",
    })
    .min(1, { message: "Firstname is required" }),
  lastname: z
    .string({
      message: "Lastname must be a string ",
    })
    .min(1, { message: "Lastname is required" }),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, {
    message: "Format the phone number correctly, must start with country code",
  }),
  email: z
    .string({
      message: "Email must be a string",
    })
    .email({ message: "Must be avalid email address " }),
  NID: nidSchema,
  plateNumber: z
    .string({
      message: "License plate number must be a string",
    })
    .min(1, { message: "License plate number is required" }),
})

export const tempAccessSchema = z
  .object({
    accessStart: z.string().refine((val) => !isNaN(new Date(val).getTime()), {
      message: "Access start must be a valid date and time",
    }),
    accessEnd: z.string().refine((val) => !isNaN(new Date(val).getTime()), {
      message: "Access end must be a valid date and time",
    }),
  })
  .refine((data) => new Date(data.accessStart) >= new Date(), {
    message: "Access start must not be in the past",
    path: ["accessStart"],
  })
  .refine((data) => new Date(data.accessEnd) > new Date(data.accessStart), {
    message: "Access end must be later than access start",
    path: ["accessEnd"],
  })
export const cashInSchema = z
  .object({
    plateNumber: z
      .string({
        message: "Plate Number must be a string",
      })
      .min(1, { message: "PLate Number code is required" }),

    amount: z
      .string()
      .refine(
        (value: string) => {
          const numericValue = value.replace(/[^\d.]/g, "")
          //@ts-ignore
          return !isNaN(numericValue) && numericValue.trim() !== ""
        },
        {
          message: "Invalid amount. Please enter a valid number.",
        }
      )
      .transform((value: string): string => {
        const numericValue = parseFloat(value.replace(/[^\d.]/g, ""))
        return `Rwf ${new Intl.NumberFormat("en-RW", {
          style: "currency",
          currency: "RWF",
          minimumFractionDigits: 0,
        })
          .format(numericValue)
          .replace("RWF", "")
          .trim()}`
      }),

    telecom: z.enum(["MTN", "Airtel"], {
      message: "You must choose a payment method",
    }),

    phone: z
      .string()
      .refine((value) => value.startsWith("+250"), {
        message: "Phone number must start with +250",
      })
      .refine((value) => value.length === 13, {
        message: "Phone number must be 13 characters long",
      }),
  })
  .refine(
    (data) => {
      const nextDigits = data.phone.slice(4, 6)
      if (
        (data.telecom === "MTN" &&
          (nextDigits === "78" || nextDigits === "79")) ||
        (data.telecom === "Airtel" &&
          (nextDigits === "73" || nextDigits === "72"))
      ) {
        return true
      }
      return false
    },
    {
      message: "Invalid phone number for the selected telecom provider.",
      path: ["phone"],
    }
  )
