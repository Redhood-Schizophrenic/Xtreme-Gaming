import { Button } from "@renderer/components/ui/button";
import { Download, HardDrive, Database, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function BackupHistory({ backups = [], lastBackupDate, onDelete, onRestore }) {
  console.log('BackupHistory component received:', { backups, lastBackupDate });
  if (lastBackupDate === 'Never' || !backups || backups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 border rounded-lg border-dashed">
        <HardDrive className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-center text-muted-foreground">
          No backup history available. Create your first backup to see it here.
        </p>
      </div>
    );
  }

  // Format file size to human-readable format
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format backup name to be more user-friendly
  const formatBackupName = (key) => {
    // Remove the prefix and extension
    const nameWithoutPrefix = key.replace('pb_backup_', '').replace('.zip', '');

    // Try to extract date and time parts
    const parts = nameWithoutPrefix.split('_');
    if (parts.length >= 2) {
      // If we have a date part (YYYYMMDD) and time part (HHMMSS)
      const datePart = parts[0];
      const timePart = parts[1];

      if (datePart.length === 8 && timePart.length === 6) {
        // Format as YYYY-MM-DD HH:MM:SS
        const year = datePart.substring(0, 4);
        const month = datePart.substring(4, 6);
        const day = datePart.substring(6, 8);

        const hour = timePart.substring(0, 2);
        const minute = timePart.substring(2, 4);
        const second = timePart.substring(4, 6);

        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
      }
    }

    // Fallback to the original name without prefix and extension
    return nameWithoutPrefix;
  };

  // Make sure backups is an array
  const safeBackups = Array.isArray(backups) ? backups : [];

  // Log the backups for debugging
  console.log('BackupHistory rendering with:', {
    safeBackups,
    count: safeBackups.length,
    firstBackup: safeBackups.length > 0 ? safeBackups[0] : null
  });

  return (
    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
      {safeBackups.map((backup, index) => (
        <div key={backup.key} className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center">
            <Database className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
            <div className="overflow-hidden">
              <p className="font-medium truncate" title={backup.key}>
                {formatBackupName(backup.key)}
              </p>
              <div className="flex text-xs text-muted-foreground gap-2">
                <span>{formatDistanceToNow(new Date(backup.modified), { addSuffix: true })}</span>
                <span>•</span>
                <span>{formatFileSize(backup.size)}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete && onDelete(backup.key)}
              title="Delete backup"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRestore && onRestore(backup.key)}
              title="Restore from this backup"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
