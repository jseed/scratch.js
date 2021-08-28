import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EditorFromTextArea, fromTextArea } from 'codemirror';
import 'codemirror/mode/javascript/javascript';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { EvaluatorService } from './evaluator.service';
import { debounceTime } from 'rxjs/operators';


@Component({
  selector: 'sjs-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, OnDestroy {

  private readonly EDITOR_DEBOUNCE_TIME = 300;

  private readonly DEFAULT_EDITOR_OPTS = {
      theme: 'dracula',
      mode: 'javascript',
  };

  @ViewChild('inputEl', {static: true}) inputEl;
  @ViewChild('outputEl', {static: true}) outputEl;

  inputEditor: EditorFromTextArea;
  outputEditor: EditorFromTextArea;

  inputChange$: Observable<any>;

  private subscriptions = new Subscription();

  constructor(
    private evaluator: EvaluatorService,
  ) {}

  ngOnInit(): void {

    this.inputEditor = fromTextArea(this.inputEl.nativeElement, {
      ...this.DEFAULT_EDITOR_OPTS,
      autofocus: true,
    });

    this.outputEditor = fromTextArea(this.outputEl.nativeElement, {
      ...this.DEFAULT_EDITOR_OPTS,
      readOnly: true,
    });

    this.inputChange$ = fromEvent(this.inputEditor, 'change');

    this.subscriptions.add(
      this.inputChange$.pipe(
        debounceTime(this.EDITOR_DEBOUNCE_TIME),
      ).subscribe(() => {
        const code = this.inputEditor.getValue();
        const result = this.evaluator.evaluate(code);
        this.outputEditor.setValue(result);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
