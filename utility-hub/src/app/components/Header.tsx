import { ThemeToggle } from './ThemeToggle';

export interface HeaderProps {
  dropdown?: React.ReactNode;
}

export function Header({ dropdown }: HeaderProps) {
  return (
    <header className="border-b border-background bg-background backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Avatar for branding */}
            {/* <Avatar src="/logo.svg" alt="KazeX" /> */}
            <h1 className="text-4xl tracking-tight text-foreground drop-shadow-lg" style={{ fontFamily: 'Zalando Sans Expanded, Arial, sans-serif' }}>KazeX</h1>
            {/* <Badge variant="outline" className="ml-2 text-btn-primary border-btn-primary">v1.0</Badge> */}
          </div>
          <div className="flex items-center gap-4">
            {dropdown && <div>{dropdown}</div>}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}


