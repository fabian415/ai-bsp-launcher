export const MOCK_PLATFORMS = [
  { 
    id: 'qcom', 
    name: 'Qualcomm Snapdragon', 
    code: 'QSC-8250', 
    icon: 'cpu', 
    color: 'red' 
  },
  { 
    id: 'nvidia', 
    name: 'NVIDIA Jetson Orin', 
    code: 'AGX-Orin-32G', 
    icon: 'zap', 
    color: 'green' 
  },
  { 
    id: 'rockchip', 
    name: 'Rockchip', 
    code: 'RK3588', 
    icon: 'layers', 
    color: 'blue' 
  },
  { 
    id: 'nxp', 
    name: 'NXP i.MX 8M', 
    code: 'IMX8M-PLUS', 
    icon: 'hard-drive', 
    color: 'yellow' 
  },
];

export const MOCK_DOWNLOADS = [
  { 
    id: 'sample-1', 
    name: 'sample-10mb.zip',
    fileName: 'sample-10mb.zip',
    url: 'http://ipv4.download.thinkbroadband.com/10MB.zip',
    size: '10 MB',
    totalBytes: 10 * 1024 * 1024,
    description: 'Sample 10MB file for testing',
    status: 'idle' 
  },
  { 
    id: 'sample-2', 
    name: 'sample-50mb.zip',
    fileName: 'sample-50mb.zip',
    url: 'http://ipv4.download.thinkbroadband.com/50MB.zip',
    size: '50 MB',
    totalBytes: 50 * 1024 * 1024,
    description: 'Sample 50MB file for testing',
    status: 'idle' 
  },
  { 
    id: 'sample-3', 
    name: 'ubuntu-22.04.5-desktop-amd64.iso',
    fileName: 'ubuntu-22.04.5-desktop-amd64.iso',
    url: 'https://releases.ubuntu.com/22.04.5/ubuntu-22.04.5-desktop-amd64.iso',
    size: '4.9 GB',
    totalBytes: 4900 * 1024 * 1024,
    description: 'Ubuntu 22.04.5 LTS Desktop ISO',
    status: 'idle' 
  },
  { 
    id: 'sample-4', 
    name: 'alpine-standard-3.20.3-x86_64.iso',
    fileName: 'alpine-standard-3.20.3-x86_64.iso',
    url: 'https://dl-cdn.alpinelinux.org/alpine/v3.20/releases/x86_64/alpine-standard-3.20.3-x86_64.iso',
    size: '208 MB',
    totalBytes: 208 * 1024 * 1024,
    description: 'Alpine Linux 3.20.3 Standard ISO',
    status: 'idle' 
  },
];

