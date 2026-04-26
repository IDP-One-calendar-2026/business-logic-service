import { hc } from 'hono/client'
import type { AppType } from 'io-service/app'

const ioServiceBaseUrl = process.env.VITE_IO_SERVICE_URL ?? 'http://localhost:3002'

export const ioServiceClient = hc<AppType>(ioServiceBaseUrl)