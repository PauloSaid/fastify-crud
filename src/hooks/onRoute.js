/** @type{import('fastify').FastifyPluginAsync<>} */
import { isAdmin, isAuthenticated, BookExists, AdminExists } from './functions/index.js'

export default async function onRouteHook(app, options) {
    app.addHook('onRoute', (routeOptions) => {
        routeOptions.onRequest = Array.isArray(routeOptions.onRequest) ? routeOptions.onRequest : [];
        routeOptions.preHandler = Array.isArray(routeOptions.preHandler) ? routeOptions.preHandler : [];

        if (routeOptions.config?.requireAuthentication) {
            routeOptions.onRequest.push(isAuthenticated(app));
        }
        if (routeOptions.config?.requireAdmin) {
            routeOptions.onRequest.push(isAdmin(app));
        }

        if (routeOptions.url === '/register/:id' && routeOptions.method === 'PUT') {
            routeOptions.preHandler.push(AdminExists(app));
        }

        if (routeOptions.url === '/books' && routeOptions.method === 'POST') {
            routeOptions.preHandler.push(BookExists(app));
        }
    });
}