/* eslint-disable */
// from upcoming release of material-ui, with slight modifications
// see https://github.com/callemall/material-ui/blob/next/test/utils/createMountWithContext.js

import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
import createMuiTheme from 'material-ui/styles/getMuiTheme'
import { create } from 'jss'
import jssPreset from 'jss-preset-default'
import { createStyleManager } from 'jss-theme-reactor'
import { PropTypes } from 'prop-types'
import { mount as enzymeMount } from 'enzyme'

function cleanStyles() {
  const head = window.document.head
  const length = head.children.length
  for (let i = length - 1; i >= 0; i -= 1) {
    if (head.children[i].tagName.toLowerCase() === 'style') {
      head.removeChild(head.children[i])
    }
  }
}

export default function createMountWithContext(mount = enzymeMount) {
  cleanStyles()

  const attachTo = window.document.createElement('div')
  attachTo.className = 'app'
  attachTo.setAttribute('id', 'app')
  window.document.body.insertBefore(attachTo, window.document.body.firstChild)
  const theme = createMuiTheme(baseTheme)
  const jss = create(jssPreset())
  const styleManager = createStyleManager({ jss, theme })
  const context = { theme, styleManager, muiTheme: theme }
  const childContextTypes = {
    theme: PropTypes.object,
    muiTheme: PropTypes.object,
    styleManager: PropTypes.object,
  }

  const mountWithContext = function mountWithContext(node) {
    return mount(node, { context, attachTo, childContextTypes })
  }

  mountWithContext.context = context
  mountWithContext.attachTo = attachTo

  mountWithContext.cleanUp = () => {
    cleanStyles()
    attachTo.parentNode.removeChild(attachTo)
  }

  mountWithContext.reset = () => {
    attachTo.innerHTML = ''
  }

  return mountWithContext
}
