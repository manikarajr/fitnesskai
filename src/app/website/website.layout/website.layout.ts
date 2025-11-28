import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../shared/header/header';
import { Hero } from '../components/hero/hero';
import { Services } from '../components/services/services';
import { Features } from '../components/features/features';
import { HowItWorks } from '../components/how-it-works/how-it-works';
import { Pricing } from '../components/pricing/pricing';
import { Footer } from '../shared/footer/footer';
import { ThemeService } from '../../shared/theme.service';


@Component({
  selector: 'app-website-layout',
  standalone: true,
  templateUrl: './website.layout.html',
  imports: [
    CommonModule,
    Header,
    Hero,
    Services,
    Features,
    HowItWorks,
    Pricing,
    Footer
  ]
})
export class WebsiteLayout {
  constructor(public themeService: ThemeService) {}
}
