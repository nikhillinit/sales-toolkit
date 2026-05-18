/**
 * Home — Unified Signal OS
 * Main app shell. Mobile-first: bottom nav, sticky header, safe-area aware.
 * On desktop (>768px): full-viewport layout via DesktopShell with a sidebar nav.
 */
import AppHeader from '@/components/AppHeader';
import BottomNav from '@/components/BottomNav';
import { DesktopShell } from '@/components/DesktopShell';
import DraftBanner from '@/components/DraftBanner';
import Toast from '@/components/Toast';
import { useUiActions, useUiState, type StepId } from '@/contexts/AppState';
import { BookOpen, CalendarDays, Compass, Handshake, Library, MessageSquare, Search, Settings2, Zap, type LucideIcon } from 'lucide-react';
import { lazy, Suspense, useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import Activate from './steps/Activate';
import FollowUp from './steps/FollowUp';
import Prepare from './steps/Prepare';
import Qualify from './steps/Qualify';
import Report from './steps/Report';

type SecondaryTab = 'os' | 'manual' | 'scanner' | 'lane' | 'network' | 'roleplay' | 'story' | 'cadence' | 'settings';

const ClaimScanner = lazy(() => import('./ClaimScanner'));
const FieldManual = lazy(() => import('./FieldManual'));
const LaneSelector = lazy(() => import('./LaneSelector'));
const NetworkTracker = lazy(() => import('./NetworkTracker'));
const RoleplaySimulator = lazy(() => import('./RoleplaySimulator'));
const StoryCardBuilder = lazy(() => import('./StoryCardBuilder'));
const WeeklyCadencePlanner = lazy(() => import('./WeeklyCadencePlanner'));
const SettingsPage = lazy(() => import('./Settings'));

const STEP_IDS: StepId[] = ['prepare', 'qualify', 'activate', 'followup', 'report'];

const SECONDARY_TABS: { id: SecondaryTab; label: string; Icon: LucideIcon; path: string }[] = [
  { id: 'os',      label: 'Sales OS',     Icon: Zap,      path: '/os/prepare' },
  { id: 'manual',  label: 'Field Manual', Icon: BookOpen, path: '/manual' },
  { id: 'scanner', label: 'Claim Check',  Icon: Search,   path: '/scanner' },
  { id: 'lane',    label: 'Lane Plan',    Icon: Compass,  path: '/lane' },
  { id: 'network',  label: 'Network Log', Icon: Handshake, path: '/network' },
  { id: 'roleplay', label: 'Roleplay',     Icon: MessageSquare, path: '/roleplay' },
  { id: 'story',    label: 'Story Vault',  Icon: Library,       path: '/story' },
  { id: 'cadence',  label: 'War Plan',     Icon: CalendarDays,  path: '/cadence' },
  { id: 'settings', label: 'Settings',     Icon: Settings2,     path: '/settings' },
];

function isSecondaryTab(value: string | undefined): value is SecondaryTab {
  return value === 'os' || value === 'manual' || value === 'scanner' || value === 'lane' || value === 'network' || value === 'roleplay' || value === 'story' || value === 'cadence' || value === 'settings';
}

function isStepId(value: string | undefined): value is StepId {
  return STEP_IDS.includes(value as StepId);
}

function parseRoute(path: string): { activeTab: SecondaryTab; activeStep: StepId } {
  const [section, step] = path.replace(/^\/+/, '').split('/');
  if (section === 'os') {
    return { activeTab: 'os', activeStep: isStepId(step) ? step : 'prepare' };
  }
  return { activeTab: isSecondaryTab(section) ? section : 'os', activeStep: 'prepare' };
}

function SectionLoading() {
  return (
    <div style={{ padding: '18px', fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#4A5159' }}>
      Loading section...
    </div>
  );
}

function AppShell() {
  const [location, setLocation] = useLocation();
  const { currentStep } = useUiState();
  const { switchStep } = useUiActions();
  const { activeTab, activeStep } = parseRoute(location);

  useEffect(() => {
    if (activeTab === 'os' && currentStep !== activeStep) {
      switchStep(activeStep);
    }
  }, [activeStep, activeTab, currentStep, switchStep]);

  useEffect(() => {
    if (location === '/os' || (activeTab === 'os' && !isStepId(location.split('/')[2]))) {
      setLocation('/os/prepare');
    }
  }, [activeTab, location, setLocation]);

  const renderStep = () => {
    switch (activeStep) {
      case 'prepare':  return <Prepare />;
      case 'qualify':  return <Qualify />;
      case 'activate': return <Activate />;
      case 'followup': return <FollowUp />;
      case 'report':   return <Report />;
      default:         return <Prepare />;
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#F4F1EA',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Sticky header */}
      <AppHeader />

      {/* Draft banner */}
      <DraftBanner />

      {/* Secondary tab bar */}
      <div
        style={{
          display: 'flex',
          background: '#fff',
          borderBottom: '1px solid #C8CCD2',
          flexShrink: 0,
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
        }}
      >
        {SECONDARY_TABS.map(tab => {
          const Icon = tab.Icon;
          const isActive = activeTab === tab.id;
          return (
          <button
            key={tab.id}
            onClick={() => setLocation(tab.id === 'os' ? `/os/${currentStep}` : tab.path)}
            aria-current={isActive ? 'page' : undefined}
            style={{
              flex: 1,
              minWidth: '44px',
              padding: '10px 4px',
              border: 'none',
              borderBottom: `2px solid ${isActive ? '#A82820' : 'transparent'}`,
              background: isActive ? '#FBF8F1' : 'transparent',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '10px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: isActive ? '#A82820' : '#4A5159',
              cursor: 'pointer',
              transition: 'color 0.15s, border-color 0.15s, background 0.15s',
              WebkitTapHighlightColor: 'transparent',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
            }}
          >
            <Icon aria-hidden="true" size={16} strokeWidth={2.2} />
            <span>{tab.label}</span>
          </button>
          );
        })}
      </div>

      {/* Main content area */}
      <main
        style={{
          flex: 1,
          overflowY: activeTab === 'manual' ? 'hidden' : 'auto',
          overflowX: 'hidden',
          paddingBottom: activeTab === 'os' ? '72px' : (activeTab === 'lane' || activeTab === 'roleplay' || activeTab === 'story' || activeTab === 'manual') ? '0' : '16px',
          WebkitOverflowScrolling: 'touch',
          display: activeTab === 'manual' ? 'flex' : undefined,
          flexDirection: activeTab === 'manual' ? 'column' as const : undefined,
        }}
      >
        <Suspense fallback={<SectionLoading />}>
          {activeTab === 'os' && renderStep()}
          {activeTab === 'manual' && <FieldManual />}
          {activeTab === 'scanner' && <ClaimScanner />}
          {activeTab === 'lane' && (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <LaneSelector />
            </div>
          )}
          {activeTab === 'network' && <NetworkTracker />}
          {activeTab === 'roleplay' && (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <RoleplaySimulator />
            </div>
          )}
          {activeTab === 'story' && (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <StoryCardBuilder />
            </div>
          )}
          {activeTab === 'cadence' && <WeeklyCadencePlanner />}
          {activeTab === 'settings' && <SettingsPage />}
        </Suspense>
      </main>

      {/* Bottom navigation (only for OS tab) */}
      {activeTab === 'os' && <BottomNav />}

      {/* Toast */}
      <Toast />
    </div>
  );
}

function useIsMobileViewport() {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 768px)').matches);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(query.matches);

    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return isMobile;
}

export default function Home() {
  const isMobile = useIsMobileViewport();

  if (isMobile) {
    return (
      <div
        className="mobile-app-wrapper"
        style={{
          display: 'flex',
          height: '100dvh',
          flexDirection: 'column',
        }}
      >
        <AppShell />
      </div>
    );
  }

  return <DesktopShell />;
}
