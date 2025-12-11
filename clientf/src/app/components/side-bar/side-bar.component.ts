import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './side-bar.component.html'
})
export class SidebarComponent implements OnInit {
  collapsed = false;
  showSidebar = true;

  navItems = [
    { label: 'Home', link: '/home', icon: 'home' },
    { label: 'Lessons', link: '/lessons', icon: 'menu_book' },
    { label: 'Completed Courses', link: '/completed-courses', icon: 'check_circle' },
    { label: 'Vision and Mission', link: '/vission', icon: 'visibility' },
    { label: 'Feedback', link: '/feedback', icon: 'rate_review' },
    { label: 'Profile', link: '/Profile', icon: 'account_circle' },
  ];

  getIconGradient(label: string): string {
    const gradients: { [key: string]: string } = {
      Home: 'from-pink-500 to-red-500',
      Network: 'from-indigo-500 to-purple-500',
      'Completed Courses': 'from-green-500 to-emerald-500',
      Vission: 'from-blue-500 to-cyan-500',
      Feedback: 'from-yellow-500 to-orange-500',
      Profile: 'from-rose-500 to-pink-500',
    };
  
    const gradient = gradients[label] || 'from-gray-500 to-gray-700';
    return `bg-gradient-to-r ${gradient}`;
  }
  

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.showSidebar = window.innerWidth >= 768;                         
  }
  
  isActiveRoute(route: string): boolean {
    return this.router.url.includes(route);
  }

  logout(): void{
    localStorage.removeItem('token');
      this.router.navigate(['/login']);
  }
}
