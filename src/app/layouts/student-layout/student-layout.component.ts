import { Component } from '@angular/core';
import { SidebarComponent } from "../../components/side-bar/side-bar.component";
import { RouterOutlet } from "@angular/router";
import { NavbarComponent } from "../../components/nav-bar/nav-bar.component";

@Component({
  selector: 'app-student-layout',
  imports: [SidebarComponent, RouterOutlet, NavbarComponent],
  templateUrl: './student-layout.component.html',
  styleUrl: './student-layout.component.css'
})
export class StudentLayoutComponent {

}
