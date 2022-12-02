# trpc-template
this is a trpc template using the below stack
## Stack
### Backend
- express
- trpc
- prisma
### frontend
- react
- tailwind css
- trpc-query

## Features
- ✅ using npm workspaces to setup the monorepo.
- ✅ JWT Authentication implemented with `jsonwebtoken` and `bcrypt`.
- ✅ RBAC Authorization using trpc `meta` and midlewares.
- ✅ automatic openapi generation using `trpc-openapi`.
- ✅ frontend using vite.
- ✅ a node client for testing.


## Development

```bash
npm i
npx prisma migrate dev --name "init" # run this in server workspace
npm run dev
```
## Building

```bash
npm run build
npm run start
```
