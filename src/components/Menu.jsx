const items = [
  { label: 'ABOUT', href: '#about' },
  { label: 'WORK', href: '#work' },
  { label: 'MORE', href: '#more' },
  { label: 'CONTACT', href: '#contact' }
];

function Menu() {
  return (
    <nav className="menu" aria-label="Section navigation">
      <div className="menu__inner">
        {items.map((item) => (
          <a key={item.href} className="menu__link" href={item.href}>
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

export default Menu;
