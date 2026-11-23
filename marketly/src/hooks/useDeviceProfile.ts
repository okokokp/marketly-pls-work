import { useEffect, useState } from 'react';

export type DeviceType = 'pc' | 'laptop' | 'tablet' | 'phone';

export interface DeviceProfile {
  deviceType: DeviceType;
  isPhone: boolean;
  isTablet: boolean;
  isLaptop: boolean;
  isPc: boolean;
  width: number;
  height: number;
  aspectRatio: number;
  isWidescreen: boolean;
}

function computeDeviceProfile(): DeviceProfile {
  if (typeof window === 'undefined') {
    return {
      deviceType: 'pc',
      isPhone: false,
      isTablet: false,
      isLaptop: false,
      isPc: true,
      width: 1920,
      height: 1080,
      aspectRatio: 16 / 9,
      isWidescreen: true,
    };
  }

  const width = window.innerWidth;
  const height = Math.max(1, window.innerHeight);
  const aspectRatio = width / height;

  let deviceType: DeviceType = 'laptop';
  if (width < 768) {
    deviceType = 'phone';
  } else if (width < 1024) {
    deviceType = 'tablet';
  } else if (width >= 1440 || (width >= 1280 && aspectRatio >= 1.65)) {
    deviceType = 'pc';
  } else {
    deviceType = 'laptop';
  }

  return {
    deviceType,
    isPhone: deviceType === 'phone',
    isTablet: deviceType === 'tablet',
    isLaptop: deviceType === 'laptop',
    isPc: deviceType === 'pc',
    width,
    height,
    aspectRatio,
    isWidescreen: aspectRatio >= 1.6,
  };
}

export function useDeviceProfile(): DeviceProfile {
  const [profile, setProfile] = useState<DeviceProfile>(() => computeDeviceProfile());

  useEffect(() => {
    const update = () => setProfile(computeDeviceProfile());
    update();
    window.addEventListener('resize', update, { passive: true });
    window.addEventListener('orientationchange', update, { passive: true });

    const pointerMq =
      typeof window.matchMedia === 'function'
        ? window.matchMedia('(pointer: coarse)')
        : null;
    pointerMq?.addEventListener('change', update);

    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
      pointerMq?.removeEventListener('change', update);
    };
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.dataset.device = profile.deviceType;
  }, [profile.deviceType]);

  return profile;
}
