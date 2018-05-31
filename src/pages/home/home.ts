import { Component } from '@angular/core';
import { NavController} from 'ionic-angular';
import { RuleProvider } from '../../providers/rule/rule';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  factStack: any = new Array();
  currentDecision: string = "";
  decisionReached: boolean = false;
  currentQuestion: string = "";
  currentAnswer: any = 'null';

  private questions = {
    q1: { text: 'vai chover?', valid_values: ['s', 'n'] },
    q2: { text: 'vai fazer frio?', valid_values: ['s', 'n'] }
  };

  private decisions = {
    d1: { text: 'não sair de casa' },
    d2: { text: 'sair tranquilo' },
    d3: { text: 'levar um casaco' }
  };

  private facts;

  constructor(public navCtrl: NavController, private ruleProvider : RuleProvider) {
    this.ruleProvider.getEngine().on('success', (event, almanac) => {
      if (event.type === 'question') {
        this.facts[event.params.value] = this.currentAnswer
        this.currentQuestion = event.params.value
      }
      if (event.type === 'decision') {
        this.decisionReached = true
        this.currentDecision = event.params.value
      }
    });
  }


  public rollback() { 
    if (this.factStack.length > 1) {
      this.decisionReached = false
      this.factStack.pop()
      this.ruleProvider.applyFacts(this.factStack[this.factStack.length - 1])
    }

  }

  public runAnswer(answer) {
    this.facts[this.currentQuestion] = answer;
    this.factStack.push(Object.assign({}, this.facts))
    this.ruleProvider.applyFacts(this.facts)
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.facts = {
      q1: "null",
      q2: "null"
    }
    this.factStack.push(Object.assign({}, this.facts))
    this.ruleProvider.applyFacts(this.facts)
  }
}
