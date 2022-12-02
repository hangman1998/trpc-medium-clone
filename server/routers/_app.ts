import { router } from "../globals"
import { hi } from "./hi"
import { auth } from "./auth"

// main router, each router is merged here
export const appRouter = router({
	hi,
	auth,
})

// this is for client
export type AppRouter = typeof appRouter
