import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@renderer/components/ui/card";
import { Button } from "@renderer/components/ui/button";
import { Badge } from "@renderer/components/ui/badge";
import { Database, FileDown, RotateCcw } from "lucide-react";
import BackupStatusIndicator from './components/BackupStatusIndicator';
import BackupHistory from './components/BackupHistory';
import BackupService from './api';
import { toast } from 'sonner';

export default function BackupPage() {
  const backupService = BackupService();
  const [backupState, setBackupState] = useState('idle'); // idle, loading, success, error
  const [restoreState, setRestoreState] = useState('idle'); // idle, warning, loading, success, error
  const [lastBackupDate, setLastBackupDate] = useState('Never');
  const [backups, setBackups] = useState([]);

  // Fetch backups on component mount and when dependencies change
  useEffect(() => {
    const fetchBackups = async () => {
      try {
        // Fetch backups from the service
        const backupsList = await backupService.listBackups();
        console.log('Fetched backups:', backupsList);

        // If backupsList is undefined or null, use an empty array
        const safeBackupsList = backupsList || [];

        // Sort backups by date (newest first)
        const sortedBackups = [...safeBackupsList].sort((a, b) =>
          new Date(b.modified) - new Date(a.modified)
        );

        // Update state with sorted backups
        setBackups(sortedBackups);

        // Update last backup date if we have backups
        if (sortedBackups.length > 0) {
          setLastBackupDate(new Date(sortedBackups[0].modified).toLocaleString());
        } else {
          setLastBackupDate('Never');
        }

        console.log('Updated state:', {
          backupsCount: sortedBackups.length,
          lastBackupDate: sortedBackups.length > 0 ? new Date(sortedBackups[0].modified).toLocaleString() : 'Never'
        });
      } catch (error) {
        console.error('Error fetching backups:', error);
        toast.error('Failed to fetch backups');
        setBackups([]);
      }
    };

    fetchBackups();

    // Set up an interval to refresh the backups list every 30 seconds
    const intervalId = setInterval(fetchBackups, 30000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [backupService]);

  const handleBackup = useCallback(async () => {
    setBackupState('loading');

    try {
      // Generate a dynamic backup name in the format [a-z0-9_-].zip
      const timestamp = new Date();
      const formattedDate = timestamp.toISOString().slice(0, 10).replace(/-/g, '');
      const formattedTime = timestamp.toTimeString().slice(0, 8).replace(/:/g, '');
      // Ensure the name only contains allowed characters: a-z, 0-9, _, -
      const backupName = `pb_backup_${formattedDate}_${formattedTime}.zip`.toLowerCase();

      // Create a new backup with the custom name
      const newBackup = await backupService.createBackup(backupName);
      console.log('Created new backup:', newBackup);

      // Refresh the backup list
      const backupsList = await backupService.listBackups();
      console.log('Refreshed backups list:', backupsList);

      // If backupsList is undefined or null, use an empty array
      const safeBackupsList = backupsList || [];

      // Sort backups by date (newest first)
      const sortedBackups = [...safeBackupsList].sort((a, b) =>
        new Date(b.modified) - new Date(a.modified)
      );

      // Update state with sorted backups
      setBackups(sortedBackups);

      // Update last backup date if we have backups
      if (sortedBackups.length > 0) {
        setLastBackupDate(new Date(sortedBackups[0].modified).toLocaleString());
      } else {
        // This shouldn't happen since we just created a backup
        setLastBackupDate(new Date().toLocaleString());
      }

      setBackupState('success');
      toast.success('Backup created successfully');
    } catch (error) {
      console.error('Error creating backup:', error);
      setBackupState('error');
      toast.error('Failed to create backup');
    }
  }, [backupService]);

  const handleRetry = () => {
    setBackupState('idle');
  };

  const handleRestore = useCallback(async (backupKey) => {
    // First show warning state
    if (restoreState === 'idle') {
      // Store the key for later use when user confirms
      if (backupKey) {
        window.selectedBackupKey = backupKey;
      }
      setRestoreState('warning');
      return;
    }

    // If user confirms (clicks through warning), start restore process
    setRestoreState('loading');

    try {
      // Get the backup key from the window object or use the first backup
      const keyToRestore = window.selectedBackupKey || backupKey || backups[0]?.key;

      if (!keyToRestore) {
        throw new Error('No backup selected for restoration');
      }

      // Restore from the selected backup
      await backupService.restoreFromBackup(keyToRestore);
      setRestoreState('success');
      toast.success('System restored successfully');

      // Clear the selected backup key
      window.selectedBackupKey = null;
    } catch (error) {
      console.error('Error restoring backup:', error);
      setRestoreState('error');
      toast.error('Failed to restore system: ' + (error.message || 'Unknown error'));
    }
  }, [backupService, restoreState, backups]);

  const handleRestoreReset = useCallback(() => {
    setRestoreState('idle');
    // Clear the selected backup key
    window.selectedBackupKey = null;
  }, [backupService]);

  const handleDeleteBackup = useCallback(async (backupKey) => {
    if (!backupKey) return;

    try {
      await backupService.deleteBackup(backupKey);

      // Refresh the backup list
      const backupsList = await backupService.listBackups();
      console.log('Refreshed backups list after delete:', backupsList);

      // If backupsList is undefined or null, use an empty array
      const safeBackupsList = backupsList || [];

      // Sort backups by date (newest first)
      const sortedBackups = [...safeBackupsList].sort((a, b) =>
        new Date(b.modified) - new Date(a.modified)
      );

      // Update state with sorted backups
      setBackups(sortedBackups);

      // Update last backup date if we have backups
      if (sortedBackups.length > 0) {
        setLastBackupDate(new Date(sortedBackups[0].modified).toLocaleString());
      } else {
        setLastBackupDate('Never');
      }

      toast.success('Backup deleted successfully');
    } catch (error) {
      console.error('Error deleting backup:', error);
      toast.error('Failed to delete backup');
    }
  }, [backupService]);

  return (
    <section className="p-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Backup Management</h1>
        <p className="text-muted-foreground">Create and manage backups of your system data</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Backup Status Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Backup Status</CardTitle>
              <Badge variant={lastBackupDate === 'Never' ? 'outline' : 'default'}>
                {lastBackupDate === 'Never' ? 'No Backups' : 'Backed Up'}
              </Badge>
            </div>
            <CardDescription>
              Last backup: {lastBackupDate}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <BackupStatusIndicator status={backupState} lastBackupDate={lastBackupDate} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            {backupState === 'idle' && (
              <Button className="w-full" onClick={handleBackup}>
                <Database className="mr-2 h-4 w-4" />
                Create Backup
              </Button>
            )}

            {backupState === 'loading' && (
              <Button className="w-full" disabled>
                <div className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin mr-2"></div>
                Creating Backup...
              </Button>
            )}

            {backupState === 'success' && (
              <div className="w-full flex gap-4">
                <Button className="flex-1" variant="outline" onClick={handleRetry}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  New Backup
                </Button>
                <Button className="flex-1">
                  <FileDown className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            )}

            {backupState === 'error' && (
              <Button className="w-full" onClick={handleRetry}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Backup History Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Backup History</CardTitle>
                <CardDescription>
                  View and restore previous backups
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Manually refresh backups
                  const fetchBackups = async () => {
                    try {
                      const backupsList = await backupService.listBackups();
                      const safeBackupsList = backupsList || [];
                      const sortedBackups = [...safeBackupsList].sort((a, b) =>
                        new Date(b.modified) - new Date(a.modified)
                      );
                      setBackups(sortedBackups);

                      if (sortedBackups.length > 0) {
                        setLastBackupDate(new Date(sortedBackups[0].modified).toLocaleString());
                      } else {
                        setLastBackupDate('Never');
                      }
                      toast.success('Backup list refreshed');
                    } catch (error) {
                      console.error('Error refreshing backups:', error);
                      toast.error('Failed to refresh backups');
                    }
                  };
                  fetchBackups();
                }}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Debug info */}
            <div className="mb-4 p-2 bg-muted/20 rounded text-xs">
              <p>{backups ? backups.length : 0} backups available</p>
              <p>Last backup: {lastBackupDate}</p>
            </div>

            <BackupHistory
              backups={backups}
              lastBackupDate={lastBackupDate}
              onDelete={handleDeleteBackup}
              onRestore={handleRestore}
            />
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled={lastBackupDate === 'Never'}>
              Manage Backups
            </Button>
          </CardFooter>
        </Card>
      </div>

    </section>
  );
}
