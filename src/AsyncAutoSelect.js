import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AutoSelect from './AutoSelect'

const empty = []

class AsyncAutoSelect extends Component {
  static defaultProps = {
    preload: false,
  }

  state = {
    options: empty,
  }

  componentDidMount() {
    const { preload } = this.props
    if (preload) {
      this.updateOptions(this.props)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { props } = this
    const newOptions = nextProps.fetchOptions !== props.fetchOptions
    const maybeUpdateOptions = newOptions && !props.preload
      ? { options: empty }
      : {}

    this.setState({
      ...maybeUpdateOptions,
    })

    if (newOptions && props.preload) this.updateOptions(nextProps)
  }

  updateOptions({ fetchOptions }) {
    try {
      fetchOptions(
        //  setOptions
        (options, callback) =>
        this.setState({ options }, callback),
      )
    } catch (err) {
      if (err instanceof TypeError) {
        this.setState({ options: [] })
        console.error(err) // eslint-disable-line no-console
      } else {
        throw err
      }
    }
  }

  maybeInitializeOptions = () => {
    const { onFocus } = this.props
    if (onFocus) {
      onFocus()
    }

    if (this.state.options === empty) {
      this.updateOptions(this.props)
    }
  }

  render() {
    const { onFocus, name, fetchOptions, ...otherProps } = this.props // eslint-disable-line no-unused-vars
    const { options } = this.state

    return (
      <AutoSelect
        name={name}
        ref={(c) => { this.input = c && c.input }}
        onFocus={this.maybeInitializeOptions}
        options={options}
        {...otherProps}
      />
    )
  }
}
AsyncAutoSelect.propTypes = {
  preload: PropTypes.bool.isRequired,
  onFocus: PropTypes.func,
  name: PropTypes.string.isRequired,
  fetchOptions: (props, propName, componentName) => {
    const propVal = props[propName]
    if (typeof propVal !== 'function') {
      return new Error(propVal
        ? `Prop ${propName}' in ${componentName} must be a function}.`
        : `Required function prop '${propName}' was not provided in ${componentName}`,
      )
    }
  },
}

export default AsyncAutoSelect
