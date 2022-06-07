import joi from "joi";

const regex = /https?:\/\//

const urlFormatSchema = joi.object(
    {
        url: joi.string().required().pattern(regex)
    }
)

export default urlFormatSchema;