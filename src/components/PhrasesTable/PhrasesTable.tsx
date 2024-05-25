import { Table } from 'antd';
import type { TableColumnsType as TableColumns } from 'antd';
import Markdown from 'react-markdown';

import './PhrasesTable.css';

import { Phrase, Phrases } from '../../types';
import { renderTags } from '../../utils';
import { useEffect, useMemo, useState } from 'react';
import { useSettingsContext } from '../../hooks';

interface PhraseTableProps {
  readonly wrapperSelector: string;
  readonly phrasesInTheSelection?: Phrases;
  readonly onRowClick: (record: Phrase) => void;
  readonly tableRef: Parameters<typeof Table>[0]['ref'];
}

export default function PhrasesTable({
  wrapperSelector,
  phrasesInTheSelection,
  onRowClick,
  tableRef,
}: PhraseTableProps) {
  const { tags } = useSettingsContext();

  const [contentAreaSize, setContentAreaSize] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const COLUMNS: TableColumns<Phrase> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 48,
      fixed: 'left',
    },
    {
      title: 'First',
      dataIndex: 'first',
      key: 'first',
      render: (_, record) => <Markdown>{record.first}</Markdown>,
    },
    {
      title: 'Second',
      dataIndex: 'second',
      key: 'second',
      render: (_, record) => <Markdown>{record.second}</Markdown>,
    },
    {
      title: 'LVL',
      dataIndex: 'knowledgeLvl',
      key: 'knowledgeLvl',
      width: 40,
    },
    {
      title: 'Created',
      dataIndex: 'createDate',
      key: 'createDate',
      width: 100,
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      className: 'lp-phrases-table__tags-wrapper',
      key: 'tags',
      width: 300,
      render: (_, record: Record<string, unknown>) => renderTags(record, tags),
    },
  ];

  const handleRowClick = (record: Phrase) => {
    onRowClick(record);
  };

  const data = useMemo(
    () => phrasesInTheSelection?.map((item) => ({ ...item, key: item.id })) || [],
    [phrasesInTheSelection],
  );

  // Resize table when viewport size changes
  useEffect(() => {
    const onViewportResize = () => {
      const div = document.querySelector(wrapperSelector);
      if (div) {
        const { width, height } = div.getBoundingClientRect();
        setContentAreaSize({ x: Math.max(width - 24, 1000), y: height - 94 });
      }
    };

    onViewportResize();

    window.addEventListener('resize', onViewportResize);

    return () => {
      window.removeEventListener('resize', onViewportResize);
    };
  }, [wrapperSelector]);

  return (
    <Table
      className="lp-phrases-table"
      ref={tableRef}
      columns={COLUMNS}
      dataSource={data}
      scroll={contentAreaSize}
      size="small"
      onRow={(record: Phrase) => ({ onClick: () => handleRowClick(record) })}
      pagination={false}
    />
  );
}
