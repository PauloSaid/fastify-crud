/**@type{import('fastify').FastifyPluginAsync<>} */

export default async function Books(app, options){

    const books = app.mongo.db.collection('books');

    app.get('/books', async (req, rep) => {
        return await books.find().toArray();
    });

    app.get('/books/:id', async (req, rep) => {
        let id = req.params.id;
        let book = await books.findOne({_id: new app.mongo.ObjectId(id)});

        return book;
    });

    app.post('/books', {
        schema: {
            body: {
                type: 'object',
                properties: {
                    id: { type: 'integer'},
                    title:  { type: 'string' },
                    author: { type: 'string' },
                    genre:  { type: 'string' },
                    price:  { type: 'string' },
                    description: { type: 'string'}
                },
                required: ['title', 'author', 'genre', 'price']
            }
        },
        config: {
            requireAuthentication: true,
            requireAdmin: true
        }
    }, async (req, rep) => {
        let book = req.body;

        await books.insertOne(book);

        return rep.code(201).send();
    });

    app.put('/books/:id', {
        schema: {
            body: {
                type: 'object',
                properties: {
                    id: { type: 'integer'},
                    title:  { type: 'string' },
                    author: { type: 'string' },
                    genre:  { type: 'string' },
                    price:  { type: 'string' },
                    description: { type: 'string'}
                },
                required: ['title', 'author', 'genre', 'price']
            }
        },
        config: {
            requireAuthentication: true,
            requireAdmin: true
        }
    }, async (req, rep) => {
        let id = req.params.id;
        let book = req.body;
        await books.updateOne({ id: new app.mongo.ObjectId(id) }, {
            $set: {
                title: book.title,
                author: book.author,
                description: book.description,
                genre: book.genre,
                price: book.price
            }
        });

        return rep.code(204).send();
    });

    app.delete('/books/:id', {
        config: {
            requireAuthentication: true,
            requireAdmin: true
        }
    }, async (req, rep) => {
        let id = req.params.id;
        await books.deleteOne({ _id: new app.mongo.ObjectId(id) });

        return rep.code(204).send();
    });
}