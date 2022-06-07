import { nanoid } from 'nanoid'

import db from "../db.js";

async function generateShortUrl(req, res) {
    const { url } = req.body;

    const { user } = res.locals;

    const shortUrl = nanoid(6);

    try {
        await db.query(`
            INSERT INTO urls ("userId", url, "shortUrl, views)
            VALUES ($1, $2, $3, $4)`,
            [user.id, url, shortUrl, 0])

        return res.status(201).send(shortUrl);
    
    } catch (e) {
        console.log(e);
        return res.status(422).send("Não foi possível conectar")
    }
}

export default generateShortUrl;