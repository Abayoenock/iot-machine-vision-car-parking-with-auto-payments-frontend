import DotLarge from "@/components/loaders/dotLoaders/large"
import useFetch from "@/hooks/useFetch"
import React, { createContext, useState, ReactNode, ReactElement } from "react"

// Define the user type
interface User {
  _id: string
  email: string
  phone: string
  firstname: string
  lastname: string
  role: number
  isverified: boolean
  isBlocked: boolean
  createdAt: string
  updatedAt: string
  __v: number
}

// Create a Context for the user
interface UserContextType {
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
}

const UserContext = createContext<UserContextType | null>(null)

interface UserProviderProps {
  children: ReactNode
}

const UserProvider = ({ children }: UserProviderProps): ReactElement => {
  const [user, setUser] = useState<User | null>(null)
  const { data, loading, error } = useFetch<any>(`/api/auth/user`, true)

  // Update user state when data is fetched
  React.useEffect(() => {
    if (data) {
      setUser(data?.data)
      console.log(data)
    }
  }, [data])

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {loading && (
        <div className=" w-full h-screen flex justify-center items-center ">
          <DotLarge />
        </div>
      )}
      {error && <>{error}</>}
      {data && !loading && children}
    </UserContext.Provider>
  )
}

export { UserContext, UserProvider }
