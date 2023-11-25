import { Element, Component, Host, Prop, h, Watch, State } from '@stencil/core'
import { forceX, forceY, forceCenter, forceCollide, forceLink, forceManyBody, forceSimulation, selectAll } from 'd3'
import { getPosition, resize } from '../../utils/utils';
import type { Node, Link } from './bubbles-ui.types'

@Component({
  tag: 'bubbles-ui',
  styleUrl: 'bubbles-ui.css',
})
export class BubblesUi {
  /**
   * The Bubble UI element
   */
  @Element() element: HTMLElement;
  /**
   * The data nodes passed to the force graph
   */
  @Prop() data?: {
    nodes?: Node[],
    links?: Link[]
  } = {};

  @State() nodes: any
  @State() simulation: any

  // constructor() {}

  // connectedCallback() {}

  componentDidLoad() {

    const { nodes, links } = this.data

    const bubbles = this.element.children

    if (bubbles.length !== nodes.length) throw new Error('Nodes length does not match the number of children')

    const data = nodes ?? Array.prototype.map.call(bubbles, (bubble: HTMLElement) => ({
      x: parseInt(bubble.style.top) / 100,
      y: parseInt(bubble.style.left) / 100,
      radius: 0.25
    })) as Node[]

    this.nodes = selectAll(bubbles)
      .data(data)
      .attr("class", "bubble")
      .style("height", 0)
      .style("width", 0)

    this.simulation = forceSimulation(data)

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
        .radius((node: Node) => node.radius)
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
      .on("tick", () => this.tick())
      .on("end", () => { })
  }

  tick() {
    this.nodes
      .style("width", (bubble: Node) => {
        const { over: overX } = getPosition(bubble.x, bubble.radius)
        const { over: overY } = getPosition(bubble.y, bubble.radius)
        return resize(bubble, (overX || overY), this.element)
      })
      .style("height", (bubble: Node) => {
        const { over: overX } = getPosition(bubble.x, bubble.radius)
        const { over: overY } = getPosition(bubble.y, bubble.radius)
        return resize(bubble, (overX || overY), this.element)
      })
      .style("left", (bubble: Node) => {
        const { position } = getPosition(bubble.x, bubble.radius)
        return position
      })
      .style("top", (bubble: Node) => {
        const { position } = getPosition(bubble.y, bubble.radius)
        return position
      })
  }

  @Watch('data')
  simulate({ nodes }) {
    this.simulation.nodes(nodes)
  }

  // disconnectedCallback() {}

  render() {
    return (
      <Host class="bubbles" />
    )
  }
}