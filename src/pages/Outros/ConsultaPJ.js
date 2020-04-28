import React, { Fragment, useState, useEffect } from 'react'

import {
  Alert,
  AsyncStorage,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Image,
  Keyboard,
  Text,
  View,
} from 'react-native'

import { LinearGradient } from 'expo-linear-gradient'

import GlobalStyles, {
  _url, colors, bg_colors, bg_start, bg_end
} from '../../GlobalStyles'

import { Formik } from 'formik'
import FormTextInput from '../../components/FormTextInput'
import FormButton from '../../components/FormButton'

import logo from '../../assets/SimplesDiretObjetivo-branco-sombra.png'

const { width } = Dimensions.get('window')

export default function ConsultaPJ({ navigation }) {
  const [email, setEmail] = useState('')
  
  const initialValues = { 
    placa: '', 
  }

  useEffect(() => {
    AsyncStorage.getItem('email').then(Email => {
      setEmail(Email)
    })
  }, [email])

  const handleSubmit = (values, props) => {
    if (values.placa.length === 0) {
      Alert.alert('Informe a Placa para consulta')
      return
    }

    const placa = values.placa
    Keyboard.dismiss()
    
    if (email !== '' && placa !== '') {
      navigation.navigate('Passagens', { placa })
    }
  }
  
  return (
    <SafeAreaView style={GlobalStyles.container}>
      <LinearGradient
        colors={bg_colors}
        style={GlobalStyles.background}
        start={bg_start}
        end={bg_end}
      >
        <Image style={styles.logo} source={logo} />

        <View style={GlobalStyles.boxContainer}>
          <View style={styles.parentHr} />
          <Text style={styles.msgText}>
            Exclusiva para prestadores de serviços
          </Text>
          <View style={styles.parentHr} />

          <Text style={styles.msgTitle}>
            Informe a Placa
          </Text>

          <Formik
            initialValues={initialValues}
            onSubmit={(values, {resetForm}) => {
              handleSubmit(values)
              resetForm()
            }}
          >
            {({ 
              handleChange, 
              values, 
              handleSubmit,
            }) => (
              <Fragment>

                <View style={styles.box}>
                  <View style={styles.row}>
                    <View style={styles.vlegend}>
                      <FormTextInput
                        type={'custom'}
                        options={{ mask: 'SSSSSSS' }}
                        name='placa'
                        value={values.placa}
                        style={styles.input}
                        autoCorrect={false}
                        autoCapitalize="none"
                        onChangeText={handleChange('placa')}
                      />
                    </View>
                  </View> 

                  <FormButton
                    style={styles.button}
                    type="outline"
                    onPress={handleSubmit}
                    title="Consulta"
                    buttonStyle={styles.button}
                    titleStyle={styles.buttonText}
                  />
                </View> 

              </Fragment>
            )}
          </Formik>

        </View>
      </LinearGradient>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  logo: {
    height: 100,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: 50,
  },

  msgTitle: {
    fontWeight: 'bold',
    fontSize: 25,
    color: '#FFFFFF',
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    paddingTop: 30,
    width: width - 10, 
  },

  msgText: {
    fontSize: 20,
    color: '#FFFFFF',
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    paddingTop: 50,
    width: width - 10, 
  },
  
  parentHr: {
    height: 1,
    color: '#FFFFFF',
    width: '100%'
  },

  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  vlegend: {
    marginTop: 20,
    width: 240,
  },

  box: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },

  input: {
    borderWidth: 1,
    borderColor: '#444',
    fontSize: 16,
    color: '#444',
    height: 44,
    marginBottom: 20,
    marginLeft: 15, 
    marginRight: 15,
    borderRadius: 2,
    backgroundColor: '#FFF',
  },

  button: {
    height: 42,
    width: 200,
    backgroundColor: '#27a2b3',
    borderColor: '#87CEFA',
  },

  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },

})