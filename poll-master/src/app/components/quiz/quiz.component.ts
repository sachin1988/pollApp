import { Component, OnInit, OnDestroy } from '@angular/core';
import { Question } from './../../models';
import { WebSocketSvc } from './../../services';
@Component({
	selector: 'app-quiz',
	templateUrl: './quiz.component.html',
	styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit, OnDestroy {
	public question: Question;
	public hasCompletedResponse = false;
	public hasExpired = false;
	constructor(private wsSvc: WebSocketSvc) { }

	ngOnInit() {
		this.wsSvc.registerOnMsg(this.onQuizStart.bind(this));
		this.wsSvc.registerOnMsg(this.onQuizTimerEnd.bind(this));
	}

	onQuizStart(quizQuestions: string) {
		try {
			this.question = JSON.parse(quizQuestions['data'])['data']['questions'][0];
			this.hasCompletedResponse = false;
			this.hasExpired = false
		} catch (err) { }
	}


	submitAnswer(ans) {
		this.wsSvc.sendMsg(ans);
		this.hasCompletedResponse = true;
		this.question = null;
	}

	onQuizTimerEnd(data) {
		if (JSON.parse(data.data).stop && !this.hasCompletedResponse) {
			this.hasExpired = true;
		}
	}

	ngOnDestroy() {
	}
}
