import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { AdminUser, GenericResponse } from "../interfaces/interfaces";

@Injectable({
    providedIn: 'root'
})
export class AdminUserService {
    private readonly baseUrl = `${environment.apiBase}/admin/user`;
    constructor(private http: HttpClient) {}

    private getAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        return new HttpHeaders({
            Authorization: `Bearer ${token}`
        });
    }

    getAllUsers(): Observable<AdminUser[]> {
        return this.http.get<AdminUser[]>(this.baseUrl);
    }

    getuserById(id: string): Observable<AdminUser> {
        return this.http.get<AdminUser>(`${this.baseUrl}/${id}`);
    }

    getUserByEmail(email: string): Observable<AdminUser> {
        return this.http.get<AdminUser>(`${this.baseUrl}/email`)
    }

    deleteUser(id: string): Observable<GenericResponse> {
        return this.http.delete<GenericResponse>(`${this.baseUrl}/${id}`)
    }
}