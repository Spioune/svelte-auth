import { variables } from '$lib/variables'

const { AUTH0_ISSUER_BASE_URL, AUTH0_COOKIE_NAME, AUTH0_CLIENT_SECRET } = variables

import Iron from '@hapi/iron'
import { parse } from 'cookie'

export async function get(request) {
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
