import { Tag } from 'antd';
import { Tags } from '../types';

export const renderTags = (record: Record<string, unknown>, tagsData?: Tags) => {
  const list = record.tags ? (record.tags as string).split(',') : [];
  const tags: React.ReactNode[] = [];
  list?.forEach((tag: string, index: number) => {
    if (!tag) return;
    const tagData = tagsData?.find((item) => item.value === tag);
    const color = tagData?.color;
    tags.push(
      <Tag key={`${tag}-${index}`} color={color}>
        {tag}
      </Tag>,
    );
  });
  return tags.length ? tags : null;
};
