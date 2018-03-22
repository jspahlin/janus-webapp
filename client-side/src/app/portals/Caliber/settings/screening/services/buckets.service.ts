import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators';

import { Bucket } from '../entities/Bucket';

const httpOptions = {

    headers: new HttpHeaders({
            'Content-Type':  'application/json',
        })
    };

@Injectable()
export class BucketsService {

  testBucket: Bucket = new Bucket(0, "Java", "This is Java");

  constructor(private http: HttpClient) { }
  name:string = null;
    url: string = "/bucket/";

  /** Gets all of company's buckets */
  getAllBuckets(){
      return this.http.get(this.url + "getBuckets");
  }

  getBucketById(bucketId: number){
      return this.http.get(this.url + bucketId);
  }

  //Need to create bucket models
  createNewBucket(bucket: Bucket){
      return this.http.post(this.url + "createBucket", bucket, httpOptions);
  }


}
