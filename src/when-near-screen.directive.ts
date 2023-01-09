import { ChildPart, html, TemplateResult } from 'lit';
import { AsyncDirective, DirectiveResult } from 'lit/async-directive.js';
import { directive, PartInfo } from 'lit/directive.js';
import { delay, first, Observable, Subject, Subscriber, takeUntil } from 'rxjs';


const isElementVisibleOnScreen = (
  element: HTMLElement,
  options?: IntersectionObserverInit
): Observable<boolean> => {
  return new Observable((subscriber: Subscriber<boolean>) => {
    const observerIntersection: IntersectionObserver = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => subscriber.next(entries[entries.length - 1].isIntersecting),
      options
    );
    observerIntersection.observe(element);
    return (): void => observerIntersection.disconnect();
  });
};


export class WhenNearScreenDirective extends AsyncDirective {
  private _initialized: boolean = false;
  private _whenFn!: () => TemplateResult;
  private _whenFnResolved: TemplateResult | undefined;

  private _destroy$: Subject<void> = new Subject<void>();

  constructor(private _part: PartInfo) {
    super(_part);
  }

  private _init(): void {
    isElementVisibleOnScreen(this._parent)
      .pipe(
        first((state: boolean) => state),
        delay(1000),
        takeUntil(this._destroy$)
      )
      .subscribe(() => {
        console.log('should update view, but doesnt')
        this._whenFnResolved = this._whenFn();
        this.setValue(this._whenFnResolved);
      });
  }

  public render(whenFn: () => TemplateResult, orElseFn?: () => TemplateResult): TemplateResult {
    this._whenFn = whenFn;
    if (this._whenFnResolved){
      return this._whenFnResolved
    }
    if (!this._initialized) {
      this._init();
      this._initialized = true;
    }
    return orElseFn?.() ?? html``;
  }

  private get _parent(): HTMLElement {
    return (this._part as ChildPart).parentNode! as HTMLElement;
  }

  public override disconnected(): void {
    this._destroy$.next(undefined);
    this._destroy$.complete();
  }
}

type WhenNearScreenDirectiveResult = (
  whenFn: () => TemplateResult,
  orElseFn?: (() => TemplateResult) | undefined
) => DirectiveResult<typeof WhenNearScreenDirective>;
export const whenNearScreen: WhenNearScreenDirectiveResult = directive(WhenNearScreenDirective);
