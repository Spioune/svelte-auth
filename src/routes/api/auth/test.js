export async function get({ headers, method, host, path, query, body, params }) {
	return {
		status: 200,
		body: JSON.stringify({ url: process.env.URL, base_url: AUTH0_BASE_URL }),
	}
}
