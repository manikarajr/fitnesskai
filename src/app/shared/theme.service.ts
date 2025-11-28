import { Injectable, signal, effect, inject } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  private _isDarkMode = signal<boolean>(false);

  constructor() {
    if (this.isBrowser) {
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      this._isDarkMode.set(savedTheme === 'dark' || (!savedTheme && prefersDark));

      effect(() => this.applyTheme(this._isDarkMode()));
    }
  }

  isDarkMode(): boolean {
    return this._isDarkMode();
  }

  setDarkMode(isDark: boolean): void {
    this._isDarkMode.set(isDark);
  }

  toggleTheme(): void {
    this._isDarkMode.update(v => !v);
  }

  private applyTheme(isDark: boolean) {
    if (!this.isBrowser) return;

    const root = document.documentElement;

    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }
}
