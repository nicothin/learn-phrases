import { Octokit } from '@octokit/core';

import { PhraseDTO } from '../types';

type GistConfig = {
  token?: string;
  gistId?: string;
};

enum FILE_NAMES {
  PHRASES = 'phrases.json',
}

export type OctokitResponse = {
  data: {
    html_url?: string;
  };
  status: number;
};

export class Gist {
  private static instance: Gist | null = null;
  private token: string;
  private octokit: Octokit;
  private gistId: string;

  private constructor(config: GistConfig) {
    if (!config.token || !config.gistId) {
      throw new Error('Token and gistId are required');
    }
    this.token = config.token;
    this.gistId = config.gistId;
    this.octokit = new Octokit({ auth: this.token });
  }

  public static getInstance(config: GistConfig): Gist | null {
    if (!config.token || !config.gistId) {
      return null;
    }

    if (!Gist.instance || config.token !== Gist.instance.token || config.gistId !== Gist.instance.gistId) {
      Gist.instance = new Gist(config);
    }
    return Gist.instance;
  }

  public async getAllPhrases(): Promise<PhraseDTO[]> {
    const response = await this.octokit.request('GET /gists/{gist_id}', { gist_id: this.gistId });

    if (!response?.data?.files?.[FILE_NAMES.PHRASES]) {
      throw new Error(`File ${FILE_NAMES.PHRASES} not found in gist.`);
    }

    const gistContent = response?.data?.files?.[FILE_NAMES.PHRASES]?.content ?? '[]';

    try {
      const result = JSON.parse(gistContent);

      if (!Array.isArray(result) || !result.length) {
        throw new Error(`${FILE_NAMES.PHRASES} does not contain phrases.`);
      }

      return result;
    } catch (error) {
      throw new Error(`Invalid JSON: ${error}`);
    }
  }

  public async setAllPhrases(phrasesDTO: PhraseDTO[]): Promise<OctokitResponse> {
    if (!Array.isArray(phrasesDTO) || !phrasesDTO?.length) {
      throw new Error('Saved phrases is not array or is empty.');
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
