import { Link } from 'react-router-dom';

import { LayoutText } from '../../shared/layouts/LayoutText/LayoutText';

export function PageNotFound() {
  return (
    <LayoutText>
      <h1>404 - Bobr kurwa!</h1>
      <p>Page not found. <a href="https://www.youtube.com/watch?v=6vNezXKkq9g" target="_blank" rel="noopener noreferrer">
          Sorry
        </a>.</p>
      <p className="text-secondary">
        <Link to="/">Go home</Link> to pet your beaver.
      </p>
    </LayoutText>
  );
}
