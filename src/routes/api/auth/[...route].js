import Iron from '@hapi/iron'
import * as jose from 'jose'
import { parse } from 'cookie'

import { variables } from '$lib/variables'

const {
	AUTH0_BASE_URL,
	AUTH0_ISSUER_BASE_URL,
	AUTH0_CLIENT_ID,
	AUTH0_CLIENT_SECRET,
	AUTH0_AUDIENCE,
	AUTH0_COOKIE_NAME,
} = variables

export async function get(request) {
	const {
		params: { route },
	} = request

	if (route == 'me') {
		return me(request)
	}
	if (route == 'logout') {
		return logout(request)
	}
	if (route == 'login') {
		return login(request)
	}
	if (route == 'callback') {
		return callback(request)
	}
}

async function callback({ query }) {
	if (query.get('error')) {
		throw new Error(query.get('error'))
	}

	const data = await fetch(`${AUTH0_ISSUER_BASE_URL}/oauth/token`, {
		method: 'POST',
		headers: { 'Content-type': 'application/json' },
		body: JSON.stringify({
			grant_type: 'authorization_code',
			client_id: AUTH0_CLIENT_ID,
			client_secret: AUTH0_CLIENT_SECRET,
			code: query.get('code'),
			redirect_uri: `${AUTH0_BASE_URL}/api/auth/callback`,
		}).toString(),
	})

	const { access_token, id_token, scope, expires_in, token_type } = await data.json()

	const JWKS = jose.createRemoteJWKSet(new URL(`${AUTH0_ISSUER_BASE_URL}/.well-known/jwks.json`))

	const { payload: user } = await jose.jwtVerify(id_token, JWKS, {
		issuer: `${AUTH0_ISSUER_BASE_URL}/`,
	})

	const cookie = {
		user,
		id_token,
		access_token,
		scope,
		expires_in,
		token_type,
	}

	const sealedCookie = await Iron.seal(cookie, AUTH0_CLIENT_SECRET, Iron.defaults)

	return {
		status: 302,
		headers: {
			'Set-cookie': `${AUTH0_COOKIE_NAME}=${sealedCookie}; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=${expires_in}`,
			Location: '/',
		},
	}
}

async function login(request) {
	const loginUrl = `${AUTH0_ISSUER_BASE_URL}/authorize?response_type=code&client_id=${AUTH0_CLIENT_ID}&redirect_uri=${AUTH0_BASE_URL}/api/auth/callback&scope=openid%20profile%20email&audience=${AUTH0_AUDIENCE}`

	return {
		status: 302,
		headers: { Location: loginUrl },
	}
}

async function logout(request) {
	return {
		status: 302,
		headers: {
			'Set-cookie': `${AUTH0_COOKIE_NAME}=; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=0`,
			Location: `${AUTH0_ISSUER_BASE_URL}/v2/logout?client_id=${AUTH0_CLIENT_ID}&returnTo=${AUTH0_BASE_URL}`,
		},
	}
}

async function me(request) {
	const cookies = parse(request.headers.cookie || '')

	if (cookies[AUTH0_COOKIE_NAME] != null) {
		const session = await Iron.unseal(cookies[AUTH0_COOKIE_NAME], AUTH0_CLIENT_SECRET, Iron.defaults)

		const data = await fetch(`${AUTH0_ISSUER_BASE_URL}/userinfo`, {
			headers: {
				Authorization: `Bearer ${session.access_token}`,
			},
		})
		return {
			body: await data.json(),
		}
	}
}
