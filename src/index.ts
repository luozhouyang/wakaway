import { Hono } from 'hono'
import { Bindings } from './env'
import admin from './apis/admin'
import proxy from './apis/proxy'

const app = new Hono<{ Bindings: Bindings }>()

app.route('/admin', admin)
app.route('/', proxy)

export default app
