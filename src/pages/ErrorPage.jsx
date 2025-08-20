function ErrorPage({ message = 'Page not found' }) {
  return <p className="text-center text-slate-500">{message}</p>;
}
export default ErrorPage;