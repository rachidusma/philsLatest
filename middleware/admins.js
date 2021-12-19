export default function ({ redirect, app, route }) {
  const token = app.$axios.defaults.headers.common['x-auth-token']
  if (!token) { return redirect('/login') }
  const userRole = token.split(',')[0]
  const haveAccess = ['Restaurant Owner', 'admin'].includes(userRole)
  if (!haveAccess) {
    redirect('/error')
    // redirect('/error')
  } else if (userRole === 'Restaurant Owner' && ['/admin', ''].includes(route.path)) {
    return true
  }
}
