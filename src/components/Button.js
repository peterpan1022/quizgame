import React from "react";

import {View, Text, TouchableOpacity} from "react-native";

class Button extends React.Component {
  render() {
    return (
      <TouchableOpacity onPress={() => this.props.action()}>
        <View style={{backgroundColor: "#eee", padding: 12, borderRadius: 4, margin: 8}}>
          <Text style={{fontSize: 18, textAlign: this.props.left ? null : "center"}}>{this.props.title}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

export default Button;