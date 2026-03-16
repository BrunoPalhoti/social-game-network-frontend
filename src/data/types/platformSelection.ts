/**
 * Tipo para uma plataforma exibida no perfil (nome + logo).
 * Usado no card PLATAFORMAS e persistido no store/auth como array.
 */

export interface PlatformSelection {
  name: string;
  imageUrl: string | null;
}
