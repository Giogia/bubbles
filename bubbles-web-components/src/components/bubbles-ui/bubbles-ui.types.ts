/**
 * Represents a bubble in the force graph.
 */
export type Node = {

  /**
   * The radius of the node.
   */
  radius: number;

  /**
   * The x-coordinate of the node.
   */
  x: number;

  /**
   * The y-coordinate of the node.
   */
  y: number;

  /**
   * The children of the node.
   */
  children: HTMLElement[];
}

/**
 * Represents a link between two bubbles in the force graph.
 */
export type Link = {
  /**
   * The index of the source bubble node.
   */
  source: number;

  /**
   * The index of the target bubble node.
   */
  target: number;
}