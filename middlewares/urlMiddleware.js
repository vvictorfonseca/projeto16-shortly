import db from "../db.js";

import urlFormatSchema from "../schemas/urlSchema.js"

async function validateToken(req, res, next) {
    const { authorization } = req.headers;

    const token = authorization?.replace('Bearer ', '').trim();

    if (!token) {
        return res.status(401).send("Token não encontrado!");
    }

    try {
        const session = await db.query(`
            SELECT * FROM sessions
            WHERE token = $1`,
            [token]);

        if (!session.rows[0]) {
            return res.status(422).send("Sessão não encontrada!");
        }

        console.log("sessionmiddleware", session.rows)

        const user = await db.query(`
            SELECT * FROM users
            WHERE id = $1`,
            [session.rows[0].userId]);

        if (!user.rows[0]) {
            return res.status(404).send("user não encontrado");
        }

        res.locals.user = user;

        delete user.password
        delete user.confirmPassword

        next();

    } catch (e) {
        console.log(e);
        return res.status(422).send("Erro ao conectar");
    }
}

async function validateUrl(req, res, next) {
    const { url } = req.body;

    if (!url) {
        return res.status(422).send("Corpo veio vazio da requisição!");
    }

    try {

        const { error } = urlFormatSchema.validate(req.body, { abortEarly: false });

        if (error) {
            return res.status(400).send(error.details.map((error) => error.message));
        }

        const urlExist = await db.query(`
            SELECT * FROM urls
            WHERE url = $1`,
            [url]);

        if (urlExist.rows[0]) {
            return res.status(409).send("Essa url já esta cadastrada!");
        }

        next();

    } catch (e) {
        console.log(e);
        return res.status(422).send("Erro ao conectar");
    }
}

async function validateGetUrl(req, res, next) {
    const { id } = req.params;

    try {
        const idExist = await db.query(`
            SELECT * FROM  urls
            WHERE id = $1`,
            [id])

        if (!idExist.rows[0] || idExist.rows[0].shortUrl == null) {
            return res.status(404).send("id inexistente ou url encurtada inexistente!")
        }

        next();

    } catch (e) {
        console.log(e);
        return res.status(422).send("Erro ao conectar");
    }
}

export { validateToken, validateUrl, validateGetUrl };