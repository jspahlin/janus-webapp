import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/Rx';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// Entities
import { Question } from '../../entities/question';
import { Tag } from '../../entities/tag';
import { QUESTIONS } from '../../mock-data/mock-questions';
import { TagsAndSkill } from '../../wrappers/tagsAndSkill';

// Services
import { TagService } from '../../services/tag/tag.service';
import { SimpleTraineeService } from '../simpleTrainee/simple-trainee.service';
import { UrlUtilService } from '../UrlUtil/url-util.service';
/*
Provides an observable of Questions through the getQuestions() method.
*/
@Injectable()
export class QuestionService {

  constructor(
    private httpClient: HttpClient,
    private tagService: TagService,
    private simpleTraineeService: SimpleTraineeService,
    private urlUtilService: UrlUtilService
  ) {}

  private ROOT_URL: string = this.urlUtilService.getBase();
  headers = new HttpHeaders({
    'Content-type': 'application/json'
  });


  // Returns an observable array of questions, filtered by the selected tags and
  // candidate's skillTypeID
  getQuestions(): Observable<Question[]> {
    const tagArray: number[] = [];
    for (const tag of this.tagService.getCheckedTags()){
      tagArray.push(tag.tagId);
    }
    const currSkillTypeID = this.simpleTraineeService.getSelectedCandidate().skillTypeID;
    // let currSkillTypeID = this.simpleTraineeService.getSelectedCandidate().skillTypeID;
    const tagsAndSkill: TagsAndSkill = { tagList : tagArray, skillTypeId : currSkillTypeID };
    return this.httpClient.post<Question[]>(
      this.ROOT_URL + '/question-service/question/filtered',
      tagsAndSkill
    );
  }
}