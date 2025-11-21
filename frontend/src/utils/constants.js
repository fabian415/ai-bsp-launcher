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
    id: 1, 
    name: 'QSC-8250_L.35.4.1_BSP.tar.gz', 
    size: '4.2 GB', 
    date: '2023-10-15', 
    status: 'downloaded' 
  },
  { 
    id: 2, 
    name: 'AGX-Orin_R35.3.1_Source.tbz2', 
    size: '6.8 GB', 
    date: '2023-10-12', 
    status: 'downloading', 
    progress: 45 
  },
  { 
    id: 3, 
    name: 'RK3588_Android12_SDK_v1.0.zip', 
    size: '12.5 GB', 
    date: '2023-09-28', 
    status: 'idle' 
  },
  { 
    id: 4, 
    name: 'IMX8M-PLUS_Yocto_Kirkstone.iso', 
    size: '2.1 GB', 
    date: '2023-09-20', 
    status: 'idle' 
  },
];

