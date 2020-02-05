import React, { Component } from 'react'
import { 
  Dimensions, 
  View, 
  TouchableOpacity, 
  Text, 
  StyleSheet 
} from "react-native"

import { Colors } from './Colors'
import Icon from "react-native-vector-icons/MaterialIcons"

const { width } = Dimensions.get('window')

export default class Accordian extends Component {

  constructor(props) {
    super(props)
    this.state = {
      data: props.data,
      expanded: false,
    }
  }

  render() {

    return (
      <View style={styles.accordian}>
        <TouchableOpacity 
          style={
            !this.state.expanded ? 
            styles.row :
            styles.rowOpen
          } 
          onPress={() => this.toggleExpand()}>
          <Text style={[styles.title, styles.font]}>{this.props.title}</Text>
          {/*           
          <Icon name={
            this.state.expanded ? 
            'keyboard-arrow-up' : 
            'keyboard-arrow-down'
            } size={30} color={Colors.DARKGRAY}
          /> 
          */}
        </TouchableOpacity>
        <View style={styles.parentHr} />
        {
          this.state.expanded &&
          <View style={styles.child}>
            <Text>{this.props.data}</Text>
          </View>
        }
      </View>
    )
  }

  toggleExpand = () => {
    this.setState({ expanded: !this.state.expanded })
  }

}

const styles = StyleSheet.create({
  accordian: {
    width: width - 2,
    paddingHorizontal: 2,
  },

  title: {
    fontSize: 14,
    fontWeight: 'bold',
    justifyContent: 'space-between',
    color: Colors.DARKGRAY,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 56,
    paddingLeft: 25,
    paddingRight: 18,
    alignItems: 'center',
    backgroundColor: Colors.CGRAY,
    color: Colors.BLACK,
  },
  
  rowOpen: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 56,
    paddingLeft: 25,
    paddingRight: 18,
    alignItems: 'center',
    backgroundColor: 'rgba(224,255,255,0.5)',
    color: Colors.WHITE,
  },
  
  parentHr: {
    height: 1,
    color: Colors.WHITE,
    width: '100%'
  },
  
  child: {
    backgroundColor: Colors.LIGHTGRAY,
    padding: 16,
  }

})