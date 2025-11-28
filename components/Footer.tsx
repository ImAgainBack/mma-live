import Link from 'next/link';

const footerLinks = {
  navigation: [
    { name: 'Accueil', href: '/' },
    { name: 'Calendrier', href: '/calendrier' },
    { name: 'Organisations', href: '/organisations' },
  ],
  organizations: [
    { name: 'UFC', href: '/organisations#ufc' },
    { name: 'Bellator', href: '/organisations#bellator' },
    { name: 'ONE Championship', href: '/organisations#one-championship' },
    { name: 'PFL', href: '/organisations#pfl' },
  ],
  legal: [
    { name: 'Mentions légales', href: '/mentions-legales' },
    { name: 'Politique de confidentialité', href: '/confidentialite' },
    { name: 'Contact', href: '/contact' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-zinc-900 border-t border-zinc-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🥊</span>
              <span className="font-bold text-xl text-white">
                MMA<span className="text-red-500">Live</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-zinc-500">
              Tous les combats MMA en direct, au même endroit. Horaires, liens de diffusion légaux et alertes personnalisées.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Navigation</h3>
            <ul className="space-y-2">
              {footerLinks.navigation.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-500 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Organizations */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Organisations</h3>
            <ul className="space-y-2">
              {footerLinks.organizations.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-500 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Légal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-500 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} MMA Live. Tous droits réservés.
          </p>
          <p className="text-xs text-zinc-600">
            Ce site référence uniquement des liens de diffusion légaux.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
