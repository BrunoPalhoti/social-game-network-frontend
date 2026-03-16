import { useState, useEffect, useCallback } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { fetchGames } from "@/shared/api/rawgApi";
import type { RawgGame } from "@/shared/api/rawgApi";
import type { JourneyGame, JourneyStatus } from "@/data/types/journey";
import { isZeradoStatus } from "../../utils";

const STATUS_OPTIONS: { label: string; value: JourneyStatus }[] = [
  { label: "Em missão (jogando)", value: "PLAYING" },
  { label: "Missão concluída (zerado)", value: "COMPLETED" },
  { label: "Missão abortada (dropado)", value: "DROPPED" },
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
  hoursPlayed: number | null;
  rating?: number | null;
  notes?: string;
  status: JourneyStatus;
  /** Plataforma em que jogou (ex.: PlayStation 5). */
  platform?: string;
  /** Preenchido ao selecionar jogo da RAWG. */
  genres?: string[];
}

const emptyForm: JourneyGameFormValues = {
  rawgGame: null,
  name: "",
  startedAt: "",
  completedAt: "",
  hoursPlayed: null,
  rating: null,
  notes: "",
  status: "PLAYING",
  platform: "",
};

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

export function JourneyGameFormModal({
  visible,
  onHide,
  initialGame,
  year: _year,
  onSave,
  readOnly = false,
}: JourneyGameFormModalProps) {
  const [form, setForm] = useState<JourneyGameFormValues>(emptyForm);
  const [searchQuery, setSearchQuery] = useState("");
  const [games, setGames] = useState<RawgGame[]>([]);
  const [gamesLoading, setGamesLoading] = useState(false);
  const [gamesError, setGamesError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const [saveValidationError, setSaveValidationError] = useState(false);

  const completedAtRequired = isZeradoStatus(form.status);
  const hoursRequired = completedAtRequired;

  const normalizeHours = (v: number | null | undefined): number | null => {
    if (v == null) return null;
    const n = Number(v);
    return Number.isFinite(n) && n >= 0 ? n : null;
  };

  useEffect(() => {
    if (!visible) return;
    if (initialGame) {
      setForm({
        rawgGame: null,
        name: initialGame.name,
        startedAt: initialGame.startedAt ?? "",
        completedAt: initialGame.completedAt ?? "",
        hoursPlayed: normalizeHours(initialGame.hoursPlayed),
        rating: initialGame.rating ?? null,
        notes: initialGame.notes ?? "",
        status: initialGame.status,
        platform: initialGame.platform ?? "",
      });
      setSearchQuery(initialGame.name);
    } else {
      setForm({ ...emptyForm, startedAt: new Date().toISOString().slice(0, 10) });
      setSearchQuery("");
    }
    setGames([]);
    setGamesError(null);
    setTouched(false);
    setSaveValidationError(false);
  }, [visible, initialGame]);

  useEffect(() => {
    if (!visible || readOnly || !searchQuery.trim()) {
      setGames([]);
      return;
    }
    const t = setTimeout(() => {
      setGamesLoading(true);
      setGamesError(null);
      fetchGames({ search: searchQuery.trim(), page_size: 10 })
        .then((r) => setGames(r.results ?? []))
        .catch((e) => {
          setGamesError(e instanceof Error ? e.message : "Erro ao buscar jogos");
        })
        .finally(() => setGamesLoading(false));
    }, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [visible, readOnly, searchQuery]);

  const onSelectGame = useCallback((rawg: RawgGame) => {
    setSaveValidationError(false);
    setForm((prev) => ({
      ...prev,
      rawgGame: rawg,
      name: rawg.name,
      genres: rawg.genres?.map((g) => g.name) ?? [],
    }));
    setSearchQuery(rawg.name);
    setGames([]);
  }, []);

  const handleSave = useCallback(() => {
    setTouched(true);
    setSaveValidationError(false);
    const zerado = isZeradoStatus(form.status);
    const payload: JourneyGameFormValues = {
      ...form,
      completedAt: zerado && !form.completedAt && form.startedAt ? form.startedAt : form.completedAt,
      hoursPlayed: zerado && (form.hoursPlayed == null || form.hoursPlayed < 0) ? 0 : form.hoursPlayed,
    };
    if (!payload.name.trim()) {
      setSaveValidationError(true);
      return;
    }
    if (!payload.startedAt) {
      setSaveValidationError(true);
      return;
    }
    if (zerado && !payload.completedAt) {
      setSaveValidationError(true);
      return;
    }
    if (zerado && (payload.hoursPlayed == null || payload.hoursPlayed < 0)) {
      setSaveValidationError(true);
      return;
    }
    onSave(payload);
    onHide();
  }, [form, onSave, onHide]);

  const handleStatusChange = (status: JourneyStatus) => {
    setSaveValidationError(false);
    setForm((prev) => {
      const next = { ...prev, status };
      if (isZeradoStatus(status)) {
        if (!next.completedAt && next.startedAt) next.completedAt = next.startedAt;
        if (next.hoursPlayed == null) next.hoursPlayed = 0;
      }
      return next;
    });
  };

  const formIsZerado = isZeradoStatus(form.status);
  const canSave =
    form.name.trim() !== "" &&
    form.startedAt !== "" &&
    (!formIsZerado || !!((form.completedAt || form.startedAt) && (form.hoursPlayed == null || form.hoursPlayed >= 0)));

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
            {readOnly ? "Nome do jogo" : "Nome do jogo (busque na RAWG)"}
          </label>
          <InputText
            id="journey-game-search"
            value={searchQuery}
            onChange={(e) => {
              if (readOnly) return;
              const value = e.target.value;
              setSearchQuery(value);
              setForm((prev) => ({ ...prev, name: value }));
              setSaveValidationError(false);
            }}
            placeholder={readOnly ? "" : "Procure seu jogo aqui..."}
            className="gv-journey-form-input w-full"
            readOnly={readOnly}
            disabled={readOnly}
          />
        </div>

        {!readOnly && (
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

        <div className="gv-journey-form-field">
          <label className="gv-journey-form-label" htmlFor="journey-started-at">
            Quando começou a jogar? *
          </label>
          <input
            id="journey-started-at"
            type="date"
            value={form.startedAt}
            onChange={(e) => {
              if (readOnly) return;
              setSaveValidationError(false);
              setForm((prev) => ({ ...prev, startedAt: e.target.value }));
            }}
            className="gv-journey-form-input p-inputtext p-component w-full"
            readOnly={readOnly}
            disabled={readOnly}
          />
        </div>

        <div className="gv-journey-form-field">
          <label className="gv-journey-form-label" htmlFor="journey-completed-at">
            Quando zerou o jogo? {!readOnly && completedAtRequired && "*"}
          </label>
          <input
            id="journey-completed-at"
            type="date"
            value={form.completedAt}
            onChange={(e) => {
              if (readOnly) return;
              setSaveValidationError(false);
              setForm((prev) => ({ ...prev, completedAt: e.target.value }));
            }}
            className="gv-journey-form-input p-inputtext p-component w-full"
            readOnly={readOnly}
            disabled={readOnly}
          />
          {completedAtRequired && touched && !form.completedAt && (
            <p className="gv-journey-form-error">Informe a data que zerou o jogo.</p>
          )}
        </div>

        <div className="gv-journey-form-field">
          <label className="gv-journey-form-label" htmlFor="journey-status">
            Status da missão
          </label>
          <select
            id="journey-status"
            value={form.status}
            onChange={(e) => !readOnly && handleStatusChange(e.target.value as JourneyStatus)}
            className="gv-journey-form-input p-inputtext p-component w-full"
            disabled={readOnly}
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
              if (readOnly) return;
              setSaveValidationError(false);
              setForm((prev) => ({ ...prev, platform: e.target.value || undefined }));
            }}
            className="gv-journey-form-input p-inputtext p-component w-full"
            disabled={readOnly}
          >
            <option value="">Selecione a plataforma</option>
            {PLATFORM_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

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
                  if (readOnly) return;
                  setSaveValidationError(false);
                  const v = e?.value ?? e;
                  setForm((prev) => ({ ...prev, hoursPlayed: normalizeHours(typeof v === "number" ? v : null) }));
                }}
                min={0}
                placeholder={readOnly ? "" : "Ex: 25h"}
                className="gv-journey-form-input w-full"
                readOnly={readOnly}
                disabled={readOnly}
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
                  if (readOnly) return;
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
                placeholder={readOnly ? "" : "Ex: 8.5"}
                className="gv-journey-form-input w-full"
                readOnly={readOnly}
                disabled={readOnly}
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
                  if (readOnly) return;
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
      </div>
    </Dialog>
  );
}
