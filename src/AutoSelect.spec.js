import expect from 'expect'
import React from 'react'
import { shallow } from 'enzyme'
import createMountWithContext from './utils/__test__/createMountWithContext'
import { AutoSelectOptions } from './AutoSelectOptions'
import AutoSelect from './AutoSelect'
import { makes } from './AutoSelectFixtures'

describe('AutoSelect', () => {
  const mount = createMountWithContext()

  const blankAutoSelectProps = {
    name: 'myAutoSelectField',
    value: '',
    disabled: false,
    required: false,
    label: 'My AutoSelect field',
    options: [1, 2, 3],
    Options: AutoSelectOptions,
  }
  const makeAutoSelectTransforms = {
    displayOption: (option) => option.description,
    serializeOption: (option) => option.code,
  }

  const simpleAutoSelect = shallow(<AutoSelect {...blankAutoSelectProps} />)

  const selectedOption = makes[7]
  const activeMakeAutoSelect = shallow(
    <AutoSelect
      {...blankAutoSelectProps}
      options={makes}
      value={makeAutoSelectTransforms.serializeOption(selectedOption)}
      {...makeAutoSelectTransforms}
    />
  ).setState({ active: true })

  it('renders with MUI TextField', () => {
    expect(simpleAutoSelect.find('TextField').length).toEqual(1)
  })

  it('renders with a hidden input field', () => {
    expect(simpleAutoSelect.find('input[type="hidden"]').length).toEqual(1)
  })

  it('renders no options list on initialization', () => {
    expect(simpleAutoSelect.find('AutoSelectOptions').length).toEqual(0)
  })

  it('renders options list when active', () => {
    const autoSelect = shallow(<AutoSelect {...blankAutoSelectProps} />)

    autoSelect.setState({ active: true })

    expect(autoSelect.find('AutoSelectOptions').length).toEqual(1)
  })

  it('mirrors value in MUI TextField and hidden input field in absence of displayOption and serializeOption props', () => {
    const simpleValue = 'hello!'
    const autoSelect = shallow(
      <AutoSelect {...blankAutoSelectProps} value={simpleValue} />
    )
    autoSelect.setState({ active: true })
    const textFieldValue = autoSelect.find('TextField').prop('value')
    const hiddenInputValue = autoSelect.find('input[type="hidden"]').prop('value')

    expect([textFieldValue, hiddenInputValue]).toEqual([simpleValue, simpleValue])
  })

  it('passes MUI TextField a transformed value from options when given props displayOption and serializeOption', () => {
    const textFieldValue = activeMakeAutoSelect.find('TextField').prop('value')
    const hiddenInputValue = activeMakeAutoSelect.find('input[type="hidden"]').prop('value')
    const findOptionWithCode = (code) => makes.find((o) => o.code === code)

    expect(textFieldValue).toEqual(makeAutoSelectTransforms.displayOption(findOptionWithCode(hiddenInputValue)))
  })

  it('passes MUI TextField raw value if it cannot be found among options (with serializeOption prop)', () => {
    const newMake = 'Bladeblah'
    const makeAutoSelect = shallow(
      <AutoSelect
        {...blankAutoSelectProps}
        value={newMake}
        {...makeAutoSelectTransforms}
      />
    )
    makeAutoSelect.setState({ active: true })
    const textFieldValue = makeAutoSelect.find('TextField').prop('value')
    const hiddenInputValue = makeAutoSelect.find('input[type="hidden"]').prop('value')

    expect([textFieldValue, hiddenInputValue]).toEqual([newMake, newMake])
  })

  it('passes correct props to AutoSelectOptions', () => {
    const passedProps = {
      displayOption: () => null,
      serializeOption: () => null,
      options: [1, 2, 3],
    }
    const autoSelect = shallow(
      <AutoSelect {...blankAutoSelectProps} {...passedProps} />
    )
    autoSelect.setState({ active: true })

    expect(autoSelect.find('AutoSelectOptions').props()).toInclude(passedProps)
  })

  it('opens dropdown with correct option highlighted if its value is present among options', () => {
    expect(activeMakeAutoSelect.find('AutoSelectOptions').prop('selectedOption')).toEqual(selectedOption)
  })

  it('passes mouseentered option as selectedOption to AutoSelectOptions', () => {
    const autoSelectOptions = () => activeMakeAutoSelect.find('AutoSelectOptions')
    const prevSelectedOption = autoSelectOptions().prop('selectedOption')
    const highlightedOption = makes[1]
    expect(prevSelectedOption).toNotBe(highlightedOption)

    activeMakeAutoSelect.setState({ highlightedOption })
    expect(autoSelectOptions().prop('selectedOption')).toBe(highlightedOption)

    activeMakeAutoSelect.setState({ highlightedOption: null })
  })

  it('restores previous selectedOption to AutoSelectOptions on option mouseleave', () => {
    const autoSelectOptions = () => activeMakeAutoSelect.find('AutoSelectOptions')
    const prevSelectedOption = autoSelectOptions().prop('selectedOption')
    const highlightedOption = makes[1]
    expect(prevSelectedOption).toNotBe(highlightedOption)

    activeMakeAutoSelect.setState({ highlightedOption })
    activeMakeAutoSelect.setState({ highlightedOption: null })

    expect(autoSelectOptions().prop('selectedOption')).toBe(prevSelectedOption)
  })

  describe('AutoSelectOptions', () => {
    const onClickOption = expect.createSpy()
    const onMouseEnterOption = expect.createSpy()
    const { serializeOption, displayOption } = makeAutoSelectTransforms
    const makeAutoSelectOptions = mount(
      <AutoSelectOptions
        options={makes}
        {...makeAutoSelectTransforms}
        onClickOption={onClickOption}
        onMouseEnterOption={onMouseEnterOption}
      />
    )

    it('displays some options transformed using displayOption prop in MDL flat buttons', () => {
      const individualOptions = makeAutoSelectOptions.find('.mdl-button')
      const optionsText = individualOptions.map((o) => o.text()).slice(0, 4)
      const transformedOptions = makes.map(displayOption).slice(0, 4)
      expect(optionsText).toEqual(transformedOptions)
    })

    it('fires onClickOption prop with serialized option value when option is clicked', () => {
      const option = makeAutoSelectOptions.find('.mdl-button').at(3)

      option.simulate('click')
      expect(onClickOption).toHaveBeenCalledWith(serializeOption(makes[3]))
    })

    it('fires onMouseEnter prop with option value when option is mouseentered', () => {
      const option = makeAutoSelectOptions.find('.mdl-button').at(3)

      option.simulate('mouseenter')
      expect(onMouseEnterOption).toHaveBeenCalledWith(makes[3])
    })
  })
})
