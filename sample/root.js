import React, { useState, useEffect, useMemo } from 'react';
import { 
  Moon, Sun, Languages, LogOut, Terminal, 
  Cpu, Download, Zap, Settings, User, 
  ChevronRight, Layers, HardDrive, Play, 
  Activity, CheckCircle, AlertCircle, Search,
  Save, RefreshCw, Folder, Globe, Bell, FileCode
} from 'lucide-react';

// --- 1. 多國語系字典 (Mock i18n) ---
const translations = {
  en: {
    login: "Login",
    register: "Register",
    email: "Email Address",
    password: "Password",
    welcomeBack: "Welcome Back",
    welcomeDesc: "Sign in to access your BSP workspace.",
    dashboard: "Dashboard",
    platforms: "Platforms",
    downloads: "Downloads",
    settings: "Settings",
    logout: "Logout",
    selectPlatform: "Select Hardware Platform",
    build: "Build",
    flash: "Flash Image",
    status: "Status",
    logs: "Build Logs",
    ready: "Ready",
    building: "Building...",
    flashing: "Flashing...",
    completed: "Completed",
    version: "Version",
    theme: "Theme",
    language: "Language",
    account: "No account?",
    signUp: "Sign up",
    haveAccount: "Have an account?",
    signIn: "Sign in",
    launchPad: "BSP LaunchPad",
    // New Translations
    recentActivity: "Recent Activity",
    systemHealth: "System Health",
    cpuUsage: "CPU Usage",
    ramUsage: "RAM Usage",
    diskUsage: "Disk Usage",
    downloadCenter: "Download Center",
    fileName: "File Name",
    size: "Size",
    date: "Date",
    action: "Action",
    downloading: "Downloading",
    workspacePath: "Workspace Path",
    enableNotifications: "Enable Notifications",
    proxySettings: "Proxy Settings",
    saveChanges: "Save Changes",
    general: "General",
    network: "Network"
  },
  'zh-TW': {
    login: "登入",
    register: "註冊",
    email: "電子郵件",
    password: "密碼",
    welcomeBack: "歡迎回來",
    welcomeDesc: "登入以存取您的 BSP 工作區。",
    dashboard: "儀表板",
    platforms: "平台選擇",
    downloads: "下載中心",
    settings: "設定",
    logout: "登出",
    selectPlatform: "選擇硬體平台",
    build: "建置",
    flash: "燒錄映像檔",
    status: "狀態",
    logs: "建置日誌",
    ready: "就緒",
    building: "建置中...",
    flashing: "燒錄中...",
    completed: "已完成",
    version: "版本",
    theme: "主題",
    language: "語言",
    account: "沒有帳號？",
    signUp: "註冊",
    haveAccount: "已有帳號？",
    signIn: "登入",
    launchPad: "BSP 啟動器",
    // New Translations
    recentActivity: "最近活動",
    systemHealth: "系統健康度",
    cpuUsage: "CPU 使用率",
    ramUsage: "記憶體使用率",
    diskUsage: "硬碟使用率",
    downloadCenter: "下載中心",
    fileName: "檔案名稱",
    size: "大小",
    date: "日期",
    action: "操作",
    downloading: "下載中",
    workspacePath: "工作區路徑",
    enableNotifications: "啟用通知",
    proxySettings: "Proxy 設定",
    saveChanges: "儲存變更",
    general: "一般",
    network: "網路"
  },
  'zh-CN': {
    login: "登录",
    register: "注册",
    email: "电子邮件",
    password: "密码",
    welcomeBack: "欢迎回来",
    welcomeDesc: "登录以访问您的 BSP 工作区。",
    dashboard: "仪表板",
    platforms: "平台选择",
    downloads: "下载中心",
    settings: "设置",
    logout: "退出",
    selectPlatform: "选择硬件平台",
    build: "构建",
    flash: "烧录镜像",
    status: "状态",
    logs: "构建日志",
    ready: "就绪",
    building: "构建中...",
    flashing: "烧录中...",
    completed: "已完成",
    version: "版本",
    theme: "主题",
    language: "语言",
    account: "没有账号？",
    signUp: "注册",
    haveAccount: "已有账号？",
    signIn: "登录",
    launchPad: "BSP 启动器",
    // New Translations
    recentActivity: "最近活动",
    systemHealth: "系统健康度",
    cpuUsage: "CPU 使用率",
    ramUsage: "内存使用率",
    diskUsage: "磁盘使用率",
    downloadCenter: "下载中心",
    fileName: "文件名",
    size: "大小",
    date: "日期",
    action: "操作",
    downloading: "下载中",
    workspacePath: "工作区路径",
    enableNotifications: "启用通知",
    proxySettings: "代理设置",
    saveChanges: "保存更改",
    general: "常规",
    network: "网络"
  },
  ja: {
    login: "ログイン",
    register: "登録",
    email: "メールアドレス",
    password: "パスワード",
    welcomeBack: "お帰りなさい",
    welcomeDesc: "BSPワークスペースにアクセスするにはサインインしてください。",
    dashboard: "ダッシュボード",
    platforms: "プラットフォーム",
    downloads: "ダウンロード",
    settings: "設定",
    logout: "ログアウト",
    selectPlatform: "ハードウェアを選択",
    build: "ビルド",
    flash: "書き込み",
    status: "ステータス",
    logs: "ビルドログ",
    ready: "準備完了",
    building: "ビルド中...",
    flashing: "書き込み中...",
    completed: "完了",
    version: "バージョン",
    theme: "テーマ",
    language: "言語",
    account: "アカウントをお持ちでないですか？",
    signUp: "登録",
    haveAccount: "アカウントをお持ちですか？",
    signIn: "サインイン",
    launchPad: "BSP ランチャー",
    // New Translations
    recentActivity: "最近のアクティビティ",
    systemHealth: "システム状態",
    cpuUsage: "CPU使用率",
    ramUsage: "メモリ使用率",
    diskUsage: "ディスク使用率",
    downloadCenter: "ダウンロードセンター",
    fileName: "ファイル名",
    size: "サイズ",
    date: "日付",
    action: "操作",
    downloading: "ダウンロード中",
    workspacePath: "ワークスペースパス",
    enableNotifications: "通知を有効化",
    proxySettings: "プロキシ設定",
    saveChanges: "変更を保存",
    general: "一般",
    network: "ネットワーク"
  },
  ko: {
    login: "로그인",
    register: "등록",
    email: "이메일 주소",
    password: "비밀번호",
    welcomeBack: "환영합니다",
    welcomeDesc: "BSP 작업 공간에 액세스하려면 로그인하십시오.",
    dashboard: "대시보드",
    platforms: "플랫폼",
    downloads: "다운로드",
    settings: "설정",
    logout: "로그아웃",
    selectPlatform: "하드웨어 플랫폼 선택",
    build: "빌드",
    flash: "이미지 굽기",
    status: "상태",
    logs: "빌드 로그",
    ready: "준비",
    building: "빌드 중...",
    flashing: "굽는 중...",
    completed: "완료",
    version: "버전",
    theme: "테마",
    language: "언어",
    account: "계정이 없으신가요?",
    signUp: "가입하기",
    haveAccount: "계정이 있으신가요?",
    signIn: "로그인",
    launchPad: "BSP 런처",
    // New Translations
    recentActivity: "최근 활동",
    systemHealth: "시스템 상태",
    cpuUsage: "CPU 사용량",
    ramUsage: "RAM 사용량",
    diskUsage: "디스크 사용량",
    downloadCenter: "다운로드 센터",
    fileName: "파일 이름",
    size: "크기",
    date: "날짜",
    action: "작업",
    downloading: "다운로드 중",
    workspacePath: "작업 공간 경로",
    enableNotifications: "알림 활성화",
    proxySettings: "프록시 설정",
    saveChanges: "변경 사항 저장",
    general: "일반",
    network: "네트워크"
  }
};

// --- 2. Mock Data ---
const MOCK_PLATFORMS = [
  { id: 'qcom', name: 'Qualcomm Snapdragon', code: 'QSC-8250', icon: 'cpu', color: 'text-red-500', bg: 'bg-red-500/10' },
  { id: 'nvidia', name: 'NVIDIA Jetson Orin', code: 'AGX-Orin-32G', icon: 'zap', color: 'text-green-500', bg: 'bg-green-500/10' },
  { id: 'rockchip', name: 'Rockchip', code: 'RK3588', icon: 'layers', color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: 'nxp', name: 'NXP i.MX 8M', code: 'IMX8M-PLUS', icon: 'hard-drive', color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
];

const LANGUAGE_OPTIONS = [
  { code: 'en', label: 'English' },
  { code: 'zh-TW', label: '繁體中文' },
  { code: 'zh-CN', label: '简体中文' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
];

const MOCK_DOWNLOADS = [
  { id: 1, name: 'QSC-8250_L.35.4.1_BSP.tar.gz', size: '4.2 GB', date: '2023-10-15', status: 'downloaded' },
  { id: 2, name: 'AGX-Orin_R35.3.1_Source.tbz2', size: '6.8 GB', date: '2023-10-12', status: 'downloading', progress: 45 },
  { id: 3, name: 'RK3588_Android12_SDK_v1.0.zip', size: '12.5 GB', date: '2023-09-28', status: 'idle' },
  { id: 4, name: 'IMX8M-PLUS_Yocto_Kirkstone.iso', size: '2.1 GB', date: '2023-09-20', status: 'idle' },
];

// --- 3. Main Application Component ---
export default function App() {
  // State: User & Auth
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  
  // State: Theme & Language
  const [theme, setTheme] = useState('dark'); // Default to dark for professional tool look
  const [lang, setLang] = useState('en');
  
  // State: App Logic
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, platforms, downloads, settings
  const [buildStatus, setBuildStatus] = useState('ready'); // ready, building, flashing, completed
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);

  // Helper: Translations
  const t = (key) => translations[lang][key] || key;

  // Effect: Auto-detect language on mount
  useEffect(() => {
    const browserLang = navigator.language;
    if (browserLang.includes('zh-TW') || browserLang.includes('zh-HK')) setLang('zh-TW');
    else if (browserLang.includes('zh')) setLang('zh-CN');
    else if (browserLang.includes('ja')) setLang('ja');
    else if (browserLang.includes('ko')) setLang('ko');
    else setLang('en');

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('bsp-theme');
    if (savedTheme) setTheme(savedTheme);
  }, []);

  // Effect: Apply Theme to HTML/Body
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('bsp-theme', theme);
  }, [theme]);

  // Action: Simulate Login
  const handleAuth = (e) => {
    e.preventDefault();
    setIsAuthenticated(true);
  };

  // Action: Handle Tab Navigation
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    // If we switch tabs, generally we want to exit the specific platform workspace
    // unless we want to keep it active in background. For now, let's exit to show the top-level tab view.
    setSelectedPlatform(null);
  };

  // Action: Simulate Build Process
  const startProcess = (type) => {
    if (buildStatus !== 'ready' && buildStatus !== 'completed') return;
    
    setBuildStatus(type === 'build' ? 'building' : 'flashing');
    setLogs([]);
    setProgress(0);

    const steps = type === 'build' 
      ? ['Initializing build environment...', 'Checking dependencies...', 'Compiling kernel...', 'Linking modules...', 'Generating rootfs...', 'Build Successful.']
      : ['Detecting device...', 'Erasing partition...', 'Flashing bootloader...', 'Flashing system...', 'Verifying checksum...', 'Flash Complete.'];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep >= steps.length) {
        clearInterval(interval);
        setBuildStatus('completed');
        setProgress(100);
        return;
      }

      const newLog = `[${new Date().toLocaleTimeString()}] ${steps[currentStep]}`;
      setLogs(prev => [...prev, newLog]);
      setProgress(prev => Math.min(prev + (100 / steps.length), 99));
      currentStep++;
    }, 800);
  };

  // Sub-component: Dashboard View
  const DashboardView = () => (
    <div className="max-w-6xl mx-auto w-full">
      <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">{t('dashboard')}</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-500">{t('cpuUsage')}</h3>
            <Activity className="text-blue-500" size={20} />
          </div>
          <div className="text-3xl font-bold text-slate-800 dark:text-white">12%</div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 mt-4 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full" style={{ width: '12%' }}></div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-500">{t('ramUsage')}</h3>
            <Cpu className="text-purple-500" size={20} />
          </div>
          <div className="text-3xl font-bold text-slate-800 dark:text-white">8.4 GB</div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 mt-4 rounded-full overflow-hidden">
            <div className="bg-purple-500 h-full" style={{ width: '52%' }}></div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-500">{t('diskUsage')}</h3>
            <HardDrive className="text-green-500" size={20} />
          </div>
          <div className="text-3xl font-bold text-slate-800 dark:text-white">450 GB</div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 mt-4 rounded-full overflow-hidden">
            <div className="bg-green-500 h-full" style={{ width: '45%' }}></div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-slate-800 dark:text-white">{t('recentActivity')}</h3>
        </div>
        <div className="p-0">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center p-4 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mr-4">
                <FileCode size={18} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="font-medium text-slate-900 dark:text-white">Build QSC-8250 Kernel</span>
                  <span className="text-xs text-slate-500">2 hours ago</span>
                </div>
                <p className="text-sm text-slate-500">Completed successfully in 14m 20s</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Sub-component: Downloads View
  const DownloadsView = () => (
    <div className="max-w-6xl mx-auto w-full">
       <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{t('downloadCenter')}</h2>
        <button className="p-2 text-slate-500 hover:text-blue-600 transition-colors">
          <RefreshCw size={20} />
        </button>
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-medium border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="px-6 py-4">{t('fileName')}</th>
              <th className="px-6 py-4">{t('size')}</th>
              <th className="px-6 py-4">{t('date')}</th>
              <th className="px-6 py-4 text-right">{t('action')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {MOCK_DOWNLOADS.map((file) => (
              <tr key={file.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200 flex items-center">
                  <div className="mr-3 p-2 bg-slate-100 dark:bg-slate-800 rounded text-slate-500">
                    <Folder size={16} />
                  </div>
                  {file.name}
                </td>
                <td className="px-6 py-4 text-slate-500">{file.size}</td>
                <td className="px-6 py-4 text-slate-500">{file.date}</td>
                <td className="px-6 py-4 text-right">
                  {file.status === 'downloading' ? (
                     <div className="flex items-center justify-end">
                       <span className="text-xs text-blue-500 mr-3">{file.progress}%</span>
                       <div className="w-24 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                         <div className="bg-blue-500 h-full" style={{ width: `${file.progress}%` }}></div>
                       </div>
                     </div>
                  ) : file.status === 'downloaded' ? (
                    <span className="inline-flex items-center text-green-500 text-xs font-medium px-2.5 py-0.5 rounded-full bg-green-100 dark:bg-green-900/20">
                      <CheckCircle size={12} className="mr-1" /> {t('ready')}
                    </span>
                  ) : (
                    <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center justify-end ml-auto">
                      <Download size={16} className="mr-1" /> Download
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Sub-component: Settings View
  const SettingsView = () => (
    <div className="max-w-4xl mx-auto w-full">
      <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">{t('settings')}</h2>
      
      <div className="space-y-6">
        {/* General Settings */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-semibold mb-4 flex items-center text-slate-800 dark:text-white">
            <Settings size={20} className="mr-2 text-slate-500" /> {t('general')}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('workspacePath')}</label>
              <div className="flex">
                <input 
                  type="text" 
                  defaultValue="/home/user/bsp_workspace"
                  className="flex-1 px-4 py-2 rounded-l-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300 outline-none"
                />
                <button className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-r-lg border-y border-r border-slate-300 dark:border-slate-600 hover:bg-slate-300 dark:hover:bg-slate-600">Browse</button>
              </div>
            </div>
             <div className="flex items-center justify-between py-2">
                <span className="text-slate-700 dark:text-slate-300">{t('enableNotifications')}</span>
                <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer bg-blue-600">
                  <span className="absolute left-0 inline-block w-6 h-6 bg-white border border-gray-300 rounded-full shadow transform translate-x-6 transition-transform duration-200 ease-in-out"></span>
                </div>
            </div>
          </div>
        </div>

        {/* Network Settings */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-semibold mb-4 flex items-center text-slate-800 dark:text-white">
            <Globe size={20} className="mr-2 text-slate-500" /> {t('network')}
          </h3>
          <div className="space-y-4">
             <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('proxySettings')}</label>
              <input 
                type="text" 
                placeholder="http://proxy.example.com:8080"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="flex items-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg shadow-blue-600/20 transition-all">
            <Save size={18} className="mr-2" /> {t('saveChanges')}
          </button>
        </div>
      </div>
    </div>
  );

  // Sub-component: Platform Grid (Extracted)
  const PlatformsGrid = () => (
    <div className="max-w-6xl mx-auto w-full">
      <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">{t('selectPlatform')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_PLATFORMS.map(platform => (
          <div 
            key={platform.id}
            onClick={() => setSelectedPlatform(platform)}
            className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-lg hover:-translate-y-1"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-lg ${platform.bg} ${platform.color}`}>
                {platform.id === 'qcom' ? <Cpu size={24} /> : 
                  platform.id === 'nvidia' ? <Zap size={24} /> : 
                  <HardDrive size={24} />}
              </div>
              <span className="px-2 py-1 text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 rounded">
                SDK v1.2.0
              </span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">{platform.name}</h3>
            <p className="text-sm font-mono text-slate-500">{platform.code}</p>
            <div className="mt-6 flex items-center text-sm text-blue-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              Open Workspace <ChevronRight size={16} className="ml-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render: Auth Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 transition-colors duration-300">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-700">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <Cpu size={32} />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-white mb-2">
            {t('launchPad')}
          </h2>
          <p className="text-center text-slate-500 dark:text-slate-400 mb-8">
            {authMode === 'login' ? t('welcomeDesc') : t('welcomeDesc')}
          </p>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('email')}</label>
              <input 
                type="email" 
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('password')}</label>
              <input 
                type="password" 
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
            
            <button 
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all shadow-lg shadow-blue-600/30"
            >
              {authMode === 'login' ? t('login') : t('register')}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            {authMode === 'login' ? t('account') : t('haveAccount')}{' '}
            <button 
              onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
              className="text-blue-600 hover:underline font-medium"
            >
              {authMode === 'login' ? t('signUp') : t('signIn')}
            </button>
          </div>

          {/* Utilities for Auth Screen */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
             <select 
                value={lang} 
                onChange={(e) => setLang(e.target.value)}
                className="bg-transparent text-sm text-slate-500 dark:text-slate-400 outline-none cursor-pointer"
              >
                {LANGUAGE_OPTIONS.map(opt => (
                  <option key={opt.code} value={opt.code}>{opt.label}</option>
                ))}
              </select>
              <button 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
          </div>
        </div>
      </div>
    );
  }

  // Render: Main App Layout
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex overflow-hidden font-sans transition-colors duration-300">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col z-20">
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
          <Cpu className="text-blue-600 mr-3" size={24} />
          <span className="font-bold text-lg tracking-tight">BSP Launcher</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'dashboard', icon: Layers, label: t('dashboard') },
            { id: 'platforms', icon: HardDrive, label: t('platforms') },
            { id: 'downloads', icon: Download, label: t('downloads') },
            { id: 'settings', icon: Settings, label: t('settings') },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === item.id && !selectedPlatform
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <item.icon size={18} className="mr-3" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="flex items-center w-full px-4 py-2 text-sm text-slate-500 hover:text-red-500 transition-colors"
          >
            <LogOut size={18} className="mr-3" />
            {t('logout')}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
            <span className="cursor-pointer hover:text-slate-700 dark:hover:text-slate-200">{t('launchPad')}</span>
            <ChevronRight size={14} className="mx-2" />
            <span className="font-medium text-slate-800 dark:text-slate-100">
              {selectedPlatform ? selectedPlatform.name : t(activeTab)}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {/* Global Status Indicator */}
            <div className="flex items-center text-xs px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className={`w-2 h-2 rounded-full mr-2 ${
                buildStatus === 'ready' ? 'bg-green-500' : 
                buildStatus === 'completed' ? 'bg-blue-500' : 'bg-amber-500 animate-pulse'
              }`}></div>
              <span className="font-mono uppercase tracking-wider text-slate-600 dark:text-slate-400">
                {buildStatus === 'ready' ? t('ready') : 
                 buildStatus === 'building' ? t('building') :
                 buildStatus === 'flashing' ? t('flashing') : t('completed')}
              </span>
            </div>

            {/* Language Toggle */}
            <div className="relative group">
              <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
                <Languages size={20} />
              </button>
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 hidden group-hover:block py-1 z-50">
                {LANGUAGE_OPTIONS.map(opt => (
                  <button
                    key={opt.code}
                    onClick={() => setLang(opt.code)}
                    className={`w-full text-left px-4 py-2 text-sm ${
                      lang === opt.code 
                        ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' 
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Toggle */}
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-transform active:scale-95"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* User Profile */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer">
              AD
            </div>
          </div>
        </header>

        {/* Workspace Content Area */}
        <div className="flex-1 overflow-auto p-6">
          {selectedPlatform ? (
             /* Platform Workspace (The "Launcher" Interface) */
             <div className="h-full flex flex-col max-w-6xl mx-auto">
             <div className="mb-6 flex items-center justify-between">
               <div>
                 <button 
                   onClick={() => setSelectedPlatform(null)}
                   className="text-xs text-blue-500 hover:underline mb-1 flex items-center"
                 >
                   ← Back to Selection
                 </button>
                 <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center">
                   {selectedPlatform.name} 
                   <span className="ml-3 px-3 py-1 text-xs font-mono bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full border border-blue-200 dark:border-blue-800">
                     {selectedPlatform.code}
                   </span>
                 </h2>
               </div>
               
               {/* Action Buttons */}
               <div className="flex space-x-3">
                 <button 
                   disabled={buildStatus === 'building' || buildStatus === 'flashing'}
                   onClick={() => startProcess('build')}
                   className="flex items-center px-5 py-2 bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-lg transition-colors disabled:opacity-50"
                 >
                   <Settings size={18} className="mr-2" />
                   {t('build')}
                 </button>
                 <button 
                   disabled={buildStatus === 'building' || buildStatus === 'flashing'}
                   onClick={() => startProcess('flash')}
                   className="flex items-center px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50"
                 >
                   <Play size={18} className="mr-2" />
                   {t('flash')}
                 </button>
               </div>
             </div>

             {/* Dashboard Grid */}
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
               
               {/* Column 1: Info & Config */}
               <div className="space-y-6">
                 <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
                   <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">{t('status')}</h3>
                   <div className="space-y-4">
                     <div className="flex justify-between items-center">
                       <span className="text-sm text-slate-600 dark:text-slate-400">Target Device</span>
                       <span className="text-sm font-medium text-green-500 flex items-center"><CheckCircle size={14} className="mr-1"/> Connected</span>
                     </div>
                     <div className="flex justify-between items-center">
                       <span className="text-sm text-slate-600 dark:text-slate-400">BSP Version</span>
                       <span className="text-sm font-mono text-slate-800 dark:text-slate-200">REL_35.4.1</span>
                     </div>
                      <div className="flex justify-between items-center">
                       <span className="text-sm text-slate-600 dark:text-slate-400">Disk Space</span>
                       <span className="text-sm text-slate-800 dark:text-slate-200">45GB Free</span>
                     </div>
                   </div>
                 </div>

                 <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Quick Config</h3>
                    <div className="space-y-3">
                      <label className="flex items-center p-3 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
                        <input type="radio" name="boot" defaultChecked className="text-blue-600 focus:ring-blue-500" />
                        <div className="ml-3">
                          <span className="block text-sm font-medium text-slate-900 dark:text-white">SD Card Boot</span>
                          <span className="block text-xs text-slate-500">Flash to external storage</span>
                        </div>
                      </label>
                      <label className="flex items-center p-3 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
                        <input type="radio" name="boot" className="text-blue-600 focus:ring-blue-500" />
                        <div className="ml-3">
                          <span className="block text-sm font-medium text-slate-900 dark:text-white">eMMC Boot</span>
                          <span className="block text-xs text-slate-500">Flash to internal storage</span>
                        </div>
                      </label>
                    </div>
                 </div>
               </div>

               {/* Column 2 & 3: Terminal & Logs */}
               <div className="lg:col-span-2 bg-slate-950 rounded-xl border border-slate-800 flex flex-col shadow-inner overflow-hidden">
                 <div className="h-10 bg-slate-900 border-b border-slate-800 flex items-center px-4 justify-between">
                   <div className="flex items-center text-slate-400">
                     <Terminal size={16} className="mr-2" />
                     <span className="text-xs font-mono">{t('logs')}</span>
                   </div>
                   <div className="flex space-x-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50"></div>
                   </div>
                 </div>
                 
                 {/* Terminal Output */}
                 <div className="flex-1 p-4 font-mono text-xs leading-relaxed overflow-auto text-slate-300 bg-slate-950">
                   {logs.length === 0 ? (
                     <div className="h-full flex items-center justify-center text-slate-700">
                       Waiting for process to start...
                     </div>
                   ) : (
                     logs.map((log, i) => (
                       <div key={i} className="mb-1">
                         <span className="text-blue-500 mr-2">➜</span>
                         {log}
                       </div>
                     ))
                   )}
                   {buildStatus === 'completed' && (
                     <div className="mt-4 text-green-400 font-bold">
                       Done. Process exited with code 0.
                     </div>
                   )}
                 </div>

                 {/* Progress Bar */}
                 {(buildStatus === 'building' || buildStatus === 'flashing' || buildStatus === 'completed') && (
                   <div className="h-1 w-full bg-slate-800">
                     <div 
                       className="h-full bg-blue-500 transition-all duration-300 ease-out"
                       style={{ width: `${progress}%` }}
                     ></div>
                   </div>
                 )}
               </div>

             </div>
           </div>
          ) : (
            /* Top Level Tabs */
            <>
              {activeTab === 'dashboard' && <DashboardView />}
              {activeTab === 'platforms' && <PlatformsGrid />}
              {activeTab === 'downloads' && <DownloadsView />}
              {activeTab === 'settings' && <SettingsView />}
            </>
          )}
        </div>
      </main>
    </div>
  );
}