import { StyleSheet, Platform, StatusBar } from 'react-native'
import {
  Dimensions,
} from 'react-native'

let width = Dimensions.get('window').width

export default StyleSheet.create({
  AndroidSafeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },

  container: {
    flex: 1,
  },

  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  boxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },

  box: {
    marginTop: 20,
    width: width / 3 - 20,
    height: 120,
    margin: 6,
    marginLeft: 12,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  boxIcone: {
    height: 80,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: 0,
  },

  boxText: {
    fontSize: 12,
    color: '#FFF',
    marginTop: 10,
  },

  boxSpace: {
    height: 50,
  },

  boxButton: {
    height: 80,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: 0,
    backgroundColor: '#007189',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },

  listaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#87CEEB',
    padding: 8,
    marginTop: 10,
  },

  lista: {
    height: 50,
    margin: 0,
    marginLeft: 0,
    justifyContent: 'flex-start',
  },

  lista1: {
    width: 90,
  },

  lista2: {
    width: 170,
  },

  lista3: {
    width: 70,
    alignItems: 'flex-end',
  },

  listaLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  }, 

  listaValor: {
    fontSize: 22,
    color: '#000080',
    fontWeight: 'bold',
    marginTop: 10,
  },

})
