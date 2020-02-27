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
  TouchableOpacity, 
  View, 
} from 'react-native'

import { Button } from 'react-native-elements'

import Icon from 'react-native-vector-icons/FontAwesome'
import * as Facebook from 'expo-facebook'

//import Alerta from '../components/Alerta'
import api from '../services/api'

import logo from '../assets/logo.png'
import bg from '../assets/splash.png'

const { width } = Dimensions.get('window')

// No Motorola G7 Plus foi necessário habilitar (Android 9)
// enabled={Platform.OS === 'ios'} 

export default function Login({ navigation }) {
  const [email, setEmail] = useState('')
  const [oficina, setOficina] = useState({})
  const [password, setPassword] = useState('')
  const [Response, setResponse] = useState(null)

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
    AsyncStorage.getItem('token').then(token => {
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
    })
  }, [])

  const salvaToken = (token) => {
    if (email !== '' && token !== '') {
      async function GravaToken() {
        try {
          await Api.post('', querystring.stringify({
            pservico: 'wfcusu',
            pmetodo: 'GravaToken',
            pcodprg: '',
            pemail: email,
            pemailcli: email,
            ptiptkn: 'facebook',
            ptoken: token,
          })).then(response => {
            if (response.status === 200) {
              if (response.data.ProDataSet !== undefined) {
                console.log('response.data.ProDataSet', response.data.ProDataSet)
                const { ttfcusu } = response.data.ProDataSet
                AsyncStorage.setItem('oficina', JSON.stringify(ttfcusu))
                setOficina(ttfcusu)
              } 
            } else {
              console.log('response.status', response.status)
            }
          })
        } catch (error) {
          const { response } = error
          console.log('error', response)
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
    navigation.navigate('Home')
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
        // console.log('token', token)
        salvaToken(token)
      } else {
        console.log('type', type)
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
      console.log(`Facebook Login Error: ${message}`)
    }
  
  }

  const handleNovo = async () => {
    navigation.navigate('NovoUsuario', {email: email})
  }

  const handleRecuperar = async () => {

  }

  const handleSubmit = async () => {
    if (email !== '') {
      try {
        if (email !== 'demo@demo.com') {
          const response = await api.post('/oapi/login', {
            "email": email,
            "senha": password
          })

          const { oficina, token } = response.data
          await AsyncStorage.setItem('email', email)
          await AsyncStorage.setItem('oficina', JSON.stringify(oficina))
          await AsyncStorage.setItem('token', token)
        } else {
          await AsyncStorage.setItem('email', email)
          await AsyncStorage.setItem('oficina', { e_mail: email })
          await AsyncStorage.setItem('token', '')
        }
        navigation.navigate('Home')
      }
      catch (error) {
        const { response } = error
        if (response !== undefined) {
          Alert.alert(response.data.errors[0])
        } else {
          Alert.alert('Falha ao conectar com o servidor, por favor tente mais tarde.')
        }
      }
    } else {
      Alert.alert('E-mail deve ser informado!')
    }
  }

  return (
    <KeyboardAvoidingView behavior="padding" style={[styles.container, {paddingTop: 75,}]}>
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