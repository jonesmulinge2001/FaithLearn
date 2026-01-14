import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SidebarComponent {

  constructor(private router: Router) {}

  @Input() activeSection: string = 'dashboard';
  @Input() isCollapsed: boolean = false;
  @Input() isDarkMode: boolean = false;

  @Output() sectionChange = new EventEmitter<string>();

  menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: 'dashboard', route: '/admin/dashboard' },
    { id: 'users', label: 'User Management', icon: 'group', route: '/admin/manage-users' },
    { id: 'create', label: 'Create Lessons', icon: 'article', route: '/admin/create-lesson' },
    { id: 'Courses', label: 'All Lessons', icon: 'chat', route: '/admin/lessons' },
    { id: 'analytics', label: 'Analytics & Growth', icon: 'bar_chart', route: '/admin/manage-analytics' },
    { id: 'Logout', label: 'Logout', icon: 'logout', route: '/login' },
    { id: 'Course', label: 'Create Course', icon: 'article', route: '/admin/course'}
  ];

  // --- Modal state ---
  showLogoutModal: boolean = false;
  logoutItem!: MenuItem;

  // --- Section selection ---
  onSectionSelect(item: MenuItem) {
    if (item.id === 'Logout') {
      this.logoutItem = item;
      this.showLogoutModal = true; // open modal
      return;
    }
    this.activeSection = item.id;        
    this.router.navigate([item.route]);  
  }

  // --- Modal actions ---
  confirmLogout() {
    if (this.logoutItem) {
      this.activeSection = this.logoutItem.id;
      this.router.navigate([this.logoutItem.route]);
      this.showLogoutModal = false;
    }
  }

  cancelLogout() {
    this.showLogoutModal = false;
  }

}
