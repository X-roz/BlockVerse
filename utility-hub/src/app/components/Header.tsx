export interface HeaderProps {
  dropdown?: React.ReactNode;
}

export function Header({ dropdown }: HeaderProps) {
  return (
    <header className="border-b border-[#4e8e8e]/40 bg-gradient-to-r from-[#b8e0e6] via-[#4e8e8e] to-[#183a3a] shadow-lg backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Avatar for branding */}
            {/* <Avatar src="/logo.svg" alt="KazeX" /> */}
            <h1 className="text-4xl font-extrabold tracking-tight text-[#000000] drop-shadow-lg">KazeX Utility Hub</h1>
            {/* <Badge variant="outline" className="ml-2 text-[#4e8e8e] border-[#4e8e8e]">v1.0</Badge> */}
          </div>
          {dropdown && (
            <div>{dropdown}</div>
          )}
        </div>
      </div>
    </header>
  );
}
