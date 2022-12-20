import { TemplateResult } from 'lit';
import { AsyncDirective, DirectiveResult } from 'lit/async-directive.js';
import { directive, PartInfo } from 'lit/directive.js';

class LazyRepeatDirective extends AsyncDirective {
  private _items!: any[];
  private _itemsToShowFn!: (newItems: any[]) => TemplateResult;

  private _interval: any | undefined;

  constructor(private _part: PartInfo) {
    super(_part);
  }

  private _reset(): void {
    clearInterval(this._interval);
    let counter: number = 0;
    this._interval = setInterval(() => {
      this.setValue(this._itemsToShowFn(this._items.slice(0, counter * 1)));
      counter++;
    }, 10);
  }

  public render(items: any[], itemsToShowFn: (newItems: any[]) => TemplateResult): TemplateResult {
    this._itemsToShowFn = itemsToShowFn;
    if (items !== this._items) {
      this._items = items;
      this._reset();
    }
    return itemsToShowFn([]);
  }

  public override disconnected(): void {
    clearInterval(this._interval);
  }
}

type LazyRepeatDirectiveResult = (
  items: any[],
  itemsToShowFn: (newItems: any[]) => TemplateResult
) => DirectiveResult<typeof LazyRepeatDirective>;
export const lazyRepeat: LazyRepeatDirectiveResult = directive(LazyRepeatDirective);
