import { getInitialsFromName, useAuthStore } from "@/shared/store/useAuthStore";
import { Avatar } from "primereact/avatar";
import { Tag } from "primereact/tag";

interface ProfileHeroProps {
  children?: React.ReactNode;
}

export function ProfileHero({ children }: ProfileHeroProps) {
  const user = useAuthStore((s) => s.user);

  return (
    <section className="gv-profile-hero">
      <div className="gv-profile-banner" />

      <div className="gv-profile-avatar-wrap">
        <div className="gv-profile-avatar-container">
          <Avatar
            label={user ? getInitialsFromName(user.name) : "?"}
            size="xlarge"
            shape="circle"
            className="gv-profile-avatar"
          />
          <Tag value="PRO" severity="secondary" className="gv-profile-badge" />
        </div>
      </div>

      <div className="gv-profile-info">
        <p className="gv-profile-name">{user?.name ?? "..."}</p>
        <h1 className="gv-profile-username">@{user?.nickname ?? "..."}</h1>
      </div>

      {children && (
        <>
          <div className="gv-profile-hero-divider" aria-hidden />
          {children}
        </>
      )}
    </section>
  );
}
