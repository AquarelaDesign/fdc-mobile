import React, { Fragment, useState, useEffect } from 'react'

import {
  AsyncStorage,
  Dimensions,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from 'react-native'

import { LinearGradient } from 'expo-linear-gradient'

import Lottie from 'lottie-react-native'
import GlobalStyles, {
  _url, bg_colors, bg_start, bg_end
} from '../../GlobalStyles'

import loading from '../../assets/json/car-scan.json'

import Api from '../../services/oapi'

import { Formik } from 'formik'
import FormTextInput from '../../components/FormTextInput'
import FormButton from '../../components/FormButton'
import Icon from 'react-native-vector-icons/FontAwesome'

const querystring = require('querystring')
const { width } = Dimensions.get('window')

const NovoUsuario = ({ e_mail, buscaHistorico }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState(e_mail)
  
  const initialValues = { 
    e_mail: '', 
    nome: '', 
    fone: '', 
    cep: '',
    endrua: '',
    endnum: '',
    endcom: '',
    bairro: '',
    cidade: '',
    uf: '',
  }

  useEffect(() => {
    AsyncStorage.getItem('email').then(Email => {
      setEmail(Email)
    })
  }, [email])

  const handleSubmit = (values) => {
    if (values.e_mail.length > 0
        ) {
      setIsLoading(true)
      Keyboard.dismiss()
      
      if (email !== '') {
        const enviaDados = async (values) => {
          try {
            await Api.post('', querystring.stringify({
              pservico: 'wfcusu',
              pmetodo: 'NovoUsuario',
              pcodprg: '',
              pemail: email,
              pjsonusu: jsonusu,
            })).then(response => {
              if (response.status === 200) {
                if (response.data.ProDataSet !== undefined) {
                  const { ttfckmv, ttretorno } = response.data.ProDataSet
                  if (ttretorno.tipret === 'err') {
                    ToastAndroid.showWithGravity(
                      ttretorno.mensagem,
                      ToastAndroid.SHORT,
                      ToastAndroid.CENTER
                    )
                  } else {
                    buscaHistorico(ttfckmv)
                  }
                  setIsLoading(false)
                } else {
                  setIsLoading(false)
                }
              } else {
                setIsLoading(false)
              }
            })
          } catch (error) {
            const { response } = error
            if (response !== undefined) {
              setIsLoading(false)
            } else {
              setIsLoading(false)
            }
          }
        }
        // enviaDados()
      }
    }
  }

  const Loading = () => {
    return (
      <Lottie source={loading} autoPlay loop />
    )
  }

  return (
    <SafeAreaView style={[GlobalStyles.container, {paddingTop: 40,}]}>
      <LinearGradient
        colors={bg_colors}
        style={GlobalStyles.background}
        start={bg_start}
        end={bg_end}
      >
        <View style={styles.row}>
          <Icon name="user-plus" size={40} color="#f7ff00" style={{marginLeft: 20, marginTop: 30, marginBottom: 10, }}/>
          <Text style={styles.title}>Novo Usuário</Text>
        </View>

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
              <View style={styles.row}>
                <View style={[styles.vlegend, {width: '100%',}]}>
                  <Text style={styles.legend}>Email*</Text>
                </View>
              </View>
              <View style={styles.row}>
                <View style={[styles.vlegend, {width: '100%'}]}>
                  <FormTextInput
                    type={'custom'}
                    options={{
                      mask: '**********************************************************************'
                    }}
                    name='e_mail'
                    value={values.e_mail}
                    style={styles.input}
                    keyboardType="email-address"
                    autoCompleteType="email"
                    autoCorrect={false}
                    autoCapitalize="none"
                    onChangeText={handleChange('e_mail')}
                  />
                </View>
              </View> 

              <View style={styles.row}>
                <View style={[styles.vlegend, {width: '100%',}]}>
                  <Text style={styles.legend}>Nome*</Text>
                </View>
              </View>
              <View style={styles.row}>
                <View style={[styles.vlegend, {width: '100%'}]}>
                  <FormTextInput
                    type={'custom'}
                    options={{
                      mask: '**********************************************************************'
                    }}
                    name='nome'
                    value={values.nome}
                    style={styles.input}
                    keyboardType="default"
                    autoCompleteType="name"
                    autoCorrect={false}
                    autoCapitalize="words"
                    onChangeText={handleChange('nome')}
                  />
                </View>
              </View> 

              <View style={styles.row}>
                <View style={[styles.vlegend, {width: '100%',}]}>
                  <Text style={styles.legend}>Telefone</Text>
                </View>
              </View>
              <View style={styles.row}>
                <View style={[styles.vlegend, {width: '100%'}]}>
                  <FormTextInput
                    type={'cel-phone'}
                    options={{
                      maskType: 'BRL',
                      withDDD: true,
                      dddMask: '(99) '
                    }}
                    name='fone'
                    value={values.fone}
                    style={styles.input}
                    keyboardType="phone-pad"
                    autoCompleteType="tel"
                    autoCorrect={false}
                    autoCapitalize="none"
                    onChangeText={handleChange('fone')}
                  />
                </View>
              </View> 

              <FormButton
                style={styles.button}
                type="outline"
                onPress={handleSubmit}
                title="Gravar"
                buttonStyle={styles.button}
                titleStyle={styles.buttonText}
              />

            </Fragment>
          )}
        </Formik>

        {isLoading ? Loading() : <></>}
      </LinearGradient>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({

  scene: {
    flex: 1,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  vlegend: {
    marginTop: 5,
    width: width,
  },

  legend: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'left',
    paddingLeft: 10,
  },

  text: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#F0E68C',
    textAlign: 'right',
    paddingRight: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: '#444',
    paddingHorizontal: 5,
    fontSize: 14,
    color: '#444',
    height: 44,
    marginBottom: 5,
    marginLeft: 5, 
    marginRight: 5,
    borderRadius: 5,
    backgroundColor: '#FFF',
  },

  button: {
    height: 35,
    width: 140,
    backgroundColor: '#4169E1',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderColor: '#87CEFA',
  },

  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },

  title: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#FFF',
    width: width - 115,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    textTransform: "uppercase",
  },

})

export default NovoUsuario
