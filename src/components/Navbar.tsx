import Link from "next/link";

export default function Navbar() {
  return (
    <nav>
      <ul style={{ display: "flex", gap: "1rem", listStyle: "none" }}>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/players">Players</Link>
        </li>
        <li>
          <Link href="/matches">Matches</Link>
        </li>
        <li>
          <Link href="/about">About</Link>
        </li>
        <li>
          <Link href="/contact">Contact</Link>
        </li>
      </ul>
    </nav>
  );
}
