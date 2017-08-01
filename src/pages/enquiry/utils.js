import { classToSelected } from 'utils'
import { groupBy } from 'lodash'

export function toRemoteBom (localBom) {
  const remoteBom = {
    name: localBom.name,
    per_bom_amount: localBom.amount,
    unit: localBom.unit,
    quality_req: localBom.quality_req,
    quality_testing_req: localBom.quality_testing_req
  }
  if (localBom.attributes.length) remoteBom.attribute_id_arr = localBom.attributes.map(attr => attr.id)
  if (localBom.classesSelected.length) remoteBom.class_id = localBom.classesSelected.slice(-1)[0]
  return remoteBom
}

export function toLocalBom (remoteBom) {
  let attributesObj = groupBy(remoteBom.attribute_arr, 'lv1_id')
  Object.keys(attributesObj).forEach(key => {
    attributesObj[key] = attributesObj[key].map(item => item.id)
  })
  const localBom = {
    id: remoteBom.id,
    name: remoteBom.name,
    amount: remoteBom.per_bom_amount,
    unit: remoteBom.unit,
    quality_req: remoteBom.quality_req,
    quality_testing_req: remoteBom.quality_testing_req,
    attributes: remoteBom.attribute_arr,
    classesSelected: classToSelected(remoteBom.class_),
    attributesObj
  }
  return localBom
}
