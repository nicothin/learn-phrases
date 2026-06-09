import { LayoutText } from '../../shared/layouts/LayoutText/LayoutText';

export function About() {
  return <LayoutText><h1>About</h1>

      <p>TODO</p>

      <h2>Links</h2>

      <ul>
        <li>
          Author: <a href="https://nicothin.pro/">Nikolay Gromov</a>.
        </li>
        <li>
          Github repository for this project:{' '}
          <a href="https://github.com/nicothin/learn-phrases">github.com/nicothin/learn-phrases</a>
        </li>
      </ul>

      <h2>Thanx</h2>

      <p>
        Thanks to <a href="https://www.instagram.com/english_playlists/">Alexander Bebris</a>. This project
        inspired by the video course{' '}
        <a href="https://www.youtube.com/watch?v=BAahBqreWZw&amp;list=PLD6SPjEPomasNzHuJpcS1Fxa2PYf1Bm-x&amp;index=1">
          English by playlists
        </a>
        .
      </p></LayoutText>;
}
