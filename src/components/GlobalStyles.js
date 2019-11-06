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

})
