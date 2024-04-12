import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as L from 'leaflet';
import 'leaflet.fullscreen';
import 'leaflet.locatecontrol';
import 'leaflet-routing-machine';

import { IShop } from '../shop.model';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, ShopService } from '../service/shop.service';
import { ShopDeleteDialogComponent } from '../delete/shop-delete-dialog.component';
import { PermissionComponent } from '../permission/permission.component';
import { DataUtils } from 'app/core/util/data-util.service';
import { SortService } from 'app/shared/sort/sort.service';
import { HttpClient } from '@angular/common/http'; // Import HttpClient
import { UserDataService } from 'app/account/register/userData.service';

@Component({
  selector: 'jhi-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss', './shop2.component.scss'],
})
export class ShopComponent implements OnInit {
  shops?: IShop[];
  filteredShops?: IShop[];
  isLoading = false;
  map?: L.Map;
  mapReady = false;
  userLocation: L.LatLngTuple | null = null;
  userURL = '../../../../content/images/userLocationIcon.png';
  iconRetinaUrl = 'assets/marker-icon-2x.png';
  iconUrl = 'assets/marker-icon.png';
  shadowUrl = 'assets/marker-shadow.png';
  markerShadowUrl = '';
  searchQuery: string = '';
  selectedSortCriteria: string = 'sortBy';
  predicate = 'id';
  ascending = true;
  selectedShop: IShop | null = null;
  routingStarted: boolean = false;
  darkModeEnabled = false;

  // marker design
  protected userMarkerIcon = L.icon({
    iconUrl: this.userURL,
    shadowUrl: this.shadowUrl,
    iconSize: [53, 51],
    iconAnchor: [12, 41],
    popupAnchor: [15, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [55, 55],
    shadowAnchor: [5, 45],
  });

  protected shopMarkerIcon = L.icon({
    iconUrl: this.iconUrl,
    shadowUrl: this.shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41],
  });

  protected userMarker: L.Marker | null = null;
  protected shopMarker: L.Marker | null = null;

  constructor(
    protected shopService: ShopService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected dataUtils: DataUtils,
    protected modalService: NgbModal,
    private http: HttpClient, // Inject HttpClient
    private userDataService: UserDataService
  ) {}

  trackId = (_index: number, item: IShop): number => this.shopService.getShopIdentifier(item);

  ngOnInit(): void {
    setTimeout(() => {
      this.initMap();
    }, 100); // Adjust the delay as needed
    this.load();
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(shop: IShop): void {
    const modalRef = this.modalService.open(ShopDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.shop = shop;
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        switchMap(() => this.loadFromBackendWithRouteInformations())
      )
      .subscribe({
        next: (res: EntityArrayResponseType) => {
          this.onResponseSuccess(res);
        },
      });
  }

  onTableRowClick(event: MouseEvent, shopId: string) {
    const target = event.target as HTMLElement;
    if (!target.matches('.btn')) {
      // If the click target is not a button, navigate to the view page
      this.router.navigate(['/shop', shopId, 'view']);
    }
  }

  toggleDarkMode(): void {
    const mapContainer = document.getElementById('map-container-rectangle');
    if (mapContainer) {
      this.darkModeEnabled = !this.darkModeEnabled;
      if (this.darkModeEnabled) {
        mapContainer.classList.add('dark-mode');
      } else {
        mapContainer.classList.remove('dark-mode');
      }
    }
  }
  // Load all the shop location
  protected load(): void {
    this.loadFromBackendWithRouteInformations().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
        if (this.map) {
          this.displayAllShopLocation();
        }
      },
    });
  }

  navigateToWithComponentValues(): void {
    this.handleNavigation(this.predicate, this.ascending);
  }

  protected loadFromBackendWithRouteInformations(): Observable<EntityArrayResponseType> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.queryBackend(this.predicate, this.ascending))
    );
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const sort = (params.get(SORT) ?? data[DEFAULT_SORT_DATA]).split(',');
    this.predicate = sort[0];
    this.ascending = sort[1] === ASC;
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.shops = dataFromBody;
    console.log('Shops:', this.shops);
    this.filterShops();
  }

  //Preset unsed attributes to prevent the need of using a form to enter
  protected fillComponentAttributesFromResponseBody(data: IShop[] | null): IShop[] {
    const presetRating = 0;
    const presetDistance = 0;
    const presetDuration = 'PT0M';

    return (data ?? []).map(shop => ({
      ...shop,
      rating: presetRating,
      distance: presetDistance,
      duration: presetDuration,
    }));
  }

  protected queryBackend(predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject = {
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.shopService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(predicate?: string, ascending?: boolean): void {
    const queryParamsObj = {
      sort: this.getSortQueryParam(predicate, ascending),
    };

    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute,
      queryParams: queryParamsObj,
    });
  }

  protected getSortQueryParam(predicate = this.predicate, ascending = this.ascending): string[] {
    const ascendingQueryParam = ascending ? ASC : DESC;
    if (predicate === '') {
      return [];
    } else {
      return [predicate + ',' + ascendingQueryParam];
    }
  }

  //Filter Shops for search bar
  protected filterShops(): void {
    if (!this.searchQuery) {
      this.filteredShops = this.shops;
    } else {
      this.filteredShops = this.shops?.filter(
        shop =>
          shop.shopName?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          (shop.street + ', ' + shop.city + ', ' + shop.postCode + ', ' + shop.country)
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase())
      );
    }
  }

  protected goBack(): void {
    this.selectedShop = null; // Set selectedShop to null to go back to the non-selected state
    this.routingStarted = false;

    if (this.map) {
      this.map.remove();
      this.map = undefined;
    }

    // Initialize the map again
    this.initMap();
  }

  openPermissionModal(): void {
    // Open the permission modal
    const modalRef = this.modalService.open(PermissionComponent, { centered: true });
    modalRef.componentInstance.permissionGranted.subscribe(() => {
      // Subscribe to permissionGranted event
      this.getUserLocationAndSetupMap(); // Trigger getUserLocationAndSetupMap method
    });
  }

  //Initialize the map and setup real user location data
  protected initMap(): void {
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then(permissionStatus => {
        console.log(permissionStatus.state);
        if (permissionStatus.state === 'granted') {
          this.getUserLocationAndSetupMap();
        } else if (permissionStatus.state === 'prompt') {
          console.log('Geolocation permission is in the prompt state.');
          this.openPermissionModal();
        } else {
          console.log(permissionStatus.state);
          console.error('Geolocation permission denied.');
          // Handle permission denied scenario
        }
      });
    } else {
      console.error('Geolocation permissions API is not supported.');
      // Handle unsupported browser
    }
  }

  protected getUserLocationAndSetupMap(): void {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.userLocation = [position.coords.latitude, position.coords.longitude];
        this.setupMap();
      },
      error => {
        console.error('Error getting user location:', error);
        // Handle error
      }
    );
  }

  // Set up the map with user's location
  protected setupMap(): void {
    const username = this.userDataService.getUsername();
    console.log('Username:', username);

    if (this.map) {
      // If the map is already initialized, no need to initialize it again
      console.warn('Map is already initialized.');
      return;
    }

    const tileLayerUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const tileLayer = L.tileLayer(tileLayerUrl, {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    });

    try {
      const mapElement = document.getElementById('map-container-rectangle') as HTMLElement;
      if (!mapElement) {
        console.error('Map container not found.');
        return;
      }

      if (this.userLocation) {
        this.map = new L.Map(mapElement, {
          fullscreenControl: true,
          fullscreenControlOptions: {
            position: 'topleft',
          },
        }).setView(this.userLocation, 13);
        this.userMarker = L.marker(this.userLocation, { icon: this.userMarkerIcon })
          .addTo(this.map)
          .bindPopup(`${username}'s location`)
          .openPopup();
      } else {
        console.error('User location is not available.');
      }

      if (this.map) {
        tileLayer.addTo(this.map);
      } else {
        console.error('Map is not initialized.');
      }

      this.mapReady = true;
      this.displayAllShopLocation();
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }

  protected shopCoordinates: { [key: string]: L.LatLngTuple } = {};

  protected displayAllShopLocation(): void {
    if (!this.mapReady) {
      console.error('Map is not initialized for displaying shop locations.');
      return;
    }

    if (!this.shops || this.shops.length === 0) {
      console.error('No shops available.');
      return;
    }

    this.shops.forEach(shop => {
      const address = `${shop.street}, ${shop.city}, ${shop.postCode}, ${shop.country}`;
      const encodedAddress = encodeURIComponent(address);
      this.http.get<any>(`https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}`).subscribe({
        next: (response: any) => {
          if (response && response.length > 0) {
            const firstResult = response[0];
            const latitude = parseFloat(firstResult.lat);
            const longitude = parseFloat(firstResult.lon);

            // Define coordinates as LatLngTuple
            const coordinates: L.LatLngTuple = [latitude, longitude];

            // Store coordinates for this shop
            this.shopCoordinates[shop.id] = coordinates;

            // Calculate distance and duration from user location to shop location
            const distance = this.calculateDistance(this.userLocation![0], this.userLocation![1], latitude, longitude);
            const duration = this.calculateDuration(this.userLocation![0], this.userLocation![1], latitude, longitude);
            shop.distance = distance.value; // Assign the formatted distance value
            shop.duration = duration;

            // Create shopMarker with shopMarkerIcon
            const shopMarker = L.marker(coordinates, { icon: this.shopMarkerIcon });

            // Initialize shopMarker if it's not already initialized
            if (!this.shopMarker) {
              this.shopMarker = shopMarker;
            }

            // Check if map is defined before adding marker
            if (this.map) {
              shopMarker.addTo(this.map);
              shopMarker.bindPopup(`<b>${shop.shopName}</b><br>${shop.street}, ${shop.city}, ${shop.postCode}, ${shop.country}`);
              shopMarker.on('click', () => {
                shopMarker.openPopup();
              });
            } else {
              console.error('Map is not initialized for displaying shop locations.');
            }
          } else {
            console.error('No coordinates found for the address:', address);
          }
        },
        error: error => {
          console.error('Error fetching coordinates from Nominatim API:', error);
          console.error(`Coordinates for shop ${shop.id} are not available.`);
          // Handle error - you can log an error message and continue processing other shops
        },
      });
    });
  }

  protected degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  protected calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): { value: number } {
    const a = 6378137; // semi-major axis of the WGS84 ellipsoid in meters
    const f = 1 / 298.257223563; // flattening of the WGS84 ellipsoid
    const b = (1 - f) * a; // semi-minor axis

    const phi1 = this.degreesToRadians(lat1);
    const phi2 = this.degreesToRadians(lat2);
    const lambda1 = this.degreesToRadians(lon1);
    const lambda2 = this.degreesToRadians(lon2);

    const U1 = Math.atan((1 - f) * Math.tan(phi1));
    const U2 = Math.atan((1 - f) * Math.tan(phi2));
    const L = lambda2 - lambda1;

    let lambda = L;
    let lambdaPrev = 0;
    let iterationLimit = 100;

    let cosU1 = Math.cos(U1);
    let cosU2 = Math.cos(U2);
    let sinU1 = Math.sin(U1);
    let sinU2 = Math.sin(U2);
    let cosLambda;
    let sinLambda;
    let sinSigma;
    let cosSigma;
    let sigma;
    let sinAlpha;
    let cosSqAlpha;
    let cos2SigmaM;
    let C;

    do {
      sinLambda = Math.sin(lambda);
      cosLambda = Math.cos(lambda);
      sinSigma = Math.sqrt((cosU2 * sinLambda) ** 2 + (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda) ** 2);
      cosSigma = sinU1 * sinU2 + cosU1 * cosU2 * cosLambda;
      sigma = Math.atan2(sinSigma, cosSigma);
      sinAlpha = (cosU1 * cosU2 * sinLambda) / sinSigma;
      cosSqAlpha = 1 - sinAlpha ** 2;
      cos2SigmaM = cosSigma - (2 * sinU1 * sinU2) / cosSqAlpha;
      C = (f / 16) * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha));
      lambdaPrev = lambda;
      lambda = L + (1 - C) * f * sinAlpha * (sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM ** 2)));
    } while (Math.abs(lambda - lambdaPrev) > 1e-12 && --iterationLimit > 0);

    if (iterationLimit === 0) {
      console.error('Vincenty formula failed to converge');
      return { value: NaN }; // Unable to compute distance
    }

    const uSq = (cosSqAlpha * (a ** 2 - b ** 2)) / b ** 2;
    const A = 1 + (uSq / 16384) * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
    const B = (uSq / 1024) * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
    const deltaSigma =
      B *
      sinSigma *
      (cos2SigmaM +
        (B / 4) * (cosSigma * (-1 + 2 * cos2SigmaM ** 2) - (B / 6) * cos2SigmaM * (-3 + 4 * sinSigma ** 2) * (-3 + 4 * cos2SigmaM ** 2)));

    const s = b * A * (sigma - deltaSigma); // Distance in meters

    const distanceInKm = s / 1000;

    return { value: distanceInKm };
  }

  protected calculateDuration(lat1: number, lon1: number, lat2: number, lon2: number): string {
    // Assuming you have a method calculateDistance already defined
    const { value } = this.calculateDistance(lat1, lon1, lat2, lon2);

    // Assuming an average driving speed of 30 km/h
    const drivingSpeed = 30; // in km/h

    let durationHours = 0;
    durationHours = value / drivingSpeed;

    const durationMinutes = Math.round(durationHours * 60);

    if (durationMinutes >= 1440) {
      // More than 24 hours
      const days = Math.floor(durationMinutes / 1440);
      const hours = Math.floor((durationMinutes % 1440) / 60);
      return `${days} days ${hours} hours`;
    } else if (durationMinutes >= 60) {
      const hours = Math.floor(durationMinutes / 60);
      const remainingMinutes = Math.round(durationMinutes % 60);
      return `${hours} hours ${remainingMinutes} minutes`;
    } else {
      return `${Math.round(durationMinutes)} minutes`;
    }
  }

  //When user press the map-container-rectangle it will direct user to the location
  protected directSpecificShopLocation(shop: IShop): void {
    if (!this.map) {
      console.error('Map is not initialized for directing to a specific shop location.');
      return;
    }

    const address = `${shop.street}, ${shop.city}, ${shop.postCode}, ${shop.country}`;
    const encodedAddress = encodeURIComponent(address);
    this.http.get<any>(`https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}`).subscribe({
      next: (response: any) => {
        if (response && response.length > 0) {
          const firstResult = response[0];
          const latitude = parseFloat(firstResult.lat);
          const longitude = parseFloat(firstResult.lon);

          //Define coordinates as LatLngTuple
          const coordinates: L.LatLngTuple = [latitude, longitude];

          // Set the view and add marker if the map is defined
          if (this.map) {
            this.displaySelectedShopDetails(shop);
            this.map.setView(coordinates, 14.5);
            const shopMarker = L.marker(coordinates, {
              icon: this.shopMarkerIcon,
            }).addTo(this.map);
            shopMarker.bindPopup(`<b>${shop.shopName}</b><br>${shop.street}, ${shop.city}, ${shop.postCode}, ${shop.country}`).openPopup();
          }
        } else {
          console.error('No coordinates found for the address:', address);
        }
      },
      error: error => {
        console.error('Error fetching coordinates from Nominatim API:', error);
      },
    });
  }

  protected displaySelectedShopDetails(selectedShop: IShop): void {
    this.selectedShop = selectedShop;
  }

  protected startRouting(): void {
    if (!this.userLocation) {
      console.error('User location is not available.');
      return;
    }

    // Check if routing has already been started for the selected shop
    if (this.routingStarted) {
      console.error('Routing has already been started for the selected shop.');
      return;
    }

    if (!this.selectedShop || !this.selectedShop.id) {
      console.error('Selected shop information is incomplete.');
      return;
    }

    // Check if coordinates for the selected shop exist in shopCoordinates
    if (!this.shopCoordinates[this.selectedShop.id]) {
      console.error('Coordinates for the selected shop are not available.');
      return;
    }

    // Fetch the coordinates from shopCoordinates
    const shopCoordinates: L.LatLngTuple = this.shopCoordinates[this.selectedShop.id];

    // Call the routing method
    this.routeUserToShop(this.userLocation, shopCoordinates);

    // Set routingStarted flag to true
    this.routingStarted = true;
  }

  protected routeUserToShop(
    userLocation: L.LatLngTuple | null,
    shopCoordinates: L.LatLngTuple,
    displayRoute: boolean = true
  ): { distance: number; duration: string } {
    const result = { distance: 0, duration: '' };

    // Check if map is defined before adding markers and routing
    if (!this.map) {
      console.error('Map is not initialized for routing.');
      return result;
    }

    // Check if userLocation is available
    if (!userLocation) {
      console.error('User location is not available for routing.');
      return result;
    }

    // Reuse existing markers for user's location and shop's location
    if (!this.userMarker || !this.shopMarker) {
      console.error('User marker or shop marker is not initialized.');
      return result;
    }

    // Update the position of existing markers
    this.userMarker.setLatLng(userLocation);
    this.shopMarker.setLatLng(shopCoordinates);

    const waypoints = [L.latLng(userLocation[0], userLocation[1]), L.latLng(shopCoordinates[0], shopCoordinates[1])];

    const icons = [this.userMarkerIcon, this.shopMarkerIcon];

    const markers = waypoints.map((waypoint, index) =>
      L.marker(waypoint, {
        icon: icons[index],
        draggable: false, // Set draggable to false to prevent markers from being draggable
      })
    );

    const createMarker = (i: number, wp: L.LatLng): L.Marker => markers[i];

    const routingControlOptions = {
      waypoints: waypoints,
      createMarker: displayRoute ? createMarker : null, // Only create markers if displayRoute is true
      show: displayRoute,
      addWaypoints: false,
      fitSelectedRoutes: true,
      routeWhileDragging: false,
      showAlternatives: false,
      collapsible: true,
    };

    const routingControl = L.Routing.control(routingControlOptions).addTo(this.map);

    routingControl.on('routeselected', (e: any) => {
      const route = e.route;
      result.distance = route.summary.totalDistance / 1000; // Distance in kilometers
      const roundedDistance = result.distance < 1 ? (result.distance * 1000).toFixed() + ' meters' : result.distance.toFixed(2) + ' km';
      const totalMinutes = route.summary.totalTime / 60; // Duration in minutes

      if (totalMinutes >= 1440) {
        // More than 24 hours
        const days = Math.floor(totalMinutes / 1440);
        const hours = Math.floor((totalMinutes % 1440) / 60);
        result.duration = `${days} days ${hours} hours`;
      } else if (totalMinutes >= 60) {
        const hours = Math.floor(totalMinutes / 60);
        const remainingMinutes = Math.round(totalMinutes % 60);
        result.duration = `${hours} hours ${remainingMinutes} minutes`;
      } else {
        result.duration = `${Math.round(totalMinutes)} minutes`;
      }

      const distanceElements = document.querySelectorAll('.selected-shop-distance');
      const durationElements = document.querySelectorAll('.selected-shop-duration');

      // Loop through each distance element and update its inner text
      distanceElements.forEach(element => {
        if (result.distance !== null) {
          (element as HTMLElement).innerText = `${roundedDistance}`;
        } else {
          (element as HTMLElement).innerText = 'Distance not available';
        }
      });

      // Loop through each duration element and update its inner text
      durationElements.forEach(element => {
        if (result.duration !== null) {
          (element as HTMLElement).innerText = `${result.duration}`;
        } else {
          (element as HTMLElement).innerText = 'Duration not available';
        }
      });
    });

    return result;
  }

  //Sort By function to sort the arrangement of the map-container-rectangle to see which are the highest rating, nearest distance, shortest duration
  protected sortFilteredShops(): void {
    if (!this.selectedSortCriteria) {
      return;
    }

    switch (this.selectedSortCriteria) {
      case 'highestRating':
        // Sort by highest rating
        this.filteredShops = this.filteredShops?.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'shortestDisDur':
        // Sort by shortest distance or duration
        // This sorting depends on pre-calculated distance and duration properties on each shop
        // You may need to adjust the property names based on your actual implementation
        this.filteredShops = this.filteredShops?.sort((a, b) => {
          // Sort by distance if available, otherwise sort by duration
          const aDistance = a.distance || Number.MAX_VALUE;
          const bDistance = b.distance || Number.MAX_VALUE;
          const aDuration = a.duration ? parseFloat(a.duration) : Number.MAX_VALUE; // Convert duration to number if it exists
          const bDuration = b.duration ? parseFloat(b.duration) : Number.MAX_VALUE; // Convert duration to number if it exists

          // Compare distances first
          if (aDistance !== bDistance) {
            return aDistance - bDistance;
          } else {
            // If distances are equal, compare durations
            return aDuration - bDuration;
          }
        });
        break;
      case 'alphabeticalOrder':
        // Sort alphabetically by shop name
        this.filteredShops = this.filteredShops?.sort((a, b) => {
          // Use localeCompare for case-insensitive alphabetical sorting
          return (a.shopName || '').localeCompare(b.shopName || '');
        });
        break;
      default:
        break;
    }
  }
}
