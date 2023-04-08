export interface Phrase {
  id: string,
  languages: {
    first: { content: string, descr: string },
    second: { content: string, descr: string },
  },
  myKnowledgeLvl: string,
}

