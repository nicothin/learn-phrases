import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { NotificationInstance } from 'antd/es/notification/interface';

import { Phrases, PhrasesDTO } from '../types';
import { Gist } from '../services/Gist';
import { useSettingsContext } from './useSettingsContext';
import { getPhrasesDTOFromLocal, savePhrasesDTOToGist } from '../services/actions';

type UseExportToGistWhen100PercentProps = {
  isGoToNext: boolean;
  unlearnedIDs: Set<number>;
  learnedIDs: Set<number>;
  phrases: Phrases;
  prevPhraseIndex: number;
  nowPrasesIndex: number;
  nextPhraseIndex: number;
  notificationApi: NotificationInstance;
};

export const useExportToGistWhen100Percent = ({
  isGoToNext,
  unlearnedIDs,
  learnedIDs,
  phrases,
  prevPhraseIndex,
  nowPrasesIndex,
  nextPhraseIndex,
  notificationApi,
}: UseExportToGistWhen100PercentProps) => {
  const { token, gistId, isSyncWhen100percent } = useSettingsContext();

  const gist = Gist.getInstance({ token, gistId });

  useEffect(() => {
    if (
      !isSyncWhen100percent ||
      !gist ||
      !isGoToNext ||
      !(
        unlearnedIDs.has(phrases[prevPhraseIndex].id) &&
        learnedIDs.has(phrases[nowPrasesIndex].id) &&
        learnedIDs.has(phrases[nextPhraseIndex].id)
      )
    )
      return;

    getPhrasesDTOFromLocal()
      .then((phrasesDTO: PhrasesDTO) => {
        savePhrasesDTOToGist({ gist, phrasesDTO })
          .then((res) => {
            notificationApi.success({
              message: 'Export to gist completed',
              description: (
                <>
                  The export to{' '}
                  <a href={res.data.html_url} target="_blank">
                    this gist
                  </a>{' '}
                  has been successfully completed. This is enabled{' '}
                  <Link to="/settings">in the settings</Link>.
                </>
              ),
            });
          })
          .catch((error: Error) => {
            console.error(error);
            notificationApi?.error({
              message: 'Export to gist failed',
              description: error.message,
            });
          });
      })
      .catch((error) => {
        console.error(error);
        notificationApi.error({
          message: 'Export to gist failed',
          description: String(error),
        });
      });
  }, [
    gist,
    isSyncWhen100percent,
    phrases,
    isGoToNext,
    learnedIDs,
    unlearnedIDs,
    prevPhraseIndex,
    nowPrasesIndex,
    nextPhraseIndex,
    notificationApi,
  ]);
};
