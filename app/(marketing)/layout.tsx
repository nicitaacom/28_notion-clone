import { Navbar } from "./_components/Navbar";

export default function MarketingLayout ({children}:{children:React.ReactNode}) {
return ( 
  <div className="h-full">
    <Navbar/>
    <main className="h-full pt-40">
      {children}
    </main>
  </div>
    
)
}