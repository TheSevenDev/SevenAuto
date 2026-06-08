import { IMedia } from '@seven-auto/libs';
import { useCallback, useMemo } from 'react';
import * as Yup from 'yup';

import { useTranslate } from '../../locales';

export interface IMediaValue {
  id: string;
  url?: string;
  type?: string;
  size?: number;
  width?: number;
  height?: number;
  createdAt: Date;
  updatedAt: Date;
}

export const useMediaSchema = () => {
  const { t } = useTranslate();

  const MediaSchema = useMemo(() => Yup.mixed<IMediaValue>().nullable(), []);

  const MediaRequiredSchema = useMemo(
    () => Yup.mixed<IMediaValue>().required(t('validate.required')),
    [t],
  );

  const getMediaValue = useCallback(
    (media: IMedia | undefined): IMediaValue | undefined | null => {
      if (!media) return undefined;
      return {
        id: media.id,
        url: media.url,
        type: media.type,
        size: media.size,
        width: media.width,
        height: media.height,
        createdAt: media.createdAt,
        updatedAt: media.updatedAt,
      };
    },
    [],
  );

  return {
    MediaSchema,
    MediaRequiredSchema,
    getMediaValue,
  };
};
