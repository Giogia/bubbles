import { Element, Component, Host, Prop, h, Watch, State } from '@stencil/core'
import { forceX, forceY, forceCenter, forceCollide, forceLink, forceManyBody, forceSimulation, select } from 'd3'
import { getPosition, resize } from '../../utils/utils';

@Component({
  tag: 'bubbles-ui',
  styleUrl: 'bubbles-ui.css',
  shadow: true,
})
export class BubblesUi {
  @Element() element: HTMLElement;
  /**
   * The data nodes passed to the force graph
   */
  @Prop() data?: {
    nodes?: { radius: number; x: number; y: number; name: string; }[],
    links?: { source: number; target: number; }[]
  } = {};

  @State() simulation: any

  // constructor() {}

  connectedCallback() {
    const element = this.element.shadowRoot.querySelector(".bubbles")

    element
      .querySelectorAll(".bubble")
      .forEach(childElement => element.removeChild(childElement))
  }

  componentDidLoad() {
    const { nodes, links } = this.data

    const element = this.element.shadowRoot.querySelector(".bubbles")

    const bubbles = select(element)
      .selectAll()
      .data(nodes)
      .enter()
      .append("div")
      .attr("class", "bubble")
      .html(d => `<p>${d.name}</p>`)
      .style("height", 0)
      .style("width", 0)

    this.simulation = forceSimulation(nodes)

      /** Nodes */
      // .nodes(nodes)
      // .find(x, y, radius) // gets closest

      /** Alpha */
      // .alpha(1)
      // .alphaMin(0.001)
      // .alphaDecay(1 - pow(0.001, 1 / 300)) around 0.0228
      .alphaTarget(0)

      /** Velocity */
      // .velocityDecay(0.4)
      // .velocityDecay(0.5) // friction

      /** Forces */
      .force("center", forceCenter()
        .strength(0.1)
        // .x(element.clientWidth / 2)
        // .y(element.clientHeight / 2)
        .x(0.5)
        .y(0.5)
      )
      .force("x", forceX()
        // .x(0)
        .strength(0.01)
      )
      .force("y", forceY()
        // .y(0)
        .strength(0.01)
      )
      .force("collide", forceCollide()
        // .strength(1)
        // .radius(d => d.radius * Math.min(element.clientHeight, element.clientWidth))
        .radius(d => d.radius)
        .iterations(3)
      )
      .force("charge", forceManyBody()
        // .theta(0.9)
        // .distanceMin(1)
        // .distanceMax(Infinity)
        // .strength((d, i) => i ? 0 : - element.clientWidth * 2 / 3)
        .strength(0)
      )
      .force("link", forceLink(links)
        // .id(d => d.name)
        .strength(1)
        .distance(0)
        .iterations(3)
      )
      .on("tick", () => this.tick(bubbles, element))
      .on("end", () => { })
  }

  tick(bubbles, element) {
    bubbles
      .style("width", bubble => {
        const { over: overX } = getPosition(bubble.x, bubble.radius)
        const { over: overY } = getPosition(bubble.y, bubble.radius)
        return resize(bubble, (overX || overY), element)
      })
      .style("height", bubble => {
        const { over: overX } = getPosition(bubble.x, bubble.radius)
        const { over: overY } = getPosition(bubble.y, bubble.radius)
        return resize(bubble, (overX || overY), element)
      })
      .style("left", bubble => {
        const { position } = getPosition(bubble.x, bubble.radius)
        return position
      })
      .style("top", bubble => {
        const { position } = getPosition(bubble.y, bubble.radius)
        return position
      })
  }

  @Watch('data')
  simulate({ nodes }) {
    this.simulation.nodes(nodes)
  }

  disconnectedCallback() {
  }

  render() {
    return (
      <Host>
        <div class="bubbles" />
      </Host>
    )
  }
}