import fastify from 'fastify';
import createError from '@fastify/error';
import autoload from '@fastify/autoload';
import mongodb from '@fastify/mongodb';
import jwt from '@fastify/jwt';
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
}