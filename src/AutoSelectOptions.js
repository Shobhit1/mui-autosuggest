import React from 'react'
import PropTypes from 'prop-types'
import { AutoSizer, List } from 'react-virtualized'
import cn from 'classnames'
import styles from './AutoSelect.css'
import mdlComponent from './mdlComponent'
import identity from './utils/identity'

const OPTIONS_ROW_HEIGHT = 50

let AutoSelectOption = ({
  onMouseEnter,
  onMouseLeave,
  onClick,
  displayOption,
  serializeOption,
  afterClickOption,
  selected,
  style,
  option,
  name,
}) =>
  <div
    name={`${name}-input`}
    onMouseEnter={() => onMouseEnter(option)}
    onMouseLeave={onMouseLeave}
    onClick={() => { onClick(serializeOption(option)); setTimeout(afterClickOption, 60) }} // allow animation to finish
    className={cn({ [styles.selectedOption]: option === selected }, styles.option, 'mdl-button', 'mdl-js-button', 'mdl-js-ripple-effect')}
    style={{ ...style }}
  >
    {displayOption(option)}
  </div>
AutoSelectOption = mdlComponent(AutoSelectOption)

export const AutoSelectOptions = ({
  name,
  options,
  onMouseEnterOption = () => null,
  onMouseLeaveOption = () => null,
  onClickOption = () => null,
  afterClickOption = () => null,
  displayOption = identity,
  serializeOption = identity,
  selectedOption,
  scrollToIndex,
  width = 200, // DEFAULT WIDTH FOR TESTING
}) => (
  <List
    name={name}
    scrollToIndex={scrollToIndex}
    width={Math.max(width, 190)}
    height={Math.min(options.length * OPTIONS_ROW_HEIGHT, 200)}
    rowCount={options.length}
    rowHeight={OPTIONS_ROW_HEIGHT}
    className={styles.options}
    tabIndex={-1}
    rowRenderer={({ index: i, key, style }) =>
      <AutoSelectOption
        name={name}
        key={key}
        onMouseEnter={onMouseEnterOption}
        onMouseLeave={onMouseLeaveOption}
        onClick={onClickOption}
        afterClickOption={afterClickOption}
        selected={selectedOption}
        option={options[i]}
        {...{ style, displayOption, serializeOption }}
      />
    }
  />
)

AutoSelectOptions.propTypes = {
  options: PropTypes.array.isRequired,
  displayOption: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
}

const AutoSizedAutoSelectOptions = (props) => <AutoSizer>{({ width }) => <AutoSelectOptions {...props} width={width} />}</AutoSizer>

export default AutoSizedAutoSelectOptions
