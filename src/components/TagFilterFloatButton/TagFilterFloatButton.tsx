import { ChangeEvent, ReactNode, useCallback, useMemo, useState } from 'react';
import { FilterOutlined } from '@ant-design/icons';
import { Checkbox, FloatButton, Popover, Tag } from 'antd';

import './TagFilterFloatButton.css';

import { getFloatButtonPositionStyle } from '../../utils';
import { TagCheckboxes } from '../../types';

interface TagFilterFloatButtonProps {
  readonly tagsCheckboxes: TagCheckboxes;
  readonly setTagsCheckboxes: (newTagsCheckboxes: TagCheckboxes) => void;
  readonly floatButtonPosition: [number, number];
}

export default function TagFilterFloatButton({
  tagsCheckboxes,
  setTagsCheckboxes,
  floatButtonPosition,
}: TagFilterFloatButtonProps) {
  const [badgeCount, setBadgeCount] = useState(0);

  const checkboxChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      const thisCheckbox = tagsCheckboxes.get(event.target.name);
      if (!thisCheckbox) return;

      const newTagsCheckboxes = new Map(tagsCheckboxes);

      newTagsCheckboxes.set(thisCheckbox.value, {
        ...thisCheckbox,
        checked: !thisCheckbox.checked,
      });

      setTagsCheckboxes(newTagsCheckboxes);

      const newCheckboxesCheckedCounter = Array.from(newTagsCheckboxes.values()).filter(
        (item) => item.checked,
      ).length;

      setBadgeCount(
        newCheckboxesCheckedCounter !== tagsCheckboxes.size
          ? tagsCheckboxes.size - (tagsCheckboxes.size - newCheckboxesCheckedCounter)
          : 0,
      );
    },
    [setTagsCheckboxes, tagsCheckboxes],
  );

  const popoverContent = useMemo(() => {
    const content: ReactNode[] = [];
    tagsCheckboxes.forEach((tag) => {
      content.push(
        <p className="tag-filter-float-button__checkbox-wrapper" key={tag.value}>
          <Checkbox checked={tag.checked} name={tag.value}>
            <Tag color={tag.color}>{tag.value}</Tag>
          </Checkbox>
        </p>,
      );
    });
    return <div onChange={checkboxChange}>{content}</div>;
  }, [checkboxChange, tagsCheckboxes]);

  return (
    <Popover content={popoverContent} placement="leftBottom" title="Tag filter" trigger="click">
      <FloatButton
        shape="circle"
        style={getFloatButtonPositionStyle(floatButtonPosition)}
        icon={<FilterOutlined />}
        badge={badgeCount ? { count: badgeCount, color: 'red' } : undefined}
      />
    </Popover>
  );
}
