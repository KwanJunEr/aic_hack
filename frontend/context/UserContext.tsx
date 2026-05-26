"use client";

import {
    createContext, 
    useContext, 
    useEffect, 
    useState
} from "react"

import { useRouter } from "next/navigation";


export type User = {
  id: string
  email: string
  full_name: string

  phone_number?: string

  organization?: string
  position?: string
  department?: string
  region?: string
  territory?: string

  is_active: boolean
  created_at?: string
}

type UserContextType = {
    user: User | null
    isLoading: boolean
}

const UserContext = createContext<UserContextType>({
    user: null, 
    isLoading: true, 
})

export const UserProvider = ({
    children,
}:{children : React.ReactNode}) =>{
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(()=>{
        const fetchUser = async ()=>{
            try{
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
                    {
                        credentials:"include"
                    }
                )

                if (response.status === 401){
                    router.push("/sign-in")
                    return
                }

                const data = await response.json()
                setUser(data)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }catch(error: any){
                router.push("/sign-in")
            }finally{
                setIsLoading(false)
            }
        }
        fetchUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    return(
         <UserContext.Provider
      value={{
        user,
        isLoading,
      }}
    >
      {children}
    </UserContext.Provider>
    )

}

export const useCurrentUser = () => {
  return useContext(UserContext)
}