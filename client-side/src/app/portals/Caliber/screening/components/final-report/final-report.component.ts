import { Component, OnInit, OnDestroy } from '@angular/core';
import { ScreeningService } from '../../services/screening/screening.service';
import { CandidateService } from '../../services/candidate/candidate.service';
import { SkillTypeBucketService } from '../../services/skillTypeBucketLookup/skill-type-bucket.service';
import { QuestionScoreService } from '../../services/question-score/question-score.service';
import { QuestionScore } from '../../entities/questionScore';
import { ScoresToBucketsUtil } from '../../util/scoresToBuckets.util';
import { AlertsService } from '../../../services/alerts.service';
import { SoftSkillsViolationService } from '../../services/soft-skills-violation/soft-skills-violation.service';
import { SoftSkillViolation } from '../../entities/softSkillViolation';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-final-report',
  templateUrl: './final-report.component.html',
  styleUrls: ['./final-report.component.css']
})

/*
A simple text summary of how the candidate performed
in each category on technical skills,the overall feedback thereon,
and if the candidate passed or failed their soft skills evaluation.
Screener can copy the summary to the clipboard, and return to the candidate list.
*/

export class FinalReportComponent implements OnInit, OnDestroy {

public candidateName: string;
softSkillString: string;
bucketStringArray: string[];
overallScoreString: string;
generalNotesString: string;
allTextString: string;

questionScores: QuestionScore[];
softSkillViolations: SoftSkillViolation[];
public checked: string;
subscriptions: Subscription[] = [];

  constructor(
    private screeningService: ScreeningService,
    private candidateService: CandidateService,
    private skillTypeBucketService: SkillTypeBucketService,
    private questionScoreService: QuestionScoreService,
    private scoresToBucketsUtil: ScoresToBucketsUtil,
    private alertsService: AlertsService,
    private softSkillsViolationService: SoftSkillsViolationService
  ) { }

  ngOnInit() {
    this.checked = 'false';
    //this.candidateName = this.candidateService.getSelectedCandidate().name;
    this.candidateName = 'First Last';
    this.softSkillString = 'Soft Skills: ' + this.screeningService.softSkillsResult;
    this.allTextString = this.softSkillString + '\n';
    this.questionScoreService.currentQuestionScores.subscribe(
      questionScores => {
        this.questionScores = questionScores;
        this.bucketStringArray =
          this.scoresToBucketsUtil.getFinalBreakdown(this.questionScores, this.skillTypeBucketService.bucketsByWeight);

        // Set the composite score in the screening service
        this.screeningService.compositeScore = +this.bucketStringArray[this.bucketStringArray.length - 1];
        this.bucketStringArray.splice(this.bucketStringArray.length - 1, 1);

        this.overallScoreString = this.bucketStringArray[this.bucketStringArray.length - 1];
        this.bucketStringArray.splice(this.bucketStringArray.length - 1, 1);

        this.bucketStringArray.forEach(bucketString => {
          this.allTextString += bucketString + '\n';
        });
        this.overallScoreString = "Overall: 71%";
        this.allTextString += this.overallScoreString + '\n';
      });
    //this.generalNotesString = this.screeningService.generalComments;
    this.generalNotesString = "General Notes";
    this.allTextString += '"some' + this.generalNotesString + 'thing"';

    this.screeningService.endScreening(this.generalNotesString);
    this.subscriptions.push(this.softSkillsViolationService.currentSoftSkillViolations.subscribe(
      softSkillViolations => (this.softSkillViolations = softSkillViolations)
    ));
  }

  // Used for copying the data to the clipboard (this is done using ngx-clipboard)
  copyToClipboard() {
    this.checked = 'true';
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.allTextString;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.alertsService.success('Copied to Clipboard');
  }

  ngOnDestroy() {
    // Called once before the instance is destroyed.
    // Empty the appropriate arrays, clean local storage and unsubscribe from subscriptions in this component.
    this.questionScores = [];
    this.questionScoreService.updateQuestionScores(this.questionScores);
    this.softSkillViolations = [];
    this.softSkillsViolationService.updateSoftSkillViolations(this.softSkillViolations);
    localStorage.removeItem('screeningID');
    localStorage.removeItem('scheduledScreeningID');
    this.subscriptions.forEach(s => s.unsubscribe);
  }
}
