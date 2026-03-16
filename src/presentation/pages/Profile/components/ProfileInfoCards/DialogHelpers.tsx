export function LoadingRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="gv-profile-dialog-games-loading">
      <i className="pi pi-spin pi-spinner" />
      {children}
    </div>
  );
}

export function ErrorText({ message }: { message: string }) {
  return <p className="gv-profile-dialog-games-error">{message}</p>;
}

export function EmptyMessage({ children }: { children: React.ReactNode }) {
  return <p className="gv-profile-dialog-games-error">{children}</p>;
}

