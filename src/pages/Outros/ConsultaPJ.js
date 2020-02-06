import React, { Fragment, useState } from 'react'

import {
  Alert,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Image,
  Keyboard,
  Text,
  View,
  ImageBackground,
} from 'react-native'

import Lottie from 'lottie-react-native'

import { Formik } from 'formik'
import * as Yup from 'yup'

import GlobalStyles, { _url } from '../../GlobalStyles'
import FormTextInput from '../../components/FormTextInput'
import FormButton from '../../components/FormButton'

import logo from '../../assets/SimplesDiretObjetivo-branco-sombra.png'
import bg from '../../assets/fundo-app.png'

const { width } = Dimensions.get('window')

const validationSchema = Yup.object().shape({
  placa: Yup.string()
    .required('Informe a Placa para consulta'),
})

export default function ConsultaPJ({ navigation }) {
  const [isLoading, setIsLoading] = useState(false)
  
  const initialValues = { 
    placa: '', 
  }

  const handleSubmit = (values, props) => {
    if (values.placa.length === 0) {
      Alert.alert('Informe a Placa para consulta')
      return
    }

    const placa = values.placa
    // navigation.navigate('Passagem', { placa })
    setIsLoading(true)
    Keyboard.dismiss()
    
    AsyncStorage.getItem('email').then(Email => {
      setEmail(Email)
      if (email !== '' && placa !== '') {
        async function gravaKm() {
          try {
            await Api.post('', querystring.stringify({
              pservico: 'wfcpas',
              pmetodo: 'ListaPassagens',
              pcodprg: '',
              pemail: email,
              pplaca: placa,
            })).then(response => {
              console.log(response)
              /*
              if (response.status === 200) {
                if (response.data.ProDataSet !== undefined) {
                  // const { ttfccva } = response.data.ProDataSet
                  props.buscaHistorico()
                  setIsLoading(false)
                } else {
                  setIsLoading(false)
                }
              } else {
                setIsLoading(false)
              }
              */
            })
          } catch (error) {
            const { response } = error
            if (response !== undefined) {
              // console.log(response.data.errors[0])
              setIsLoading(false)
            } else {
              // console.log(error)
              setIsLoading(false)
            }
          }
        }
        gravaKm()
      }
    })
    setIsLoading(false)

  }
  
  return (
    <SafeAreaView style={GlobalStyles.container}>
      <ImageBackground
        style={GlobalStyles.background}
        source={bg}
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
            // validationSchema={validationSchema}
          >
            {({ 
              handleChange, 
              values, 
              handleSubmit,
              resetForm,
              // errors,
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
                    type="solid"
                    onPress={handleSubmit}
                    title="Consulta"
                    buttonStyle={styles.button}
                    textStyle={styles.buttonText}
                  />
                </View> 

              </Fragment>
            )}
          </Formik>

        </View>
      </ImageBackground>
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
    // marginTop: height - (height / 2) - 40, 
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
    // marginTop: height - (height / 2) - 40, 
    paddingTop: 50,
    // padding: 10,
    width: width - 10, 
  },
  
  parentHr: {
    height: 1,
    color: '#FFF',
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
    backgroundColor: '#87CEEB',
  },

  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },

})