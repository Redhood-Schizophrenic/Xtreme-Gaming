import { Button } from "@renderer/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@renderer/components/ui/card"
import { Input } from "@renderer/components/ui/input"
import { Label } from "@renderer/components/ui/label"
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@renderer/contexts/AuthContext";
import { useNavigate } from "react-router";

export default function Login() {
  const { login, error } = useAuth();
  const router = useNavigate();

  const [displayPassword, setDisplayPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.username || !formData.password) {
        toast.warning('Please fill all the fields')
      }
      const response = await login(formData.username, formData.password);
      console.log('Login', response);
      await window.api.notify('Success', 'Login successfully!!!');
      router('/');
    } catch (e) {
      await window.api.notify('Error', error);
    } finally {
      await window.api.customDialogClose();
      setFormData({
        ...formData,
        username: '',
        email: '',
        password: '',
        passwordConfirm: '',
      });
    }
  }



  return (
    <main className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <section className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className='grid gap-4 pt-10'>
              <div className="space-y-4">
                <Label>Username</Label>
                <Input
                  type='text'
                  value={formData.username}
                  onChange={(e) => setFormData({
                    ...formData,
                    username: e.target.value,
                  })}
                  placeholder='eg; John Doe'
                  required
                />
              </div>
              <div className="space-y-4">
                <Label>Password</Label>
                <div className='flex items-center gap-2 border px-2 rounded-lg'>
                  <Input
                    type={displayPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({
                      ...formData,
                      password: e.target.value,
                    })}
                    placeholder='********'
                    minLength={8}
                    className='border-none focus:ring-0'
                  />
                  {
                    displayPassword ?
                      <EyeOff onClick={() => setDisplayPassword(false)} className="cursor-pointer" />
                      : <Eye onClick={() => setDisplayPassword(true)} className="cursor-pointer" />
                  }
                </div>
              </div>
              <div className="pt-2 w-full">
                <Button
                  type='submit'
                  className='w-full'
                  onClick={onSubmit}
                >
                  Login
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}

