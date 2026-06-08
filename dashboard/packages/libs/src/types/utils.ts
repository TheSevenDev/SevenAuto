/* eslint-disable @typescript-eslint/no-explicit-any */
export type SortOrder = 'asc' | 'desc';

export type SortOrderInput = {
  sort: SortOrder;
  nulls?: 'first' | 'last';
};

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonValue }
  | JsonValue[];

export type ActionMapType<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export type PartialDeep<T> = T extends object
  ? {
      [P in keyof T]?: PartialDeep<T[P]>;
    }
  : T;

export type IFindManyResponse<T> = {
  items: T[];
  total: number;
};

export const EDataSelect = {
  BASIC: 'basic',
  DETAIL: 'detail',
  FULL: 'full',
} as const;

export type EDataSelect = (typeof EDataSelect)[keyof typeof EDataSelect];

export type ISelect = {
  select?: EDataSelect;
};

export const EStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;

export type EStatus = (typeof EStatus)[keyof typeof EStatus];

export const EStatusProcess = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  CANCELED: 'CANCELED',
} as const;

export type EStatusProcess =
  (typeof EStatusProcess)[keyof typeof EStatusProcess];

export const ELanguage = {
  VI: 'vi',
  EN: 'en',
} as const;

export type ELanguage = (typeof ELanguage)[keyof typeof ELanguage];

export type IFindMany = {
  take?: number;
  skip?: number;
  filter?: string;
  select?: EDataSelect;
  includeIds?: string[];
  excludeIds?: string[];
  startDate?: Date | string;
  endDate?: Date | string;
  orderBy?: IOrderBy;
};

export type IBaseEntity = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};

export type IOrderBy = {
  [key: string]: SortOrder | SortOrderInput | IOrderBy;
};
