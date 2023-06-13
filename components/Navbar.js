import Link from 'next/link'

export default function Navbar(){
    return (
        <nav>
            <ul className="nav-container">
                <li><Link href='/'><h2>Blog</h2></Link></li>
                <li><Link href='/aboutme'><h2>About me</h2></Link></li>
            </ul>
        </nav>
    )
}