import React from "react"
import { View } from "react-native"
import { withFormikControl } from "react-native-formik"
import SearchableDropdown from 'react-native-searchable-dropdown';

class FormDropDown extends React.PureComponent {
  render() {
    const { 
      error, 
      value, 
      setFieldValue,
      onItemSelect,
      textInputStyle,
      itemStyle,
      itemTextStyle,
      items, 
      defaultIndex, 
      placeholder,
    } = this.props

    return (
      <View style={{marginTop: 0}} >
        <SearchableDropdown
          onTextChange={setFieldValue}
          onItemSelect={onItemSelect}
          containerStyle={{ padding: 5 }}
          textInputStyle={textInputStyle}
          itemStyle={itemStyle}
          itemTextStyle={itemTextStyle}
          itemsContainerStyle={{maxHeight: '60%'}}
          items={items}
          defaultIndex={defaultIndex}
          placeholder={placeholder}
          resetValue={false}
          underlineColorAndroid="transparent"
        />
      </View>
    )
  }
}

export default withFormikControl(FormDropDown)