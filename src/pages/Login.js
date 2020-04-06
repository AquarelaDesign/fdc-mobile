import React, { useState, useEffect } from 'react'

import { 
  Alert, 
  AsyncStorage, 
  Dimensions,
  Image, 
  ImageBackground,
  KeyboardAvoidingView, 
  StyleSheet, 
  Text, 
  TextInput, 
  ToastAndroid,
  TouchableOpacity, 
  View, 
} from 'react-native'

import { Button, Overlay, Divider } from 'react-native-elements'

import Icon from 'react-native-vector-icons/FontAwesome'
import * as Facebook from 'expo-facebook'

import { Notifications } from 'expo'
import * as Permissions from 'expo-permissions'

import { modalStyle } from '../GlobalStyles'
// import Alerta from '../components/Alerta'
// import api from '../services/api'
import Api from '../services/oapi'

import logo from '../assets/logo.png'
import bg from '../assets/splash.png'

const { width } = Dimensions.get('window')

const querystring = require('querystring')
// No Motorola G7 Plus foi necessário habilitar (Android 9)
// enabled={Platform.OS === 'ios'} 

export default function Login({ navigation }) {
  const [email, setEmail] = useState('')
  const [oficina, setOficina] = useState({})
  const [password, setPassword] = useState('')
  const [Response, setResponse] = useState(null)
  const [token, setToken] = useState('')
  const [tkpush, setTkpush] = useState('')
  const [modView, setModView] = useState(false)
  const [codseg, setCodseg] = useState('')
  const [icodseg, setIcodseg] = useState('')
  const [notification, setNotification] = useState('')

  useEffect(() => {
    if (email === '') {
      AsyncStorage.getItem('email').then(Email => {
        if (email !== Email && email !== '') {
          setEmail(Email)
        }
      })
    }
  }, [email])

  useEffect(() => {
    AsyncStorage.getItem('Autorizado').then(auth => {
      if (auth !== null) {
         navigation.navigate('Home')
      }
      /*
      async function validateToken() {
        const response = await api.post('/oapi/validateToken', {
          "email": email,
          "token": token
        })

        if (response.data.valid) {
          navigation.navigate('Home')
        }
      }
      validateToken()
      */
    })
  }, [])

  const salvaToken = (token, tipo) => {
    if (email !== '' && token !== '') {
      async function GravaToken() {
        try {
          await Api.post('', querystring.stringify({
            pservico: 'wfcusu',
            pmetodo: 'GravaToken',
            pcodprg: '',
            pemail: email,
            pemailcli: email,
            ptiptkn: tipo,
            ptoken: token,
          })).then(response => {
            if (response.status === 200) {
              if (response.data.ProDataSet !== undefined) {
                const { ttfcusu } = response.data.ProDataSet
                AsyncStorage.setItem('oficina', JSON.stringify(ttfcusu[0]))
                if (ttfcusu.situsu === 'P') {
                  setCodseg(ttfcusu.codseg)
                  setModView(true)
                }
                setOficina(ttfcusu)
              } 
            } else {
              ToastAndroid.showWithGravity(
                `Falha ao atualiar [${tipo}]`,
                ToastAndroid.LONG,
                ToastAndroid.TOP
              )
            }
          })
        } catch (error) {
          const { response } = error
          ToastAndroid.showWithGravity(
            'Falha na comunicação [GT]',
            ToastAndroid.LONG,
            ToastAndroid.TOP
          )
    }
      }
      GravaToken()
    }
  }

  const callGraph = async token => {
    /// Look at the fields... I don't have an `about` on my profile but everything else should get returned.
    const response = await fetch(
      `https://graph.facebook.com/me?access_token=${token}&fields=id,name,email,about,picture`
    )

    const responseJSON = JSON.stringify(await response.json())
    setResponse(responseJSON)
    const face = JSON.parse(responseJSON)
    // console.log(face.email)
    
    // if (face.email === 'aquarela.design@gmail.com') {
    //   setEmail('sandro.luizdepaula@gmail.com')
    // } else {
      setEmail(face.email)
    // }
    // navigation.navigate('Home')
    handleSubmit()
  }

  const _handleNotification = Notification => {
    setNotification(Notification)
  }

  const handleSubmitFb = async () => {
    try {
      await Facebook.initializeAsync('3265336060162401')
      const {
        type,
        token,
        expires,
        permissions,
        declinedPermissions,
      } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile', 'email'],
      })

      if (type === 'success') {
        callGraph(token)
        salvaToken(token, 'facebook')
      } else {
        ToastAndroid.showWithGravity(
          `Falha na comunicação [${type}]`,
          ToastAndroid.LONG,
          ToastAndroid.TOP
        )
      }
    } catch ({ message }) {
      console.log('message', message)
      ToastAndroid.showWithGravity(
        `Facebook Login Error: ${message}`,
        ToastAndroid.LONG,
        ToastAndroid.TOP
      )
    }
  
  }

  const handleNovo = async () => {
    navigation.navigate('NovoUsuario', {email: email})
  }

  const handleRecuperar = async () => {

  }

  const validaCodseg = async () => {
    if (icodseg === codseg) {
      try {
        await Api.post('', querystring.stringify({
          pservico: 'wfcusu',
          pmetodo: 'ValidaCodseg',
          pcodprg: '',
          pemail: email,
          pcodseg: icodseg,
        })).then(response => {
          if (response.status === 200) {
            if (response.data.ProDataSet !== undefined) {
              const { ttfcusu, ttretorno } = response.data.ProDataSet

              ToastAndroid.showWithGravity(
                ttretorno[0].mensagem,
                ToastAndroid.LONG,
                ToastAndroid.TOP
              )
              
              if (ttretorno[0].tipret === '') {
                AsyncStorage.setItem('Autorizado', 'S')
                setModView(false)
                navigation.navigate('Home')
              }

            } 
          } else {
            ToastAndroid.showWithGravity(
              response.status,
              ToastAndroid.LONG,
              ToastAndroid.TOP
            )
          }
        })

      }
      catch (error) {
        const { response } = error
        if (response !== undefined) {
          Alert.alert(response.data.errors[0])
        } else {
          ToastAndroid.showWithGravity(
            'Falha ao conectar com o servidor, por favor tente mais tarde.',
            ToastAndroid.LONG,
            ToastAndroid.TOP
          )
        }
      }
    } else {
      ToastAndroid.showWithGravity(
        'Código Inválido!!!',
        ToastAndroid.LONG,
        ToastAndroid.TOP
      )
}
  }

  const handleSubmit = async () => {
    if (email !== '') {
      try {
        await AsyncStorage.setItem('email', email)
        if (email !== 'demo@demo.com') {

          await Api.post('', querystring.stringify({
            pservico: 'wfcusu',
            pmetodo: 'Autentica',
            pcodprg: '',
            pemail: email,
            psenha: password,
          })).then(response => {
            if (response.status === 200) {
              if (response.data.ProDataSet !== undefined) {
                const { ttfcusu, ttretorno } = response.data.ProDataSet
                
                setOficina(ttfcusu[0])
                registerForPushNotifications(email)
                
                AsyncStorage.setItem('oficina', JSON.stringify(ttfcusu[0]))
                AsyncStorage.setItem('token', token)
                
                if (ttretorno[0].tipret !== '') {
                  ToastAndroid.showWithGravity(
                    ttretorno[0].mensagem,
                    ToastAndroid.LONG,
                    ToastAndroid.TOP
                  )
                }
                
                if (ttfcusu[0].situsu === 'P') {
                  setCodseg(ttfcusu[0].codseg)
                  setModView(true)
                } else {
                  AsyncStorage.setItem('Autorizado', 'S')
                  navigation.navigate('Home')
                }
                
              } 
            } else {
              ToastAndroid.showWithGravity(
                response.status,
                ToastAndroid.LONG,
                ToastAndroid.TOP
              )
            }
          })
          /*
          const response = await api.post('/oapi/login', {
            "email": email,
            "senha": password
          })
          
          await AsyncStorage.setItem('email', email)
          registerForPushNotifications(email)

          if (response.status === 200) {
            const { oficina, token } = response.data
            console.log('oficina', oficina)
            await AsyncStorage.setItem('oficina', JSON.stringify(oficina))
            await AsyncStorage.setItem('token', token)

            if (oficina.situsu === 'P') {
              setCodseg(oficina.codseg)
              setModView(true)
            }
          }
          */
        } else {
          await AsyncStorage.setItem('email', email)
          await AsyncStorage.setItem('oficina', { e_mail: email })
          await AsyncStorage.setItem('token', '')
          await AsyncStorage.setItem('Autorizado', '')
        }
      }
      catch (error) {
        const { response } = error
        if (response !== undefined) {
          ToastAndroid.showWithGravity(
            response.data.errors[0],
            ToastAndroid.LONG,
            ToastAndroid.TOP
          )
        } else {
          ToastAndroid.showWithGravity(
            'Falha ao conectar com o servidor, por favor tente mais tarde.',
            ToastAndroid.LONG,
            ToastAndroid.TOP
          )
        }
      }
    } else {
      ToastAndroid.showWithGravity(
        'E-mail deve ser informado!',
        ToastAndroid.LONG,
        ToastAndroid.TOP
      )
    }
  }

  async function registerForPushNotifications(Email) {
    const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS)
    // console.log('status', status)
    if (status !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
      if (status !== 'granted') {
        return
      }
    }
    const token = await Notifications.getExpoPushTokenAsync()
    const subscription = Notifications.addListener(_handleNotification)
    // console.log('token', token, oficina.tokpsh)
    setToken(token)
    // salvar token na base do FDC
    if (oficina.tokpsh !== token && email !== '') {
      salvaToken(token, 'push')
    }
  }

  return (
    <KeyboardAvoidingView behavior="height" style={[styles.container, {paddingTop: 75,}]}>
      <Overlay
        isVisible={modView}
        supportedOrientations={['portrait', 'landscape']}
        windowBackgroundColor="rgba(0, 0, 0, .7)"
        overlayBackgroundColor="transparent"
        width="80%"
        height={240}
        overlayStyle={{
          backgroundColor: 'white',
          borderRadius: 15,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.8,
          shadowRadius: 5,
        }}
        onBackdropPress={() => {
          setModView(false)
        }}>

        <View style={modalStyle.modalContainer}>
          <View style={modalStyle.innerContainer}>
            
            <View style={modalStyle.form}>
              <Text style={modalStyle.label}>Código de Segurança</Text>

              <TextInput
                style={styles.input}
                placeholder="Digite o Código"
                placeholderTextColor="#999"
                keyboardType="default"
                autoCapitalize="none"
                autoCorrect={false}
                value={icodseg}
                onChangeText={setIcodseg}
              />

              <Button
                style={{
                  marginBottom: 20
                }}
                onPress={() => {validaCodseg()}}
                title="Validar"
              >
              </Button>

            </View>
          </View>
        </View>
      </Overlay>

      <ImageBackground
        style={styles.background}
        source={bg}
      >
        <View style={{height: 65}}></View>
        <Image source={logo} />

        <View style={styles.form}>
          <Text style={styles.label}>Endereço e-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="Seu endereço de e-mail"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Sua senha"
            placeholderTextColor="#999"
            autoCorrect={false}
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity onPress={handleSubmit} style={styles.button}>
            <Text style={styles.buttonText}>Iniciar sessão</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSubmitFb} style={[styles.button, styles.buttonFb]}>
            <Icon name="facebook-square" size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}> facebook</Text>
          </TouchableOpacity>

        </View>

        <View style={styles.row}>
          <View style={{width: '50%'}}>
            <Button
              title="Novo Usuário?"
              type="clear"
              style={styles.buttonClear}
              onPress={handleNovo}
              titleStyle={styles.buttonTextClear}
              icon={{
                name: "person-add",
                size: 20,
                color: "#363636"
              }}
            />
          </View>
          <View style={{width: '50%'}}>
            <Button
              title="Esqueceu a senha?"
              type="clear"
              style={styles.buttonClear}
              onPress={handleRecuperar}
              titleStyle={styles.buttonTextClear}
              icon={{
                name: "mail",
                size: 20,
                color: "#363636"
              }}
            />
          </View>
        </View>

      </ImageBackground>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: -50,
  },

  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -50,
  },

  form: {
    alignSelf: 'stretch',
    paddingHorizontal: 20,
    marginTop: 10,
  },

  label: {
    color: '#363636',
    fontWeight: 'bold',
    justifyContent: 'center',
    marginBottom: 4,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#444',
    backgroundColor: '#E6E6FA',
    height: 44,
    marginBottom: 20,
    borderRadius: 2,
  },

  buttonFb: {
    marginTop: 10,
    backgroundColor: '#3B5998',
    marginBottom: 10,
  },

  button: {
    flexDirection: 'row',
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

  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    // paddingHorizontal: 5,
    marginLeft: 0,
    marginRight: 10,
  },

  buttonClear: {
    height: 35,
    width: 140,
    backgroundColor: '#4169E1',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderColor: '#87CEFA',
    marginLeft: (width / 2) - 70,
    marginBottom: 20,
  },

  buttonTextClear: {
    color: '#363636',
    // fontWeight: 'bold',
    fontSize: 12,
  },

})