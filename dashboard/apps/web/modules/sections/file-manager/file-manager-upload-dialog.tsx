import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { handleErrorResponse } from '@seven-auto/libs';
import Iconify from 'modules/components/iconify';
import { CustomFile, Upload } from 'modules/components/upload';
import { useMediaStore } from 'modules/store/media';
import { useCallback, useEffect, useRef, useState } from 'react';

import { fileManagerUploadAccept } from './file-manager-upload-accept';

// ----------------------------------------------------------------------

interface Props extends DialogProps {
  title?: string;
  //
  open: boolean;
  onClose: VoidFunction;
}

export default function FileManagerUploadDialog({
  title = 'Upload Files',
  open,
  onClose,
  //
  ...other
}: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const dialogContentRef = useRef<HTMLDivElement>(null);
  const { uploadMedia, fetchMedias } = useMediaStore();

  useEffect(() => {
    if (!open) {
      setFiles([]);
      return;
    }

    const frameId = requestAnimationFrame(() => {
      dialogContentRef.current?.focus({ preventScroll: true });
    });

    return () => cancelAnimationFrame(frameId);
  }, [open]);

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        }),
      );

      setFiles([...files, ...newFiles]);
    },
    [files],
  );

  const handleUpload = async () => {
    setIsUploading(true);
    const promises = await files
      .filter((file: CustomFile) => file.status !== 'done')
      .map(async (file) => {
        // assign loading
        setFiles((prevFiles) =>
          prevFiles.map((prevFile) =>
            prevFile === file
              ? Object.assign(file, { loading: true })
              : prevFile,
          ),
        );
        try {
          const result = await uploadMedia(file as File);
          // set status
          setFiles((prevFiles) =>
            prevFiles.map((prevFile) =>
              prevFile === file
                ? Object.assign(file, { loading: false, status: 'done' })
                : prevFile,
            ),
          );
          return result;
        } catch (error) {
          // set status
          setFiles((prevFiles) =>
            prevFiles.map((prevFile) =>
              prevFile === file
                ? Object.assign(file, {
                    loading: false,
                    status: 'error',
                    errorMessage: handleErrorResponse(error),
                  })
                : prevFile,
            ),
          );
          return null;
        }
      });
    await Promise.all(promises);
    await fetchMedias();
    setIsUploading(false);
  };

  const handleRemoveFile = (inputFile: File | string) => {
    const filtered = files.filter((file) => file !== inputFile);
    setFiles(filtered);
  };

  const handleRemoveAllFiles = () => {
    setFiles([]);
  };

  const allUploaded =
    files.length > 0 &&
    files.every((file: CustomFile) => file.status === 'done');

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={onClose}
      disableRestoreFocus
      {...other}
    >
      <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}>
        {title}
      </DialogTitle>

      <DialogContent
        ref={dialogContentRef}
        tabIndex={-1}
        dividers
        sx={{ pt: 1, pb: 0, border: 'none', outline: 'none' }}
      >
        <Upload
          multiple
          files={files}
          onDrop={handleDrop}
          onRemove={handleRemoveFile}
          accept={fileManagerUploadAccept}
        />
      </DialogContent>

      <DialogActions>
        {allUploaded ? (
          <Button
            variant="contained"
            color="primary"
            onClick={onClose}
            disabled={isUploading}
          >
            Done
          </Button>
        ) : (
          <Button
            variant="contained"
            loading={isUploading}
            disabled={isUploading || !files.length}
            startIcon={<Iconify icon="eva:cloud-upload-fill" />}
            onClick={handleUpload}
          >
            Upload
          </Button>
        )}

        {!!files.length && (
          <Button
            variant="outlined"
            color="inherit"
            disabled={isUploading}
            onClick={handleRemoveAllFiles}
          >
            Remove all
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
