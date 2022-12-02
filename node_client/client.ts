import { createTRPCProxyClient, httpBatchLink } from "@trpc/client"
import fetch from "node-fetch"
import type { AppRouter } from "../server/routers/_app"
import { PORT, trpcApiEndpoint } from "../server/index"
// polyfill
global.fetch = fetch as any

async function main() {
	await new Promise(r => setTimeout(r, 1000))
	const client = createTRPCProxyClient<AppRouter>({
		links: [
			httpBatchLink({
				url: `http://localhost:2022/api/trpc`,
			}),
		],
	})
	console.log(await client.hi.welcome.query({}))
}

main()
