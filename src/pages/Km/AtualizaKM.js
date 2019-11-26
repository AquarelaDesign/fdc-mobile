import React, { Fragment, useState, useEffect } from 'react'

import {
  AsyncStorage,
  Dimensions,
  ImageBackground,
  StyleSheet,
  TextInput,
  Text,
  TouchableHighlight,
  View,
} from 'react-native'

import { Formik, Field } from 'formik'
// import { SwitchToggle } from '@dooboo-ui/native'
import Switch from '@material-ui/core/Switch'

import GlobalStyles, { colors, _url } from '../../GlobalStyles'
import FormInput from '../../components/FormInput'
import FormButton from '../../components/FormButton'
import FormCheckBox from '../../components/FormCheckBox'

import bg from '../../assets/fundo-app.png'

const { width, height } = Dimensions.get('window')

export default function AtualizaKM({ placa, navigation }) {
  const [km, setKm] = useState('')
  const [encheu, setEncheu] = useState(false)
  const [quant, setQuant] = useState('')
  const [valor, setValor] = useState('')

  const onSubmit = (data) => { console.log(data) }

  const handleSubmit = (values) => {
    if (values.km.length > 0 && 
        values.quant.length > 0 &&
        values.valor.length > 0
        ) {
      console.log('values', values)
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
          onSubmit={values => { handleSubmit(values) }}
        >
          {({ 
            handleChange, 
            values, 
            handleSubmit 
          }) => (
            <Fragment>

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
                  <FormInput
                    name='km'
                    value={values.km}
                    style={styles.input}
                    keyboardType="numeric"
                    autoCorrect={false}
                    autoCapitalize="none"
                    onChangeText={handleChange('km')}
                  />
                </View>

                <View style={[styles.vlegend, {width: '50%', justifyContent: 'center', alignItems: 'center',}]}>
                  <FormCheckBox
                    checked={values.encheu}
                    onChange={handleChange('encheu')}
                    value={values.encheu}
                  />
                    
{/*
                  <SwitchToggle
                    containerStyle={{
                      width: 100,
                      height: 30,
                      borderRadius: 15,
                      padding: 5,
                    }}
                    backgroundColorOn="#a0e1e5"
                    backgroundColorOff="#e5e1e0"
                    circleStyle={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      backgroundColor: 'blue',
                    }}
                    switchOn={values.encheu}
                    onPress={() => !handleChange('encheu')}
                    circleColorOff='red'
                    circleColorOn='green'
                    duration={500}
                  />
*/}
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
                  <FormInput
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
                  <FormInput
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