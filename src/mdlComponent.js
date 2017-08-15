import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'

const recursiveForEachEl = (el, fn) => {
  fn(el)

  for (const child of el.children) recursiveForEachEl(child, fn)
}

const mdlComponent = (ComposedComponent) => class extends Component {
  static displayName = `mdlComponent(${ComposedComponent.displayName || ComposedComponent.name})`

  componentDidMount() {
    window.componentHandler && recursiveForEachEl(findDOMNode(this), window.componentHandler.upgradeElement)
  }

  componentWillUnmount() {
    window.componentHandler && recursiveForEachEl(findDOMNode(this), window.componentHandler.upgradeElement)
  }


  render() {
    return <ComposedComponent {...this.props} />
  }
}

export default mdlComponent
