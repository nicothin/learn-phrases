import { ChangeEvent, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { FilterOutlined } from '@ant-design/icons';
import { Button, Checkbox, Divider, FloatButton, Popover, Space, Tag } from 'antd';

import './TagFilterFloatButton.css';

import { getFloatButtonPositionStyle } from '../../utils';
import { TagCheckboxes } from '../../types';

interface BadgeData {
  count?: ReactNode;
}

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
  const [badge, setBadge] = useState<BadgeData | undefined>(undefined);

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
    },
    [setTagsCheckboxes, tagsCheckboxes],
  );

  const onChangeAll = useCallback(
    (checkedValue: boolean) => {
      const newTagsCheckboxes: TagCheckboxes = new Map();

      tagsCheckboxes.forEach((tag) => {
        newTagsCheckboxes.set(tag.value, { ...tag, checked: checkedValue });
      });

      setTagsCheckboxes(newTagsCheckboxes);
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

    return (
      <div onChange={checkboxChange}>
        {content}
        <Divider />
        <Space.Compact block>
          <Button onClick={() => onChangeAll(true)}>Select all</Button>
          <Button onClick={() => onChangeAll(false)}>Select none</Button>
        </Space.Compact>
      </div>
    );
  }, [checkboxChange, onChangeAll, tagsCheckboxes]);

  useEffect(() => {
    const tagsCheckboxesCheckedCounter = Array.from(tagsCheckboxes.values()).filter(
      (item) => item.checked,
    ).length;

    if (tagsCheckboxesCheckedCounter === tagsCheckboxes.size) {
      setBadge(undefined);
      return;
    }

    if (tagsCheckboxesCheckedCounter === 0) {
      setBadge({ count: '!!!' });
      return;
    }

    setBadge({
      count: tagsCheckboxes.size - (tagsCheckboxes.size - tagsCheckboxesCheckedCounter),
    });
  }, [tagsCheckboxes]);

  return (
    <Popover content={popoverContent} placement="leftBottom" title="Tag filter" trigger="click">
      <FloatButton
        shape="circle"
        style={getFloatButtonPositionStyle(floatButtonPosition)}
        icon={<FilterOutlined />}
        badge={badge}
      />
    </Popover>
  );
}
