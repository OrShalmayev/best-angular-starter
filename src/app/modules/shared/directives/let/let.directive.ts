import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  EmbeddedViewRef
} from '@angular/core';

interface NgLetContext<T> {
  $implicit: T;
  ngLet: T;
}

/**
 * How It Works:
 * - The NgLetDirective creates an embedded view from the template it is applied to.
 * - The context (NgLetContext) is provided to this embedded view, allowing you to access the value via $implicit or ngLet.
 * - The ngTemplateContextGua rd helps Angular's compiler understand the type of the context, improving type safety within your templates.
 */
@Directive({
  selector:   '[ngLet]',
  standalone: true
})
class NgLetDirective<T = unknown> {
  private _context: NgLetContext<T> = {
    $implicit: undefined,
    ngLet:     undefined
  };

  private _viewRef: EmbeddedViewRef<NgLetContext<T>> | null = null;

  @Input()
  set ngLet(value: T) {
    this._context.$implicit = this._context.ngLet = value;
    this._updateView();
  }

  constructor(
    private _viewContainer: ViewContainerRef,
    private _templateRef: TemplateRef<NgLetContext<T>>
  ) {
  }

  private _updateView(): void {
    if (this._viewRef == null) {
      this._viewContainer.clear();
      this._viewRef = this._viewContainer.createEmbeddedView(this._templateRef, this._context);
    }
    else {
      this._viewRef.markForCheck();
    }
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  static ngTemplateContextGuard<T>(
    dir: NgLetDirective<T>,
    ctx: unknown
  ): ctx is NgLetContext<NonNullable<T>> {
    return true;
  }
}
export {NgLetDirective};
