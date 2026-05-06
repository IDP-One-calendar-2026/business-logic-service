import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { authMiddleware } from './auth.js'
import calendar from './calendar.js'

export const app = new Hono()

app.use('*', cors({
  origin: process.env.VITE_UI_URL || 'http://localhost:5173',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))

app.get('/', (c) => {
  return c.text('Business Logic Service')
})

app.use('/calendar/*', authMiddleware)
app.route('/calendar', calendar)

export type AppType = typeof app
