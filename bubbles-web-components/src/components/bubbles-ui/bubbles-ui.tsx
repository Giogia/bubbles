import { Element, Component, Host, Prop, h, Watch, State } from '@stencil/core'
import { forceX, forceY, forceCenter, forceCollide, forceLink, forceManyBody, forceSimulation, select, selectAll } from 'd3'
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
   * The nodes composing the force graph
   */
  @Prop() nodes?: Node[] = [];

  /**
   * The links between the force graph nodes
   */
  @Prop() links?: Link[] = [];

  /**
   * The center of the force graph
   */
  @Prop() center?: { x?: number, y?: number } = { x: 0.5, y: 0.5 };

  @State() data: any
  @State() elements: any
  @State() simulation: any
  @State() simulationCenter = { x: 0.5, y: 0.5 }

  // constructor() {}

  connectedCallback() {
    window.addEventListener('resize', () => this.restartSimulation())
  }

  componentWillLoad() {

    const { children } = this.element

    if (children.length !== this.nodes.length) throw new Error('Nodes length does not match the number of children')

    this.data = (this.nodes ?? Array.prototype.map.call(children, (bubble: HTMLElement) => ({
      x: parseInt(bubble.style.top) / 100,
      y: parseInt(bubble.style.left) / 100,
      radius: 0.25
    }))).map((node: Node, index: number) => ({
      ...node,
      id: node.id ?? index,
      x: node.x - this.center.x,
      y: node.y - this.center.y
    })) as Node[]

    this.elements = selectAll(children)
      .data(this.data)
      .attr("class", "bubble")
      .style("height", 0)
      .style("width", 0)
      .on("click", (e: MouseEvent) => this.click(e))
      .on("resize", () => this.restartSimulation())

    this.simulation = forceSimulation(this.data)

      /** Nodes */
      // .nodes(nodes)
      // .find(x, y, radius) // gets closest

      /** Alpha */
      // .alpha(1)
      // .alphaMin(0.001)
      // .alphaDecay(1 - pow(0.001, 1 / 300)) around 0.0228
      .alphaDecay(0.25)
      .alphaTarget(0)

      /** Velocity */
      // .velocityDecay(0.4)
      .velocityDecay(0.25) // low friction

      /** Forces */
      .force("center", forceCenter()
        // .strength(0.1)
        .x(this.simulationCenter.x - this.center.x)
        .y(this.simulationCenter.y - this.center.y)
      )
      .force("x", forceX()
        // .x(0)
        .strength(({ radius }) => Math.min(radius, 0.25))
      )
      .force("y", forceY()
        // .y(0)
        .strength(({ radius }) => Math.min(radius, 0.25))
      )
      .force("collide", forceCollide()
        // .strength(1)
        // .iterations(3)
        .radius((node: Node) => 0.5 * node.radius + 0.025)
      )
      .force("charge", forceManyBody()
        // .theta(0.9)
        // .distanceMin(1)
        // .distanceMax(Infinity)
        .strength(-0.001)
      )
      .force("link", forceLink(this.links)
        // .id(d => d.name)
        // .strength(0)
        // .iterations(3)
        .distance(0)
      )
      .on("tick", () => this.tick())
    // .on("end", () => {})

    select(this.element).style("visibility", "visible")
  }

  tick() {
    this.elements
      .style("width", ({ radius }: Node) => radius * this.element.clientWidth + "px")
      .style("height", ({ radius }: Node) => radius * this.element.clientHeight + "px")
      .style("left", ({ x }: Node) => (x + this.center.x) * 100 + "%")
      .style("top", ({ y }: Node) => (y + this.center.y) * 100 + "%")
  }

  click(e: MouseEvent) {

    const { id } = this.getNode(e)

    this.data = this.data.map(node => {
      const distanceFactor = Math.min(0.9, 0.5 - this.distanceFromSimulationCenter(node))

      return id && node.id === id ?
        {
          ...node,
          radius: Math.min(2 * node.radius, 0.5),
          x: 0.25 * node.x,
          y: 0.25 * node.y,
        } :
        {
          ...node,
          radius: Math.max(distanceFactor * node.radius, 0.2),
          x: 1.25 * node.x,
          y: 1.25 * node.y,
        }
    })

    this.updateNodes()
    this.restartSimulation()
  }

  getNode(e: MouseEvent) {
    const x = e.x / window.innerWidth - this.center.x
    const y = e.y / window.innerHeight - this.center.y

    return this.simulation.find(x, y)
  }

  updateNodes() {
    this.elements.data(this.data)
    this.simulation.nodes(this.data)
  }

  restartSimulation(alpha = 1.0) {
    this.simulation.alpha(alpha).restart()
  }

  distanceFromSimulationCenter(node) {
    return Math.sqrt(
      Math.pow(this.simulationCenter.x - this.center.x + node.x, 2) +
      Math.pow(this.simulationCenter.y - this.center.y + node.y, 2))
  }

  @Watch('graph')
  simulate({ nodes }) {
    this.data = nodes
    this.updateNodes()
    this.restartSimulation()
  }

  disconnectedCallback() {
    window.removeEventListener('resize', () => this.restartSimulation())
  }

  render() {
    return (
      <Host class="bubbles" />
    )
  }
}