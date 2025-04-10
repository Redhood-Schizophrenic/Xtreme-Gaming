import React from 'react';
import { CheckCircle2, Database, XCircle } from 'lucide-react';

export default function BackupStatusIndicator({ status, lastBackupDate }) {
  if (status === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center p-6 border rounded-lg border-dashed">
        <Database className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-center text-muted-foreground">
          Create a backup of your system data including user settings, device configurations, and inventory records.
        </p>
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center p-6">
        <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
        <p className="text-center font-medium">Creating backup...</p>
        <p className="text-center text-muted-foreground mt-2">
          This may take a few moments. Please don't close the application.
        </p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center p-6 border rounded-lg border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900">
        <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
        <p className="text-center font-medium text-green-700 dark:text-green-300">Backup Completed Successfully</p>
        <p className="text-center text-muted-foreground mt-2">
          Your data has been backed up successfully at {lastBackupDate}
        </p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center p-6 border rounded-lg border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900">
        <XCircle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-center font-medium text-red-700 dark:text-red-300">Backup Failed</p>
        <p className="text-center text-muted-foreground mt-2">
          There was an error creating your backup. Please try again.
        </p>
      </div>
    );
  }

  return null;
}
