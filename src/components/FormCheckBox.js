import React from 'react'
import { CheckBox } from 'react-native-elements'
import { StyleSheet, View, Image } from 'react-native'

const FormCheckBox = ({
  name,
  value,
  ...rest
}) => (
  <View style={styles.inputContainer}>
    <CheckBox
      {...rest}
      name={name}
      value={value}
      checkedIcon={<Image source={require('../assets/tanque_cheio.png')} style={styles.icone} />}
      uncheckedIcon={<Image source={require('../assets/tanque_parcial.png')} style={styles.icone} />}
    />
  </View>
)

const styles = StyleSheet.create({
  
  inputContainer: {
    margin: 15
  },
  
  icone: {
    height: 100,
    width: 50,
  },

})

export default FormCheckBox
