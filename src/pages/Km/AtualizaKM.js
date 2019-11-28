import React, { Fragment, useState, useEffect, useRef } from 'react'

import {
  Animated,
  AsyncStorage,
  Dimensions,
  Easing,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native'

import { Formik } from 'formik'
// import * as Yup from 'yup'

import GlobalStyles, { colors, _url } from '../../GlobalStyles'
import FormTextInput from '../../components/FormTextInput'
import FormButton from '../../components/FormButton'
import FormSwitch from '../../components/FormSwitch'

import bg from '../../assets/fundo-app.png'
import cheio from '../../assets/tanque_cheio.png'
import parcial from '../../assets/tanque_parcial.png'

const { width, height } = Dimensions.get('window')
/*
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
*/

export default function AtualizaKM({ placa, navigation }) {
  const [km, setKm] = useState('')
  const [encheu, setEncheu] = useState(false)
  const [quant, setQuant] = useState('')
  const [valor, setValor] = useState('')
  const [imgSwitch, setimgSwitch] = useState(parcial)
  const [RotateValueHolder, setRotateValueHolder] = useState(0)

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
  
  const handleSubmit = (values) => {
    console.log('values', values)
    if (values.km.length > 0 && 
        values.quant.length > 0 &&
        values.valor.length > 0
        ) {
      console.log('values-ok', values)
    }
  }

  return (
    <View style={styles.scene}>
      <ImageBackground
        style={GlobalStyles.background}
        source={bg}
      > 
        <Text style={styles.placa}>{placa}</Text> 
                
        <Formik
          initialValues={{ 
            km: '', 
            encheu: false,
            quant: '',
            valor: '',
          }}
          onSubmit={values => {
            handleSubmit(values)
          }}
          // validationSchema={validationSchema}
        >
          {({ 
            handleChange, 
            values, 
            handleSubmit,
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
                buttonType="outline"
                onPress={handleSubmit}
                title="Gravar"
                buttonColor="#007189"
              />

            </Fragment>
          )}
        </Formik>

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
    backgroundColor: '#007189',
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