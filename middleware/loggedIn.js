export default function ({ redirect, app }) {
  const token = app.$axios.defaults.headers.common['x-auth-token']
  if (token) {
    redirect('/')
  }
}
