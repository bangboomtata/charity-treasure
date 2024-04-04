import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
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
import { DataUtils } from 'app/core/util/data-util.service';
import { SortService } from 'app/shared/sort/sort.service';
import { HttpClient } from '@angular/common/http'; // Import HttpClient

@Component({
  selector: 'jhi-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
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

  constructor(
    protected shopService: ShopService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected dataUtils: DataUtils,
    protected modalService: NgbModal,
    private http: HttpClient // Inject HttpClient
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

  protected fillComponentAttributesFromResponseBody(data: IShop[] | null): IShop[] {
    return data ?? [];
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
  }

  //Initialize the map and setup real user location data
  protected initMap(): void {
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then(permissionStatus => {
        if (permissionStatus.state === 'granted') {
          this.getUserLocationAndSetupMap();
        } else if (permissionStatus.state === 'prompt') {
          // The user hasn't decided yet, so you may want to show a message asking for permission
          // You can handle this case according to your UI/UX requirements
        } else {
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
            content: '[--]',
          },
        }).setView(this.userLocation, 13);
        const userMarker = L.marker(this.userLocation, {
          icon: L.icon({
            iconUrl: this.userURL,
            shadowUrl: this.shadowUrl,
            iconSize: [53, 51],
            iconAnchor: [12, 41],
            popupAnchor: [15, -34],
            tooltipAnchor: [16, -28],
            shadowSize: [55, 55],
            shadowAnchor: [5, 45],
          }),
        })
          .addTo(this.map)
          .bindPopup('User Location')
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

  protected displayAllShopLocation(): void {
    if (!this.mapReady) {
      console.error('Map is not initialized for displaying shop locations.');
      return;
    }

    if (!this.shops) {
      console.error('No shops available.');
      return;
    }

    const map = this.map; // Store a reference to this.map in a local variable
    this.shops.forEach(shop => {
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

            const shopMarker = L.marker(coordinates, {
              icon: L.icon({
                iconUrl: this.iconUrl,
                shadowUrl: this.shadowUrl,
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                tooltipAnchor: [16, -28],
                shadowSize: [41, 41],
              }),
            });

            // Check if map is defined before adding marker
            if (map) {
              shopMarker.addTo(map);
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
        },
      });
    });
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
              icon: L.icon({
                iconUrl: this.iconUrl,
                shadowUrl: this.shadowUrl,
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                tooltipAnchor: [16, -28],
                shadowSize: [41, 41],
              }),
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

  // protected startRouting(): void {
  //   if (this.selectedShop && this.userLocation && this.map) {
  //     L.Routing.control({
  //       waypoints: [
  //         L.latLng(this.userLocation[0], this.userLocation[1]),
  //         L.latLng(this.selectedShop.latitude, this.selectedShop.longitude)
  //       ],
  //       routeWhileDragging: true,
  //       show: true,
  //       createMarker: function(i, wp, nWps) {
  //         if (i === 0) {
  //           // User's location
  //           return L.marker(wp.latLng, {
  //             icon: L.icon({
  //               iconUrl: 'path/to/user-location-icon.png', // Replace with your user location icon
  //               iconSize: [32, 32],
  //             })
  //           });
  //         } else {
  //           // Shop's location
  //           return L.marker(wp.latLng, {
  //             icon: L.icon({
  //               iconUrl: 'path/to/shop-icon.png', // Replace with your shop location icon
  //               iconSize: [32, 32],
  //             })
  //           });
  //         }
  //       }
  //     }).addTo(this.map);
  //   }
  // }

  //Sort By function to sort the arrangement of the map-container-rectangle to see which are the highest rating, nearest distance, shortest duration
  protected sortFilteredShops(): void {
    if (!this.selectedSortCriteria) {
      return;
    }

    switch (this.selectedSortCriteria) {
      case 'highestRating':
        // this.filteredShops = this.filteredShops?.sort((a, b) => (a.rating > b.rating ? -1 : 1));
        break;
      case 'nearestDistance':
        // Implement sorting by distance
        // You may need to calculate the distance from the universityCoordinates to each shop's location
        // and then sort the shops accordingly
        break;
      case 'shortestDuration':
        // Implement sorting by duration
        // You may need additional information to calculate the duration to each shop
        // and then sort the shops accordingly
        break;
      default:
        break;
    }
  }
}
