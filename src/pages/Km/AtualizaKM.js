import React, { Fragment, useState, useEffect } from 'react'

import {
  Animated,
  AsyncStorage,
  Dimensions,
  Keyboard,
  StyleSheet,
  Text,
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
import FormSwitch from '../../components/FormSwitch'

import cheio from '../../assets/tanque_cheio.png'
import parcial from '../../assets/tanque_parcial.png'

const querystring = require('querystring')
const { width } = Dimensions.get('window')

const AtualizaKM = ({ placa, buscaHistorico }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [imgSwitch, setimgSwitch] = useState(parcial)
  
  const initialValues = { 
    km: '', 
    encheu: false,
    quant: '',
    valor: '',
  }

  useEffect(() => {
    AsyncStorage.getItem('email').then(Email => {
      setEmail(Email)
    })
  }, [email])

  const handleSubmit = (values) => {
    if (values.km.length > 0 && 
        values.quant.length > 0 &&
        values.valor.length > 0
        ) {
      setIsLoading(true)
      Keyboard.dismiss()
      
      if (email !== '' && placa !== '') {
        async function gravaKm() {
          try {
            await Api.post('', querystring.stringify({
              pservico: 'wfcvei',
              pmetodo: 'AtualizaKM',
              pcodprg: '',
              pemail: email,
              pplaca: placa,
              pquant: values.quant, 
              pkm: values.km,
              ptanqch: values.encheu ? 'S' : 'N',
              pvalor: values.valor.replace('R$ ','') 
            })).then(response => {
              if (response.status === 200) {
                if (response.data.ProDataSet !== undefined) {
                  const { ttfckmv } = response.data.ProDataSet
                  buscaHistorico(ttfckmv)
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
        gravaKm()
      }
    }
  }

  const Loading = () => {
    return (
      <Lottie source={loading} autoPlay loop />
    )
  }

  return (
    <View style={styles.scene}>
      <LinearGradient
        colors={bg_colors}
        style={GlobalStyles.background}
        start={bg_start}
        end={bg_end}
      >
        <Text style={styles.placa}>{placa}</Text> 
                
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
                        }}
                        resizeMode="contain"
                      />
                    </View>
                  </View>
                </View>
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
                      separator: ',',
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
    </View>
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
    marginTop: 20,
    width: width,
  },

  legend: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#FFFFFF',
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
    backgroundColor: '#4169E1',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
    borderColor: '#87CEFA',
  },

  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },

})

export default AtualizaKM
