import React, { useState, useEffect } from 'react'

import {
  AsyncStorage,
  KeyboardAvoidingView, 
  Dimensions,
  StyleSheet,
  Text,
  TextInput, 
  ToastAndroid,
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
  const [email, setEmail] = useState('')
  const [oficina, setOficina] = useState(undefined)
  const [btnSenhaTit, setBtnSenhaTit] = useState('Cancelar')
  const [isBtnSenha, setIsBtnSenha] = useState(false)
  const [senha, setSenha] = useState('')
  const [senha1, setSenha1] = useState('')


  useEffect(() => {
    setIsLoading(true)

    AsyncStorage.getItem('email').then(Email => {
      if (email !== '') {
        setEmail(Email)
      }
    })
  }, [email])

  useEffect(() => {
    AsyncStorage.getItem('oficina').then(Oficina => {
      if (Oficina !== undefined) {
        const ofi = JSON.parse(Oficina)
        if (ofi.nome !== undefined) {
          setOficina(ofi[0])
          setOficina(JSON.parse(Oficina))
        }
        setIsLoading(false)
      } else {
        setIsLoading(false)
      }
    })
  }, [])

  useEffect(() => {
    if (!isBtnSenha) {
      setBtnSenhaTit('Alterar Senha')
    } else {
      if (senha !== '' || senha1 !== '') {
        setBtnSenhaTit('Gravar')
      } else {
        setBtnSenhaTit('Cancelar')
      }
    }  
  }, [senha, senha1])

  const handleEncerra = () => {
    try {
      callGraph()
      AsyncStorage.setItem('oficina', '')
      AsyncStorage.setItem('token', '')
      AsyncStorage.setItem('Autorizado', '')

      navigation.navigate('Login')
    }
    catch (error) {
    }
  }

  const callGraph = async () => {
    var token = oficina.idface

    const resp = await fetch(
      `https://graph.facebook.com/me?access_token=${token}&fields=id,name,email,about,picture`
    )
    const responseJSON = JSON.stringify(await resp.json())
    const face = JSON.parse(responseJSON)

    var lParams = `access_token=${token}`
    const response = await fetch(
      `https://graph.facebook.com/${face.id}/permissions`,{
      method : 'DELETE',
      body: lParams
    })
  }

  const handleSenha = async () => {
    if (isBtnSenha) {
      if (senha !== '' && senha1 !== '') {
        if (senha !== senha1) {
          ToastAndroid.showWithGravity(
            'As Senhas não são iguais',
            ToastAndroid.LONG,
            ToastAndroid.TOP
          )
          return
        }
      } else if (
        (senha !== '' && senha1 === '') ||
        (senha === '' && senha1 !== '')) {
        ToastAndroid.showWithGravity(
          'As Senhas não são iguais',
          ToastAndroid.LONG,
          ToastAndroid.TOP
        )
        return
      }
      setBtnSenhaTit('Alterar Senha')
      setIsBtnSenha(false)
    } else {
      setBtnSenhaTit('Cancelar')
      setIsBtnSenha(true)
    }
  }

  const Loading = () => {
    return (
      <Lottie source={loading} autoPlay loop />
    )
  }

  return (
    <KeyboardAvoidingView behavior="height" style={[GlobalStyles.container, {paddingTop: 25,}]}>
      <View style={styles.scene}>
        <LinearGradient
          colors={bg_colors}
          style={GlobalStyles.background}
          start={bg_start}
          end={bg_end}
        >
          <Icon style={styles.logo} name="user-circle-o" size={90}/>

          <View style={styles.container}>
            {oficina !== undefined && !isBtnSenha ?
            <>
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
              <View style={styles.row}>
                <View style={styles.vlegend}>
                  <Text style={styles.legend}>E-mail</Text>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.vtext} >
                  <Text style={styles.text}>{oficina.e_mail}</Text>
                </View>
              </View>
            </>
            : <></>}

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
    marginTop: 30,
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
    marginTop: 5,
    width: width,
  },

  legend: {
    fontSize: 14,
    color: '#007189',
    textAlign: 'left',
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
  },

  form: {
    alignSelf: 'stretch',
    paddingHorizontal: 30,
    marginTop: 20,
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
    backgroundColor: '#27a2b3',
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
