/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserPreferences } from '../types/game';
import { soundManager } from '../game/engine/sound';
import { storageService } from '../game/persistence/storage';
import {
  Volume2,
  VolumeX,
  Sliders,
  Eye,
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  Check,
  User,
} from 'lucide-react';

interface SettingsScreenProps {
  preferences: UserPreferences;
  onUpdatePreferences: (updates: Partial<UserPreferences>) => void;
  onResetAllData: () => void;
  onBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  preferences,
  onUpdatePreferences,
  onResetAllData,
  onBack,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [exportJson, setExportJson] = useState<string | null>(null);
  const [importInput, setImportInput] = useState<string>('');
  const [showImportArea, setShowImportArea] = useState<boolean>(false);

  const handleVolumeChange = (newVol: number) => {
    onUpdatePreferences({ soundVolume: newVol });
    soundManager.setVolume(newVol);
    soundManager.playUiClick();
  };

  const handleToggleSound = () => {
    const nextState = !preferences.soundEnabled;
    onUpdatePreferences({ soundEnabled: nextState });
    soundManager.setEnabled(nextState);
    if (nextState) soundManager.playUiClick();
  };

  const handleExportBackup = () => {
    const json = storageService.exportBackup();
    setExportJson(json);
  };

  const handleImportBackup = () => {
    if (!importInput.trim()) return;
    const res = storageService.importBackup(importInput);
    if (res.success) {
      setImportStatus('¡Respaldo importado con éxito! Recargando datos...');
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    } else {
      setImportStatus(`Error: ${res.error || 'Archivo inválido'}`);
    }
  };

  const handleConfirmReset = () => {
    onResetAllData();
    setShowResetConfirm(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black font-display text-white">Configuración del Sistema</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Parámetros de audio, accesibilidad y administración de datos locales
          </p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="text-xs font-medium px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
        >
          Volver
        </button>
      </div>

      <div className="space-y-6">
        {/* Player Profile & Identity */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <h2 className="text-base font-bold text-white font-display mb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-cyan-400" />
            <span>Perfil de Piloto</span>
          </h2>
          <div className="max-w-md">
            <label className="text-xs text-slate-400 mb-1.5 block">Nombre del Jugador</label>
            <input
              type="text"
              maxLength={24}
              value={preferences.playerName}
              onChange={(e) => onUpdatePreferences({ playerName: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Audio Settings */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <h2 className="text-base font-bold text-white font-display mb-4 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Efectos de Audio y Síntesis</span>
          </h2>

          <div className="space-y-4 max-w-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">Efectos Sonoros Espaciales</p>
                <p className="text-xs text-slate-400">Sonidos de volteo, acordes armónicos y alertas</p>
              </div>
              <button
                type="button"
                onClick={handleToggleSound}
                className={`p-2.5 rounded-xl border transition-colors ${
                  preferences.soundEnabled
                    ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400'
                    : 'bg-slate-800 border-slate-700 text-slate-500'
                }`}
              >
                {preferences.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
            </div>

            {preferences.soundEnabled && (
              <div className="pt-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                  <span>Volumen Maestro</span>
                  <span>{Math.round(preferences.soundVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={preferences.soundVolume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
              </div>
            )}
          </div>
        </div>

        {/* Accessibility Settings */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <h2 className="text-base font-bold text-white font-display mb-4 flex items-center gap-2">
            <Eye className="w-4 h-4 text-indigo-400" />
            <span>Accesibilidad Visual y Rendimiento</span>
          </h2>

          <div className="space-y-4 max-w-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">Modo de Movimiento Reducido</p>
                <p className="text-xs text-slate-400">Minimiza animaciones de cartas y partículas de estrellas</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.reducedMotion}
                onChange={(e) => onUpdatePreferences({ reducedMotion: e.target.checked })}
                className="w-5 h-5 accent-cyan-500 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <div>
                <p className="text-sm font-semibold text-white">Alto Contraste</p>
                <p className="text-xs text-slate-400">Refuerza bordes e indicadores para facilitar la visión</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.highContrast}
                onChange={(e) => onUpdatePreferences({ highContrast: e.target.checked })}
                className="w-5 h-5 accent-cyan-500 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Data Management & Backup */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <h2 className="text-base font-bold text-white font-display mb-2 flex items-center gap-2">
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Respaldo y Portabilidad de Datos</span>
          </h2>
          <p className="text-xs text-slate-400 mb-4">
            Los datos se almacenan exclusivamente en este navegador. Puedes exportar o importar tu progreso cuando lo desees.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleExportBackup}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Exportar Respaldo JSON</span>
            </button>

            <button
              type="button"
              onClick={() => setShowImportArea(!showImportArea)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <Upload className="w-4 h-4 text-cyan-400" />
              <span>Importar Respaldo</span>
            </button>
          </div>

          {/* Export JSON Modal / Box */}
          {exportJson && (
            <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
              <div className="flex items-center justify-between mb-2">
                <span className="text-emerald-400 font-bold">Copia tu código de respaldo:</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(exportJson);
                    alert('¡Copiado al portapapeles!');
                  }}
                  className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-white hover:bg-slate-700"
                >
                  Copiar Todo
                </button>
              </div>
              <textarea
                readOnly
                rows={4}
                value={exportJson}
                className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-slate-300 text-[11px]"
              />
            </div>
          )}

          {/* Import Textarea Area */}
          {showImportArea && (
            <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
              <label className="text-slate-300 mb-1 block">Pega aquí el texto JSON de respaldo:</label>
              <textarea
                rows={4}
                value={importInput}
                onChange={(e) => setImportInput(e.target.value)}
                placeholder='{"version": 1, ...}'
                className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-slate-300 text-[11px] mb-2"
              />
              <button
                type="button"
                onClick={handleImportBackup}
                className="px-4 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs"
              >
                Validar e Importar
              </button>
              {importStatus && <p className="mt-2 text-xs text-amber-300">{importStatus}</p>}
            </div>
          )}
        </div>

        {/* Danger Zone: Reset */}
        <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-900/40">
          <h2 className="text-base font-bold text-rose-300 font-display mb-1 flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-rose-400" />
            <span>Zona de Reinicio</span>
          </h2>
          <p className="text-xs text-rose-400/80 mb-3">
            Borra todas las estadísticas, estrellas, niveles desbloqueados y récords de este dispositivo.
          </p>

          {showResetConfirm ? (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/50 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
              <div className="flex items-center gap-2 text-xs text-rose-200">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                <span>¿Estás seguro? Esta acción es irreversible.</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReset}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs hover:bg-rose-500"
                >
                  Sí, Borrar Todo
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="px-4 py-2 rounded-xl bg-rose-900/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 text-xs font-semibold transition-colors"
            >
              Reiniciar Todo el Progreso
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
