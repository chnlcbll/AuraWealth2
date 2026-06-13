import React, { useEffect } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

interface Props {
  onClose: () => void;
  setAppView: (view: 'dashboard' | 'calculator') => void;
  setActiveTab: (tab: 'tbond' | 'mp2' | 'goalseek') => void;
  switchTheme: () => void;
  setHelpOpen: (open: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
}

export const IntroTour: React.FC<Props> = ({ onClose, setAppView, setActiveTab, switchTheme, setHelpOpen, setSidebarOpen }) => {
  // Use refs to avoid re-triggering the effect when callbacks change
  const callbacksRef = React.useRef({ onClose, setAppView, setActiveTab, switchTheme, setHelpOpen, setSidebarOpen });
  useEffect(() => {
    callbacksRef.current = { onClose, setAppView, setActiveTab, switchTheme, setHelpOpen, setSidebarOpen };
  });

  useEffect(() => {
    const tourDriver = driver({
      showProgress: true,
      animate: true,
      showButtons: ['next', 'previous', 'close'],
      nextBtnText: 'Next',
      prevBtnText: 'Previous',
      doneBtnText: 'Finish',
      progressText: '{{current}} of {{total}}',
      popoverClass: 'driver-popover-custom',
      onPopoverRendered: () => {
        const popoverEl = document.querySelector('.driver-popover');
        if (!popoverEl) return;
        const closeBtn = popoverEl.querySelector('.driver-popover-close-btn');
        const prevBtn = popoverEl.querySelector('.driver-popover-prev-btn');
        const navBtns = popoverEl.querySelector('.driver-popover-navigation-btns');
        if (closeBtn && prevBtn && navBtns) {
           navBtns.insertBefore(closeBtn, prevBtn);
        }
      },
      steps: [
        {
          popover: {
            title: 'Welcome to AuraWealth!',
            description: 'Let us show you around your premium companion for Retail Treasury Bonds (RTBs), MP2, and goal-seek investment planning.',
            side: "bottom", align: 'center'
          }
        },
        {
          element: '#tour-welcome',
          popover: {
            title: 'Your Dashboard',
            description: 'This is your portfolio overview. The greeting message will keep you motivated!',
            side: "bottom", align: 'start'
          }
        },
        {
          element: '#tour-theme-btn',
          popover: {
            title: 'Toggle Theme',
            description: 'Switch between light and dark mode for comfortable late-night crunching.',
            side: "left", align: 'start',
            onNextClick: () => {
              callbacksRef.current.switchTheme();
              setTimeout(() => tourDriver.moveNext(), 100);
            }
          }
        },
        {
          element: '#tour-mute-btn',
          popover: {
            title: 'Audio Toggle',
            description: 'You can easily mute or unmute the application sound effects here.',
            side: "left", align: 'start'
          }
        },
        {
          element: '#tour-help-btn',
          popover: {
            title: 'Help & Information',
            description: 'Need help? Click next to open our knowledge base.',
            side: "left", align: 'start',
            onNextClick: () => {
              callbacksRef.current.setHelpOpen(true);
              setTimeout(() => tourDriver.moveNext(), 300);
            }
          }
        },
        {
          element: '#tour-help-tabs',
          popover: {
            title: 'Knowledge Base',
            description: 'Inside here, you will find simulated Video Guides and a comprehensive list of FAQs to answer all your investment questions.',
            side: "bottom", align: 'center',
            onNextClick: () => {
              callbacksRef.current.setHelpOpen(false);
              setTimeout(() => tourDriver.moveNext(), 300);
            }
          }
        },
        {
          element: '#tour-saved-btn',
          popover: {
            title: 'Saved Calculations',
            description: 'Access your saved snapshots and export PDF reports from here.',
            side: "left", align: 'start'
          }
        },
        {
          element: '#tour-logout-btn',
          popover: {
            title: 'Log Out',
            description: 'When you are done, log out of your session securely.',
            side: "left", align: 'start'
          }
        },
        {
          element: '#tour-new-projection',
          popover: {
            title: 'Create New Projection',
            description: 'Clicking on these options will bring you to the analysis tab to calculate your potential returns. Let\'s explore them next!',
            side: "top", align: 'center',
            onNextClick: () => {
              callbacksRef.current.setAppView('calculator');
              callbacksRef.current.setActiveTab('tbond');
              setTimeout(() => tourDriver.moveNext(), 400);
            }
          }
        },
        {
          element: '#tour-rtb-metrics',
          popover: {
            title: 'RTB Analysis & Inflation',
            description: 'Here you can calculate potential returns on your Retail Treasury Bonds. Notice the new feature: you can now enable an Inflation Adjuster to see your Real Return limit.',
            side: "top", align: 'center'
          }
        },
        {
          element: '#tour-quarterly-payout',
          popover: {
            title: 'Quarterly Dividends',
            description: 'You will see exactly how much you can expect to receive every 3 months after the withholding tax is deducted.',
            side: "top", align: 'center',
            onNextClick: () => {
              callbacksRef.current.setActiveTab('mp2');
              setTimeout(() => tourDriver.moveNext(), 400);
            }
          }
        },
        {
          element: '#tour-mp2-metrics',
          popover: {
            title: 'MP2 Analysis',
            description: 'Looking to calculate your Pag-IBIG MP2 tax-free compound growth? Here is everything you need including your total principal deposit sum. The Inflation Adjuster is available here too.',
            side: "top", align: 'center',
            onNextClick: () => {
              callbacksRef.current.setActiveTab('goalseek');
              setTimeout(() => tourDriver.moveNext(), 400);
            }
          }
        },
        {
          element: '#tour-goalseek-tab',
          popover: {
            title: 'Goal-Seek Calculator',
            description: 'Brand new! Switch to Goal-Seek mode to reverse-engineer your investments. Set a target amount and time horizon, and find out exactly how much you need to deposit.',
            side: "bottom", align: 'center',
            onNextClick: () => {
              callbacksRef.current.setSidebarOpen(true);
              setTimeout(() => tourDriver.moveNext(), 400);
            }
          }
        },
        {
          element: '#tour-export-all-btn',
          popover: {
            title: 'Export All Saved',
            description: 'From the Sidebar, you can now generate and export all your saved calculations into a single PDF folio!',
            side: "top", align: 'center',
            onNextClick: () => {
              callbacksRef.current.setSidebarOpen(false);
              callbacksRef.current.setAppView('dashboard');
              setTimeout(() => tourDriver.moveNext(), 300);
            }
          }
        }
      ],
      onDestroyed: () => {
        callbacksRef.current.onClose();
      }
    });

    tourDriver.drive();

    return () => {
      // Don't call destroy here as it triggers another render state that might cause issues?
      // Actually we should in strict mode, let's keep it minimal
      try {
        tourDriver.destroy();
      } catch (e) {}
    };
  }, []); // Run only once

  return null;
};
