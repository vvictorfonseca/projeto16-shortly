import db from "../db.js";

async function getUserInfo(req, res) {
    const { id } = req.params;

    try {
        const user = await db.query(`
            SELECT users.id, users.name, SUM(urls.views) as "visitCount"
            FROM users
            JOIN urls ON urls."userId" = users.id
            WHERE users.id = $1
            GROUP BY users.id`,
            [id]);

        const userInfo = user.rows;

        const url = await db.query(`
            SELECT urls.id, urls."shortUrl", urls.url, urls.views as "visitCount"
            FROM urls
            WHERE urls."userId" = $1
            ORDER BY "visitCount" DESC`,
            [id]);

        const urlInfo = url.rows;

        const result = { ...userInfo, urlInfo };

        return res.status(200).send(result);

    } catch (e) {
        console.log(e);
        return res.status(422).send("Não foi possível conectar")
    }

}

async function getRanking(req, res) {

    try {
        const ranking = await db.query(`
            SELECT users.id, users.name, COUNT(urls.url) as "linksCount", COALESCE(SUM(urls.views),0) as "visitCount"
            FROM urls
            RIGHT JOIN users ON urls."userId" = users.id
            GROUP BY users.id
            ORDER BY "visitCount" DESC
            LIMIT 10`);

        const result = ranking.rows;

        return res.status(200).send(result);

    } catch (e) {
        console.log(e);
        return res.status(422).send("Não foi possível conectar")
    }
}

export { getUserInfo, getRanking };