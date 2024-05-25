import { Phrase, Tag, Tags } from '../types';

export const getMatchedTags = (phrases: Map<number, Phrase>, tagList: Tags): Tags => {
  if (!phrases.size || !Array.isArray(tagList)) return [];

  const newTagsMap: Map<string, Tag> = new Map();

  tagList.forEach((tag) => {
    newTagsMap.set(tag.value, tag);
  });

  phrases.forEach((phrase) => {
    if (!phrase.tags) return;
    const tags = phrase.tags.split(',');
    tags.forEach((tag: string) => {
      if (newTagsMap.has(tag)) return;
      newTagsMap.set(tag, { value: tag });
    });
  });

  const newTags: Tags = Array.from(newTagsMap.values());

  return newTags;
};
