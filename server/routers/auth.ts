import { z } from "zod"
import { prisma, publicProcedure, router } from "../globals"
import v from "validator"
import { compare, hashSync } from "bcrypt"
import { TRPCError } from "@trpc/server"
import jwt from "jsonwebtoken"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime"

export const auth = router({
	signUp: publicProcedure
		.meta({ openapi: { method: "POST", path: "/auth/signup" } })
		.input(
			z
				.object({
					username: z.string().min(4),
					email: z.string().email(),
					password: z
						.string()
						.refine(p => v.isStrongPassword(p), "password should be strong"),
					confirm: z.string(),
				})
				.refine(obj => obj.password === obj.confirm, "passwords don't match")
		)
		.output(z.object({ token: z.string() }))
		.mutation(async ({ input }) => {
			try {
				const { id } = await prisma.user.create({
					data: {
						email: input.email,
						username: input.username,
						password: hashSync(input.password, 12),
					},
					select: { id: true },
				})

				return {
					token: jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "2h" }),
				}
			} catch (error) {
				if (
					error instanceof PrismaClientKnownRequestError &&
					error.code === "P2002"
				) {
					const duplicateProp = error.meta?.target as string
					throw new TRPCError({
						message: `an account already exists with the requested ${duplicateProp}`,
						code: "BAD_REQUEST",
					})
				} else throw error
			}
		}),
	login: publicProcedure
		.meta({ openapi: { method: "POST", path: "/auth/login" } })
		.input(
			z.object({
				username: z.string(),
				password: z.string(),
			})
		)
		.output(z.object({ token: z.string() }))
		.query(async ({ input }) => {
			const user = await prisma.user.findUnique({
				where: { username: input.username },
				select: { id: true, password: true },
			})
			if (user === null || !(await compare(input.password, user.password)))
				throw new TRPCError({
					message: "invalid credentials",
					code: "BAD_REQUEST",
				})

			return {
				token: jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
					expiresIn: "2h",
				}),
			}
		}),
})
