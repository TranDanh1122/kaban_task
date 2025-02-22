'use client'
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Oauth from "./Oauth"
import { toast } from "sonner"
import { signIn, useSession } from "next-auth/react"
import React from "react"
import { useRouter } from "next/navigation"
const formSchema = z.object({
  email: z.string().min(2, {
    message: "Email is too short",
  }).email({ message: "Invalid email" }),
  password: z.string().min(6, {
    message: "Password is too short",
  })
})

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  })
  const { data: session, status } = useSession()
  const router = useRouter()
  React.useEffect(() => {
    if (status == "unauthenticated" ) return        
    router.push("/")
  }, [session, status, router])
  const [loading, isLoading] = React.useState<boolean>(false)
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      isLoading(true)
      const result = await signIn("credentials", { redirect: false,  ...data})
      
      if (!result?.ok) {
        toast.error("Wrong email or password", {
          style: { color: "red" }
        })
      }
    } catch (error: any) {
      toast.error(`Credentials user error ${error.message}`, {
        style: { color: "red" }
      })
    } finally {
      isLoading(false)
    }
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome To My App</CardTitle>
          <CardDescription>
            Join with your GitHub/X Account
          </CardDescription>
        </CardHeader>
        <CardContent>

          <div className="grid gap-6">
            <div className="flex flex-col gap-4">
              <Oauth />
            </div>
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">
                Or just text some information here
              </span>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="trandanh14042000@gmail.com" {...field} />
                      </FormControl>
                      <FormMessage className="font-semibold text-accent-200" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage className="font-semibold text-accent-200" />
                    </FormItem>
                  )}
                />
                <Button disabled={loading} className="flex mx-auto" type="submit">
                  {!loading && "Login"}
                  {loading && <div className="w-5 h-5 border-white border-t-2 border-r-2 rounded-full animate-spin"></div>}
                </Button>
              </form>
            </Form>
            <div className="text-center text-sm">
              Not have an account?
              <Link href="/register" className="underline underline-offset-4">
                Register
              </Link>
            </div>
          </div>

        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>
        and <a href="#">Privacy Policy</a>.
      </div>
    </div >
  )
}
