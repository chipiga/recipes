/**
 * Minimal error message renderer.
 * @param {{ message?: string }} props
 * @returns {JSX.Element}
 */
function ErrorPage({ message = 'Page not found' }) {
  return <p className="text-center text-red-500">{message}</p>;
}
export default ErrorPage;