import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import * as esprima from 'esprima';
import * as escodegen from 'escodegen';
@Injectable({
  providedIn: 'root'
})
export class EvaluatorService {

  private readonly renderer: Renderer2;
  private readonly sandboxEl: any;

  constructor(
    private rendererFactory: RendererFactory2,
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    this.sandboxEl = this.renderer.createElement('iframe');
    this.renderer.setProperty(this.sandboxEl, 'style', 'display: none');
    this.renderer.appendChild(document.body, this.sandboxEl);
  }

  evaluate(code: string): string {
    const results = [];

    try {
      const program = esprima.parse(code);
      const body = program.body;

      // For each line of code, get the output by evaluating all code up to that point
      for (let i = 0; i < body.length; i++) {

        // Skip variable declarations, they will evaluate to the same value as the previous statement
        if (body[i].type === 'VariableDeclaration') {
          continue;
        }

        program.body = body.slice(0, i + 1);

        const regeneratedCode = escodegen.generate(program);
        const result = this.sandboxedEval(regeneratedCode);

        // Convert to string to keep undefined
        results.push(`${result}`);
      }
    } catch (err) {
      results.push(err);
    }

    return results.join('\n');
  }

  private sandboxedEval(code: string): string {
    return this.sandboxEl.contentWindow.eval(code);
  }
}
