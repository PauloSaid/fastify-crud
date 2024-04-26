import fastify from 'fastify';
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export const options = {
    stage: process.env.STAGE,
    port: process.env.PORT,
    host: process.env.HOST,
    logger: process.env.STAGE === 'dev' ? { transport : { target: 'pino-pretty'} } : false,
    jwt_secret: process.env.JWT_SECRET,
    db_url: process.env.DB_URL
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function build(opts) {
    const app = fastify(opts);

    return app;
}