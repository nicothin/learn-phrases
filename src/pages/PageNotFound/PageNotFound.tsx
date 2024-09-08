import { Link } from 'react-router-dom';

export default function PageNotFound() {
  return (
    <div className="layout-text">
      <h1>404 - Bobr kurwa!</h1>
      <p>Page not found.</p>
      <p className="text-secondary">
        <Link to="/">Go home</Link> to pet your beaver.
      </p>
    </div>
  );
}
