import { IUser } from '../types';

export const getDisplayName = (
  currentUser: IUser | null | undefined,
): string => {
  if (!currentUser) return '';
  if (currentUser.fullname) return currentUser.fullname;
  if (currentUser.username) return currentUser.username;
  return '';
};

export const getFullAddress = (currentUser: IUser | null): string => {
  if (!currentUser) return '';
  let address = '';
  if (currentUser.address) address += currentUser.address;
  if (currentUser.region) address += `, ${currentUser.region}`;
  if (currentUser.city) address += `, ${currentUser.city}`;
  if (currentUser.country) address += `, ${currentUser.country}`;
  if (currentUser.zipCode) address += `, ${currentUser.zipCode}`;
  return address;
};
