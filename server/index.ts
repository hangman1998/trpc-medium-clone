import express from "express"
import cors from "cors"
import * as trpcExpress from "@trpc/server/adapters/express"
// import { expressHandler } from "trpc-playground/handlers/express"
import { createContext } from "./context"
import { appRouter } from "./routers/_app"
import {
	createOpenApiExpressMiddleware,
	generateOpenApiDocument,
} from "trpc-openapi"
import swaggerUi from "swagger-ui-express"

export const PORT = 2022
export const playgroundEndpoint = "/api/play"
export const restEndpoint = "/api/rest"
export const trpcApiEndpoint = "/api/trpc"

const openApiDocument = generateOpenApiDocument(appRouter, {
	title: "tRPC OpenAPI",
	description: "OpenAPI compliant REST API built using tRPC with Express",
	version: "1.0.0",
	baseUrl: `http://localhost:${PORT}${restEndpoint}`,
})

const main = async () => {
	const app = express()
	// setting up middle wares
	app.use(cors({ credentials: true }))
	app.use((req, _res, next) => {
		// request logger
		console.log("⬅️ ", req.method, req.path, req.body ?? req.query)
		next()
	})
	app.use(
		trpcApiEndpoint,
		trpcExpress.createExpressMiddleware({
			router: appRouter,
			createContext,
		})
	)
	app.use(
		restEndpoint,
		createOpenApiExpressMiddleware({ router: appRouter, createContext })
	)
	// app.use(
	// 	playgroundEndpoint,
	// 	await expressHandler({
	// 		trpcApiEndpoint,
	// 		playgroundEndpoint,
	// 		router: appRouter,
	// 	})
	// )
	app.use("/", swaggerUi.serve)
	app.get("/", swaggerUi.setup(openApiDocument))
	app.listen(PORT, () =>
		console.log(`server listening at http://localhost:${PORT} 🚀`)
	)
}
main()
