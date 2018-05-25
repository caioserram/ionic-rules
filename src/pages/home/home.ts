import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { Engine, RuleEngine } from 'json-rules-engine'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  factStack: any = new Array();
  currentDecision: any;
  decisionReached: boolean = false;
  currentQuestion: any;
  currentAnswer: any = 'null';

  private engine: Engine

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


  constructor(public navCtrl: NavController, public events: Events) {
    this.engine = new Engine()

    this.engine.addRule({
      conditions: {
        all: [
          { fact: 'q1', operator: 'equal', value: 'null' },
          { fact: 'q2', operator: 'equal', value: 'null' }
        ]
      },
      event: {
        type: 'question', params: { value: 'q1' }
      },
      // priority: 3
    })

    this.engine.addRule({
      conditions: {
        all: [
          { fact: 'q1', operator: 'equal', value: 'n' },
          { fact: 'q2', operator: 'equal', value: 'null' }
        ]
      },
      event: {
        type: 'question', params: { value: 'q2' }
      },
      //priority: 2
    })

    this.engine.addRule({
      conditions: {
        all: [
          { fact: 'q1', operator: 'equal', value: 's' }
        ]
      },
      event: {
        type: 'decision', params: { value: 'd1' }
      },
      //priority: 1
    })

    this.engine.addRule({
      conditions: {
        all: [
          { fact: 'q1', operator: 'equal', value: 'n' },
          { fact: 'q2', operator: 'equal', value: 'n' }
        ]
      },
      event: {
        type: 'decision', params: { value: 'd2' }
      },
      //priority: 1
    })

    this.engine.addRule({
      conditions: {
        all: [
          { fact: 'q1', operator: 'equal', value: 'n' },
          { fact: 'q2', operator: 'equal', value: 's' }
        ]
      },
      event: {
        type: 'decision', params: { value: 'd3' }
      },
      //priority: 1
    })

    
  }


  public rollback() { 
    if (this.factStack.length > 1) {
      this.decisionReached = false
      this.factStack.pop()
      this.engine
        .run(this.factStack[this.factStack.length - 1])
        .then((events) => {
          events.map((event) => {
          });
        });
    }

  }

  public runAnswer(answer) {
    this.facts[this.currentQuestion] = answer;
    this.factStack.push(Object.assign({}, this.facts))
    this.engine
      .run(this.facts)
      .then((events) => {
        events.map((event) => {
        });
      });

  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.facts = {
      q1: "null",
      q2: "null"
    }

    this.factStack.push(Object.assign({}, this.facts))
    this.engine.on('success', async (event, almanac) => {
      if (event.type === 'question') {
        this.facts[event.params.value] = this.currentAnswer
        this.currentQuestion = event.params.value
      }
      if (event.type === 'decision') {
        this.decisionReached = true
        this.currentDecision = event.params.value
      }
    });


    this.engine
      .run(this.facts)
      .then((events) => {
        events.map((event) => {
        });
      });

  }
}
