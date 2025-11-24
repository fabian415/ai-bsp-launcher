import { create } from 'zustand';

export const useAppStore = create((set, get) => ({
  // Authentication
  isAuthenticated: false,
  authMode: 'login',
  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
  setAuthMode: (mode) => set({ authMode: mode }),
  logout: () => set({ isAuthenticated: false }),

  // Theme & Language
  theme: 'dark',
  lang: 'en',
  setTheme: (theme) => {
    set({ theme });
    localStorage.setItem('bsp-theme', theme);
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  },
  setLang: (lang) => {
    set({ lang });
    localStorage.setItem('bsp-lang', lang);
  },

  // Platform & Navigation
  selectedPlatform: null,
  activeTab: 'dashboard',
  setSelectedPlatform: (platform) => set({ selectedPlatform: platform }),
  setActiveTab: (tab) => set({ activeTab: tab, selectedPlatform: null }),

  // Build Process
  buildStatus: 'ready',
  progress: 0,
  logs: [],
  setBuildStatus: (status) => set({ buildStatus: status }),
  setProgress: (progress) => set({ progress }),
  setLogs: (logs) => set({ logs }),
  addLog: (log) => set((state) => ({ logs: [...state.logs, log] })),
  resetBuild: () => set({ buildStatus: 'ready', progress: 0, logs: [] }),

  // Download Management
  downloads: [],
  activeDownloadsCount: 0,
  
  addDownload: (download) => set((state) => {
    const exists = state.downloads.find(d => d.id === download.id);
    if (exists) return state;
    
    const newDownloads = [...state.downloads, download];
    const activeCount = newDownloads.filter(d => d.status === 'downloading').length;
    
    return { 
      downloads: newDownloads,
      activeDownloadsCount: activeCount
    };
  }),
  
  updateDownload: (id, updates) => set((state) => {
    const downloads = state.downloads.map(d => 
      d.id === id ? { ...d, ...updates } : d
    );
    const activeCount = downloads.filter(d => d.status === 'downloading').length;
    
    return { 
      downloads,
      activeDownloadsCount: activeCount
    };
  }),
  
  removeDownload: (id) => set((state) => {
    const downloads = state.downloads.filter(d => d.id !== id);
    const activeCount = downloads.filter(d => d.status === 'downloading').length;
    
    return { 
      downloads,
      activeDownloadsCount: activeCount
    };
  }),
  
  getDownloadById: (id) => {
    const state = get();
    return state.downloads.find(d => d.id === id);
  },
  
  getActiveDownloads: () => {
    const state = get();
    return state.downloads.filter(d => d.status === 'downloading' || d.status === 'pending' || d.status === 'queued');
  },
  
  getCompletedDownloads: () => {
    const state = get();
    return state.downloads.filter(d => d.status === 'completed');
  },
  
  clearCompletedDownloads: () => set((state) => ({
    downloads: state.downloads.filter(d => d.status !== 'completed')
  })),

  // Activity Management
  activities: [],
  
  setActivities: (activities) => set({ activities }),
  
  addActivity: (activity) => set((state) => ({
    activities: [activity, ...state.activities]
  })),

  // Initialize
  initialize: () => {
    // Auto-detect language
    const browserLang = navigator.language;
    const savedLang = localStorage.getItem('bsp-lang');
    const savedTheme = localStorage.getItem('bsp-theme');

    if (savedLang) {
      set({ lang: savedLang });
    } else {
      if (browserLang.includes('zh-TW') || browserLang.includes('zh-HK')) set({ lang: 'zh-TW' });
      else if (browserLang.includes('zh')) set({ lang: 'zh-CN' });
      else if (browserLang.includes('ja')) set({ lang: 'ja' });
      else if (browserLang.includes('ko')) set({ lang: 'ko' });
      else set({ lang: 'en' });
    }

    if (savedTheme) {
      get().setTheme(savedTheme);
    } else {
      get().setTheme('dark');
    }
  }
}));

