import { Link } from 'react-router-dom';

export default function PageNotFound() {
  return (
    <>
      <h1>404 - Bobr kurwa!</h1>
      <p>Page not found.</p>
      <p>
        <Link to="/">go home</Link>
      </p>
    </>
  );
}
