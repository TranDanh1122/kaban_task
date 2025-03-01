'use client'
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useDialog } from "@/hooks/use-dialog"
import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus_Jakarta_Sans, Nunito_Sans } from "next/font/google";
import { BookA, Moon, Sun } from "lucide-react"
type Theme = "light" | "dark"
const jakarta = Plus_Jakarta_Sans({
    subsets: ['latin'],
    display: 'swap',
})
const nunito = Nunito_Sans({
    subsets: ['latin'],
    display: 'swap',
    variable: "--font-nunito"
})
interface UI {
    theme: Theme,
    font: string
}
export default function SettingDialog() {
    const { isOpen, dispatch } = useDialog()
    const localUIState = JSON.parse(localStorage.getItem("kanban-task-ui") || "{}")
    const [setting, setUI] = React.useState<UI>(localUIState ?? { theme: "light", font: jakarta.className })
    React.useEffect(() => {
        document.documentElement.classList.toggle("dark", setting.theme == "dark");

        document.documentElement.classList.remove(jakarta.className, nunito.className);
        document.documentElement.classList.add(setting.font);
        
        localStorage.setItem("kanban-task-ui", JSON.stringify(setting))
    }, [setting])

    const changeTheme = (theme: string) => setUI(prev => ({ ...prev, theme: theme as Theme }))
    const changeFont = (font: string) => setUI(prev => ({ ...prev, font: font }))

    return <Dialog onOpenChange={(open) => dispatch({ type: "TOOGLE", payload: { name: "SettingDialog", state: open } })} open={isOpen("SettingDialog")}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle className="font-bold heading-l text-center" >
                    UI Setting
                </DialogTitle>
                <DialogDescription className="text-secondary-100 font-semibold body-l text-center">
                    Warning: UI Setting only effect on your client
                </DialogDescription>
                <Tabs defaultValue="account" className="w-full">
                    <TabsList className="w-full" >
                        <TabsTrigger className="w-1/2" value="theme">Color Theme</TabsTrigger>
                        <TabsTrigger className="w-1/2" value="font">Font</TabsTrigger>
                    </TabsList>
                    <TabsContent value="theme" className="space-y-2">
                        <div onClick={() => changeTheme("light")} className="flex gap-3 items-center p-4 rounded-lg border-2 border-border cursor-pointer" style={{ backgroundColor: `${setting.theme == "light" ? "#E0E4EA" : "inherit"}` }}>
                            <span className="p-3 border-border bg-white dark:bg-secondary-100 rounded-md"><Sun></Sun></span>
                            <div>
                                <h2 className="text-sm font-bold">Light Mode</h2>
                                <span className="text-sm font-medium text-secondary-100">Pick a clean and classic light theme</span>
                            </div>
                        </div>
                        <div onClick={() => changeTheme("dark")} className="flex gap-3 items-center p-4 rounded-lg border-2 border-border cursor-pointer" style={{ backgroundColor: `${setting.theme == "dark" ? "#3E3F4E" : "inherit"}` }}>
                            <span className="p-3 border-border bg-white dark:bg-secondary-100  rounded-md"><Moon></Moon></span>
                            <div>
                                <h2 className="text-sm font-bold ">Dark Mode</h2>
                                <span className="text-sm font-medium text-secondary-100">Select a sleek and modern dark theme</span>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent className="space-y-2" value="font">
                        <div onClick={() => changeFont(nunito.className)} className="flex gap-3 items-center p-4 rounded-lg border-2 border-border cursor-pointer" style={{ backgroundColor: `${setting.font == nunito.className ? "#E0E4EA" : "inherit"}` }}>
                            <span className="p-3 border-border bg-white dark:bg-secondary-100 rounded-md"><BookA></BookA></span>
                            <div>
                                <h2 className="text-sm font-bold"> Nunito</h2>
                                <span className="text-sm font-medium text-secondary-100">Pick a clean and classic font</span>
                            </div>
                        </div>
                        <div onClick={() => changeFont(jakarta.className)} className="flex gap-3 items-center p-4 rounded-lg border-2 border-border cursor-pointer" style={{ backgroundColor: `${setting.font == jakarta.className ? "#E0E4EA" : "inherit"}` }}>
                            <span className="p-3 border-border bg-white dark:bg-secondary-100  rounded-md"><BookA></BookA></span>
                            <div>
                                <h2 className="text-sm font-bold ">Jarkarta</h2>
                                <span className="text-sm font-medium text-secondary-100">Select a sleek and modern font</span>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogHeader>
            <DialogFooter className="flex items-center sm:justify-between">
                <DialogClose asChild><Button className="text-primary-300 bg-primary-100 hover:bg-primary-100 rounded-2xl ml-auto" >Cancel</Button></DialogClose>

            </DialogFooter>
        </DialogContent>

    </Dialog>

}