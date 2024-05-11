export default function About() {
  // prettier-ignore
  return (
    <>
      <h1>About</h1>

      <p>
        This is a tool for learning phrases in a foreign language using the spaced repetition method.
      </p>
      <ol>
        <li>Add words or phrases you are learning.</li>
        <li>Cycle through the added cards, marking correct and incorrect answers.</li>
        <li>
          After 10 correct marks, the word/phrase is marked as learned and is not shown in the list of learned phrases by default.
        </li>
      </ol>
      <p>
        This is a serverless project. By default, all added words/phrases are saved in the browser storage. But in the settings you can specify data for accessing <a href="https://gist.github.com/" rel="noreferrer">gist</a> and then the data will be periodically saved to it.
      </p>

      <h2>Links</h2>

      <ul>
        <li>Author: <a href="https://nicothin.pro/">Nikolay Gromov</a>.</li>
        <li>Github repository for this project: <a href="https://github.com/nicothin/learnphrases2">github.com/nicothin/learnphrases2</a></li>
      </ul>

      <h2>Thanx</h2>

      <p>Thanks to <a href="https://www.instagram.com/english_playlists/">Alexander Bebris</a>. This project inspired by the video course <a href="https://www.youtube.com/watch?v=BAahBqreWZw&amp;list=PLD6SPjEPomasNzHuJpcS1Fxa2PYf1Bm-x&amp;index=1">English by playlists</a>.</p>
    </>
  );
}
