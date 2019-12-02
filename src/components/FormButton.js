import React from 'react'
import { Button } from 'react-native-elements'

const FormButton = ({ type, title, buttonStyle, titleStyle, ...rest }) => (
  <Button
    {...rest}
    type={type}
    title={title}
    buttonStyle={buttonStyle}
    titleStyle={titleStyle}
  />
)

export default FormButton
