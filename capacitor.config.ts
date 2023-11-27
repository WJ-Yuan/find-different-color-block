import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.davidyuan.find_diff_color',
  appName: 'diff-color',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
