import React, { useState, useEffect } from 'react'

import {
  AsyncStorage,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
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

const NovoUsuario = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [dadosCep, setDadosCep] = useState({})
  const [mudouCEP, setMudouCEP] = useState(false)
  const [uf, setUF] = useState('PR')
  const [senha, setSenha] = useState('')
  const [senha1, setSenha1] = useState('')
  const [habilitaBotao, setHabilitaBotao] = useState(false)

  useEffect(() => {
    const tmp = navigation.getParam('email')
    setEmail(tmp)

    setValues({
      ...values,
      e_mail: tmp,
    })
  }, [])

  const [values, setValues] = useState({ 
    e_mail: '', 
    nome: '', 
    fone: '', 
    cep: '',
    endrua: '',
    endnum: '',
    endcom: '',
    bairro: '',
    cidade: 'Curitiba',
    uf: uf,
  })

  const [mostraErro, setMostraErro] = useState({
    e_mail: false, 
    senha: false, 
    senha1: false,
  })

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
                setMudouCEP(true)
                setIsLoading(false)
              } else {
                const dataDados = data[0].data[0]
                console.log('dataDados', dataDados)
                setDadosCep(dataDados)
                
                setValues({
                  ...values,
                  endrua: dataDados.Logradouro,
                  bairro: dataDados.Bairro,
                  cidade: dataDados.Cidade,
                  uf: dataDados.UF
                })

                setMudouCEP(false)
                setIsLoading(false)
              }
            } else {
              setIsLoading(false)
            }
          })
        } catch (error) {
          
          const { response } = error
          if (response !== undefined) {
            console.log('err1', response.data.errors[0])
            setIsLoading(false)
          } else {
            console.log('err2', error)
            setIsLoading(false)
          }
        }
        
      }
      buscaDadosCEP()
    } else {
      setIsLoading(false)
    }

  }

  const updateField = async (field, text) => {
    setValues({
      ...values,
      [field]: text
    })
  }

  const validate = (field) => {
    setIsLoading(false)
    
    if (field === 'e_mail') {
      if (values.e_mail.length === 0) {
        ToastAndroid.showWithGravity(
          'O Email deve ser informado',
          ToastAndroid.SHORT,
          ToastAndroid.TOP
        )
        setMostraErro({...mostraErro, e_mail: true})
      } else {
        setMostraErro({...mostraErro, e_mail: false})
      }
    }

    if (field === 'senha') {
      if (senha === '') {
        ToastAndroid.showWithGravity(
          'A Senha deve ser informada',
          ToastAndroid.SHORT,
          ToastAndroid.TOP
        )
        setMostraErro({...mostraErro, senha: true})
      } else if (
        (senha !== '' && senha1 === '') ||
        (senha === '' && senha1 !== '') ||
        (senha !== senha1)) {
          ToastAndroid.showWithGravity(
            'As Senhas não são iguais',
            ToastAndroid.SHORT,
            ToastAndroid.TOP
          )
          setMostraErro({...mostraErro, senha: true, senha1: true})
      } else {
        setMostraErro({...mostraErro, senha: false, senha1: false})
      }
    }

    if (field === 'senha1') {
      if (senha1 === '') {
        ToastAndroid.showWithGravity(
          'A Senha deve ser confirmada',
          ToastAndroid.SHORT,
          ToastAndroid.TOP
        )
        setMostraErro({...mostraErro, senha1: true})
      } else if (
        (senha !== '' && senha1 === '') ||
        (senha === '' && senha1 !== '') ||
        (senha !== senha1)) {
          ToastAndroid.showWithGravity(
            'As Senhas não são iguais',
            ToastAndroid.SHORT,
            ToastAndroid.TOP
          )
          setMostraErro({...mostraErro, senha: true, senha1: true})
      } else {
        setMostraErro({...mostraErro, senha: false, senha1: false})
        setHabilitaBotao(true)
      }
    }

  }

  const handleSubmit = () => {
    
    if (values.e_mail.length > 0
        ) {
      setIsLoading(true)
      Keyboard.dismiss()

      validate('e_mail')
      validate('senha')
      validate('senha1')
      
      if (values.e_mail !== '') {
        
        console.log('dadosCep', dadosCep)
        
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
             "codcid": dadosCep ? dadosCep.cidade[0].cod_ibge : '',
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
              pmetodo: 'GravaUsuario',
              pcodprg: '',
              pemail: email,
              psenha: senha,
              ptipusu: 'COF',
              pjsonusu: JSON.stringify(jsonusu),
            })).then(response => {
              console.log('enviaDados_response', response)
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
                    ToastAndroid.showWithGravity(
                      'Verifique sua caixa de entrada para confirmar o cadastro',
                      ToastAndroid.SHORT,
                      ToastAndroid.CENTER
                    )
                    navigation.goBack()
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
        enviaDados(dados)
      }
    }
  }

  const Loading = () => {
    return (
      <Lottie source={loading} autoPlay loop />
    )
  }

  return (
    <KeyboardAvoidingView behavior="padding" style={[GlobalStyles.container, {paddingTop: 40,}]}>
    {/* <SafeAreaView style={[GlobalStyles.container, {paddingTop: 40,}]}> */}
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
                style={[styles.input, Object.assign({}, styles.input, { 
                  borderColor: mostraErro.e_mail ? '#FF0000' : '#444',
                  borderWidth: mostraErro.e_mail ? 2 : 1,
                })]}
                keyboardType="email-address"
                autoCompleteType="email"
                autoCorrect={false}
                autoCapitalize="none"
                onBlur={() => {
                  validate('e_mail', values.e_mail)
                }}
                onChangeText={text => {
                  updateField('e_mail', text)
                }}
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
                onChangeText={text => {
                  updateField('nome', text)
                }}
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
                onChangeText={text => {
                  updateField('fone', text)
                }}
              />
            </View>
          </View> 

          <View style={styles.row}>
            <View style={[styles.vlegend, {width: '70%',}]}>
              <Text style={styles.legend}>CEP</Text>
            </View>
            <View style={[styles.vlegend, {width: '30%', marginLeft: -15,}]}>
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
                onChangeText={text => {
                  updateField('cep', text)
                }}
                onSubmitEditing={() => {
                  let vCEP = values.cep
                  buscaCEP(vCEP.replace('-',''))
                }}
              />
            </View>
            <View style={[styles.vlegend, {width: '30%', marginTop: -5}]}>
              <RNPickerSelect
                placeholder={{}}
                items={Estados}
                onValueChange={value => {setUF(value)}}
                InputAccessoryView={() => null}
                style={pickerSelectStyles}
                value={uf}
                disabled = {mudouCEP}
                onChangeText={text => {
                  updateField('uf', text)
                }}
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
                editable = {mudouCEP}
                onChangeText={text => {
                  updateField('endrua', text)
                }}
              />
            </View>
          </View> 

          <View style={styles.row}>
            <View style={[styles.vlegend, {width: '40%',}]}>
              <Text style={styles.legend}>Número</Text>
            </View>
            <View style={[styles.vlegend, {width: '60%',}]}>
              <Text style={styles.legend}>Complemento</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={[styles.vlegend, {width: '40%'}]}>
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
                onChangeText={text => {
                  updateField('endnum', text)
                }}
              />
            </View>
            <View style={[styles.vlegend, {width: '60%'}]}>
              <TextInputMask
                type={'custom'}
                options={{
                  mask: '**********************************************************************'
                }}
                name='endcom'
                value={values.endcom}
                style={styles.input}
                keyboardType="default"
                autoCompleteType="off"
                autoCorrect={false}
                autoCapitalize="characters"
                onChangeText={text => {
                  updateField('endcom', text)
                }}
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
                editable = {mudouCEP}
                onChangeText={text => {
                  updateField('bairro', text)
                }}
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
                editable = {mudouCEP}
                onChangeText={text => {
                  updateField('cidade', text)
                }}
              />
            </View>
          </View> 

          <View style={styles.row}>
            <View style={[styles.vlegend, {width: '100%',}]}>
              <Text style={styles.legend}>Senha</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={[styles.vlegend, {width: '100%'}]}>
              <TextInputMask
                type={'custom'}
                options={{
                  mask: '****************'
                }}
                name='senha'
                value={senha}
                style={[styles.input, Object.assign({}, styles.input, { 
                  borderColor: mostraErro.senha ? '#FF0000' : '#444',
                  borderWidth: mostraErro.senha ? 2 : 1,
                })]}
                keyboardType="default"
                secureTextEntry={true}
                autoCompleteType="off"
                autoCorrect={false}
                autoCapitalize="none"
                onBlur={() => {validate('senha', senha)}}
                onChangeText={text => {
                  setSenha(text)
                }}
              />
            </View>
          </View> 

          <View style={styles.row}>
            <View style={[styles.vlegend, {width: '100%',}]}>
              <Text style={styles.legend}>Confirme a senha</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={[styles.vlegend, {width: '100%'}]}>
              <TextInputMask
                type={'custom'}
                options={{
                  mask: '****************'
                }}
                name='senha1'
                value={senha1}
                style={[styles.input, Object.assign({}, styles.input, { 
                  borderColor: mostraErro.senha1 ? '#FF0000' : '#444',
                  borderWidth: mostraErro.senha1 ? 2 : 1,
                })]}
                keyboardType="default"
                secureTextEntry={true}
                autoCompleteType="off"
                autoCorrect={false}
                autoCapitalize="none"
                onBlur={() => {validate('senha1', senha1)}}
                onChangeText={text => {
                  setSenha1(text)
                }}
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
            disabled={!habilitaBotao}
          />

          </ScrollView>

        {isLoading ? Loading() : <></>}
      </LinearGradient>
    </KeyboardAvoidingView>
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
    marginBottom: 70,
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
    borderRadius: 2,
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
    borderRadius: 1,
    color: '#444',
    paddingRight: 30, // to ensure the text is never behind the icon
    backgroundColor: '#FFF',
    width: 87,
    marginTop: 4,
  },
})

export default NovoUsuario
