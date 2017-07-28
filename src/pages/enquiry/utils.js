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
