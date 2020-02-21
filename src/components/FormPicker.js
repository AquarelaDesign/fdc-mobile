import React from "react"
import { View } from "react-native"
import { withFormikControl } from "react-native-formik"
import RNPickerSelect, { defaultStyles } from 'react-native-picker-select'

class FormPicker extends React.PureComponent {
  render() {
    const { 
      placeholder,
      items,
      onValueChange,
      InputAccessoryView,
      style,
      value, 
      error, 
    } = this.props

    return (
      <View style={{marginTop: 0}} >
        <RNPickerSelect
          placeholder={placeholder}
          items={items}
          onValueChange={onValueChange}
          InputAccessoryView={InputAccessoryView}
          style={style}
          value={value}
        />
      </View>
    )
  }
}

export default withFormikControl(FormPicker)