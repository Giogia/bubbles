import { Element, Component, Host, Prop, h, Watch, State } from '@stencil/core'
import { forceX, forceY, forceCenter, forceCollide, forceLink, forceManyBody, forceSimulation, select, selectAll } from 'd3'
import type { Node, Link } from './bubbles-ui.types'
import { percentage } from '../../utils/utils'

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
  @Prop() graph?: {
    nodes?: Node[],
    links?: Link[]
  } = {};

  @State() nodes: any
  @State() data: any
  @State() simulation: any

  // constructor() {}

  // connectedCallback() {}

  componentWillLoad() {

    const { nodes, links } = this.graph
    const { children } = this.element

    if (children.length !== nodes.length) throw new Error('Nodes length does not match the number of children')

    this.data = nodes ?? Array.prototype.map.call(children, (bubble: HTMLElement) => ({
      x: parseInt(bubble.style.top) / 100,
      y: parseInt(bubble.style.left) / 100,
      radius: 0.25
    })) as Node[]

    this.nodes = selectAll(children)
      .data(this.data)
      .attr("class", "bubble")
      .style("height", 0)
      .style("width", 0)
      .on("click", (e) => this.click(e))

    this.simulation = forceSimulation(this.data)

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
      .velocityDecay(0.25) // low friction

      /** Forces */
      .force("center", forceCenter()
        // .strength(0.1)
        .x(0.5)
        .y(0.5)
      )
      .force("x", forceX()
        // .x(0)
        .strength(0.1)
      )
      .force("y", forceY()
        // .y(0)
        .strength(0.1)
      )
      .force("collide", forceCollide()
        // .strength(1)
        // .iterations(3)
        .radius((node: Node) => 0.5 * node.radius + 0.01)
      )
      .force("charge", forceManyBody()
        // .theta(0.9)
        // .distanceMin(1)
        // .distanceMax(Infinity)
        .strength(-0.001)
      )
      .force("link", forceLink(links)
        // .id(d => d.name)
        // .strength(0)
        // .iterations(3)
        .distance(0)
      )
      .on("tick", () => this.tick())
      .on("end", () => { })

    select(this.element).style("visibility", "visible")
  }

  tick() {
    this.nodes
      .style("width", (bubble: Node) => {
        return bubble.radius * this.element.clientWidth + "px"
      })
      .style("height", (bubble: Node) => {
        return bubble.radius * this.element.clientHeight + "px"
      })
      .style("left", (bubble: Node) => {
        return percentage(bubble.x)
      })
      .style("top", (bubble: Node) => {
        return percentage(bubble.y)
      })
  }

  click(e: MouseEvent) {
    const { id } = this.simulation.find(e.x / window.innerWidth, e.y / window.innerHeight)

    this.data = this.data.map(node => id && node.id === id ?
      { ...node, radius: Math.min(1.5 * node.radius, 0.75) } :
      node
    )

    this.nodes.data(this.data)
    this.simulation.nodes(this.data).alpha(1.0).restart()
  }

  @Watch('graph')
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