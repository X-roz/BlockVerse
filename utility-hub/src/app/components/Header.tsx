import { ThemeToggle } from './ThemeToggle';

export interface HeaderProps {
  dropdown?: React.ReactNode;
}

export function Header({ dropdown }: HeaderProps) {
  return (
    <header className="border-b border-background bg-background backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-8 py-4">
        <div className="flex items-center justify-between">

          {/* LEFT: Logo + Brand */}
          <div className="flex items-center gap-4 ml-1">
            {/* <img
              src="/logo/kazex-icon.png"
              alt="KazeX Logo"
              className="h-20 w-auto drop-shadow-sm"
            /> */}

            <div className="flex flex-col leading-tight mt-4"> 
              <span
                className="text-4xl font-semibold tracking-tight text-foreground"
                style={{ fontFamily: 'Kalam' }}
              >
                KazeX
              </span>
          </div>
          </div>
          {/* RIGHT: Dropdown + Theme Toggle */}
          <div className="flex items-center gap-4">
            {dropdown && <div>{dropdown}</div>}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
