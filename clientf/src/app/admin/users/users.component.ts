import { Component, OnInit } from '@angular/core';
import { User } from '../../interfaces/interfaces';
import { AdminUserService } from '../../services/users.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  loading: boolean = false;
  searchTerm: string = '';
  filteredUsers: User[] = [];

  // modal handling
  selectedUser?: User;

  constructor(private adminUserService: AdminUserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.adminUserService.getAllUsers().subscribe({
      next: (res: any) => {
        this.users = res.data;
        this.filteredUsers = res.data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading users', err);
        this.loading = false;
      },
    });
  }

  onSearch(term: string): void {
    this.filteredUsers = this.users.filter((user) => {
      user.name.toLocaleLowerCase().includes(term.toLocaleLowerCase()) ||
        user.email.toLocaleLowerCase().includes(term.toLocaleLowerCase());
    });
  }
}
