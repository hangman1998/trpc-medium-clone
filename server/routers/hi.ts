import { z } from "zod"
import { prisma, publicProcedure, rbacProcedure, router } from "../globals"

export const hi = router({
	welcome: publicProcedure
		.meta({ openapi: { method: "GET", path: "/welcome" } })
		.input(z.object({}))
		.output(z.string())
		.query(() => "Welcome to server! 👋"),
	createMessage: rbacProcedure
		.meta({
			openapi: { method: "POST", path: "/new-msg", protect: true },
		})
		.input(
			z.object({
				message: z.string(),
			})
		)
		.output(z.string())
		.mutation(async ({ ctx, input }) => {
			await prisma.message.create({
				data: { message: input.message, senderId: ctx.user.id },
			})
			return `Server🤵: Hi! ${ctx.user.username}, your message was saved!`
		}),
	seeMessages: rbacProcedure
		.input(z.object({}))
		.meta({ openapi: { method: "GET", path: "/his", protect: true } })
		.output(
			z.array(
				z.object({ id: z.number(), message: z.string(), createdAt: z.date() })
			)
		)
		.query(({ ctx }) =>
			prisma.message.findMany({
				where: { senderId: ctx.user.id },
			})
		),
})
