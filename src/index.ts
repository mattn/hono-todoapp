import 'dotenv/config';
import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import { logger } from 'hono/logger'
import { drizzle } from 'drizzle-orm/libsql';
import { eq } from 'drizzle-orm';
import { task } from './db/schema';

const db = drizzle(process.env.DB_FILE_NAME!, { logger: true });

const app = new Hono()

app.use('/static/*', serveStatic({ root: './' }))
app.use('/favicon.ico', serveStatic({ path: './favicon.ico' }))
app.use(logger())
app.get('/', serveStatic({ path: './static/index.html' }))

app.get('/tasks', async (c) => {
    return c.json(await db.select().from(task))
})

app.get('/tasks/:id', async (c) => {
    const result = await db.select().from(task).where(eq(task.id, Number(c.req.param('id')))).limit(1)
    return c.json(result.pop())
})

app.post('/tasks', async (c) => {
    const payload = await c.req.json()
    const obj: typeof task.$inferInsert = payload
    const result = await db.insert(task).values(obj).returning();
    return c.json(result.pop())
})

app.post('/tasks/:id', async (c) => {
    const payload = await c.req.json()
    const result = await db.update(task)
        .set({ completed: payload.completed ? '1' : '0' })
        .where(eq(task.id, Number(c.req.param('id')))).returning();
    return c.json(result.pop())
})

app.delete('/tasks/:id', async (c) => {
    const result = await db.delete(task)
        .where(eq(task.id, Number(c.req.param('id')))).returning();
    return c.json(result.pop())
})

export default app
