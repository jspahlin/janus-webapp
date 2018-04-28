import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Location } from '../../entities/location-entities/Location';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { UrlService } from '../urls/url.service';
import { Building } from '../../entities/location-entities/Building';
import { Room } from '../../entities/location-entities/Room';


@Injectable()
export class LocationService {
  private location = new BehaviorSubject<any>([]);
  publicLocation = this.location.asObservable();

  // Injecting UrlService and HttpClient into LocationService constructor //
  constructor(private httpClient: HttpClient, private urls: UrlService) { }

  // get all Locations //
  getAllLocations() {
    return this.httpClient.get<Location>(this.urls.location.getAllLocations()).subscribe(
      (payload) => {
        this.location.next(payload);
        console.log(payload);
      }
    );
  }
  // get Location by Id //
  getLocation(location: Location) {
    return this.httpClient.get<Location>(this.urls.location.getLocationById(location.locationId));
  }
  // set new Location //
  newLocation(location: Location) {
    return this.httpClient.post<Location>(this.urls.location.postLocation(), JSON.stringify(location));
  }
  // update the location //
  updateLocation(location: Location) {
    return this.httpClient.post<Location>(this.urls.location.putLocationById(location.locationId), JSON.stringify(location));
  }
  // set location as inactive //
  deleteLocation(location: Location) {
    return this.httpClient.post<Location>(this.urls.location.deleteLocationById(location.locationId), JSON.stringify(location));
  }
  // get all Buildings //
  getAllBuildings() {
    return this.httpClient.get<Building>(this.urls.building.getAllBuildings());
  }
  // get Building by Id //
  getOneBuilding(building: Building) {
    return this.httpClient.get<Building>(this.urls.building.getBuildingById(building.buildingId));
  }
  // set new Building //
  newBuilding(building: Building) {
    return this.httpClient.post<Building>(this.urls.building.postBuilding(), JSON.stringify(building));
  }
  // update Building //
  updateBuilding(building: Building) {
    return this.httpClient.put<Building>(this.urls.building.putBuildingById(building.buildingId), JSON.stringify(building));
  }
  // set Building as inactive //
  deleteBuilding(building: Building) {
    return this.httpClient.delete<Building>(this.urls.building.deleteBuildingById(building.buildingId));
  }

  getAllRooms() {
    return this.httpClient.get<Room>(this.urls.room.getAllRooms());
  }
  getOneRoom(room: Room) {
    return this.httpClient.get<Room>(this.urls.room.getRoomById(room.roomId));
  }
  newRoom(room: Room) {
    return this.httpClient.post<Room>(this.urls.room.postRoom(), JSON.stringify(room));
  }
  updateRoom(room: Room) {
    return this.httpClient.put<Room>(this.urls.room.putRoomById(room.roomId), JSON.stringify(room));
  }
  deleteRoom(room: Room) {
    return this.httpClient.delete<Room>(this.urls.room.deleteRoomById(room.roomId));
  }


}
