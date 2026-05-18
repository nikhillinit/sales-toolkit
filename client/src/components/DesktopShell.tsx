/**
 * DesktopShell — Unified Signal OS
 * Full-viewport desktop layout: fixed left sidebar + scrollable content area.
 * Replaces the phone-frame simulation on screens wider than 768px.
 */
import DraftBanner from '@/components/DraftBanner';
import Toast from '@/components/Toast';
import { useStatsState, useTrialsState, useUiActions, useUiState, type StepId } from '@/contexts/AppState';
import {
  BookOpen,
  CalendarDays,
  Compass,
  Handshake,
  Library,
  MessageSquare,
  Search,
  Settings2,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { lazy, Suspense, useEffect } from 'react';
import { useLocation } from 'wouter';
import Activate from '@/pages/steps/Activate';
import FollowUp from '@/pages/steps/FollowUp';
import Prepare from '@/pages/steps/Prepare';
import Qualify from '@/pages/steps/Qualify';
import Report from '@/pages/steps/Report';

type SecondaryTab =
  | 'os'
  | 'manual'
  | 'scanner'
  | 'lane'
  | 'network'
  | 'roleplay'
  | 'story'
  | 'cadence'
  | 'settings';

const ClaimScanner = lazy(() => import('@/pages/ClaimScanner'));
const FieldManual = lazy(() => import('@/pages/FieldManual'));
const LaneSelector = lazy(() => import('@/pages/LaneSelector'));
const NetworkTracker = lazy(() => import('@/pages/NetworkTracker'));
const RoleplaySimulator = lazy(() => import('@/pages/RoleplaySimulator'));
const StoryCardBuilder = lazy(() => import('@/pages/StoryCardBuilder'));
const WeeklyCadencePlanner = lazy(() => import('@/pages/WeeklyCadencePlanner'));
const SettingsPage = lazy(() => import('@/pages/Settings'));

const STEP_IDS: StepId[] = ['prepare', 'qualify', 'activate', 'followup', 'report'];

const NAV_ITEMS: { id: SecondaryTab; label: string; Icon: LucideIcon; path: string }[] = [
  { id: 'os',       label: 'Sales OS',      Icon: Zap,           path: '/os/prepare' },
  { id: 'manual',   label: 'Field Manual',  Icon: BookOpen,      path: '/manual' },
  { id: 'scanner',  label: 'Claim Check',   Icon: Search,        path: '/scanner' },
  { id: 'lane',     label: 'Lane Plan',     Icon: Compass,       path: '/lane' },
  { id: 'network',  label: 'Network Log',   Icon: Handshake,     path: '/network' },
  { id: 'roleplay', label: 'Roleplay',      Icon: MessageSquare, path: '/roleplay' },
  { id: 'story',    label: 'Story Vault',   Icon: Library,       path: '/story' },
  { id: 'cadence',  label: 'War Plan',      Icon: CalendarDays,  path: '/cadence' },
  { id: 'settings', label: 'Settings',      Icon: Settings2,     path: '/settings' },
];

const OS_STEPS: { id: StepId; num: string; label: string }[] = [
  { id: 'prepare',  num: '01', label: 'Prepare'  },
  { id: 'qualify',  num: '02', label: 'Qualify'  },
  { id: 'activate', num: '03', label: 'Activate' },
  { id: 'followup', num: '04', label: 'Follow'   },
  { id: 'report',   num: '05', label: 'Report'   },
];

function isSecondaryTab(value: string | undefined): value is SecondaryTab {
  return NAV_ITEMS.some(n => n.id === value);
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
    <div
      style={{
        padding: '24px',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '11px',
        color: '#4A5159',
      }}
    >
      Loading section...
    </div>
  );
}

function SidebarBrand() {
  const stats = useStatsState();
  const trials = useTrialsState();

  return (
    <div
      style={{
        borderBottom: '1px solid #C8CCD2',
        padding: '0 16px',
        flexShrink: 0,
      }}
    >
      {/* Brand row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          height: '52px',
        }}
      >
        <h1
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: '20px',
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
            margin: 0,
            lineHeight: 1,
            color: '#1A1D22',
          }}
        >
          Restless
        </h1>
        <span
          style={{
            display: 'inline-block',
            padding: '2px 6px',
            borderRadius: '2px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '8px',
            fontWeight: 700,
            background: '#A82820',
            color: '#fff',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Field OS
        </span>
      </div>

      {/* Pipeline stats row */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          paddingBottom: '12px',
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        {[
          { label: 'Out', value: stats.out, color: '#1A1D22' },
          { label: 'Ship', value: stats.ship, color: '#A82820' },
          { label: 'Yes', value: stats.yes, color: '#2E7D32' },
          ...(trials.length > 0 ? [{ label: 'Live', value: trials.length, color: '#8A6A14' }] : []),
        ].map((stat, i, arr) => (
          <div key={stat.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px' }}>
              <span style={{ color: '#4A5159', fontSize: '7px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                {stat.label}
              </span>
              <span style={{ color: stat.color, fontSize: '16px', fontWeight: 700 }}>{stat.value}</span>
            </div>
            {i < arr.length - 1 && (
              <div style={{ width: '1px', height: '28px', background: '#C8CCD2' }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

interface SidebarProps {
  activeTab: SecondaryTab;
  activeStep: StepId;
  onTabClick: (tab: SecondaryTab, path: string) => void;
  onStepClick: (step: StepId) => void;
}

function DesktopSidebar({ activeTab, activeStep, onTabClick, onStepClick }: SidebarProps) {
  const { completedSteps } = useUiState();
  const completed = new Set(completedSteps);

  return (
    <aside
      style={{
        width: '220px',
        flexShrink: 0,
        background: '#fff',
        borderRight: '1px solid #C8CCD2',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        overflowY: 'auto',
      }}
    >
      <SidebarBrand />

      {/* Nav list */}
      <nav style={{ flex: 1, padding: '8px 0' }} aria-label="Main navigation">
        {NAV_ITEMS.map(item => {
          const Icon = item.Icon;
          const isActive = activeTab === item.id;

          return (
            <div key={item.id}>
              <button
                onClick={() => onTabClick(item.id, item.path)}
                aria-current={isActive ? 'page' : undefined}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 16px',
                  border: 'none',
                  borderLeft: `3px solid ${isActive ? '#A82820' : 'transparent'}`,
                  background: isActive ? '#FBF8F1' : 'transparent',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: isActive ? '#A82820' : '#4A5159',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'color 0.15s, border-color 0.15s, background 0.15s',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                <Icon aria-hidden="true" size={15} strokeWidth={2.2} style={{ flexShrink: 0 }} />
                <span>{item.label}</span>
              </button>

              {/* OS sub-steps — shown when Sales OS is active */}
              {item.id === 'os' && isActive && (
                <div style={{ paddingLeft: '0', borderLeft: '3px solid #A82820', background: '#FBF8F1' }}>
                  {OS_STEPS.map(step => {
                    const isStepActive = activeStep === step.id;
                    const isDone = completed.has(step.id);
                    return (
                      <button
                        key={step.id}
                        onClick={() => onStepClick(step.id)}
                        aria-current={isStepActive ? 'step' : undefined}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 16px 8px 29px',
                          border: 'none',
                          background: isStepActive ? '#F4EDE8' : 'transparent',
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: '10px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          color: isStepActive ? '#A82820' : isDone ? '#2E7D32' : '#4A5159',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'color 0.15s, background 0.15s',
                          WebkitTapHighlightColor: 'transparent',
                        }}
                      >
                        <div
                          style={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '50%',
                            background: isStepActive ? '#A82820' : isDone ? '#2E7D32' : '#EFEBE0',
                            border: `1px solid ${isStepActive ? '#A82820' : isDone ? '#2E7D32' : '#C8CCD2'}`,
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '8px',
                            color: isStepActive || isDone ? '#fff' : '#4A5159',
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          {isDone && !isStepActive ? '✓' : step.num.slice(-1)}
                        </div>
                        <span>{step.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer version tag */}
      <div
        style={{
          padding: '12px 16px',
          borderTop: '1px solid #C8CCD2',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '9px',
          color: '#C8CCD2',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}
      >
        Unified Signal OS
      </div>
    </aside>
  );
}

export function DesktopShell() {
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

  const handleTabClick = (tab: SecondaryTab, path: string) => {
    setLocation(tab === 'os' ? `/os/${currentStep}` : path);
  };

  const handleStepClick = (step: StepId) => {
    setLocation(`/os/${step}`);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'os':
        switch (activeStep) {
          case 'prepare':  return <Prepare />;
          case 'qualify':  return <Qualify />;
          case 'activate': return <Activate />;
          case 'followup': return <FollowUp />;
          case 'report':   return <Report />;
          default:         return <Prepare />;
        }
      case 'manual':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <FieldManual />
          </div>
        );
      case 'scanner':  return <ClaimScanner />;
      case 'lane':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <LaneSelector />
          </div>
        );
      case 'network':  return <NetworkTracker />;
      case 'roleplay':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <RoleplaySimulator />
          </div>
        );
      case 'story':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <StoryCardBuilder />
          </div>
        );
      case 'cadence':  return <WeeklyCadencePlanner />;
      case 'settings': return <SettingsPage />;
      default:         return <Prepare />;
    }
  };

  const isFullHeightSection = activeTab === 'manual' || activeTab === 'lane' || activeTab === 'roleplay' || activeTab === 'story';

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#F4F1EA', overflow: 'hidden' }}>
      <DesktopSidebar
        activeTab={activeTab}
        activeStep={activeStep}
        onTabClick={handleTabClick}
        onStepClick={handleStepClick}
      />

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          overflow: 'hidden',
        }}
      >
        <DraftBanner />
        <main
          style={{
            flex: 1,
            overflowY: isFullHeightSection ? 'hidden' : 'auto',
            overflowX: 'hidden',
            display: isFullHeightSection ? 'flex' : undefined,
            flexDirection: isFullHeightSection ? 'column' as const : undefined,
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <Suspense fallback={<SectionLoading />}>
            {renderContent()}
          </Suspense>
        </main>
      </div>

      <Toast />
    </div>
  );
}
