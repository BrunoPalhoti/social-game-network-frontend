import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import type { JourneyGame, JourneyStatus } from "@/data/types/journey";
import type { RawgGame } from "@/shared/api/rawgApi";
import { isZeradoStatus } from "../../utils";
import { useJourneyGameForm } from "./hooks/useJourneyGameForm";

const STATUS_OPTIONS: { label: string; value: JourneyStatus }[] = [
  { label: "Em missão (jogando)", value: "PLAYING" },
  { label: "Missão concluída (zerado)", value: "COMPLETED" },
  { label: "Missão abortada (dropado)", value: "DROPPED" },
  { label: "Quero jogar (desejado)", value: "WISHLIST" },
];

const PLATFORM_OPTIONS = [
  "PC",
  "PlayStation 5",
  "PlayStation 4",
  "Xbox Series X|S",
  "Xbox One",
  "Nintendo Switch",
  "Steam Deck",
  "Mobile",
  "Outro",
];

export interface JourneyGameFormValues {
  rawgGame: RawgGame | null;
  name: string;
  startedAt: string;
  completedAt: string;
  droppedAt: string;
  hoursPlayed: number | null;
  rating?: number | null;
  notes?: string;
  droppedReason?: string;
  status: JourneyStatus;
  /** Plataforma em que jogou (ex.: PlayStation 5). */
  platform?: string;
  /** Preenchido ao selecionar jogo da RAWG. */
  genres?: string[];
  /** Para jogos desejados: data de lançamento (ISO YYYY-MM-DD). */
  releaseDate?: string;
  /** Para jogos desejados: indica se já há demo jogável. */
  hasDemo?: boolean;
}

export interface JourneyGameFormModalProps {
  visible: boolean;
  onHide: () => void;
  initialGame?: JourneyGame | null;
  year: number;
  onSave: (values: JourneyGameFormValues) => void;
  /** Quando true (ex.: ao abrir pela aba Jogos Zerados), só exibe os dados, sem permitir edição. */
  readOnly?: boolean;
}

const DEBOUNCE_MS = 350;

function normalizeHours(v: number | null | undefined): number | null {
  if (v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

export function JourneyGameFormModal({
  visible,
  onHide,
  initialGame,
  year: _year,
  onSave,
  readOnly = false,
}: JourneyGameFormModalProps) {
  const {
    form,
    setForm,
    searchQuery,
    setSearchQuery,
    games,
    gamesLoading,
    gamesError,
    touched,
    saveValidationError,
    completedAtRequired,
    hoursRequired,
    onSelectGame,
    handleStatusChange,
    handleSave,
    formIsZerado,
    formIsDropped,
    canSave,
    PLATFORM_OPTIONS,
    readOnly: readOnlyState,
    setSaveValidationError,
    setUserHasTypedSearch,
  } = useJourneyGameForm({ visible, initialGame, readOnly, onSave, onHide });
  const formIsWishlist = form.status === "WISHLIST";

  return (
    <Dialog
      header={
        readOnly
          ? "Ver jogo da jornada"
          : initialGame
          ? "Editar jogo da jornada"
          : "Adicionar jogo à jornada"
      }
      visible={visible}
      onHide={onHide}
      className="gv-journey-form-dialog"
      style={{ width: "min(95vw, 600px)" }}
      footer={
        <div
          className="gv-journey-form-dialog-footer"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {readOnly ? (
            <Button type="button" label="Fechar" onClick={onHide} />
          ) : (
            <>
              <Button type="button" label="Cancelar" severity="secondary" onClick={onHide} />
              <Button type="button" label="Salvar missão" onClick={handleSave} disabled={!canSave} />
            </>
          )}
        </div>
      }
    >
      <div className="gv-journey-form-fields">
        {!readOnly && saveValidationError && (
          <p className="gv-journey-form-error gv-journey-form-error-block gv-journey-form-field gv-journey-form-field--full">
            Preencha todos os campos obrigatórios antes de salvar.
          </p>
        )}

        <div className="gv-journey-form-field gv-journey-form-field--full">
          <label className="gv-journey-form-label" htmlFor="journey-game-search">
            {readOnlyState ? "Nome do jogo" : "Nome do jogo (busque na RAWG)"}
          </label>
          <InputText
            id="journey-game-search"
            value={searchQuery}
            onChange={(e) => {
              if (readOnlyState) return;
              const value = e.target.value;
              setUserHasTypedSearch(true);
              setSearchQuery(value);
              setForm((prev) => ({ ...prev, name: value }));
              setSaveValidationError(false);
            }}
            placeholder={readOnlyState ? "" : "Procure seu jogo aqui..."}
            className="gv-journey-form-input w-full"
            readOnly={readOnlyState}
            disabled={readOnlyState}
          />
        </div>

        {!readOnlyState && (
          <div className="gv-journey-form-field gv-journey-form-field--full">
            {gamesLoading && (
              <p className="gv-journey-form-hint">
                <i className="pi pi-spin pi-spinner" /> Buscando...
              </p>
            )}
            {gamesError && <p className="gv-journey-form-error">{gamesError}</p>}
            {!gamesLoading && !gamesError && games.length > 0 && (
              <div className="gv-journey-form-games-list">
                {games.map((game) => (
                  <button
                    key={game.id}
                    type="button"
                    className="gv-journey-form-game-item"
                    onClick={() => onSelectGame(game)}
                  >
                    {game.background_image ? (
                      <img
                        src={game.background_image}
                        alt=""
                        className="gv-journey-form-game-img"
                      />
                    ) : (
                      <div className="gv-journey-form-game-img gv-journey-form-game-placeholder" />
                    )}
                    <span className="gv-journey-form-game-name">{game.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {!formIsWishlist && (
          <div className="gv-journey-form-field">
            <label className="gv-journey-form-label" htmlFor="journey-started-at">
              Quando começou a jogar? *
            </label>
            <input
              id="journey-started-at"
              type="date"
              value={form.startedAt}
              onChange={(e) => {
                if (readOnlyState) return;
                setSaveValidationError(false);
                setForm((prev) => ({ ...prev, startedAt: e.target.value }));
              }}
              className="gv-journey-form-input p-inputtext p-component w-full"
              readOnly={readOnlyState}
              disabled={readOnlyState}
            />
          </div>
        )}

        {!formIsDropped && !formIsWishlist && (
          <div className="gv-journey-form-field">
            <label className="gv-journey-form-label" htmlFor="journey-completed-at">
              Quando zerou o jogo? {!readOnly && completedAtRequired && "*"}
            </label>
            <input
              id="journey-completed-at"
              type="date"
              value={form.completedAt}
              onChange={(e) => {
                if (readOnlyState) return;
                setSaveValidationError(false);
                setForm((prev) => ({ ...prev, completedAt: e.target.value }));
              }}
              className="gv-journey-form-input p-inputtext p-component w-full"
              readOnly={readOnlyState}
              disabled={readOnlyState}
            />
            {completedAtRequired && touched && !form.completedAt && (
              <p className="gv-journey-form-error">Informe a data que zerou o jogo.</p>
            )}
          </div>
        )}

        {formIsDropped && (
          <div className="gv-journey-form-field">
            <label className="gv-journey-form-label" htmlFor="journey-dropped-at">
              Quando dropou o jogo? *
            </label>
            <input
              id="journey-dropped-at"
              type="date"
              value={form.droppedAt}
              onChange={(e) => {
                if (readOnlyState) return;
                setSaveValidationError(false);
                setForm((prev) => ({ ...prev, droppedAt: e.target.value }));
              }}
              className="gv-journey-form-input p-inputtext p-component w-full"
              readOnly={readOnlyState}
              disabled={readOnlyState}
            />
            {touched && !form.droppedAt && (
              <p className="gv-journey-form-error">Informe a data em que dropou o jogo.</p>
            )}
          </div>
        )}

        <div className="gv-journey-form-field">
          <label className="gv-journey-form-label" htmlFor="journey-status">
            Status da missão
          </label>
          <select
            id="journey-status"
            value={form.status}
            onChange={(e) =>
              !readOnlyState && handleStatusChange(e.target.value as JourneyStatus)
            }
            className="gv-journey-form-input p-inputtext p-component w-full"
            disabled={readOnlyState}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="gv-journey-form-field">
          <label className="gv-journey-form-label" htmlFor="journey-platform">
            Onde você jogou?
          </label>
          <select
            id="journey-platform"
            value={form.platform ?? ""}
            onChange={(e) => {
              if (readOnlyState) return;
              setSaveValidationError(false);
              setForm((prev) => ({ ...prev, platform: e.target.value || undefined }));
            }}
            className="gv-journey-form-input p-inputtext p-component w-full"
            disabled={readOnlyState}
          >
            <option value="">Selecione a plataforma</option>
            {PLATFORM_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {formIsWishlist && (
          <>
            <div className="gv-journey-form-field">
              <label className="gv-journey-form-label" htmlFor="journey-release-date">
                Data de lançamento do jogo
              </label>
              <input
                id="journey-release-date"
                type="date"
                value={form.releaseDate ?? ""}
                onChange={(e) => {
                  if (readOnlyState) return;
                  setSaveValidationError(false);
                  setForm((prev) => ({ ...prev, releaseDate: e.target.value || undefined }));
                }}
                className="gv-journey-form-input p-inputtext p-component w-full"
                readOnly={readOnlyState}
                disabled={readOnlyState}
              />
            </div>
            <div className="gv-journey-form-field">
              <label className="gv-journey-form-label" htmlFor="journey-has-demo">
                Já tem demo jogável?
              </label>
              <select
                id="journey-has-demo"
                value={form.hasDemo ? "yes" : "no"}
                onChange={(e) => {
                  if (readOnlyState) return;
                  setSaveValidationError(false);
                  setForm((prev) => ({ ...prev, hasDemo: e.target.value === "yes" }));
                }}
                className="gv-journey-form-input p-inputtext p-component w-full"
                disabled={readOnlyState}
              >
                <option value="no">Ainda não</option>
                <option value="yes">Sim, já tem demo</option>
              </select>
            </div>
          </>
        )}

        {formIsZerado && (
          <>
            <div className="gv-journey-form-field">
              <label className="gv-journey-form-label" htmlFor="journey-hours">
                Quanto tempo de gameplay até zerar? {!readOnly && hoursRequired && "*"}
              </label>
              <InputNumber
                id="journey-hours"
                value={form.hoursPlayed ?? undefined}
                onValueChange={(e) => {
                  if (readOnlyState) return;
                  setSaveValidationError(false);
                  const v = e?.value ?? e;
                  setForm((prev) => ({ ...prev, hoursPlayed: normalizeHours(typeof v === "number" ? v : null) }));
                }}
                min={0}
                placeholder={readOnlyState ? "" : "Ex: 25h"}
                className="gv-journey-form-input w-full"
                readOnly={readOnlyState}
                disabled={readOnlyState}
              />
              {hoursRequired && touched && (form.hoursPlayed == null || form.hoursPlayed < 0) && (
                <p className="gv-journey-form-error">Informe as horas jogadas.</p>
              )}
            </div>

            <div className="gv-journey-form-field">
              <label className="gv-journey-form-label" htmlFor="journey-rating">
                Sua nota (0 a 10)
              </label>
              <InputNumber
                id="journey-rating"
                value={form.rating ?? undefined}
                onValueChange={(e) => {
                  if (readOnlyState) return;
                  setSaveValidationError(false);
                  const v = e?.value ?? e;
                  let normalized: number | null = null;
                  if (typeof v === "number" && Number.isFinite(v)) {
                    const clamped = Math.max(0, Math.min(10, v));
                    normalized = clamped;
                  }
                  setForm((prev) => ({ ...prev, rating: normalized }));
                }}
                min={0}
                max={10}
                step={0.5}
                placeholder={readOnlyState ? "" : "Ex: 8.5"}
                className="gv-journey-form-input w-full"
                readOnly={readOnlyState}
                disabled={readOnlyState}
              />
            </div>

            <div className="gv-journey-form-field gv-journey-form-field--full">
              <label className="gv-journey-form-label" htmlFor="journey-notes">
                Comentário / review rápida (até 200 caracteres)
              </label>
              <textarea
                id="journey-notes"
                value={form.notes ?? ""}
                onChange={(e) => {
                  if (readOnlyState) return;
                  const value = e.target.value.slice(0, 200);
                  setSaveValidationError(false);
                  setForm((prev) => ({ ...prev, notes: value }));
                }}
                maxLength={200}
                className="gv-journey-form-input p-inputtext p-component w-full gv-journey-form-textarea"
                readOnly={readOnly}
                disabled={readOnly}
              />
              {!readOnly && (
                <p className="gv-journey-form-hint">
                  {`${(form.notes ?? "").length}/200 caracteres`}
                </p>
              )}
            </div>
          </>
        )}

        {formIsDropped && (
          <div className="gv-journey-form-field gv-journey-form-field--full">
            <label className="gv-journey-form-label" htmlFor="journey-dropped-reason">
              Motivo de ter dropado (até 200 caracteres) *
            </label>
            <textarea
              id="journey-dropped-reason"
              value={form.droppedReason ?? ""}
              onChange={(e) => {
                if (readOnlyState) return;
                const value = e.target.value.slice(0, 200);
                setSaveValidationError(false);
                setForm((prev) => ({ ...prev, droppedReason: value }));
              }}
              maxLength={200}
              className="gv-journey-form-input p-inputtext p-component w-full gv-journey-form-textarea"
              readOnly={readOnly}
              disabled={readOnly}
            />
            {!readOnly && (
              <p className="gv-journey-form-hint">
                {`${(form.droppedReason ?? "").length}/200 caracteres`}
              </p>
            )}
          </div>
        )}
      </div>
    </Dialog>
  );
}
