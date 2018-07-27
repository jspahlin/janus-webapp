import { TestBed, inject } from '@angular/core/testing';

import { QuestionScoreService } from './question-score.service';

fdescribe('QuestionScoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QuestionScoreService]
    });
  });

  it('should be created', inject([QuestionScoreService], (service: QuestionScoreService) => {
    expect(service).toBeTruthy();
  }));
});
