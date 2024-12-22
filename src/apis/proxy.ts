import { Context, Hono } from 'hono';
import { Key, pathToRegexp } from 'path-to-regexp';
import { Bindings } from '../env';


const proxy = new Hono<{ Bindings: Bindings }>()


// TODO: define service schema
interface ServiceConfig {
    routes: string[];
    baseUrl: string;
}

// TODO: load services from db/cache
const services: Record<string, ServiceConfig> = {
    'service1': {
        routes: [
            '/users/:id',
            '/users/:id/profile',
        ],
        baseUrl: 'http://service1.example.com',
    },
    'service2': {
        routes: [
            '/products/:id',
            '/products/:category',
        ],
        baseUrl: 'http://service2.example.com',
    },
};


async function proxyRequest(c: any, next: any) {
    console.log('incoming request url: ', c.req.url, ', path: ', c.req.path);
    const requestPath = c.req.path;
    let service: ServiceConfig | undefined;
    let match: RegExpExecArray | null = null;

    // Find matching service
    for (const serviceName in services) {
        const serviceRoutes = services[serviceName].routes;
        for (let i = 0; i < serviceRoutes.length; i++) {
            const route = serviceRoutes[i];
            const keys: Key[] = [];
            const regexp = pathToRegexp(route, keys);
            match = regexp.exec(requestPath);
            console.log('match route against ', route, ' result: ', match);

            if (match) {
                // Extract parameters
                const params: Record<string, string> = {};
                keys.forEach((key, index) => {
                    params[key.name] = match![index + 1];
                });

                // Store matched service and parameters
                service = services[serviceName];
                c.req.params = params;
                break;
            }
        }
        if (service) break;
    }

    if (!service) {
        // No match found
        return c.text('Not Found', 404);
    } else {
        // Dispatch to the appropriate upstream service
        const proxyUrl = `${service.baseUrl}${requestPath}`;

        try {
            // Use fetch for serverless environments
            const proxyResponse = await fetch(proxyUrl, {
                method: c.req.method,
                headers: c.req.headers,
                body: c.req.body,
            });

            // Set the response status and headers
            c.status(proxyResponse.status);
            proxyResponse.headers.forEach((value, key) => {
                c.header(key, value);
            });

            // Forward the response body
            const body = await proxyResponse.text(); // or use stream if needed
            return c.text(body, proxyResponse.status);
        } catch (error) {
            console.error('Proxy error:', error);
            return c.text('Internal Server Error', 500);
        }
    }

}

proxy.use('*', proxyRequest)

export default proxy;
