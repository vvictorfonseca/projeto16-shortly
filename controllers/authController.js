import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

import db from "../db.js";

async function signUp(req, res) {
    const { name, email, password, confirmPassword } = req.body;

    const passwordHash = bcrypt.hashSync(password, 10);
    const confirmPasswordHash = bcrypt.hashSync(confirmPassword, 10);

    try {
        await db.query(`
            INSERT INTO users (name, email, password, "confirmPassword")
            VALUES ($1, $2, $3, $4)`,
            [name, email, passwordHash, confirmPasswordHash]);

        return res.sendStatus(201);
    
    } catch (e) {
        console.log(e);
        return res.send("Não foi possível conectar").status(422);
    }
}

async function signIn(req, res) {
    const { email } = req.body;
    
    const token = uuid()

    try {
        const user = await db.query(`
            SELECT * FROM users
            WHERE email = $1`,
            [email]);

        await db.query(`
            INSERT INTO sessions (token, "userId")
            VALUES ($1, $2)`,
            [token, user.rows[0].id]);

        return res.send(token).status(200);
    
    } catch (e) {
        console.log(e);
        return res.send("Não foi possível conectar").status(422);
    }
}

export { signIn, signUp };