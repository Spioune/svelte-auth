import { variables } from '$lib/variables'

const { AUTH0_BASE_URL } = variables

export async function get(request) {
	return {
		status: 200,
		body: AUTH0_BASE_URL,
	}
}
