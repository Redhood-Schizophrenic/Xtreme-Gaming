import { Button } from '@renderer/components/ui/button'
import { SettingsList } from '@renderer/lib/data/Settings'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@renderer/components/ui/card"

export default function SettingsPage() {
  return (
    <section className='p-10 grid grid-cols-3 gap-6'>
      {
        SettingsList.map((setting, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className={'flex items-center justify-between'}>
                <p>{setting.title}</p>
                <setting.icon className='w-6 h-6' />
              </CardTitle>
              <CardDescription>{setting.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <a href={setting.href} className='w-full'>
                <Button className={'w-full'}>
                  Visit
                </Button>
              </a>
            </CardContent>
          </Card>
        ))
      }</section>
  )
};
