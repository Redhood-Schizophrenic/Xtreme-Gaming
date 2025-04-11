import { Button } from "@renderer/components/ui/button";
import { Upload, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export default function RestoreSection({ status, onRestore, onReset }) {
  if (status === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center p-6 border rounded-lg border-dashed">
        <Upload className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-center font-medium mb-2">Restore from Backup</p>
        <p className="text-center text-muted-foreground mb-4">
          Upload a backup file to restore your system to a previous state.
        </p>
        <Button onClick={onRestore} className="w-full sm:w-auto">
          <Upload className="mr-2 h-4 w-4" />
          Select Backup File
        </Button>
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center p-6 border rounded-lg">
        <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
        <p className="text-center font-medium">Restoring from backup...</p>
        <p className="text-center text-muted-foreground mt-2 mb-4">
          This may take a few moments. Please don't close the application.
        </p>
        <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
          <div className="bg-primary h-full animate-pulse" style={{ width: '60%' }}></div>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center p-6 border rounded-lg border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900">
        <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
        <p className="text-center font-medium text-green-700 dark:text-green-300">Restore Completed Successfully</p>
        <p className="text-center text-muted-foreground mt-2 mb-4">
          Your system has been successfully restored from the backup.
        </p>
        <Button onClick={onReset} variant="outline" className="w-full sm:w-auto">
          Done
        </Button>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center p-6 border rounded-lg border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900">
        <XCircle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-center font-medium text-red-700 dark:text-red-300">Restore Failed</p>
        <p className="text-center text-muted-foreground mt-2 mb-4">
          There was an error restoring your system. Please try again or use a different backup file.
        </p>
        <div className="flex gap-4 w-full sm:w-auto">
          <Button onClick={onReset} variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button onClick={onRestore} className="flex-1">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (status === 'warning') {
    return (
      <div className="flex flex-col items-center justify-center p-6 border rounded-lg border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-900">
        <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
        <p className="text-center font-medium text-yellow-700 dark:text-yellow-300">Warning: Data Will Be Overwritten</p>
        <p className="text-center text-muted-foreground mt-2 mb-4">
          Restoring from a backup will overwrite your current data. This action cannot be undone.
        </p>
        <div className="flex gap-4 w-full">
          <Button onClick={onReset} variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button onClick={onRestore} variant="destructive" className="flex-1">
            Proceed Anyway
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
