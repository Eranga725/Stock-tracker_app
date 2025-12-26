import Link from "next/link"
import Image from "next/image"
import Navitems from "./NavItems"
import { UserDropdown } from "./UserDropdown"

const Header = ({user}:{user:User}) => {
  return (
    <header className="sticky top-0 header">
      <div className="container header-wrapper">
        <Link href="/"><Image src="/public/public/assets/images/icons8-user-100.png" alt="Signalist logo" width={140} height={32} className="h-8 w-auto cursor-pointer"/></Link>
        <nav className="hidden sm:block">
          <Navitems/>
        </nav>
          <UserDropdown user={user}/>
      </div>
    </header>
  )
}

export default Header