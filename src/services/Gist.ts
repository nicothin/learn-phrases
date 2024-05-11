import { Octokit } from '@octokit/core';

import { FILE_NAMES } from '../enums';
import { PhrasesDTO } from '../types';

type GistConfig = {
  token?: string;
  gistId?: string;
};

type OctokitResponse = {
  data: {
    html_url?: string;
  };
  status: number;
};

export class Gist {
  private static instance: Gist;
  private token: string;
  private octokit: Octokit;
  private gistId: string;

  private constructor(config: GistConfig) {
    this.token = config.token ?? '';
    this.gistId = config.gistId ?? '';
    this.octokit = new Octokit({ auth: this.token });
  }

  public static getInstance(config: GistConfig): Gist {
    if (
      !Gist.instance ||
      config.token !== Gist.instance.token ||
      config.gistId !== Gist.instance.gistId
    ) {
      Gist.instance = new Gist(config);
    }
    return Gist.instance;
  }

  public async getAllPhrases(): Promise<PhrasesDTO> {
    if (!this.token || !this.gistId) {
      throw new Error('Token or gistID not specified');
    }

    const response = await this.octokit.request('GET /gists/{gist_id}', { gist_id: this.gistId });

    if (!response?.data?.files?.[FILE_NAMES.PHRASES]) {
      throw new Error(`File ${FILE_NAMES.PHRASES} not found in gist`);
    }

    const gistContent = response?.data?.files?.[FILE_NAMES.PHRASES]?.content ?? '[]';

    try {
      const result = JSON.parse(gistContent);
      return result;
    } catch (error) {
      throw new Error(`The data is received, but this .json is incorrect. ${error}`);
    }
  }

  public async setAllPhrases(phrasesDTO: PhrasesDTO): Promise<OctokitResponse> {
    if (!this.token || !this.gistId) {
      throw new Error('Token or gistID not specified');
    }

    if (!Array.isArray(phrasesDTO) || !phrasesDTO?.length) {
      throw new Error('Saved phrases is not array or is empty');
    }

    try {
      const jsonString = JSON.stringify(phrasesDTO);

      return this.octokit.request('PATCH /gists/{gist_id}', {
        gist_id: this.gistId,
        files: {
          [FILE_NAMES.PHRASES]: { content: jsonString.replace(/],\[/g, '],\n[') },
        },
      });
    } catch (error) {
      throw new Error(`Saved JSON is incorrect. ${error}`);
    }
  }
}
