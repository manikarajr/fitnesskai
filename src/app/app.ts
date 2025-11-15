import { Component, OnInit, signal, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Header } from './website/shared/header/header';
import { Hero } from './website/components/hero/hero';
import { Services } from './website/components/services/services';
import { Features } from './website/components/features/features';
import { HowItWorks } from './website/components/how-it-works/how-it-works';
import { Pricing } from './website/components/pricing/pricing';
import { Footer } from './website/shared/footer/footer';
import { ThemeService } from './website/shared/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Header,Hero,Services,Features,HowItWorks,Pricing,Footer,CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit{
  protected readonly title = signal('gymwebsiteui');
  isDarkMode = false;
  private isBrowser: boolean;

  constructor(
    private themeService: ThemeService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    this.isDarkMode = this.themeService.isDarkMode();
    this.applyTheme();
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.setDarkMode(this.isDarkMode);
    this.applyTheme();
  }

  private applyTheme() {
    // Only access document if running in the browser
    if (this.isBrowser) {
      if (this.isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }
}