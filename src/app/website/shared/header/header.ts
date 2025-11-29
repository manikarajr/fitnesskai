import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  isDark = false;
  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.loadTheme();
    }
  }

  loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    this.isDark = savedTheme === 'dark';
    this.applyTheme();
  }

  toggleTheme() {
    this.isDark = !this.isDark;
    this.applyTheme();
    if (this.isBrowser) {
      localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
    }
  }

  applyTheme() {
    if (this.isBrowser) {
      if (this.isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  scrollToSection(sectionId: string) {
    if (this.isBrowser) {
      const element = document.getElementById(sectionId);
      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  }

  scrollToTop() {
    if (this.isBrowser) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }
}