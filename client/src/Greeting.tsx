import { trpc } from "./utils/trpc"

export function Greeting() {
	const greeting = trpc.hi.welcome.useQuery({})

	return (
		<div className="font-bold text-2xl p-2 underline">
			{greeting.data ?? "loading..."}
		</div>
	)
}
