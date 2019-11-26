import React, { useState, useEffect } from 'react'

import {
  AsyncStorage,
  Dimensions,
  Form,
  ImageBackground,
  StyleSheet,
  TextInput,
  Text,
  TouchableHighlight,
  View,
} from 'react-native'

import { Input } from 'react-native-elements'
import { SwitchToggle } from '@dooboo-ui/native'

import GlobalStyles, { colors, _url } from '../../GlobalStyles'

import bg from '../../assets/fundo-app.png'

const { width, height } = Dimensions.get('window')

export default function AtualizaKM({ placa, navigation }) {
  const [pkm, setPkm] = useState('')
  const [pencheu, setPencheu] = useState(false)
  const [pquant, setPquant] = useState('')
  const [pvalor, setPvalor] = useState('')

  const { register, handleSubmit, errors } = useForm()
  
  const onSubmit = (data) => { console.log(data) }

  async function handleSubmit() {
    console.log('Data', pkm, pencheu, pquant, pvalor)
  }

  return (
    <View style={styles.scene}>
      <ImageBackground
        style={GlobalStyles.background}
        source={bg}
      > 
        <Text style={styles.placa}>{placa}</Text> 
                
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
            <TextInput
              name='km'
              style={styles.input}
              keyboardType="numeric"
              autoCorrect={false}
              value={pkm || ''}
              onChangeText={setPkm}
              required
            />
          </View>

          <View style={[styles.vlegend, {width: '50%', justifyContent: 'center', alignItems: 'center',}]}>
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
              switchOn={pencheu}
              onPress={() => setPencheu(!pencheu)}
              circleColorOff='red'
              circleColorOn='green'
              duration={500}
            />
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
            <TextInput
              name='quant'
              style={styles.input}
              keyboardType="numeric"
              autoCorrect={false}
              value={pquant || ''}
              onChangeText={setPquant}
            />
          </View>
          <View style={[styles.vlegend, {width: '50%'}]}>
            <TextInput
              name='valor'
              style={styles.input}
              keyboardType="numeric"
              autoCorrect={false}
              value={pvalor || ''}
              onChangeText={setPvalor}
            />
          </View>
        </View>

        <TouchableHighlight onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Gravar</Text>
        </TouchableHighlight>

      </ImageBackground>
    </View>
  )

  /* 
  return (
    <View style={styles.scene}>
      <ImageBackground
        style={GlobalStyles.background}
        source={bg}
      > 
        <Text style={styles.placa}>{placa}</Text> 
                
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
            <TextInput
              name='km'
              style={styles.input}
              keyboardType="numeric"
              autoCorrect={false}
              value={pkm || ''}
              onChangeText={setPkm}
              required
            />
          </View>

          <View style={[styles.vlegend, {width: '50%', justifyContent: 'center', alignItems: 'center',}]}>
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
              switchOn={pencheu}
              onPress={() => setPencheu(!pencheu)}
              circleColorOff='red'
              circleColorOn='green'
              duration={500}
            />
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
            <TextInput
              name='quant'
              style={styles.input}
              keyboardType="numeric"
              autoCorrect={false}
              value={pquant || ''}
              onChangeText={setPquant}
            />
          </View>
          <View style={[styles.vlegend, {width: '50%'}]}>
            <TextInput
              name='valor'
              style={styles.input}
              keyboardType="numeric"
              autoCorrect={false}
              value={pvalor || ''}
              onChangeText={setPvalor}
            />
          </View>
        </View>

        <TouchableHighlight onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Gravar</Text>
        </TouchableHighlight>

      </ImageBackground>
    </View>
  )
   */
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