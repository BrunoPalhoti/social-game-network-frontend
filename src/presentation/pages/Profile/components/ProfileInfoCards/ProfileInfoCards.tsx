import { InfoCard } from "@/presentation/components/InfoCard";
import { getMockUserProfile, useAuthStore } from "@/shared/store/useAuthStore";

export function ProfileInfoCards() {
  const { user } = useAuthStore();
  const mockProfile = getMockUserProfile(user?.username);

  return (
    <div className="gv-profile-info-cards">
      <InfoCard
        label="GAME FAVORITO:"
        value={user?.favoriteGame ?? mockProfile.favoriteGame ?? "Em breve"}
        icon="pi pi-heart"
      />
      <InfoCard
        label="PLATAFORMAS:"
        value={user?.platform ?? mockProfile.platform ?? "Em breve"}
        icon="pi pi-desktop"
      />
      <InfoCard
        label="GÊNERO FAVORITO:"
        value="Em breve"
        icon="pi pi-star"
      />
    </div>
  );
}
