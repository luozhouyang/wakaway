import { Hono } from 'hono'
import { basicAuth } from 'hono/basic-auth'


type Bindings = {
  WAKAWAY: D1Database
  USERNAME: string
  PASSWORD: string
}

const app = new Hono<{ Bindings: Bindings }>()


app.use('/*', async (c, next) => {
  const auth = basicAuth({
    username: c.env.USERNAME,
    password: c.env.PASSWORD
  });
  return await auth(c, next);
})

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default app
