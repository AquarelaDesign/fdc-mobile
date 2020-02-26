import React, { Fragment, useState, useEffect } from 'react'

import {
  AsyncStorage,
  Dimensions,
  Keyboard,
  SafeAreaView,
  ScrollView,
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
import Axios from 'axios'

// import { Formik } from 'formik'
// import FormTextInput from '../../components/FormTextInput'
// import FormButton from '../../components/FormButton'
// import FormPicker from '../../components/FormPicker'
import Icon from 'react-native-vector-icons/FontAwesome'

import { TextInputMask } from 'react-native-masked-text'
import { Button } from 'react-native-elements'
import RNPickerSelect, { defaultStyles } from 'react-native-picker-select'


const querystring = require('querystring')
const { width } = Dimensions.get('window')

const Estados = [
  { label: 'AC', value: 'AC' },
  { label: 'AL', value: 'AL' },
  { label: 'AM', value: 'AM' },
  { label: 'AP', value: 'AP' },
  { label: 'BA', value: 'BA' },
  { label: 'CE', value: 'CE' },
  { label: 'DF', value: 'DF' },
  { label: 'ES', value: 'ES' },
  { label: 'GO', value: 'GO' },
  { label: 'MA', value: 'MA' },
  { label: 'MG', value: 'MG' },
  { label: 'MS', value: 'MS' },
  { label: 'MT', value: 'MT' },
  { label: 'PA', value: 'PA' },
  { label: 'PB', value: 'PB' },
  { label: 'PE', value: 'PE' },
  { label: 'PI', value: 'PI' },
  { label: 'PR', value: 'PR' },
  { label: 'RJ', value: 'RJ' },
  { label: 'RN', value: 'RN' },
  { label: 'RO', value: 'RO' },
  { label: 'RR', value: 'RR' },
  { label: 'RS', value: 'RS' },
  { label: 'SC', value: 'SC' },
  { label: 'SE', value: 'SE' },
  { label: 'SP', value: 'SP' },
  { label: 'TO', value: 'TO' },
]

const NovoUsuario = ({ e_mail, buscaHistorico }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState(e_mail)
  const [dadosCep, setDadosCep] = useState({})
  const [endrua, setEndRua] = useState('')
  const [mudouCEP, setMudouCEP] = useState(false)
  const [uf, setUF] = useState('PR')

  const [values, setValues] = useState({ 
    e_mail: '', 
    nome: '', 
    fone: '', 
    cep: '',
    endrua: endrua,
    endnum: '',
    endcom: '',
    bairro: '',
    cidade: 'Curitiba',
    uf: uf,
  })

  useEffect(() => {
    AsyncStorage.getItem('email').then(Email => {
      setEmail(Email)
    })
  }, [email])

  const buscaCEP = async (pCEP) => {
    setIsLoading(true)

    if (pCEP !== '') {
      const url = `http://wservice.procyon.com.br:3003/api/cep/${pCEP}`
      
      const buscaDadosCEP = async () => {
        try {
          await Axios.get(
            url
          ).then(response => {
            // console.log('response', response)
            if (response.status === 200) {
              const { data, error, message } = response.data
              if (error === true) {
                ToastAndroid.showWithGravity(
                  message,
                  ToastAndroid.SHORT,
                  ToastAndroid.TOP
                )
                setIsLoading(false)
                return false
              } else {
                // console.log('data', data[0].data[0])
                setDadosCep(data[0].data[0])
                setIsLoading(false)
                return true
              }
            } else {
              setIsLoading(false)
              return false
            }
          })
        } catch (error) {
          
          const { response } = error
          if (response !== undefined) {
            console.log('err1', response.data.errors[0])
            setIsLoading(false)
            return false
          } else {
            console.log('err2', error)
            setIsLoading(false)
            return false
          }
        }
        
      }
      let dados =  buscaDadosCEP()
      console.log('dados', dados)
      return dados
    } else {
      setIsLoading(false)
      return false
    }

  }

  const updateField = e => {
    console.log('e', e)
    // setValues({
    //   ...values,
    //   [e.target.name]: e.target.value
    // })
  }

  const handleSubmit = (values) => {
    
    if (values.e_mail.length > 0
        ) {
      setIsLoading(true)
      Keyboard.dismiss()
      
      if (values.e_mail !== '') {
        // dadosCep
        const dados = {
          "ttfcusuc":[{
             "e_mail":values.e_mail,
             "nome": values.nome,
             "fone": values.fone,
             "cep": values.cep,
             "endrua": values.endrua, // dadosCep.Logradouro
             "endnum": values.endnum,
             "endcom": values.endcom,
             "bairro": values.bairro, // dadosCep.Bairro
             "cidade": values.cidade, // dadosCep.Cidade
             "uf": values.uf, // dadosCep.UF
             "codcid": dadosCep ? dadosCep.cidade.cod_ibge : '',
             "codciddes": values.cidade, // dadosCep.Cidade
             "latit": dadosCep ? dadosCep.geo.latitude : '',
             "longit": dadosCep ? dadosCep.geo.longitude : '',
             "pais": 'Brasil',
          }]
        }
               
        console.log('handleSubmit_values', dados)
        setIsLoading(false)

        const enviaDados = async (jsonusu) => {
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
                    // buscaHistorico(ttfckmv)
                  }
                  setIsLoading(false)
                } else {
                  setIsLoading(false)
                }
              } else {
                setIsLoading(false)
              }
            }
            )
          } catch (error) {
            const { response } = error
            if (response !== undefined) {
              setIsLoading(false)
            } else {
              setIsLoading(false)
            }
          }
        }
        // enviaDados(values)
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

        <ScrollView style={styles.fragment}>

          <View style={styles.row}>
            <View style={[styles.vlegend, {width: '100%',}]}>
              <Text style={styles.legend}>Email*</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={[styles.vlegend, {width: '100%'}]}>
              <TextInputMask
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
                onChangeText={updateField('e_mail')}
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
              <TextInputMask
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
                autoCapitalize="characters"
                onChangeText={updateField}
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
              <TextInputMask
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
                onChangeText={updateField}
              />
            </View>
          </View> 

          <View style={styles.row}>
            <View style={[styles.vlegend, {width: '70%',}]}>
              <Text style={styles.legend}>CEP</Text>
            </View>
            <View style={[styles.vlegend, {width: '30%',}]}>
              <Text style={styles.legend}>UF</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={[styles.vlegend, {width: '70%'}]}>
              <TextInputMask
                type={'zip-code'}
                name='cep'
                value={values.cep}
                style={styles.input}
                keyboardType="number-pad"
                autoCompleteType="postal-code"
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={updateField}
                onSubmitEditing={() => {
                  let vCEP = values.cep
                  if (buscaCEP(vCEP.replace('-',''))) {
                    setFieldValue('endrua', dadosCep.Logradouro)
                  }
                }}
              />
            </View>
            <View style={[styles.vlegend, {width: '30%', marginTop: 0}]}>
              <RNPickerSelect
                placeholder={{}}
                items={Estados}
                onValueChange={value => {setUF(value)}}
                InputAccessoryView={() => null}
                style={pickerSelectStyles}
                value={uf}
                onChangeText={updateField}
                useNativeAndroidPickerStyle={false}
              />
            </View>
          </View> 

          <View style={styles.row}>
            <View style={[styles.vlegend, {width: '100%',}]}>
              <Text style={styles.legend}>Endereço</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={[styles.vlegend, {width: '100%'}]}>
              <TextInputMask
                type={'custom'}
                options={{
                  mask: '**********************************************************************'
                }}
                name='endrua'
                value={values.endrua}
                style={styles.input}
                keyboardType="default"
                autoCompleteType="street-address"
                autoCorrect={false}
                autoCapitalize="characters"
                onChangeText={updateField}
              />
            </View>
          </View> 

          <View style={styles.row}>
            <View style={[styles.vlegend, {width: '30%',}]}>
              <Text style={styles.legend}>Número</Text>
            </View>
            <View style={[styles.vlegend, {width: '70%',}]}>
              <Text style={styles.legend}>Complemento</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={[styles.vlegend, {width: '30%'}]}>
              <TextInputMask
                type={'custom'}
                options={{
                  mask: '**********'
                }}
                name='endnum'
                value={values.endnum}
                style={styles.input}
                keyboardType="default"
                autoCompleteType="off"
                autoCorrect={false}
                autoCapitalize="characters"
                onChangeText={updateField}
              />
            </View>
            <View style={[styles.vlegend, {width: '70%'}]}>
              <TextInputMask
                type={'custom'}
                options={{
                  mask: '**********************************************************************'
                }}
                name='endcom'
                value={values.endnum}
                style={styles.input}
                keyboardType="default"
                autoCompleteType="off"
                autoCorrect={false}
                autoCapitalize="characters"
                onChangeText={updateField}
              />
            </View>
          </View> 

          <View style={styles.row}>
            <View style={[styles.vlegend, {width: '50%',}]}>
              <Text style={styles.legend}>Bairro</Text>
            </View>
            <View style={[styles.vlegend, {width: '50%',}]}>
              <Text style={styles.legend}>Cidade</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={[styles.vlegend, {width: '50%'}]}>
              <TextInputMask
                type={'custom'}
                options={{
                  mask: '**********************************************************************'
                }}
                name='bairro'
                value={values.bairro}
                style={styles.input}
                keyboardType="default"
                autoCompleteType="off"
                autoCorrect={false}
                autoCapitalize="characters"
                onChangeText={updateField}
              />
            </View>
            <View style={[styles.vlegend, {width: '50%'}]}>
              <TextInputMask
                type={'custom'}
                options={{
                  mask: '**********************************************************************'
                }}
                name='cidade'
                value={values.cidade}
                style={styles.input}
                keyboardType="default"
                autoCompleteType="off"
                autoCorrect={false}
                autoCapitalize="characters"
                onChangeText={updateField}
              />
            </View>
          </View> 

          <Button
            style={styles.button}
            type="outline"
            onPress={handleSubmit}
            title="Gravar"
            buttonStyle={styles.button}
            titleStyle={styles.buttonText}
          />

          </ScrollView>

        {isLoading ? Loading() : <></>}
      </LinearGradient>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({

  scene: {
    flex: 1,
  },

  fragment: {
    marginTop: 10,
    marginBottom: 70,
    marginRight: 10,
    borderTopWidth: 0,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    // paddingHorizontal: 5,
    // marginRight: 50,
  },

  vlegend: {
    marginTop: 0,
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

  button: {
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

  inputContainer: {
    margin: 5
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

})

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 14,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    color: '#444',
    paddingRight: 30, // to ensure the text is never behind the icon
    backgroundColor: '#FFF',
    width: 87,
  },
  inputAndroid: {
    fontSize: 14,
    paddingHorizontal: 5,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 3,
    color: '#444',
    paddingRight: 30, // to ensure the text is never behind the icon
    backgroundColor: '#FFF',
    width: 87,
    marginTop: 4,
  },
})

export default NovoUsuario
