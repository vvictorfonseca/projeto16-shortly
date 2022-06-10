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

        return res.status(200).send(url.rows[0]);

    } catch (e) {
        console.log(e);
        return res.status(422).send("Não foi possível conectar");
    }
}

async function getShortUrl(req, res) {
    const { shortUrl } = req.params;

    const url = await db.query(`
        SELECT * FROM urls
        WHERE "shortUrl" = $1;`,
        [shortUrl]);

    const count = url.rows[0].views + (1);

    try {

        await db.query(`
            UPDATE urls
            SET views = $1
            WHERE "shortUrl" = $2`,
            [count, shortUrl]);

        res.redirect(201, `http://${url.rows[0].shortUrl}`);

    } catch (e) {
        console.log(e);
        return res.status(422).send("Não foi possível conectar");
    }
}

async function deleteUrl(req, res) {
    const { id } = req.params;

    try {
        await db.query(`    
            DELETE FROM urls
            WHERE id = $1`,
            [id]);

        return res.status(204).send("Url apagada com sucesso!")

    } catch (e) {
        console.log(e);
        return res.status(422).send("Não foi possível conectar");
    }
}

export { generateShortUrl, getUrl, getShortUrl, deleteUrl };