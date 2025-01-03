import { FC } from "react";
import logo from "../../public/images/logo.png";
import Image from "next/image";

interface HeaderProps {
  links: { name: string; url: string }[];
}

const Header: FC<HeaderProps> = ({ links }) => {
  return (
    <header>
      <Image
        src={logo.src}
        alt="Logo"
        height={logo.height}
        width={logo.width}
        className="dragon-logo"
      />
      <nav>
        <ul>
          {links.map((link, index) => (
            <li key={index}>
              <a href={link.url}>{link.name}</a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
