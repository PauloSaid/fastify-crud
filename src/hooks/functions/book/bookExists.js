import { ALREADY_EXISTS } from "../../../libs/error.js"

export const MovieExists = (app) => async(req, rep) => {
    const books = app.mongo.db.collection('books');

    let book =  req.body;

    let result = await books.count({title: book.title});

    if(result > 0) throw new ALREADY_EXISTS();
}