import { Component, OnInit, ViewChild } from '@angular/core';
import { EditorFromTextArea, fromTextArea } from 'codemirror';
import 'codemirror/mode/javascript/javascript';


@Component({
  selector: 'sjs-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  private readonly DEFAULT_EDITOR_OPTS = {
      theme: 'dracula',
      mode: 'javascript',
  };

  @ViewChild('inputEl', {static: true}) inputEl;
  @ViewChild('outputEl', {static: true}) outputEl;

  inputEditor: EditorFromTextArea;
  outputEditor: EditorFromTextArea;

  ngOnInit(): void {

    this.inputEditor = fromTextArea(this.inputEl.nativeElement, {
      ...this.DEFAULT_EDITOR_OPTS,
      autofocus: true,
    });

    this.outputEditor = fromTextArea(this.outputEl.nativeElement, {
      ...this.DEFAULT_EDITOR_OPTS,
      readOnly: true,
    });

  }


}
