import { useEffect, useState } from "react"
import { Switch } from "./ui/switch"
import { Label } from "./ui/label"
import { useRouter, usePathname } from "next/navigation"

export default function Navbar(){
    const [isEnglish, setIsEnglish] = useState(true)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        // Détecter la langue actuelle basée sur l'URL
        if(pathname) {
            setIsEnglish(!pathname.startsWith('/fr'))
        }
    }, [pathname])
    
    const toggleLanguage = () => {
        const newIsEnglish = !isEnglish
        setIsEnglish(newIsEnglish)
        
        if (newIsEnglish){
            router.replace(`/en`)

        } else {
            router.replace(`/fr`)
        }
    }
    
    return(
        <div className="w-screen h-10 glass fixed flex items-center px-4 justify-between">
            <div className="flex-1">
                {/* Logo ou titre */}
            </div>
            
            <div className="flex items-center gap-2">
                <Label htmlFor="language-switch" className="text-sm font-medium">
                    {isEnglish ? 'EN' : 'FR'}
                </Label>
                <Switch 
                    id="language-switch"
                    checked={isEnglish}
                    onCheckedChange={toggleLanguage}
                    className=""
                />
            </div>
        </div>
    )
}