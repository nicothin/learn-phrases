import { Tag } from 'antd';

export const renderTags = (record: Record<string, unknown>) => {
  const list = record.tags ? (record.tags as string).split(',') : [];
  const tags: React.ReactNode[] = [];
  list?.forEach((tag: string, index: number) => {
    if (!tag) return;
    tags.push(<Tag key={`${tag}-${index}`}>{tag}</Tag>);
  });
  return tags.length ? tags : null;
};
