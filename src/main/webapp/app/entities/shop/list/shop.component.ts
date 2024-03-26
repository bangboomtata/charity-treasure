import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as L from 'leaflet';
import 'leaflet.fullscreen';
// import '../../../../../../../node_modules/leaflet.fullscreen/Control.FullScreen.css'

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
  universityCoordinates: [number, number] = [52.4508, -1.9305]; // University of Birmingham's coordinates
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
      this.initMapForUniversity();
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

  //Initialise Map preset at University of Birmingham
  protected initMapForUniversity(): void {
    const tileLayerUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
    const tileLayer = L.tileLayer(tileLayerUrl, {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    });

    try {
      // Get the map container element by id
      const mapElement = document.getElementById('map-container-rectangle') as HTMLDivElement;
      console.log('Map Element:', mapElement);
      if (!mapElement) {
        console.error('Map container not found.');
      }

      // Initialize the map with the University of Birmingham's coordinates
      this.map = new L.Map(mapElement, {
        fullscreenControl: true,
        fullscreenControlOptions: {
          position: 'topleft',
          content: '[--]',
        },
      }).setView(this.universityCoordinates, 13);
      tileLayer.addTo(this.map);
      const universityMarker = L.marker(this.universityCoordinates, {
        icon: L.icon({
          iconUrl: this.userURL,
          shadowUrl: this.shadowUrl,
          iconSize: [53, 51],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          tooltipAnchor: [16, -28],
          shadowSize: [41, 41],
        }),
      }).addTo(this.map);

      // Set the flag to indicate that the map is ready
      this.mapReady = true;
      // this.map.addControl(new L.Control.Fullscreen());
      // Call the method to display all shop locations
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
