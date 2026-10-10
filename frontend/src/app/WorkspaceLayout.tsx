import type { ReactNode } from "react";

// Future teacher/student routes supply these slots after real authorization.
// This component does not infer a role, establish a session, or grant access.
export function WorkspaceLayout({
  title,
  navigation,
  actions,
  children,
}: {
  title: string;
  navigation: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="workspace">
      <nav aria-label="Workspace">{navigation}</nav>
      <section>
        <header className="workspace-heading">
          <h1>{title}</h1>
          {actions}
        </header>
        {children}
      </section>
    </div>
  );
}
