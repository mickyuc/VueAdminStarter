export default ({ $auth, error }) => {
  if ($auth.user && $auth.user.role !== 'sudo') {
    error({ statusCode: 403, message: 'You have no access to perform this action' })
  }
}
