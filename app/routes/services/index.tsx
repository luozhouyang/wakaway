import type { LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import type { services } from '@prisma/client'
import {getPrismaClient} from "~/prisma";


// define a page that show services list
export const loader: LoaderFunction = async ({context, params}) => {
    const { env, cf, ctx } = context.cloudflare;
    const prisma = getPrismaClient(env);
    const services = await prisma.services.findMany();
    return Response.json({services});
};
export default function Index() {
    const {services} = useLoaderData<{services: services[]}>();
    return (
        <div>
            <div>Here are all the services</div>
            {services.map((service: any) => (
                <div key={service.id}>
                    <h1>{service.name}</h1>
                    <p>{service.description}</p>
                </div>
            ))}
        </div>
    );
}