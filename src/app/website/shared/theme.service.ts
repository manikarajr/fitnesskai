import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkMode = false;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    
    // Only access localStorage if running in the browser
    if (this.isBrowser) {
      const savedTheme = localStorage.getItem('theme');
      this.darkMode = savedTheme === 'dark';
    }
  }

  isDarkMode(): boolean {
    return this.darkMode;
  }

  setDarkMode(isDark: boolean): void {
    this.darkMode = isDark;
    
    // Only access localStorage if running in the browser
    if (this.isBrowser) {
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }
  }
}