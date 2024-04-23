/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Map } from 'maplibre-gl';
import { RESQUERS, Resquer } from './map.component.resquers';
import * as maplibregl from 'maplibre-gl';
import { CommonModule } from '@angular/common';
import { Store } from '@ngxs/store';
import { GetHospitals, UpdateUserM } from './_state/map.actions';
import { switchMap, tap } from 'rxjs';
import { MapState } from './_state/map.state';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LocationComponent } from '../login/location-pick/location.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ILocation } from '@damen/models';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'damen-map',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule, MatDialogModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit, OnDestroy, OnInit {
  private map!: Map;
  searchLocation?: string = '';
  resquers: Resquer[] = RESQUERS;

  currentLocation: { latitude: number; longitude: number } | null = null;
  nearestLocation: { name: string; distance: number } | null = null;

  locations?: any[];
  level?: string;

  location?: ILocation;

  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>;

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const dialogRef = this.dialog.open(LocationComponent, {
      width: '60%',
      height: '60%',
    });
    dialogRef.componentInstance.locationSelected.subscribe(
      (selectedLocation: { lat: number; lon: number }) => {
        if (selectedLocation) {
          this.location = {
            lat: selectedLocation.lat,
            lon: selectedLocation.lon,
          };
          dialogRef.close();
        }
      }
    );

    this.route.queryParams.subscribe((params) => {
      this.level = params['level'];

      console.log('level', this.level);
    });
  }

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
    });

    this.map.addControl(new maplibregl.NavigationControl());

    this.store
      .dispatch(new GetHospitals())
      .pipe(
        switchMap(() => this.store.select(MapState.hospitals)),
        tap((hospitals) => {
          this.locations = hospitals;
          this.addMarkers();
          this.getCurrentLocation();
        })
      )
      .subscribe();
  }

  private getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const { latitude, longitude } = position.coords;
          this.addMarker([longitude, latitude]);
          this.setMapCenter([longitude, latitude]);
          this.currentLocation = { latitude, longitude };
          this.findNearestLocation();
        },
        (error: GeolocationPositionError) => {
          console.error('Error getting current position:', error.message);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  private addMarker(coordinates: [number, number]) {
    new maplibregl.Marker().setLngLat(coordinates).addTo(this.map);
  }

  private setMapCenter(coordinates: [number, number]) {
    this.map.setCenter(coordinates);
  }

  private addMarkers() {
    if (this.locations)
      this.locations.forEach((resquer) => {
        const { firstName, location, email, _id } = resquer;
        const marker = new maplibregl.Marker({ color: '#B70404' }).setLngLat([
          location?.lon,
          location?.lat,
        ]);
        const popupContent = document.createElement('div');
        popupContent.innerHTML = `
          <h3>${firstName}</h3>
          <a>0771234567</a>
          <p>${email}</p>

        `;

        if (this.level) {
          popupContent.innerHTML += `
            <button id="sendEmailBtn">Notify hospital</button>
          `;
        }
        const popup = new maplibregl.Popup().setDOMContent(popupContent);

        marker.setPopup(popup).addTo(this.map);

        // Attach click event listener to the button
        popupContent
          .querySelector('#sendEmailBtn')
          ?.addEventListener('click', () => {
            // Send email logic here
            // const subject = 'hello';
            // const body = 'This is body';
            // const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(
            //   subject
            // )}&body=${encodeURIComponent(body)}`;
            // window.location.href = mailtoLink;
            this.anotherMethod(_id);
          });
      });
  }

  anotherMethod(id: string) {
    if (this.location) {
      console.log('hello', id);
      const user = {
        notification: [
          {
            name: 'Name',
            level: 'Level 2',
            url: `https://www.google.com/maps/place/${
              this.location.lat ?? ''
            },${this.location.lon}`,
          },
        ],
      };
      this.store.dispatch(new UpdateUserM(id, user));
    }
  }

  private findNearestLocation() {
    if (this.currentLocation && this.locations) {
      let nearestDistance = Number.MAX_VALUE;
      let nearestLocation: { name: string; distance: number } | null = null;

      this.locations.forEach((resquer) => {
        const distance = this.calculateDistance(
          this.currentLocation!.latitude,
          this.currentLocation!.longitude,
          resquer.location?.lat,
          resquer.location?.lon
        );
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestLocation = { name: resquer.firstName, distance };
        }
      });

      this.nearestLocation = nearestLocation;
    }
  }

  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Radius of the earth in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  ngOnDestroy() {
    this.map?.remove();
  }
}
