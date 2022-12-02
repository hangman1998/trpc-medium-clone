import { inferAsyncReturnType, TRPCError } from "@trpc/server"
import * as trpcExpress from "@trpc/server/adapters/express"
import jwt from "jsonwebtoken"
import { prisma } from "./globals"
export const createContext = async ({
	req,
	res,
}: trpcExpress.CreateExpressContextOptions) => {
	try {
		const { authorization } = req.headers
		const token = authorization?.split(" ").at(1) // authorization = bearer token
		if (token === undefined) return { user: null }
		const { id } = jwt.verify(token, process.env.JWT_SECRET) as { id: string }
		const user = await prisma.user.findFirst({ where: { id } })
		if (user === null)
			throw new TRPCError({
				message: "account no longer exists, please login again",
				code: "BAD_REQUEST",
			})
		return { user }
	} catch (error) {
		throw new TRPCError({
			message: "token expired please login again",
			code: "BAD_REQUEST",
		})
	}
}

export type Context = inferAsyncReturnType<typeof createContext>
