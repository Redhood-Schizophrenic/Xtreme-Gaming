import pb from '@renderer/api/pocketbase'

export default function BackupService() {

  const credentials = {
    email: 'admin.xtreme@gmail.com',
    password: 'Xtreme@123'
  }

  const authorize = async () => {
    try {
      await pb.collection("_superusers").authWithPassword(credentials.email, credentials.password);
    } catch (error) {
      console.log(error);
    }
  };

  const listBackups = async () => {
    try {
      await authorize();
      console.log('PB Auth:', pb.authStore.isValid, pb.authStore.token);

      // Get real backups from PocketBase
      const backups = await pb.backups.getFullList();
      console.log('Raw backups from PB:', backups);
      return backups || [];
    } catch (error) {
      console.error('Error listing backups:', error);
      // Return an empty array instead of undefined
      return [];
    }
  };

  const createBackup = async (backupName) => {
    try {
      await authorize();

      // Use provided backup name or generate a default one
      let filename = backupName;

      if (!filename) {
        // Generate a name in the format [a-z0-9_-].zip
        const timestamp = new Date();
        const formattedDate = timestamp.toISOString().slice(0, 10).replace(/-/g, '');
        const formattedTime = timestamp.toTimeString().slice(0, 8).replace(/:/g, '');
        filename = `pb_backup_${formattedDate}_${formattedTime}.zip`.toLowerCase();
      }

      // Validate that the filename only contains allowed characters
      if (!/^[a-z0-9_-]+\.zip$/.test(filename)) {
        throw new Error('Backup name must only contain lowercase letters, numbers, underscores, and hyphens, with a .zip extension');
      }

      // Create a real backup using PocketBase
      console.log('Creating backup with filename:', filename);
      return await pb.backups.create(filename);
    } catch (error) {
      console.log(error);
      throw error; // Re-throw to allow handling in the UI
    }
  };

  const deleteBackup = async (file_path) => {
    try {
      await authorize();
      console.log('Deleting backup:', file_path);

      // Delete the backup using PocketBase
      return await pb.backups.delete(file_path);
    } catch (error) {
      console.error('Error deleting backup:', error);
      throw error; // Re-throw to allow handling in the UI
    }
  };

  const restoreFromBackup = async (file_path) => {
    try {
      await authorize();
      console.log('Restoring from backup:', file_path);

      // Restore from backup using PocketBase
      return await pb.backups.restore(file_path);
    } catch (error) {
      console.error('Error restoring backup:', error);
      throw error; // Re-throw to allow handling in the UI
    }
  };

  return {
    listBackups,
    createBackup,
    deleteBackup,
    restoreFromBackup,
  }
}

