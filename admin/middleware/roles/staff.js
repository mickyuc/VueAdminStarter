export default ({ $auth, error }) => {
  if ($auth.user && !/sudo|staff/.test($auth.user.role)) {
    error({ statusCode: 403, message: 'You have no access to perform this action' })
  }
}
