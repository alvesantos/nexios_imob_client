import { Logo } from '@/components/Logo';

const ANO = new Date().getFullYear();

export function LoginHero() {
  return (
    <aside className="relative hidden flex-col justify-between overflow-hidden bg-ink-950 p-12 text-white lg:flex">
      {/* Brilho verde no canto superior esquerdo — a "luz" da marca. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_65%_at_18%_-5%,rgba(158,230,43,0.18),transparent_60%)]"
      />

      <div className="relative">
        <Logo />
      </div>

      <div className="relative max-w-md">
        <h1 className="text-4xl leading-tight font-bold tracking-tight text-balance">
          CRM imobiliário com inteligência artificial.
        </h1>
        <p className="mt-5 text-sm leading-relaxed text-ink-300">
          Centralize clientes, imóveis e negociações num só lugar — com match automático entre
          perfil e portfólio.
        </p>
      </div>

      <p className="relative text-xs text-ink-500">
        © {ANO} Nexios Imob · plataforma multi-imobiliária
      </p>
    </aside>
  );
}
