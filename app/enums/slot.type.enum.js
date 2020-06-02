const slotTypes = {
  STANDARD: { id: 0, name: 'Standard'},
  PRIORITY: { id: 1, name: 'Priority'}
}

const slots = [slotTypes.STANDARD, slotTypes.PRIORITY]

exports.slots = () => { return slotTypes; }

exports.findById = (id) => { return slots[id]; }