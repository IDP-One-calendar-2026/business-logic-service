import { Hono } from 'hono'

const IO_BASE = process.env.IO_SERVICE_URL ?? 'http://localhost:3000'

async function ioFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${IO_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })
  return res
}

const calendar = new Hono()

// Event Types

calendar.get('/event-types', async (c) => {
  const userId = c.get('userId')
  const res = await ioFetch(`/event-types?userId=${encodeURIComponent(userId)}`)
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'IO service error' }))
    return c.json(err, res.status as 400 | 404 | 500)
  }
  return c.json(await res.json())
})

calendar.get('/event-types/:id', async (c) => {
  const id = c.req.param('id')
  const res = await ioFetch(`/event-types/${id}`)
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'IO service error' }))
    return c.json(err, res.status as 400 | 404 | 500)
  }
  return c.json(await res.json())
})

calendar.post('/event-types', async (c) => {
  const userId = c.get('userId')
  const body = await c.req.json<{ name: string; color?: string }>()
  const res = await ioFetch('/event-types', {
    method: 'POST',
    body: JSON.stringify({ userId, name: body.name, color: body.color }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'IO service error' }))
    return c.json(err, res.status as 400 | 404 | 500)
  }
  return c.json(await res.json(), 201)
})

calendar.put('/event-types/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json<{ name?: string; color?: string }>()
  const res = await ioFetch(`/event-types/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'IO service error' }))
    return c.json(err, res.status as 400 | 404 | 500)
  }
  return c.json(await res.json())
})

calendar.delete('/event-types/:id', async (c) => {
  const id = c.req.param('id')
  const res = await ioFetch(`/event-types/${id}`, { method: 'DELETE' })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'IO service error' }))
    return c.json(err, res.status as 400 | 404 | 500)
  }
  return c.json(await res.json())
})

// Events

calendar.get('/events', async (c) => {
  const userId = c.get('userId')
  const query = c.req.query()
  const params = new URLSearchParams({ userId })
  if (query.from) params.set('from', query.from)
  if (query.to) params.set('to', query.to)
  const res = await ioFetch(`/events?${params.toString()}`)
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'IO service error' }))
    return c.json(err, res.status as 400 | 404 | 500)
  }
  return c.json(await res.json())
})

calendar.get('/events/:id', async (c) => {
  const id = c.req.param('id')
  const res = await ioFetch(`/events/${id}`)
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'IO service error' }))
    return c.json(err, res.status as 400 | 404 | 500)
  }
  return c.json(await res.json())
})

calendar.post('/events', async (c) => {
  const userId = c.get('userId')
  const body = await c.req.json<{
    title: string
    description?: string
    eventTypeId?: number
    startTime: string
    endTime: string
    isAllDay?: boolean
    recurrenceRule?: string
    recurrenceInterval?: number
    recurrenceEndDate?: string
    recurrenceCount?: number
  }>()

  const res = await ioFetch('/events', {
    method: 'POST',
    body: JSON.stringify({
      userId,
      title: body.title,
      description: body.description,
      eventTypeId: body.eventTypeId,
      startTime: body.startTime,
      endTime: body.endTime,
      isAllDay: body.isAllDay,
      recurrenceRule: body.recurrenceRule,
      recurrenceInterval: body.recurrenceInterval,
      recurrenceEndDate: body.recurrenceEndDate,
      recurrenceCount: body.recurrenceCount,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'IO service error' }))
    return c.json(err, res.status as 400 | 404 | 500)
  }
  return c.json(await res.json(), 201)
})

calendar.put('/events/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json<{
    title?: string
    description?: string
    eventTypeId?: number
    startTime?: string
    endTime?: string
    isAllDay?: boolean
    recurrenceRule?: string
    recurrenceInterval?: number
    recurrenceEndDate?: string
    recurrenceCount?: number
  }>()

  const res = await ioFetch(`/events/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'IO service error' }))
    return c.json(err, res.status as 400 | 404 | 500)
  }
  return c.json(await res.json())
})

calendar.delete('/events/:id', async (c) => {
  const id = c.req.param('id')
  const res = await ioFetch(`/events/${id}`, { method: 'DELETE' })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'IO service error' }))
    return c.json(err, res.status as 400 | 404 | 500)
  }
  return c.json(await res.json())
})

export default calendar
