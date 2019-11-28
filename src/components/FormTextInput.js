import React from 'react'
import { StyleSheet, TextInput, View } from 'react-native'

const FormTextInput = ({
  name,
  value,
  placeholder,
  keyboardType,
  ...rest
}) => (
  <View style={styles.inputContainer}>
    <TextInput
      {...rest}
      name={name}
      value={value}
      placeholder={placeholder}
      style={styles.input}
      keyboardType={keyboardType}
    />
  </View>
)

const styles = StyleSheet.create({
  inputContainer: {
    margin: 5
  },

  input: {
    borderWidth: 1,
    borderColor: '#444',
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#444',
    height: 44,
    marginBottom: 20,
    marginLeft: 15, 
    marginRight: 15,
    borderRadius: 2,
    backgroundColor: '#FFF',
  },

})

export default FormTextInput
