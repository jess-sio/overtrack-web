import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class UserLoginService {
    private loginUrl = 'https://api.overtrack.uint8.me/user';
    public logoutUrl = 'https://api.overtrack.uint8.me/logout';
    private currentUser: User = null;
    private authUrl: string;

    constructor (private http: Http) {}

    getUser(): User {
        return this.currentUser;
    }

    getAuthUrl(): string {
        return this.authUrl;
    }

    logout(callback: (string) => void) {
        this.http.get(this.logoutUrl, { withCredentials: true}).subscribe(
                res => {
                    const token = res.json().token;
                    callback(token);
                },
                err => {
                    console.log(err);
                }
            );
    }

    fetchUser(callback: () => void) {
         this.http.get(this.loginUrl, { withCredentials: true}).subscribe(
                res => {
                    const body = res.json();
                    this.currentUser = {
                        superuser: body.superuser,
                        id       : body["user-id"],
                        battletag: body.battletag
                    };
                    callback();
                },
                err => {
                    const body = err.json();
                    this.authUrl = body.authenticate_url;
                    this.currentUser = null;
                    callback();
                }
            );
    }
}

// TODO: Move out into own model file
export class User {
    superuser: boolean;
    id: number;
    battletag: string;
}
