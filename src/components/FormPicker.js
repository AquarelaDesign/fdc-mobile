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
          style={style}
          value={value}
          useNativeAndroidPickerStyle={false}
        />
      </View>
    )
  }
}

export default withFormikControl(FormPicker)