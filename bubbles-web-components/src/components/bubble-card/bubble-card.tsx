import { Component, Host, Prop, h } from '@stencil/core';

@Component({
  tag: 'bubble-card',
  styleUrl: 'bubble-card.css',
})
export class BubbleCard {

  @Prop() icon?: HTMLElement;
  @Prop() name?: HTMLElement;
  @Prop() description?: HTMLElement;

  render() {
    return (
      <Host>
        <div class="heading">
          <image class="icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.475 2 2 6.475 2 12C2 17.525 6.475 22 12 22C17.525 22 22 17.525 22 12C22 6.475 17.525 2 12 2Z" fill="#1E88E5" />
            </svg>
          </image>
          <h2 class="title">
            {"Title"}
          </h2>
        </div>
        <div class="content">
          <p class="description">
            {`
              Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. 
          `}
          </p>
        </div>
      </Host >
    )
  }

}
