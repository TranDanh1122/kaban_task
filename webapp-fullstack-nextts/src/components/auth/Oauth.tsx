'use client'
import React from "react"
import { Github, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"
import { toast } from "sonner"

const Oauth = React.memo((): React.JSX.Element => {
    const handleGit = async () => {
        try {
            await signIn("github")
        } catch (error) {
            console.log(error);
            toast("Error when try to login with github")
        }

    }
    return <>
        <Button onClick={handleGit} variant="outline" className="w-full">
            <Github width={24} className="text-black font-bold border-border border-2 size-six block p-1 max-w-none max-h-none rounded-full"></Github>
            Login with Github
        </Button>
        {/* Im not own debit card, cant register this
        <Button onClick={handleGoogle} variant="outline" className="w-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                />
            </svg>
            Login with Google
        </Button> */}
        <Button onClick={() => signIn("twitter")} variant="outline" className="w-full">
            <Twitter width={24} className="text-black font-bold border-border border-2 size-six block p-1 max-w-none max-h-none rounded-full"></Twitter>
            Login with Twitter
        </Button>
    </>
})
Oauth.displayName = "Oauth"
export default Oauth