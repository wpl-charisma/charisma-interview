import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from '@charisma/edge'

export const trpc = createTRPCReact<AppRouter>()
