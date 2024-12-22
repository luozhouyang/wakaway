import { Hono } from 'hono'
import { basicAuth } from 'hono/basic-auth'
import { Bindings } from '../env'


const admin = new Hono<{ Bindings: Bindings }>()


admin.use('/*', async (c, next) => {
    const auth = basicAuth({
        username: c.env.USERNAME,
        password: c.env.PASSWORD
    });
    return await auth(c, next);
})

admin.get('/services', async (c) => {
    // TODO: query services from db
    return c.json([])
})

export default admin;
