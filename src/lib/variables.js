import dotenv from 'dotenv'
dotenv.config()

const { AUTH0_COOKIE_NAME } = process.env

export const variables = {
	AUTH0_COOKIE_NAME,
}
