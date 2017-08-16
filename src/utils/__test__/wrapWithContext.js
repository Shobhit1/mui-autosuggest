import React from 'react'
import WithContext from 'react-with-context'
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
import createMuiTheme from 'material-ui/styles/getMuiTheme'

const wrapWithContext = (component, context) =>
  <WithContext context={context}>
    {component}
  </WithContext>

export const wrapWithMaterialUIContext = (component) =>
  wrapWithContext(component, { muiTheme: createMuiTheme(baseTheme) })

export default wrapWithContext
