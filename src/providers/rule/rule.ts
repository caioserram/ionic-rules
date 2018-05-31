import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Engine, } from 'json-rules-engine';

/*
  Generated class for the RuleProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/


@Injectable()
export class RuleProvider {

  private engine: Engine

  constructor() {
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

  public getEngine(){
    return this.engine
  }

  public applyFacts(facts){
    this.engine
        .run(facts)
        .then((events) => {
          events.map((event) => {
          });
        });
  }

}
