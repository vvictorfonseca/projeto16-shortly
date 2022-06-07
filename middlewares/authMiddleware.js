import db from "../db.js";

import signUpSchema from "../schemas/authSchema.js";

async function validateSignUp(req, res, next) {
    const { name, email, password, confirmPassword } = req.body

    try {
        const { error } = signUpSchema.validate(req.body, { abortEarly: false });

        if (error) {
            return res.status(400).send(error.details.map((error) => error.message))
        }

        const userExist = await db.query(`
            SELECT * FROM users
            WHERE email = $1`,
            [email]);

        if (userExist) {
            return res.send("Usuário já cadastrado!").send(409);
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

        const userExist = await db.query(`
            SELECT * FROM users
            WHERE email = $1`,
            [email]);

        const correctPassword = bcrypt.compareSync(password, userExist.password)

        if (!userExist || !correctPassword) {
            return res.send("Usuário ou senha incorreto").status(404);
        }

        next();

    } catch (e) {
        console.log(e);
        return res.send("Erro ao conectar").status(422)
    }
}

export { validateSignIn, validateSignUp };