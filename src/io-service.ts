import { hc } from 'hono/client'
import type { AppType } from 'io-service/app'

const ioServiceBaseUrl = process.env.IO_SERVICE_URL ?? 'http://localhost:3000'

export const ioServiceClient = hc<AppType>(ioServiceBaseUrl)