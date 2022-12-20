import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import litLogo from "./assets/lit.svg";
import { repeat } from "lit/directives/repeat.js";
import { whenNearScreen } from "./when-near-screen.directive";
import { lazyRepeat } from "./lazy-repeat.directive";

@customElement("my-element")
export class MyElement extends LitElement {
  public bigArray: number[] = Array(5000).fill(0);

  render() {
    return html`
      <div class="game-list">
        ${lazyRepeat(
          this.bigArray,
          (elements) =>
            html`${repeat(
              elements,
              (element) => element,
              (element, index) => html` <div class="game">
                ${whenNearScreen(
                  () => html`<div class="visible"></div>`,
                  () => html`<div class="not-visible"></div>`
                )}

                <span>index: ${index}</span>
              </div>`
            )}`
        )}
      </div>
    `;
  }

  static styles = css`
    :host {
      width: 100%;
      height: 100%;
    }

    .game {
      display: flex;
      align-items: center;
    }

    .visible {
      background-color: blue;
      width: 150px;
      height: 50px;
    }

    .not-visible {
      background-color: red;
      width: 150px;
      height: 50px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "my-element": MyElement;
  }
}
