import { nanoid } from 'nanoid'

import db from "../db.js";

async function generateShortUrl(req, res) {
    const { url } = req.body;

    const { user } = res.locals;

    const shortUrl = nanoid(6);

    try {

        const session = await db.query(`
            SELECT * FROM sessions
            WHERE "userId" = $1`,
            [user.rows[0].id]);
        
        await db.query(`
            INSERT INTO urls ("userId", url, "shortUrl")
            VALUES ($1, $2, $3)`,
            [session.rows[0].userId, url, shortUrl])

        return res.status(201).send(shortUrl);

    } catch (e) {
        console.log(e);
        return res.status(422).send("Não foi possível conectar")
    }
}

async function getUrl(req, res) {
    const { id } = req.params;

    try {
        const url = await db.query(`
            SELECT urls.id, urls."shortUrl", urls.url FROM urls
            WHERE id = $1`,
            [id]);

        console.log(url.rows[0])

        return res.status(200).send(url.rows[0]);

    } catch (e) {
        console.log(e);
        return res.status(422).send("Não foi possível conectar");
    }
}

export { generateShortUrl, getUrl };