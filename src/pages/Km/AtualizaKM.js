import React, { Fragment, useState, useEffect, useRef } from 'react'

import {
  Animated,
  AsyncStorage,
  Dimensions,
  Easing,
  Image,
  ImageBackground,
  Keyboard,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native'

import Lottie from 'lottie-react-native'
import { Formik } from 'formik'
import * as Yup from 'yup'

import Api from '../../services/oapi'
import GlobalStyles, { colors, _url } from '../../GlobalStyles'
import FormTextInput from '../../components/FormTextInput'
import FormButton from '../../components/FormButton'
import FormSwitch from '../../components/FormSwitch'

import bg from '../../assets/fundo-app.png'
import loading from '../../assets/json/car-scan.json'
import cheio from '../../assets/tanque_cheio.png'
import parcial from '../../assets/tanque_parcial.png'

const querystring = require('querystring')
const { width, height } = Dimensions.get('window')

const validationSchema = Yup.object().shape({
  km: Yup.string()
    .matches(!/^1000([.][0]{1,3})?$|^\d{1,3}$|^\d{1,3}([.]\d{1,3})$|^([.]\d{1,3})$/, {
      message: 'Km possui um formato inválido',
      excludeEmptyString: true,
    }),
  quant: Yup.string()
    .matches(!/^1000([.][0]{1,2})?$|^\d{1,2}$|^\d{1,2}([.]\d{1,2})$|^([.]\d{1,2})$/, {
      message: 'Quantidade possui um formato inválido',
      excludeEmptyString: true,
    }),
  valor: Yup.string()
    .matches(!/^1000([.][0]{1,2})?$|^\d{1,2}$|^\d{1,2}([.]\d{1,2})$|^([.]\d{1,2})$/, {
      message: 'valor possui um formato inválido',
      excludeEmptyString: true,
    }),
})

export default function AtualizaKM({ placa, navigation }) {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  // const [placa, setPlaca] = useState('')
  const [imgSwitch, setimgSwitch] = useState(parcial)
  
  // const [km, setKm] = useState('')
  // const [encheu, setEncheu] = useState(false)
  // const [quant, setQuant] = useState('')
  // const [valor, setValor] = useState('')
  // const [RotateValueHolder, setRotateValueHolder] = useState(0)

  const initialValues = { 
    km: '', 
    encheu: false,
    quant: '',
    valor: '',
  }

/*   
  const sRotateData = useRef(new Animated.Value(0)).current

  const RotateData = sRotateData.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  })  

  useEffect(() => {
    Animated.timing(RotateData, {
      toValue: 1,
      duration: 3000,
      easing: Easing.linear,
    }).start()
  }, [])
 */
  
  function handleSubmit (values, props) {
    // console.log('values', values)
    if (values.km.length > 0 && 
        values.quant.length > 0 &&
        values.valor.length > 0
        ) {
      setIsLoading(true)
      console.log('values-ok', placa, values)
      Keyboard.dismiss()
      
      // props.buscaHistorico()
      console.log('props', props)

      AsyncStorage.getItem('email').then(Email => {
        setEmail(Email)
  
        async function gravaKm() {
          try {
            await Api.post('', querystring.stringify({
              pservico: 'wfcvei',
              pmetodo: 'AtualizaKM',
              pcodprg: '',
              pemail: email,
              pplaca: placa,
              pquant: values.quant,
              pkm: values.km.replace('.',''),
              ptanqch: values.encheu ? 'S' : 'N',
              pvalor: values.valor.replace('R$ ',''),
            })).then(response => {
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
        // gravaKm()
      })
      setIsLoading(false)

    }
  }

  function Loading() {
    return (
      <Lottie source={loading} autoPlay loop />
    )
  }

  return (
    <View style={styles.scene}>
      <ImageBackground
        style={GlobalStyles.background}
        source={bg}
      > 
        <Text style={styles.placa}>{placa}</Text> 
                
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
              {setimgSwitch(values.encheu ? cheio : parcial)}

              <View style={styles.row}>
                <View style={[styles.vlegend, {width: '50%',}]}>
                  <Text style={styles.legend}>Quilometragem</Text>
                </View>
                <View style={[styles.vlegend, {width: '50%',}]}>
                  <Text style={styles.legend}>Encheu o tanque?</Text>
                </View>
              </View>

              <View style={styles.row}>
                <View style={[styles.vlegend, {width: '50%'}]}>
                  <FormTextInput
                    // type={'custom'}
                    // options={{mask: '999.999'}}
                    type={'money'}
                    options={{
                      precision: 0,
                      separator: '.',
                      delimiter: '',
                      unit: '',
                      suffixUnit: '',
                      zeroCents: false
                    }}
                    name='km'
                    value={values.km}
                    style={styles.input}
                    keyboardType="numeric"
                    autoCorrect={false}
                    autoCapitalize="none"
                    // includeRawValueInChangeText={true}
                    onChangeText={handleChange('km')}
                  />
                </View>

                <View style={[styles.vlegend, {
                  width: '50%', justifyContent: 'flex-start', alignItems: 'flex-start',
                }]}>
                  <View style={styles.row}>
                    <View style={{width: '30%', marginRight: 5, }}>
                      <FormSwitch
                        name='encheu'
                        onChange={handleChange('encheu')}
                        value={values.encheu}
                      />
                    </View>
                    <View style={{width: '70%', marginRight: 10, }}>
                      <Animated.Image
                        source={imgSwitch}
                        style={{
                          width: 100,
                          height: 50,
                          // transform: [{ rotate: RotateData }],
                        }}
                        resizeMode="contain"
                      />
                    </View>
                  </View>
                </View>
                {/* <Text style={{ color: 'red' }}>{errors.km}</Text> */}
              </View>

              <View style={styles.row}>
                <View style={[styles.vlegend, {width: '50%',}]}>
                  <Text style={styles.legend}>Quant. Abastecida</Text>
                </View>
                <View style={[styles.vlegend, {width: '50%',}]}>
                  <Text style={styles.legend}>Valor total</Text>
                </View>
              </View>

              <View style={styles.row}>
                <View style={[styles.vlegend, {width: '50%'}]}>
                  <FormTextInput
                    // type={'custom'}
                    // options={{mask: '9999.99'}}
                    type={'money'}
                    options={{
                      precision: 2,
                      separator: ',',
                      delimiter: '.',
                      unit: '',
                      suffixUnit: ''
                    }}
                    name='quant'
                    value={values.quant}
                    style={styles.input}
                    keyboardType="numeric"
                    autoCorrect={false}
                    autoCapitalize="none"
                    onChangeText={handleChange('quant')}
                  />
                </View>
                <View style={[styles.vlegend, {width: '50%'}]}>
                  <FormTextInput
                    type={'money'}
                    options={{
                      precision: 2,
                      separator: '.',
                      delimiter: '',
                      unit: 'R$ ',
                      suffixUnit: ''
                    }}
                    name='valor'
                    value={values.valor}
                    style={styles.input}
                    keyboardType="numeric"
                    autoCorrect={false}
                    autoCapitalize="none"
                    onChangeText={handleChange('valor')}
                  />
                </View>
              </View> 

              <FormButton
                style={styles.button}
                type="solid"
                onPress={handleSubmit}
                title="Gravar"
                buttonStyle={styles.button}
                textStyle={styles.buttonText}
              />

            </Fragment>
          )}
        </Formik>

        {isLoading ? Loading() : <></>}
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({

  scene: {
    flex: 1,
    marginTop: 10,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  vlegend: {
    marginTop: 20,
    width: width,
  },

  legend: {
    fontSize: 16,
    color: '#00FFFF',
    textAlign: 'left',
    paddingLeft: 10,
  },

  text: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#F0E68C',
    textAlign: 'right',
    paddingRight: 10,
  },

  placa: {
    textAlign: 'center',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 30,
    color: '#FFF',
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

  button: {
    height: 42,
    width: 160,
    backgroundColor: '#87CEEB',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
  },

  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },

})