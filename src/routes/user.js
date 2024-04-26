/**@type{import('fastify').FastifyPluginAsync<>} */

export default async function user(app, options) {
    const users = app.mongo.db.collection('users');

    app.post('/register', {
        schema: {
            body: {
                type: 'object',
                properties: {
                    _id: { type: 'string' },
                    name: { type: 'string' },
                    password: { type: 'string' }
                },
                required: ['name', 'password']
            }
        }
    }, async (req, rep) => {
        let name = req.body.name;

        let jwtToken = app.jwt.sign(req.body);

        await users.insertOne({ name: name, jwtToken: jwtToken });

        return rep.code(201).send({
            "x-access-token": jwtToken
        });
    });

    app.put('/register/:id', {
        schema: {
            body: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    name: { type: 'string' },
                    password: { type: 'string' },
                    isAdmin: { type: 'boolean' }
                },
                required: ['name', 'password', 'isAdmin']
            }
        },
        config: {
            requireAuthentication: true
        }
    }, async (req, rep) => {
        let id = req.params.id;

        let user = req.body;

        let adminToken = app.jwt.sign(user);

        await users.updateOne({ _id: new app.mongo.ObjectId(id) }, {
            $set: {
                name: user.name,
                adminToken: adminToken
            }
        });

        return rep.code(200).send({
            "admin-token": adminToken
        });
    });
}