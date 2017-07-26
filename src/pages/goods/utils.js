export function getParent (attribute) {
  const parentLevel = attribute.level - 1
  return {
    id: attribute[`lv${parentLevel}_id`],
    value: attribute[`lv${parentLevel}_name_cn`]
  }
}

export function showAttributes (attributes) {
  return Object.keys(attributes).map(key => {
    const parent = getParent(attributes[key])
    return `${parent.value}:${attributes[key].name_cn}`
  }).join(',')
}
