import bcrypt from 'bcrypt';

import db from "../db.js";

import signUpSchema from "../schemas/authSchema.js";

async function validateSignUp(req, res, next) {
    const { name, email, password, confirmPassword } = req.body

    try {
        const { error } = signUpSchema.validate(req.body, { abortEarly: false });

        if (error) {
            return res.status(400).send(error.details.map((error) => error.message))
        }
        console.log("passou aqui 1")
        const userExist = await db.query(`
            SELECT * FROM users
            WHERE email = $1`,
            [email]);

        if (userExist.rows[0]) {
            console.log("passou aqui 2")
            return res.status(409).send("Usuário já cadastrado!");
        }

        next();

    } catch (e) {
        console.log(e);
        return res.send("Dados inválidos ou preenchidos incorretamente").status(422)
    }
}

async function validateSignIn(req, res, next) {
    const { email, password } = req.body;

    try {

        const user = await db.query(`
            SELECT * FROM users
            WHERE email = $1`,
            [email]);

        const correctPassword = bcrypt.compareSync(password, user.rows[0].password)

        if (!user.rows[0] || !correctPassword) {
            return res.send("Usuário ou senha incorreto").status(404);
        }

        res.locals.user = user;

        next();

    } catch (e) {
        console.log(e);
        return res.send("Erro ao conectar").status(422)
    }
}

export { validateSignIn, validateSignUp };