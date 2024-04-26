import { build, options } from './app.js';
import closeWithGrace from 'close-with-grace';

const server = await build(options);

await server.listen({port: options.port, host: options.host});

closeWithGrace(async ({ signal, err })=> {
    if(err) server.log.error(`Server closing due to an error: ${err.message}`);
    else server.log.info(`${signal} signal received. Shutting down gracefully.`);

    await server.close();
});