import { variables } from '$lib/variables'

const { AUTH0_ISSUER_BASE_URL, AUTH0_CLIENT_ID, AUTH0_COOKIE_NAME } = variables

export async function get() {
	return {
		status: 302,
		headers: {
			'Set-cookie': `${AUTH0_COOKIE_NAME}=; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=0`,
			Location: `${AUTH0_ISSUER_BASE_URL}/v2/logout?client_id=${AUTH0_CLIENT_ID}`,
		},
	}
}
