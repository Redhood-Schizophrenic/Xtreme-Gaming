import { useCollection } from "@renderer/hooks/pbCollection";
import GroupsTable from "./components/GroupsTable";
import { Card, CardHeader, CardTitle, CardContent } from "@renderer/components/ui/card";
import { Button } from "@renderer/components/ui/button";
import { Plus } from "lucide-react";
import { useCallback } from "react";

export default function GroupsPage() {
  const { data } = useCollection('groups');
  const handleAdd = useCallback(async () => {
    await window.api.customDialog('group_add_dialog');
  }, []);

  return (
    <section className="p-4">
      <Card className={'w-full'}>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle> Groups </CardTitle>
            <Button className={'flex items-center'} onClick={handleAdd}>
              <p>Add</p>
              <Plus />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <GroupsTable data={data} />
        </CardContent>
      </Card>
    </section>
  )
};
