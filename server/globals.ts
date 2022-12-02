import { initTRPC, MiddlewareFunction, TRPCError } from "@trpc/server"
import type { Context } from "./context"
import { OpenApiMeta } from "trpc-openapi"
import { PrismaClient } from "@prisma/client"
// this the place where trpc is initialized
const t = initTRPC
	.meta<OpenApiMeta & { access?: string | string[] }>()
	.context<Context>()
	.create()

const rbacMiddleWare = t.middleware(({ ctx, next, meta }) => {
	if (ctx.user === null)
		throw new TRPCError({
			message: "this procedure requires authentication",
			code: "UNAUTHORIZED",
		})
	const userRole = ctx.user.role
	if (meta?.access === undefined)
		return next({
			ctx: {
				...ctx,
				user: ctx.user,
			},
		})

	const roles = typeof meta.access === "string" ? [meta.access] : meta.access

	if (!roles.includes(userRole)) {
		throw new TRPCError({
			message:
				"your account does not have the required privileges of this endpoint",
			code: "UNAUTHORIZED",
		})
	} else
		return next({
			ctx: {
				...ctx,
				user: ctx.user,
			},
		})
})

export const router = t.router
export const publicProcedure = t.procedure
export const rbacProcedure = t.procedure.use(rbacMiddleWare)
export const prisma = new PrismaClient()
