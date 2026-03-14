import { Header } from "@/presentation/pages/Profile/components/Header";
import { ProfileHero } from "@/presentation/pages/Profile/components/ProfileHero";
import { ProfileInfoCards } from "@/presentation/pages/Profile/components/ProfileInfoCards";
import { ProfileTabs } from "@/presentation/pages/Profile/components/ProfileTabs";
export default function Profile() {
  return (
    <>
      <Header />
      <ProfileHero>
        <ProfileInfoCards />

        <ProfileTabs />
      </ProfileHero>
      <section className="gv-page-content gv-profile-content" />
    </>
  );
}
