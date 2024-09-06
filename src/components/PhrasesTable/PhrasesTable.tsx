import { ReactNode } from 'react';

import './PhrasesTable.css';

import { Phrase } from '../../types';
import { formatDate } from '../../utils';
import { MarkdownRenderer } from '../MarkdownRenderer/MarkdownRenderer';

interface PhrasesTableProps {
  phrases: Phrase[];
  onRowClick: (phraseId: number) => void;
  noPhrasesMessage?: string | ReactNode;
}

export function PhrasesTable(data: PhrasesTableProps) {
  const { phrases, onRowClick, noPhrasesMessage = 'There are no phrases here yet.' } = data;

  // const canAdd = typeof onAddPhrase === 'function';

  return (
    <div className="phrases-table">
      {phrases?.length ? (
        <div className="phrases-table__inner">
          <table className="phrases-table__table" style={{ width: '100%', minWidth: '1000px' }}>
            <colgroup>
              <col style={{ width: "54px" }} />
              <col />
              <col />
              <col style={{ width: "40px" }} />
              <col style={{ width: "100px" }} />
              {/* <col style={{ width: "300px" }} /> */}
            </colgroup>

            <thead>
              <tr>
                <th className="phrases-table__cell" scope="col">ID</th>
                <th className="phrases-table__cell" scope="col">First</th>
                <th className="phrases-table__cell" scope="col">Second</th>
                <th className="phrases-table__cell" scope="col">LVL</th>
                <th className="phrases-table__cell" scope="col">Created</th>
                {/* <th className="phrases-table__cell" scope="col">Tags</th> */}
              </tr>
            </thead>

            <tbody className="phrases-table__table-body">
              {phrases.map((phrase) => (
                <tr
                  key={phrase.id}
                  onClick={() => onRowClick(phrase.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      onRowClick(phrase.id);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <td className="phrases-table__cell">{phrase.id}</td>
                  <td className="phrases-table__cell  phrases-table__cell--first">
                    <MarkdownRenderer>{phrase.first}</MarkdownRenderer>
                  </td>
                  <td className="phrases-table__cell">
                    <MarkdownRenderer>{phrase.second}</MarkdownRenderer>
                  </td>
                  <td className="phrases-table__cell">{phrase.knowledgeLvl}</td>
                  <td className="phrases-table__cell">{formatDate(phrase.createDate)}</td>
                  {/* <td className="phrases-table__cell">{phrase.tags?.join(', ')}</td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="phrases-table__no-phrases">
          {noPhrasesMessage}
        </p>
      )}
    </div>
  );
};
