import { Label } from "@renderer/components/ui/label";
import { Button } from "@renderer/components/ui/button";
import { useState, useEffect } from 'react';
import { useCollection } from '@renderer/hooks/pbCollection';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@renderer/components/ui/select';
import { useParams } from 'react-router-dom';
import pb from '@renderer/api/pocketbase';

export default function UpdateDeviceStatus() {
  const { device_id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    status: 'Available'
  });
  const [statusUpdate, setStatusUpdate] = useState({
    newStatus: '',
  });

  const { data: Devices, updateItem } = useCollection('devices');
  const { createItem: createLog } = useCollection('device_logs');

  useEffect(() => {
    const loadDeviceData = async () => {
      try {
        setIsLoading(true);
        const deviceInfo = Devices.find((device) => device.id === device_id)
        if (deviceInfo) {
          setFormData({
            status: deviceInfo.status || 'Available'
          });
          setStatusUpdate({
            ...statusUpdate,
            newStatus: deviceInfo.status || 'Available',
          })

        }
      } catch (error) {
        console.error("Error loading device:", error);
        await window.api.notify('Error', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (device_id) {
      loadDeviceData();
    }
  }, [device_id, Devices]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Update the device status
      await updateItem(device_id, { status: statusUpdate.newStatus });

      // Create a log entry
      await createLog({
        device: device_id,
        status: statusUpdate.newStatus,
        user: pb.authStore?.request?.id || pb.authStore?.model?.id || 'system',
        details: `Status changed: ${formData.status} → ${statusUpdate.newStatus}`,
      });

      await window.api.notify('Success', 'Device status updated successfully!');
      await window.api.customDialogClose();
    } catch (error) {
      console.error("Error updating device:", error);
      await window.api.notify('Error', 'Error updating device status, please try again later.');
    } finally {
      setIsLoading(false);
    }
  }

  const handleClose = async () => {
    await window.api.customDialogClose();
  }

  return (
    <section className='p-10'>
      <h1 className='text-2xl font-bold'>Update Device Status</h1>
      <form className='grid gap-4 mt-10'>
        <div className="space-y-4">
          <Label>Change Status to</Label>
          <Select
            value={statusUpdate.newStatus}
            onValueChange={(value) => setStatusUpdate({ newStatus: value })}
          >
            <SelectTrigger className={'w-full'}>
              <SelectValue placeholder="Device Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='Maintainence'>Maintainence</SelectItem>
              <SelectItem value='Damaged'>Damaged</SelectItem>
              <SelectItem value='Lost'>Lost</SelectItem>
              <SelectItem value='Available'>Available</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="pt-2 w-full flex items-center gap-2">
          <Button
            variant={'secondary'}
            type='button'
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            disabled={statusUpdate.newStatus === formData.status || isLoading}
            type='submit'
            onClick={onSubmit}
          >
            {isLoading ? 'Updating...' : 'Update Device Status'}
          </Button>
        </div>
      </form>
    </section>
  )
}

