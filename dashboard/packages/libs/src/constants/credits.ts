export const conversionRateCreditToCommission = 1000;

export enum ECreditUnit {
  TIME = 'TIME',
  ONE_TIME = 'ONE_TIME',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
  UNLIMITED = 'UNLIMITED',
}

export enum ECreditFee {
  SYSTEM = 'SYSTEM',
  //
}

export interface ICreditFee {
  value: number | null;
  unit?: ECreditUnit;
}

export const creditsFee: {
  [key in ECreditFee]: ICreditFee;
} = {
  [ECreditFee.SYSTEM]: {
    value: 3,
    unit: ECreditUnit.TIME,
  },
};

export enum ECreditReward {
  VERIFY_EMAIL = 'VERIFY_EMAIL',
  FULL_FILL_PROFILE = 'FULL_FILL_PROFILE',
  SAVE_PHYSICAL_PROFILE = 'SAVE_PHYSICAL_PROFILE',
  REFERRAL = 'REFERRAL',
}

export const creditsReward: {
  [key in ECreditReward]: {
    value: number;
    unit?: ECreditUnit;
  };
} = {
  [ECreditReward.VERIFY_EMAIL]: {
    value: 10,
    unit: ECreditUnit.ONE_TIME,
  },
  [ECreditReward.FULL_FILL_PROFILE]: {
    value: 5,
    unit: ECreditUnit.ONE_TIME,
  },
  [ECreditReward.SAVE_PHYSICAL_PROFILE]: {
    value: 5,
    unit: ECreditUnit.TIME,
  },
  [ECreditReward.REFERRAL]: {
    value: 10,
    unit: ECreditUnit.TIME,
  },
};

export const creditFeeValidator = (
  creditFee: ECreditFee,
  currentCredits: number,
) => {
  const { value } = creditsFee[creditFee];
  if (!value) return true;
  if (currentCredits < value) return false;
  return true;
};

export const getCreditFee = (creditFee: ECreditFee): ICreditFee => {
  return creditsFee[creditFee];
};

export const creditRewardValidator = (
  creditReward: ECreditReward,
  currentCredits: number,
) => {
  const { value } = creditsReward[creditReward];
  if (currentCredits < value) return false;
  return true;
};

export const getCreditReward = (creditReward: ECreditReward) => {
  return creditsReward[creditReward];
};

export const getNextClaim = (
  lastClaim: Date | null,
  unit: ECreditUnit,
): Date | null => {
  const oneDay = 1000 * 60 * 60 * 24;
  const today = new Date();
  if (!lastClaim) return new Date(today.getTime() - 60 * 1000);
  if (unit === ECreditUnit.TIME || unit === ECreditUnit.UNLIMITED)
    return lastClaim || new Date(today.getTime() - 60 * 1000);
  if (unit === ECreditUnit.ONE_TIME) return null;
  if (unit === ECreditUnit.DAILY) return new Date(lastClaim.getTime() + oneDay);
  if (unit === ECreditUnit.WEEKLY)
    return new Date(lastClaim.getTime() + oneDay * 7);
  if (unit === ECreditUnit.MONTHLY)
    return new Date(lastClaim.getTime() + oneDay * 30);
  if (unit === ECreditUnit.YEARLY)
    return new Date(lastClaim.getTime() + oneDay * 365);
  return null;
};
