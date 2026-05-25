import type { ReactNode } from "react";

interface AuthLayoutProps{
    children: ReactNode;
}

export default function AuthLayout({
    children
}: AuthLayoutProps){
    return(
        <div className="min-h-screen flex items-center justify-center px-4 py-10">
            {children}
        </div>
    )
}