import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Footer } from '../footer/footer';
@Component({
  selector: 'app-welcome-page',
  standalone: false,
  templateUrl: './welcome-page.html',
  styleUrl: './welcome-page.css',
})
export class WelcomePage implements OnInit, OnDestroy {
 images: string[] = [
    '487935676_712049974480962_8630145401459821294_n.jpg', 
    '495013762_734617602224199_3155305953549467942_n.jpg', 
    '495640799_739679795051313_8603592928694249401_n.jpg',
    '496096637_740245541661405_7367560282790776295_n.jpg',
    '496296873_742854854733807_9190247843246751710_n.jpg',
    'kep1.jpg'
  ];
  currentIndex: number = 0;
  private interval: any;

  ngOnInit(): void {
    this.startSlideshow();
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  prevSlide(): void {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  goToSlide(index: number): void {
    this.currentIndex = index;
    this.resetTimer();
  }

private startSlideshow(): void {
    this.clearTimer();
    this.interval = setInterval(() => {
      this.nextSlide();
      this.cdr.detectChanges(); // <-- kényszerített frissítés
    }, 3000);
  }
  constructor(private cdr: ChangeDetectorRef) {}



  private resetTimer(): void {
    this.clearTimer();
    this.startSlideshow();
  }

  private clearTimer(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }


}
