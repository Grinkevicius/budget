import type { CapacitorConfig } from '@capacitor/cli';

// capacitor.config.ts
const config: CapacitorConfig = {
  appId: 'com.example.myapp',
  appName: 'MyApp',
  webDir: 'public',
  server: {
    url: 'http://10.0.2.2:3000',
    cleartext: true
  }
};
export default config;
