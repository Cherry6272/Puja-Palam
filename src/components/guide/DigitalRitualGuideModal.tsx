'use client';

import React, { useState } from 'react';
import { useDataStore } from '@/hooks/useDataStore';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Globe, 
  ShieldCheck, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const DigitalRitualGuideModal: React.FC = () => {
  const { products: SAMAGRI_PRODUCTS, rituals: RITUALS_DATA, festivals: FESTIVALS_DATA, isLoading } = useDataStore();

  const [selectedRitualId, setSelectedRitualId] = useState(RITUALS_DATA[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'timeline' | 'checklist' | 'audio'>('timeline');
  const [selectedLang, setSelectedLang] = useState<'English' | 'Kannada' | 'Tamil' | 'Telugu' | 'Hindi'>('English');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const ritual = RITUALS_DATA.find((r) => r.id === selectedRitualId) || RITUALS_DATA[0];

  React.useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (isPlayingAudio) {
        const utterance = new SpeechSynthesisUtterance("Om Namo Bhagavate Satyanarayanaya Namaha. Om Namo Bhagavate Satyanarayanaya Namaha. Om Namo Bhagavate Satyanarayanaya Namaha.");
        utterance.lang = 'hi-IN'; // Indian Hindi voice for better Sanskrit-like pronunciation
        utterance.rate = 0.8;
        utterance.pitch = 0.9;
        utterance.onend = () => setIsPlayingAudio(false);
        window.speechSynthesis.cancel(); // Cancel any ongoing speech
        window.speechSynthesis.speak(utterance);
      } else {
        window.speechSynthesis.cancel();
      }
    }
  }, [isPlayingAudio]);

  React.useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  React.useEffect(() => {
    if (!isLoading && RITUALS_DATA.length > 0 && !selectedRitualId) {
      setSelectedRitualId(RITUALS_DATA[0].id);
    }
  }, [isLoading, RITUALS_DATA, selectedRitualId]);

  if (isLoading || !ritual) {
    return (
      <div className="bg-white rounded-3xl border border-sandalwood-200 shadow-temple overflow-hidden flex items-center justify-center py-32">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-8 h-8 border-4 border-brass-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-temple-600">Loading Digital Guide...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-sandalwood-200 shadow-temple overflow-hidden">
      {/* Top Header */}
      <div className="bg-temple-900 px-6 sm:px-10 py-6 text-sandalwood-100 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brass-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-brass-500 text-temple-900">
              QR Companion Active
            </span>
            <span className="text-xs text-brass-300">
              Scan-to-Prepare Digital Guide
            </span>
          </div>
          <h2 className="font-serif-title text-2xl font-bold text-sandalwood-50 mt-1">
            {ritual.name} Preparation Guide
          </h2>
          <p className="text-xs text-sandalwood-300">
            {ritual.idealTime} • Duration: {ritual.typicalDuration}
          </p>
        </div>

        {/* Language Selection Bar */}
        <div className="flex items-center space-x-1 p-1 bg-temple-800/80 rounded-xl border border-brass-700/50 self-start md:self-auto">
          <Globe className="w-3.5 h-3.5 text-brass-400 ml-2 mr-1" />
          {(['English', 'Kannada', 'Tamil', 'Telugu', 'Hindi'] as const).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setSelectedLang(lang)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                selectedLang === lang
                  ? 'bg-brass-500 text-temple-950 font-bold'
                  : 'text-sandalwood-300 hover:text-white'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center border-b border-sandalwood-200 px-6 sm:px-10 bg-sandalwood-50">
        <button
          type="button"
          onClick={() => setActiveTab('timeline')}
          className={`py-4 text-xs font-bold uppercase tracking-wider border-b-2 mr-8 transition-colors ${
            activeTab === 'timeline'
              ? 'border-brass-600 text-brass-800'
              : 'border-transparent text-temple-500 hover:text-temple-900'
          }`}
        >
          Preparation Timeline
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('checklist')}
          className={`py-4 text-xs font-bold uppercase tracking-wider border-b-2 mr-8 transition-colors ${
            activeTab === 'checklist'
              ? 'border-brass-600 text-brass-800'
              : 'border-transparent text-temple-500 hover:text-temple-900'
          }`}
        >
          Box Checklist & Missing Detector
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('audio')}
          className={`py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
            activeTab === 'audio'
              ? 'border-brass-600 text-brass-800'
              : 'border-transparent text-temple-500 hover:text-temple-900'
          }`}
        >
          Audio Mantra & Dhyana
        </button>
      </div>

      {/* Tab 1: Preparation Timeline */}
      {activeTab === 'timeline' && (
        <div className="p-6 sm:p-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {ritual.prepTimeline.map((step, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-sandalwood-50/70 border border-sandalwood-200 space-y-3 relative"
              >
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-brass-200 text-brass-900 font-bold text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-brass-800">
                    {step.timing}
                  </span>
                </div>

                <h4 className="font-serif-title text-base font-bold text-temple-900">
                  {step.title}
                </h4>

                <ul className="space-y-2 text-xs text-temple-700">
                  {step.instructions.map((inst, i) => (
                    <li key={i} className="flex items-start space-x-1.5">
                      <span className="text-brass-600 mt-0.5">•</span>
                      <span>{inst}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-2 border-t border-sandalwood-200 text-[11px] text-temple-500">
                  <strong>Items needed:</strong> {step.itemsNeeded.join(', ')}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-brass-50 border border-brass-200 text-xs text-temple-700 flex items-start space-x-3">
            <ShieldCheck className="w-5 h-5 text-brass-600 flex-shrink-0 mt-0.5" />
            <p>
              This guide provides preparation and procedural assistance. The actual Vedic Sankalpa, Katha recitation, and Arghya ceremonies are led by your family purohit or pandit.
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Box Checklist & Missing Detector */}
      {activeTab === 'checklist' && (
        <div className="p-6 sm:p-10 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-title text-xl font-bold text-temple-900">
              Verified Packaging Manifest
            </h3>
            <span className="text-xs text-tulsi-700 font-bold bg-tulsi-100 px-3 py-1 rounded-full">
              All 15 Canonical Items Included
            </span>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
            {ritual.baseRequiredItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl bg-sandalwood-50 border border-sandalwood-200 text-xs"
              >
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-tulsi-600" />
                  <div>
                    <span className="font-semibold text-temple-900">{item.name}</span>
                    <span className="text-[11px] text-temple-500 block">
                      Box 0{item.boxNumber} • {item.purpose}
                    </span>
                  </div>
                </div>
                <span className="font-bold text-temple-800">
                  {item.quantity} {item.unit}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Audio Mantra & Dhyana Preview */}
      {activeTab === 'audio' && (
        <div className="p-6 sm:p-10 space-y-6">
          <div className="max-w-xl mx-auto bg-gradient-to-br from-temple-900 via-temple-800 to-temple-900 rounded-3xl p-8 text-sandalwood-100 border border-brass-600/40 text-center space-y-5 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-brass-500/20 border border-brass-400/40 flex items-center justify-center mx-auto text-brass-300">
              <Volume2 className={`w-8 h-8 ${isPlayingAudio ? 'animate-pulse' : ''}`} />
            </div>

            <div>
              <span className="text-xs uppercase font-bold text-brass-400 tracking-widest">
                Consecrated Audio Guide
              </span>
              <h3 className="font-serif-title text-2xl font-bold text-sandalwood-50 mt-1">
                {ritual.mantraAudioSnippet?.title || 'Sri Satyanarayana Moola Mantra'}
              </h3>
              <p className="text-xs text-sandalwood-300 mt-1">
                Chanted in traditional Ghana / Jata Vedic cadence • Duration: {ritual.mantraAudioSnippet?.duration || '04:18'}
              </p>
            </div>

            {/* Play/Pause Button */}
            <div className="pt-2 flex items-center justify-center space-x-4">
              <button
                type="button"
                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                className="px-6 py-3 rounded-full bg-brass-500 hover:bg-brass-600 text-temple-950 font-bold text-xs flex items-center space-x-2 shadow-brass transition-all"
              >
                {isPlayingAudio ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Pause Chanting</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Listen to Pronunciation</span>
                  </>
                )}
              </button>
            </div>

            {isPlayingAudio && (
              <p className="text-xs text-brass-300 italic animate-pulse">
                &ldquo;Om Namo Bhagavate Satyanarayanaya Namaha...&rdquo;
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
