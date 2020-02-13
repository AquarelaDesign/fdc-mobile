import React, { useState, useEffect } from 'react'

import {
  Alert,
  AsyncStorage,
  KeyboardAvoidingView, 
  Dimensions,
  StyleSheet,
  Text,
  TextInput, 
  TouchableOpacity, 
  View,
} from 'react-native'

import { LinearGradient } from 'expo-linear-gradient'

import Lottie from 'lottie-react-native'
import GlobalStyles, {
  bg_colors, bg_start, bg_end
} from '../../GlobalStyles'

import loading from '../../assets/json/car-scan.json'

import Icon from 'react-native-vector-icons/FontAwesome'

const { width } = Dimensions.get('window')

const Usuario = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [oficina, setOficina] = useState({})
  const [btnSenhaTit, setBtnSenhaTit] = useState('Alterar Senha')
  const [isBtnSenha, setIsBtnSenha] = useState(false)
  const [senha, setSenha] = useState('')
  const [senha1, setSenha1] = useState('')

  useEffect(() => {
    setIsLoading(true)

      AsyncStorage.getItem('oficina').then(Oficina => {
        if (Oficina) {
          const tmp = JSON.parse(Oficina) 
          setOficina(tmp[0])
          setIsLoading(false)
        }
      })

  }, [])

  async function handleEncerra() {
    try {
      await AsyncStorage.setItem('oficina', '')
      await AsyncStorage.setItem('token', '')
      navigation.navigate('Login')
    }
    catch (error) {
      console.log(error)
      // const { response } = error
    }
  }

  async function handleSenha() {
    if (isBtnSenha) {
      setBtnSenhaTit('Alterar Senha')
      setIsBtnSenha(false)
      // Alert.alert('Senha Alterada')
    } else {
      setBtnSenhaTit('Gravar Senha')
      setIsBtnSenha(true)
      // Alert.alert('Senha Gravada')
    }
  }

  function Loading() {
    return (
      <Lottie source={loading} autoPlay loop />
    )
  }

  return (
    <KeyboardAvoidingView behavior="padding" style={[GlobalStyles.container, {paddingTop: 25,}]}>
      <View style={styles.scene}>
        <LinearGradient
          colors={bg_colors}
          style={GlobalStyles.background}
          start={bg_start}
          end={bg_end}
        >
          { !isBtnSenha ?
          <Icon style={styles.logo} name="user-circle-o" size={120}/>
          : <></>}

          <View style={styles.container}>
            <View style={styles.row}>
              <View style={styles.vlegend}>
                <Text style={styles.legend}>Nome</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.vtext} >
                <Text style={styles.text}>{oficina.nome}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.vlegend}>
                <Text style={styles.legend}>Endereço</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.vtext} >
                <Text style={styles.text}>{`${oficina.endrua}, ${oficina.endnum}`}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={[styles.vlegend, {width: '70%',}]}>
                <Text style={styles.legend}>Bairro</Text>
              </View>
              <View style={[styles.vlegend, {width: '30%',}]}>
                <Text style={styles.legend}>UF</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={[styles.vtext, {width: '70%',}]} >
                <Text style={styles.text}>{oficina.bairro}</Text>
              </View>
              <View style={[styles.vtext, {width: '30%',}]} >
                <Text style={styles.text}>{oficina.uf}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.vlegend}>
                <Text style={styles.legend}>Fone</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.vtext} >
                <Text style={styles.text}>{oficina.fone}</Text>
              </View>
            </View>
            <View style={styles.form}>
              { 
                isBtnSenha 
              ?
                <View style={styles.senha}>
                  <Text style={styles.label}>Informe a Nova Senha</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Nova senha"
                    placeholderTextColor="#999"
                    autoCorrect={false}
                    secureTextEntry={true}
                    value={senha}
                    onChangeText={setSenha}
                  />

                  <Text style={styles.label}>Senha</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Confirme a senha"
                    placeholderTextColor="#999"
                    autoCorrect={false}
                    secureTextEntry={true}
                    value={senha1}
                    onChangeText={setSenha1}
                  />
                </View>
              : 
                <></>
              }
              <TouchableOpacity onPress={handleSenha} style={styles.button}>
                <Text style={styles.buttonText}>{btnSenhaTit}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleEncerra} style={styles.button}>
                <Text style={styles.buttonText}>Encerrar a sessão</Text>
              </TouchableOpacity>

            </View>


          </View>
        </LinearGradient>
      </View>
      {isLoading ? Loading() : <></>}
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  logo: {
    alignSelf: "center",
    marginTop: 60,
    color: "#007189",
  },

  scene: {
    flex: 1,
    marginTop: 10,
  },

  container: {
    flex: 1,
    marginTop: 30,
    paddingHorizontal: 20,
    width: width,
  },
  
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  vlegend: {
    marginTop: 10,
    width: width,
  },

  legend: {
    fontSize: 14,
    color: '#007189',
    textAlign: 'left',
    // height: 20,
  },

  vtext: {
    marginTop: 5,
    width: width,
  },

  text: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#F0E68C',
    textAlign: 'left',
    // width: '100%',
    // height: 20,
  },

  form: {
    alignSelf: 'stretch',
    paddingHorizontal: 30,
    marginTop: 30,
  },

  label: {
    fontWeight: 'bold',
    justifyContent: 'center',
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#444',
    height: 44,
    marginBottom: 20,
    borderRadius: 2,
    backgroundColor: '#fff'
  },

  button: {
    marginTop: 10,
    height: 42,
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

export default Usuario
