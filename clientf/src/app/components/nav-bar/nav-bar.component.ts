import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  userName = '';
  userImage = '';
  menuOpen = false;
  unreadCount = 0;
  notifPanelOpen = false;
  logoutModalOpen = false;
  private socketSub?: Subscription;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    document.addEventListener('click', this.closeMenuOnOutsideClick.bind(this));

  }

  ngOnDestroy(): void {
    this.socketSub?.unsubscribe();
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  toggleNotifPanel(): void {
    this.notifPanelOpen = !this.notifPanelOpen;
  }

  viewProfile(): void {
    this.menuOpen = false;
    this.router.navigate(['/my-profile']);
  }

  closeMenuOnOutsideClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const isInside = target.closest('.relative'); // The profile dropdown wrapper
    if (!isInside) {
      this.menuOpen = false;
    }
  }

  openLogoutModal(): void {
    this.menuOpen = false; // close dropdown
    this.logoutModalOpen = true;
  }

  // UPDATED: Log out directly from component
  logOut(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userid');
    localStorage.removeItem('role');
    this.logoutModalOpen = false; // close modal
    this.router.navigate(['/login']);
  }

  onNotificationsRead() {
    this.unreadCount = 0;
  }
}
