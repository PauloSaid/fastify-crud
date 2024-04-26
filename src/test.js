import { test, describe } from 'node:test';
import { equal, deepEqual } from 'node:assert';
import { build, options } from './app.js';
import { request } from 'node:http';

/*

`books`:
{
  "_id": {
    "$oid": "66215a14683ecf32e0dd6ebf"
  },
  "title": "livroteste",
  "author": "augusto glup",
  "genre:": "romance",
  "price": "10000",
  "description': "esse livro é muito legal"
}

`users`:
{
  "_id": {
    "$oid": "66215a14683ecf32e0dd6bfe"
  },
  "name": "TestUser",
  "jwtToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibWF0aGV1cyIsInBhc3N3b3JkIjoic2xhIiwiaWF0IjoxNzEzODIxOTQ3fQ.tc4aQYyufI3XnxwpWbJmrwC0d60LoLi0TWDG-Ee4L7Y"
}

*/

const jwt_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibWF0aGV1cyIsInBhc3N3b3JkIjoic2xhIiwiaWF0IjoxNzEzODIxOTQ3fQ.tc4aQYyufI3XnxwpWbJmrwC0d60LoLi0TWDG-Ee4L7Y"
const admin_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibWF0aGV1cyIsInBhc3N3b3JkIjoic2xhIiwiaXNBZG1pbiI6dHJ1ZSwiaWF0IjoxNzEzODIyMTc1fQ.E6Y1w6OES5XUQsj-6AS6lxy3vMyeOD2zO8uM29oFCVQ"

const CreateUser = {
    "name": "name",
    "password": "pss"
};
const UpdateUser = {
    "name": "name",
    "password": "pss",
    "isAdmin": true
};
const InvalidUser = {
    "name": "name",
    "password": "pss",
    "isAdmin": false
};


const CreateBook = {
    "title": "livroteste",
    "author": "augusto glup",
    "genre:": "romance",
    "price": "10000",
    "description": "esse livro é muito legal"
};
const UpdateBook = {
    "title": "livroteste",
    "author": "augusto glup",
    "genre:": "romance",
    "price": "10000",
    "description": "esse livro é muito legal"
};

describe('### Tests for server config', async (t) => {
    test('Testing options configuration file', async (t) => {

        const app = await build(options);

        t.after(async () => {
            await app.close();
        });

        deepEqual(options.stage, 'test');
        deepEqual(options.port, '3000');
        deepEqual(options.host, '127.0.0.1');
        deepEqual(options.jwt_secret, '123');
        deepEqual(options.db_url, 'mongodb://localhost:27017/library');
    });
});

describe('### Tests for unauthenticated routes', async (t) => {

    describe('## Success Request', async (t) => {

        test('# GET /books', async (t) => {
            const app = await build(options);

            t.after(async () => {
                await app.close();
            });

            const response = await app.inject({
                method: 'GET',
                url: '/books'
            });

            equal(response.statusCode, 200);
        });

        test('# GET /books/:id', async (t) => {
            const app = await build(options);

            t.after(async () => {
                await app.close();
            });

            const response = await app.inject({
                method: 'GET',
                url: '/books/66215a14683ecf32e0dd6ebf'
            })

            equal(response.statusCode, 200)
        });

        test('# POST /register', async (t) => {
            const app = await build(options);

            t.after(async () => {
                await app.close();
            });
            
            const response = await app.inject({
                method: 'POST',
                url: '/register',
                body: CreateUser
            });
            
            equal(response.statusCode, 201);
        });
    });
});

describe('### Tests for authenticated routes', async (t) => {

    describe('## Success Request', async (t) => {

        test('# POST /books', async (t) => {
            const app = await build(options);

            t.after(async () => {
                await app.close();
            });
            
            const response = await app.inject({
                method: 'POST',
                url: '/books',
                body: Createbook,
                headers: {
                    'x-access-token': jwt_token,
                    'admin-token': admin_token
                }
            });
            
            equal(response.statusCode, 201);
        });

        test('# PUT /books/:id', async (t) => {
            const app = await build(options);

            t.after(async () => {
                await app.close();
            });
            
            const response = await app.inject({
                method: 'PUT',
                url: '/books/66215a14683ecf32e0dd6ebf',
                body: UpdateBook,
                headers: {
                    'x-access-token': jwt_token,
                    'admin-token': admin_token
                }
            });
            
            equal(response.statusCode, 204);
        });

        test('# DELETE /books/:id', async (t) => {
            const app = await build(options);

            t.after(async () => {
                await app.close();
            });

            const response = await app.inject({
                method: 'DELETE',
                url: '/books/66215a14683ecf32e0dd6ebf',
                headers: {
                    'x-access-token': jwt_token,
                    'admin-token': admin_token
                }
            });
            
            equal(response.statusCode, 204);
        });

        test('# PUT /register/:id', async (t) => {
            const app = await build(options);

            t.after(async () => {
                await app.close();
            });

            const response = await app.inject({
                method: 'PUT',
                url: '/register/66215a14683ecf32e0dd6bfe',
                body: UpdateUser,
                headers: {
                    'x-access-token': jwt_token
                }
            });
            
            equal(response.statusCode, 200);
        });
    });

    describe('## Bad Request', async (t) => {

        test('# No x-access-token - POST /books', async (t) => {
            const app = await build(options);

            t.after(async () => {
                await app.close();
            });
            
            const response = await app.inject({
                method: 'POST',
                url: '/books',
                body: Createbook,
                headers: {
                    'x-access-token': "",
                    'admin-token': admin_token
                }
            });
            
            equal(response.statusCode, 401);
        });

        test('# No admin-token - POST /books', async(t) => {
            const app = await build(options);

            t.after(async() => {
            await app.close();
            });

            const response = await app.inject({
                method: 'POST',
                url: '/books',
                body: Createbook,
                headers: {
                    'x-access-token': jwt_token,
                    'admin-token': ""
                }
            });
            equal(response.statusCode, 401);
        });

        test('# Invalid x-access-token - POST /books', async (t) => {
            const app = await build(options);

            t.after(async () => {
                await app.close();
            });

            let invalid_jwt_token = jwt_token.replace("e", "");
            
            const response = await app.inject({
                method: 'POST',
                url: '/books',
                body: Createbook,
                headers: {
                    'x-access-token': invalid_jwt_token,
                    'admin-token': admin_token
                }
            });
            
            equal(response.statusCode, 401);
        });

        test('# Invalid admin-token - POST /books', async(t) => {
            const app = await build(options);

            t.after(async() => {
            await app.close();
            });

            let invalid_admin_token = admin_token.replace("e", "");

            const response = await app.inject({
                method: 'POST',
                url: '/books',
                body: Createbook,
                headers: {
                    'x-access-token': jwt_token,
                    'admin-token': invalid_admin_token
                }
            });
            equal(response.statusCode, 401);
        });

        test('# Admin property - PUT /register/:id', async (t) => {
            const app = await build(options);

            t.after(async () => {
                await app.close();
            });
            
            const response = await app.inject({
                method: 'PUT',
                url: '/register/66215a14683ecf32e0dd6bfe',
                body: InvalidUser,
                headers: {
                    'x-access-token': jwt_token
                }
            });
            equal(response.statusCode, 400);
        });

        test('# Already exists - POST /books', async (t) => {
            const app = await build(options);

            t.after(async () => {
                await app.close();
            });
            
            const response = await app.inject({
                method: 'POST',
                url: '/books',
                body: Createbook,
                headers: {
                    'x-access-token': jwt_token,
                    'admin-token': admin_token
                }
            });
            
            equal(response.statusCode, 412);
        });

    });
});