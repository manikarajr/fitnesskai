import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Gym {
  id: number;
  name: string;
  owner: string;
  email: string;
  phone: string;
  address: string;
  plan: string;
  members: number;
  trainers: number;
  status: string;
  joinedDate: Date;
  revenue: number;
}

@Injectable({
  providedIn: 'root'
})
export class GymService {
  private http = inject(HttpClient);
  private apiUrl = 'api/gyms'; // Replace with your actual API URL

  getGyms(): Observable<Gym[]> {
    return this.http.get<Gym[]>(this.apiUrl);
  }

  getGym(id: number): Observable<Gym> {
    return this.http.get<Gym>(`${this.apiUrl}/${id}`);
  }

  createGym(gym: Partial<Gym>): Observable<Gym> {
    return this.http.post<Gym>(this.apiUrl, gym);
  }

  updateGym(id: number, gym: Partial<Gym>): Observable<Gym> {
    return this.http.put<Gym>(`${this.apiUrl}/${id}`, gym);
  }

  deleteGym(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}