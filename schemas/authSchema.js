import joi from "joi";

const signUpSchema = joi.object(
    {
        name: joi.string().min(3).required(),
        email: joi.string().email().required(),
        password: joi.string().required(),
        confirmPassword: joi.string().required(),
    }
)

export default signUpSchema;