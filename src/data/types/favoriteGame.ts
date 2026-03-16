/**
 * Tipo para o jogo favorito exibido no perfil (nome + capa da RAWG).
 * Usado no card GAME FAVORITO e persistido no store/auth.
 */

export interface FavoriteGameSelection {
  name: string;
  cover: string | null;
}
