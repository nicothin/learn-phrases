export function Icons() {
  /*
    <svg width="18" height="18">
      <use xlinkHref="#error" fill="var(--danger-color)" />
    </svg>
  */

  return (
    <svg style={{ display: 'none' }}>
      <defs>
        <symbol id="done" viewBox="0 0 18 18">
          <path d="M9 0a9 9 0 1 0 0 18A9 9 0 0 0 9 0zm4 5 2 2-7 7-5-5 2-2 3 3 5-5z" />
        </symbol>

        <symbol id="success" width="18" height="18">
          <path d="M7 14 1.425 8.447 3 7l4 4 8-8 1.459 1.549S10.333 10.667 7 14z" />
        </symbol>

        <symbol id="error" width="18" height="18">
          <path d="m8.977 7.568 5.29-5.31 1.417 1.412-5.297 5.314 5.297 5.317-1.416 1.41-5.291-5.31-5.293 5.31-1.416-1.41 5.296-5.317L2.268 3.67l1.416-1.412 5.293 5.31z" />
        </symbol>

        <symbol id="arrow-l" width="18" height="18">
          <path d="M8 3 2 9l6 6 1.457-1.549L6 10h10V8H6l3.453-3.45Z" />
        </symbol>

        <symbol id="arrow-r" width="18" height="18">
          <path d="m10 3 6 6-6 6-1.457-1.549L12 10H2V8h10L8.547 4.55Z" />
        </symbol>

        <symbol id="arrow-d" width="18" height="18">
          <path d="m15 10-6 6-6-6 1.549-1.457L8 12V2h2v10l3.45-3.453z" />
        </symbol>

        <symbol id="arrow-t" width="18" height="18">
          <path d="M15 8 9 2 3 8l1.549 1.457L8 6v10h2V6l3.45 3.453z" />
        </symbol>

        <symbol id="upload" width="18" height="18">
          <path d="M9 1C6.837 1 5.077 2.36 4.12 4.205 2.024 4.752.5 6.69.5 9c0 2.633 1.97 4.856 4.5 4.994v-2.008C3.61 11.853 2.5 10.617 2.5 9c0-1.554 1.044-2.757 2.342-2.965a1 1 0 0 0 .77-.619C6.183 3.97 7.482 3 9 3s2.816.97 3.389 2.416a1 1 0 0 0 .77.62C14.455 6.242 15.5 7.445 15.5 9c0 1.617-1.11 2.853-2.5 2.986v2.008c2.53-.138 4.5-2.361 4.5-4.994 0-2.311-1.525-4.248-3.62-4.795C12.924 2.361 11.164 1 9 1zm0 6-3 3v1h2v5h2v-5h2v-1L9 7z" />
        </symbol>

        <symbol id="download" width="18" height="18">
          <path d="M9 1C6.837 1 5.077 2.36 4.12 4.205 2.024 4.752.5 6.69.5 9c0 2.633 1.97 4.856 4.5 4.994v-2.008C3.61 11.853 2.5 10.617 2.5 9c0-1.554 1.044-2.757 2.342-2.965a1 1 0 0 0 .77-.619C6.183 3.97 7.482 3 9 3s2.816.97 3.389 2.416a1 1 0 0 0 .77.62C14.455 6.242 15.5 7.445 15.5 9c0 1.617-1.11 2.853-2.5 2.986v2.008c2.53-.138 4.5-2.361 4.5-4.994 0-2.311-1.525-4.248-3.62-4.795C12.924 2.361 11.164 1 9 1zM8 9v5H6v1l3 3 3-3v-1h-2V9H8z" />
        </symbol>

        <symbol id="plus" width="18" height="18">
          <path d="M8 1v7H1v2h7v7h2v-7h7V8h-7V1H8z" />
        </symbol>

        <symbol id="trash" width="18" height="18">
          <path d="M5 1v1H4v2H1v2h2v9c0 1.108.892 2 2 2h8c1.108 0 2-.892 2-2V6h2V4h-3V2h-1V1Zm2 1h4v1h1v1H6V3h1ZM5 6h8v7.533c0 .813-.654 1.467-1.467 1.467H6.467A1.464 1.464 0 0 1 5 13.533Zm1 1v1h6V7Zm0 2v1h6V9Zm0 2v1h6v-1zm0 2v1h6v-1z" />
        </symbol>
      </defs>
    </svg>
  );
}
