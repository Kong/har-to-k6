const {
  AddressSpecies,
  FlowItemType,
  PostSpecies,
  VariableType,
} = require('../enum')
const { UnrecognizedError } = require('../error')

function declares(archive, result) {
  if (archive.log.entries) {
    result.declares.add('response')
    const entries = archive.log.entries
    if (result.flow.find(addressFlowItem)) {
      result.declares.add('address')
    }
    if (result.flow.find(bodyFlowItem)) {
      result.declares.add('body')
    }
    if (entries.find(matchEntry)) {
      result.declares.add('match')
    }
    if (entries.find(hasMultipartFormData)) {
      result.declares.add('formData')
    }
  }
}

function addressFlowItem(item) {
  switch (item.type) {
    case FlowItemType.External:
      return addressEntry(item.entry)
    case FlowItemType.Group:
      return item.entries.find(addressEntry)
    default:
      throw new UnrecognizedError(
        { name: 'UnrecognizedFlowItemType' },
        `Unrecognized flow item type: ${item.type}`
      )
  }
}

function addressEntry({ request }) {
  return request.state.address.species === AddressSpecies.Runtime
}

function bodyFlowItem(item) {
  switch (item.type) {
    case FlowItemType.External:
      return bodyEntry(item.entry)
    case FlowItemType.Group:
      return item.entries.find(bodyEntry)
    default:
      throw new UnrecognizedError(
        { name: 'UnrecognizedFlowItemType' },
        `Unrecognized flow item type: ${item.type}`
      )
  }
}

function bodyEntry({ request }) {
  return (
    request.state.post.species === PostSpecies.Structured &&
    request.post.type === 'multipart/form-data' &&
    request.state.params.variable
  )
}

function matchEntry(entry) {
  return entry.variables && entry.variables.find(matchVariable)
}

function matchVariable(variable) {
  return variable.type === VariableType.Regex
}

function hasMultipartFormData(entry) {
  if (!entry.request.postData) {
    return
  }

  return entry.request.postData.mimeType.includes('multipart/form-data')
}

module.exports = declares
