import { alpha, Box, Tab, Tabs } from '@mui/material';
import { IUser } from '@seven-auto/libs';
import { useTab } from 'modules/hooks/use-tab';
import { useTranslate } from 'modules/locales';
import TransactionList from 'modules/sections/transaction/transaction-lists';
import React from 'react';

type Props = {
  user?: IUser;
  onCallback?: () => void;
};

export default function AccountBilling({ user }: Props) {
  const { t } = useTranslate();

  const TABS = [
    {
      value: 'orders',
      label: t('users.orders'),
    },
    {
      value: 'transaction',
      label: t('users.transactions'),
    },
  ];

  const [currentTab, setCurrentTab] = useTab('subTab', TABS[0]?.value || '');

  return (
    <>
      <Tabs
        value={currentTab}
        onChange={(e, newValue) => {
          setCurrentTab(newValue);
        }}
        sx={{
          px: 1,
          boxShadow: (theme) =>
            `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
        }}
      >
        {TABS.map((tab) => (
          <Tab
            key={tab.value}
            iconPosition="end"
            value={tab.value}
            sx={{ mr: '16px !important' }}
            label={tab.label}
            // icon={<Label>0</Label>}
          />
        ))}
      </Tabs>
      <Box sx={{ mt: 2 }}>
        {currentTab === 'transaction' && <TransactionList userId={user?.id} />}
      </Box>
    </>
  );
}
