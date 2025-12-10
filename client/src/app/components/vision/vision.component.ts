import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vision',
  imports: [CommonModule],
  templateUrl: './vision.component.html',
  styleUrl: './vision.component.css'
})
export class VisionComponent implements OnInit{

  showContent = false;
  private words = ["Rooted", "Equipped", "Transformed", "Sent"];
  private wordIndex = 0;


  ngOnInit(): void {
    setTimeout(() => {
      this.showContent = true;
    }, 300);
    this.startWordRotation();
  }

  startWordRotation() {
    const rotateText = document.getElementById("rotateWord");

    if (!rotateText) return;

    rotateText.textContent = this.words[this.wordIndex];

    setInterval(() => {
      this.wordIndex = (this.wordIndex + 1) % this.words.length;
      rotateText.textContent = this.words[this.wordIndex];
    }, 2000);
  }
}
