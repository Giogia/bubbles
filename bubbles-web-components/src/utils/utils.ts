export function percentage(number: number) {
  return number * 100 + "%"
}

export function getPosition(position: number, radius = 0, min = 0, max = 1) {

  const overMin = position - radius <= min
  const overMax = position + radius >= max

  return {
    position: (
      overMin ? percentage(min + radius) :
        overMax ? percentage(max - radius) :
          percentage(position)
    ),
    over: overMin || overMax
  }
}

export function resize(node, over, element) {
  return (over ? 0.5 : 1) * 2 * node.radius * Math.min(element.clientHeight, element.clientWidth) + "px"
}