import { variables } from '$lib/variables.js'

export async function get({ headers, method, host, path, query, body, params }) {
	return {
		status: 200,
		body: JSON.stringify(variables),
	}
}
