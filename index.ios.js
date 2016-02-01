'use strict';

import React, {
  AppRegistry,
  StyleSheet,
  NavigatorIOS,
  Component
} from 'react-native';

let Dashboard = require('./App/Views/Dashboard/index.ios.js');

class HackerNews extends Component {
  render() {
    return (
      <NavigatorIOS
        style={styles.container}
        tintColor='#FF6600'
        initialRoute={{
          title: 'Hacker News',
          component: Dashboard
        }}/>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6EF'
  }
});

AppRegistry.registerComponent('HackerNews', () => HackerNews);