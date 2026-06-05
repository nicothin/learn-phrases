import type { FC, SVGProps } from 'react';
import { Done } from './icons/Done';
import { Success } from './icons/Success';
import { Error } from './icons/Error';
import { ArrowL } from './icons/ArrowL';
import { ArrowR } from './icons/ArrowR';
import { ArrowD } from './icons/ArrowD';
import { ArrowT } from './icons/ArrowT';
import { Upload } from './icons/Upload';
import { Download } from './icons/Download';
import { Plus } from './icons/Plus';
import { Trash } from './icons/Trash';
import { Sound } from './icons/Sound';
import { Burger } from './icons/Burger';
import { Close } from './icons/Close';
import { Refresh } from './icons/Refresh';
import { Export } from './icons/Export';
import { Import } from './icons/Import';

const icons = {
  done: Done,
  success: Success,
  error: Error,
  'arrow-l': ArrowL,
  'arrow-r': ArrowR,
  'arrow-d': ArrowD,
  'arrow-t': ArrowT,
  upload: Upload,
  download: Download,
  plus: Plus,
  trash: Trash,
  sound: Sound,
  burger: Burger,
  close: Close,
  refresh: Refresh,
  export: Export,
  import: Import,
} as const;

export type IconName = keyof typeof icons;

type Props = SVGProps<SVGSVGElement> & { name: IconName };

export const Icon: FC<Props> = ({ name, width = 18, height = 18, ...rest }) => {
  const Component = icons[name];

  return <Component width={width} height={height} {...rest} />;
};
