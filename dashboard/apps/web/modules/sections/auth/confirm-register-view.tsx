'use client';

import { Button, Stack, Typography } from '@mui/material';
import { paths } from '@seven-auto/libs';
import { useAuthContext } from 'modules/auth/hooks';
import { LoadingCheck } from 'modules/components/loading-check';
import { useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';

// TODO translate
const ConfirmRegisterView = () => {
  const { confirmRegister, currentUser } = useAuthContext();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<'success' | 'error' | 'warning'>(
    'error',
  );
  const [statusMessage, setStatusMessage] = useState<string | null>(
    'Verifying...',
  );

  const handleConfirmRegister = useCallback(async () => {
    const token = searchParams.get('token');
    if (currentUser && currentUser.isVerified) {
      setStatus('warning');
      setStatusMessage('Your account is already verified');
      // remove token from url
    } else if (!token) {
      setStatus('error');
      setStatusMessage('Invalid token');
    } else {
      try {
        await confirmRegister(token);
        setStatus('success');
        setStatusMessage('Success');
      } catch (error) {
        setStatus('error');
        if (error instanceof Error) {
          setStatusMessage(error.message);
        } else {
          setStatusMessage('There was an error verifying your account.');
        }
      }
    }
    setIsLoading(false);
    // remove param token from url
    window.history.replaceState({}, '', window.location.pathname);
  }, [confirmRegister, searchParams, currentUser]);

  useEffect(() => {
    handleConfirmRegister();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Stack spacing={1} sx={{ my: 1, alignItems: 'center' }}>
        <LoadingCheck
          width={80}
          height={80}
          isLoading={isLoading}
          status={status || 'error'}
        />
      </Stack>
      <Stack spacing={2} sx={{ my: 1 }}>
        <Typography variant="h3">{statusMessage}</Typography>
        {status !== 'warning' && !isLoading && (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {status === 'success'
              ? 'Your account has been successfully verified.'
              : 'There was an error verifying your account.'}
          </Typography>
        )}
        {!isLoading && (
          <Button
            variant="contained"
            color="primary"
            size="large"
            href={status === 'success' ? paths.dashboard.root : '/'}
          >
            {status === 'success' ? 'Go to Dashboard' : 'Go to home'}
          </Button>
        )}
      </Stack>
    </>
  );
};

export default ConfirmRegisterView;
