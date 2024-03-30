/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { Map } from 'maplibre-gl';
import * as maplibregl from 'maplibre-gl';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'damen-map',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule],
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
})
export class LocationComponent implements AfterViewInit, OnDestroy {
  private map!: Map;

  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>;

  @Output() locationSelected = new EventEmitter<{ lat: number; lon: number }>();

  ngAfterViewInit() {
    const initialState = { lng: 79.86124, lat: 6.9271, zoom: 7 };
    this.map = new Map({
      container: this.mapContainer.nativeElement,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=ATb0Uxk3RottlqcPUOCz`,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom,
    });
    this.map.on('click', (event: maplibregl.MapMouseEvent) => {
      const { lngLat } = event;
      const [longitude, latitude] = lngLat.toArray();
      console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
      this.locationSelected.emit({ lat: latitude, lon: longitude });
    });

    this.map.addControl(new maplibregl.NavigationControl());
  }

  ngOnDestroy() {
    this.map?.remove();
  }
}
