import expect from 'expect'
import React from 'react'
import { shallow } from 'enzyme'
import AsyncAutoSelect from './AsyncAutoSelect'
import createMountWithContext from './utils/__test__/createMountWithContext'

describe('AsyncAutoSelect', () => {
  const mount = createMountWithContext()

  const requiredProps = {
    name: 'myAutoSelectField',
    value: '',
    disabled: false,
    required: false,
    label: 'My AutoSelect field',
  }

  it('initializes with empty options', () => {
    const makeAutoSelectAsync = shallow(<AsyncAutoSelect {...requiredProps} fetchOptions={(setOptions) => setOptions([1, 2, 3])} />)
    expect(makeAutoSelectAsync.state('options')).toEqual([])
  })

  it('gets options asynchronously via fetchOptions on first focus', (done) => {
    const newOptions = [3, 4, 5]
    let makeAutoSelectAsync
    const fetchOptions = (setOptions) => setTimeout(() => {
      setOptions(newOptions, () => {
        expect(makeAutoSelectAsync.state('options')).toBe(newOptions)
        done()
      })
    }, 0)
    makeAutoSelectAsync = mount(
      <AsyncAutoSelect
        {...requiredProps}
        fetchOptions={fetchOptions}
      />
    )

    makeAutoSelectAsync.find('input[type="text"]').simulate('focus')
  })

  it('does not fire fetchOptions on second focus if fetchOptions has not changed', () => {
    const fetchOptions = expect.createSpy((setOptions) =>
      setOptions([1, 2, 3])
    ).andCallThrough()
    const makeAutoSelectAsync = mount(
      <AsyncAutoSelect
        {...requiredProps}
        fetchOptions={fetchOptions}
      />
    )

    makeAutoSelectAsync.find('input[type="text"]').simulate('focus')
    makeAutoSelectAsync.find('input[type="text"]').simulate('focus')

    expect(fetchOptions.calls.length).toEqual(1)
  })

  it('refires fetchOptions on second focus if fetchOptions has changed after first focus', () => {
    const fetchOptions1 = expect.createSpy((setOptions) => setOptions([1, 2, 3]))
    const fetchOptions2 = expect.createSpy((setOptions) => setOptions([1, 2, 3]))
    const makeAutoSelectAsync = mount(
      <AsyncAutoSelect
        {...requiredProps}
        fetchOptions={fetchOptions1}
      />
    )


    makeAutoSelectAsync.find('input[type="text"]').simulate('focus')
    makeAutoSelectAsync.setProps({ fetchOptions: fetchOptions2 })
    makeAutoSelectAsync.find('input[type="text"]').simulate('focus')

    expect([fetchOptions1, fetchOptions2].map((spy) => spy.calls.length)).toEqual([1, 1])
  })
})
